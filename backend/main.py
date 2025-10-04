from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional
import pandas as pd
import math
import os


app = FastAPI(title="Uber CoPilot+ (Regions from heatmap sheet)", version="0.4.1")


EARNERS_CSV = "earners_min.csv"


HEX_SOURCE_PATH = "uber_hackathon_v2_mock_data.xlsx"
HEX_SHEET_NAME = "heatmap"


HEX_REGION_COL   = "msg.city_id"                       
HEX_ID_COL       = "msg.predictions.hexagon_id_9"      
HEX_EPH_COL      = "msg.predictions.predicted_eph"     
HEX_Q_COL        = "q"                                  
HEX_R_COL        = "r"                                  
HEX_BIKE_COL     = "bike_safe"                          
HEX_CHARGER_COL  = "has_charger"                        


df_profiles = pd.read_csv(EARNERS_CSV, dtype={"earner_id": str})

def norm_id(x: str) -> str:
    x = str(x).strip().upper()
    return x if x.startswith("E") else f"E{x}"

df_profiles["_eid_norm"] = df_profiles["earner_id"].astype(str).map(norm_id)


def load_hex_table() -> pd.DataFrame:
    if not os.path.exists(HEX_SOURCE_PATH):
        raise RuntimeError(f"Hex workbook not found: {HEX_SOURCE_PATH}")

    hex_df = pd.read_excel(HEX_SOURCE_PATH, sheet_name=HEX_SHEET_NAME)

    
    for needed in [HEX_REGION_COL, HEX_ID_COL, HEX_EPH_COL]:
        if needed not in hex_df.columns:
            raise RuntimeError(
                f"Column '{needed}' not found in sheet '{HEX_SHEET_NAME}'. "
                f"Available: {list(hex_df.columns)}"
            )

    
    keep = [HEX_REGION_COL, HEX_ID_COL, HEX_EPH_COL]
    for opt in [HEX_Q_COL, HEX_R_COL, HEX_BIKE_COL, HEX_CHARGER_COL]:
        if opt in hex_df.columns:
            keep.append(opt)
    hex_df = hex_df[keep].copy()

    
    try:
        hex_df[HEX_REGION_COL] = hex_df[HEX_REGION_COL].astype(int)
    except Exception:
        
        pass

    
    if HEX_Q_COL not in hex_df.columns or HEX_R_COL not in hex_df.columns:
        coords = []
        for region, group in hex_df.groupby(HEX_REGION_COL, sort=True):
            n = len(group)
            cols = 4  
            local = []
            for i in range(n):
                q = i % cols
                r = i // cols
                local.append((q, r))
            coords.extend(local)
        
        hex_df = hex_df.sort_values([HEX_REGION_COL]).reset_index(drop=True)
        hex_df[HEX_Q_COL] = [q for q, r in coords]
        hex_df[HEX_R_COL] = [r for q, r in coords]

    
    if HEX_BIKE_COL not in hex_df.columns:
        hex_df[HEX_BIKE_COL] = False
    if HEX_CHARGER_COL not in hex_df.columns:
        hex_df[HEX_CHARGER_COL] = False

    # Clean types
    for col in [HEX_Q_COL, HEX_R_COL]:
        try:
            hex_df[col] = hex_df[col].astype(int)
        except Exception:
            pass
    for col in [HEX_BIKE_COL, HEX_CHARGER_COL]:
        try:
            hex_df[col] = hex_df[col].astype(bool)
        except Exception:
            hex_df[col] = False

    return hex_df

df_hex = load_hex_table()


def persona_from_row(row: pd.Series) -> dict:
    return {
        "earnerId": norm_id(row["earner_id"]),
        "isNovice": bool(int(row.get("experience_months", 0)) < 6),
        "isCourier": row.get("earner_type") == "courier",
        "bikeSafeNeeded": row.get("vehicle_type") in ["bike", "scooter"],
        "isEV": bool(row.get("is_ev", False)),
        
        "regionId": int(row.get("home_city_id", 0)),
    }

def region_hour_prior(region_id: int, hour: int) -> float:
    
    amp = {1:1.00, 2:1.05, 3:0.98, 4:1.02, 5:1.00}.get(int(region_id), 1.0)
    morning = math.exp(-((hour-8)/2.5)**2)
    evening = math.exp(-((hour-18)/2.2)**2)
    return amp * (0.6 + 0.8 * max(morning, evening))  

def persona_multiplier(persona: dict, bike_safe: bool, has_charger: bool) -> float:
    m = 1.0
    if persona.get("isCourier"):
        m *= 1.05
    if persona.get("bikeSafeNeeded") and bike_safe:
        m *= 1.05
    if persona.get("isEV") and has_charger:
        m *= 1.05
    return m

def band_by_max(values):
    if not values:
        return []
    mx = max(values)
    if mx <= 0:
        return ["low"] * len(values)
    out = []
    for v in values:
        r = v / mx
        if   r >= 0.90: out.append("very_high")
        elif r >= 0.70: out.append("high")
        elif r >= 0.40: out.append("medium")
        else:           out.append("low")
    return out


STATE = {
    "sessions": {}  
}

def ensure_session(eid: str):
    if eid not in STATE["sessions"]:
        STATE["sessions"][eid] = {"minutes_online": 0, "cash_eur": 0.0}
    return STATE["sessions"][eid]


def fatigue_score(minutes_online: int, is_novice: bool) -> int:
    rate = 18 if is_novice else 12   # points per hour
    score = (minutes_online / 60.0) * rate
    return max(0, min(100, int(round(score))))

def wellness_tier(score: int) -> str:
    if score < 40: return "green"
    if score < 70: return "amber"
    return "red"


class RecIn(BaseModel):
    earner_id: str
    local_hour: int
    session_minutes: int
    has_active_quest: bool = False  # keep for later


STATE = {"sessions": {}}

def ensure_session(eid: str):
    """Return a driver's current session; create it if missing."""
    if eid not in STATE["sessions"]:
        STATE["sessions"][eid] = {
            "minutes_online": 0,
            "cash_eur": 0.0,
            "breaks": 0,
            "current_hex": None,
            "accepted_recs": 0,
            "ignored_recs": 0,
            "earnings_breakdown": {
                "trips": 0.0,
                "tips": 0.0,
                "quests": 0.0,
                "surge": 0.0
            },
        }
    return STATE["sessions"][eid]


class EventIn(BaseModel):
    earner_id: str = Field(..., description="Driver/courier id, e.g., E10000")
    type: str = Field(
        ...,
        description=(
            "trip_completed | tip_received | quest_completed | surge_bonus | "
            "start_break | end_break | accept_card | ignore_card | arrived_hex"
        ),
    )
    amount_eur: Optional[float] = Field(None, description="Only used for earning events")
    hex_id: Optional[str] = Field(None, description="Use with arrived_hex to set current hex")

# =========================
# ENDPOINTS
# =========================
@app.get("/profile/{earner_id}")
def get_profile(earner_id: str):
    eid = norm_id(earner_id)
    row = df_profiles[df_profiles["_eid_norm"] == eid]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Earner not found: {eid}")
    base = row.iloc[0].to_dict()
    persona = persona_from_row(row.iloc[0])

    return {
        "profile": {
            "earner_id": eid,
            "earner_type": base.get("earner_type"),
            "vehicle_type": base.get("vehicle_type"),
            "fuel_type": base.get("fuel_type"),
            "is_ev": bool(base.get("is_ev", False)),
            "experience_months": int(base.get("experience_months", 0)),
            "rating": float(base.get("rating", 0.0)) if base.get("rating") is not None else None,
            "status": base.get("status"),
            "home_city_id": int(base.get("home_city_id", 0)),
        },
        "persona": {
            "earnerId": persona["earnerId"],
            "isNovice": persona["isNovice"],
            "isCourier": persona["isCourier"],
            "bikeSafeNeeded": persona["bikeSafeNeeded"],
            "isEV": persona["isEV"],
            "regionId": persona["regionId"],
        },
    }

@app.get("/regions/hexes")
def get_region_hexes(
    earner_id: str,
    hour: int = Query(..., ge=0, le=23)
):
  
    eid = norm_id(earner_id)
    row = df_profiles[df_profiles["_eid_norm"] == eid]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Earner not found: {eid}")
    persona = persona_from_row(row.iloc[0])
    region_id = persona["regionId"]

    
    hexes = df_hex[df_hex[HEX_REGION_COL] == region_id].copy()
    if hexes.empty:
        raise HTTPException(status_code=404, detail=f"No hexes found for region_id(msg.city_id)={region_id}")

    
    tod = region_hour_prior(region_id, hour)

    eph = hexes[HEX_EPH_COL].astype(float).fillna(0.0).tolist()
    scores = []
    for i, (_, h) in enumerate(hexes.iterrows()):
        base = float(eph[i])
        m = persona_multiplier(persona, bool(h[HEX_BIKE_COL]), bool(h[HEX_CHARGER_COL]))
        scores.append(base * tod * m)

    hexes["efficiency_score"] = [round(s, 4) for s in scores]
    hexes["band"] = band_by_max(hexes["efficiency_score"].tolist())

   
    out = []
    for _, h in hexes.iterrows():
        out.append({
            "hex_id": h[HEX_ID_COL],
            "region_id": int(h[HEX_REGION_COL]) if str(h[HEX_REGION_COL]).isdigit() else h[HEX_REGION_COL],
            "q": int(h[HEX_Q_COL]),
            "r": int(h[HEX_R_COL]),
            "bike_safe": bool(h[HEX_BIKE_COL]),
            "has_charger": bool(h[HEX_CHARGER_COL]),
            "predicted_eph": float(h[HEX_EPH_COL]) if pd.notna(h[HEX_EPH_COL]) else 0.0,
            "efficiency_score": float(h["efficiency_score"]),
            "band": h["band"],
        })

    out.sort(key=lambda x: x["efficiency_score"], reverse=True)
    return {"region_id": region_id, "hour": hour, "hexes": out, "top3": out[:3]}

@app.post("/recommendation")
def recommendation(body: RecIn):
    eid = norm_id(body.earner_id)

    
    row = df_profiles[df_profiles["_eid_norm"] == eid]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Earner not found: {eid}")
    persona = persona_from_row(row.iloc[0])
    region_id = persona["regionId"]

    
    fscore = fatigue_score(body.session_minutes, persona["isNovice"])
    tier = wellness_tier(fscore)

  
    sess = ensure_session(eid)
    sess["minutes_online"] = body.session_minutes  
    cash = sess["cash_eur"]

    # if tired -> break card
    if tier == "red":
        return {
            "recommendation": {
                "type": "break",
                "title": "Time for a reset",
                "subtitle": "Take 10–15 minutes to recharge.",
                "options": [10, 15, 20]
            },
            "wellness": tier,
            "fatigue_score": fscore,
            "cash_today_eur": round(cash, 2)
        }


    hour = body.local_hour
  
    hexes = df_hex[df_hex["msg.city_id"] == region_id].copy()
    if hexes.empty:
        raise HTTPException(status_code=404, detail=f"No hexes for region {region_id}")

    tod = region_hour_prior(region_id, hour)
    scores = []
    for _, h in hexes.iterrows():
        base_eph = float(h["msg.predictions.predicted_eph"])
        mult = persona_multiplier(persona, bool(h.get("bike_safe", False)), bool(h.get("has_charger", False)))
        scores.append(base_eph * tod * mult)

    hexes["efficiency_score"] = [round(s, 4) for s in scores]
    hexes.sort_values("efficiency_score", ascending=False, inplace=True)
    best = hexes.iloc[0]

    return {
        "recommendation": {
            "type": "reposition",
            "target_hex": str(best["msg.predictions.hexagon_id_9"]),
            "title": "Head to best nearby zone",
            "subtitle": "Higher chance of pings in next 20 min.",
            "etaMins": 6,         
            "upliftPct": 12        
        },
        "wellness": tier,
        "fatigue_score": fscore,
        "cash_today_eur": round(cash, 2)  
    }

@app.post("/events")
def events(body: EventIn):
    eid = norm_id(body.earner_id)

  
    row = df_profiles[df_profiles["_eid_norm"] == eid]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Earner not found: {eid}")

    sess = ensure_session(eid)
    earnings = sess["earnings_breakdown"]
    t = body.type.lower()

  
    def need_amount():
        if body.amount_eur is None:
            raise HTTPException(status_code=400, detail=f"amount_eur is required for '{t}'")
        return float(body.amount_eur)

    if t == "trip_completed":
        amt = need_amount()
        earnings["trips"] += amt
        sess["cash_eur"] += amt

    elif t == "tip_received":
        amt = need_amount()
        earnings["tips"] += amt
        sess["cash_eur"] += amt

    elif t == "quest_completed":
        amt = need_amount()
        earnings["quests"] += amt
        sess["cash_eur"] += amt

    elif t == "surge_bonus":
        amt = need_amount()
        earnings["surge"] += amt
        sess["cash_eur"] += amt

    elif t == "start_break":

        pass

    elif t == "end_break":
        sess["breaks"] = int(sess.get("breaks", 0)) + 1

    elif t == "accept_card":
        sess["accepted_recs"] = int(sess.get("accepted_recs", 0)) + 1

    elif t == "ignore_card":
        sess["ignored_recs"] = int(sess.get("ignored_recs", 0)) + 1

    elif t == "arrived_hex":
        if not body.hex_id:
            raise HTTPException(status_code=400, detail="hex_id is required for 'arrived_hex'")
        sess["current_hex"] = body.hex_id

    else:
        raise HTTPException(status_code=400, detail=f"Unknown event type: {body.type}")

    return {"ok": True, "session": sess}


@app.get("/summary/today")
def summary_today(earner_id: str):
    """Return the driver's total cash, time, and basic stats for today."""
    eid = norm_id(earner_id)

    # verify earner exists
    row = df_profiles[df_profiles["_eid_norm"] == eid]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Earner not found: {eid}")

    sess = ensure_session(eid)
    earnings = sess.get(
        "earnings_breakdown",
        {"trips": 0.0, "tips": 0.0, "quests": 0.0, "surge": 0.0},
    )

    return {
        "cash_eur": round(float(sess.get("cash_eur", 0.0)), 2),
        "minutes_online": int(sess.get("minutes_online", 0)),
        "breaks": int(sess.get("breaks", 0)),
        "accepted_recommendations": int(sess.get("accepted_recs", 0)),
        "ignored_recommendations": int(sess.get("ignored_recs", 0)),
        "current_hex": sess.get("current_hex"),
        "earnings_breakdown": {k: round(float(v), 2) for k, v in earnings.items()},
    }