'use client';
import Navbar from "../navbar/page"
import Map from "../map/page"
import RecommendCard from "../recommendation/page"
import WellnessBar from "../wellnessBar/page"
import GoalBar from "../goalBar/page"
import { useEffect, useState } from "react";
import CompleteTripButton from "../completeTrip/page";
import GoalNotif from "../notification/goalNotification/page";
import UserNotif from "../notification/userNotification/page";
import EndSessionButton from "../endSession/page";
import GetTripData from "../tripData/page";
import { redirect } from "next/navigation";
import BreakDiv from "../breakContainer/page";

export default function Dash(){
    const [activeRec, setActive] = useState("none");
    const [currentRec, setNextRec] = useState("none");
    const [earnerId, setEarnerId] = useState(0);
    const [mapData, setMapData] = useState("none");
    const [summary, setSummary] = useState("none");
    const [duration, setDuration] = useState(0);
    const [disabled, setDisabled] =useState(false);

    const [tripActive, setTripActive] = useState(false);

    const [finished, setFinished] = useState(false);


    const [goalNotifOpen, setGoalNotifOpen] = useState(false);
    const [userNotifOpen, setUserNotifOpen] = useState(false);
    const [tripDataOpen, setTripDataOpen] = useState(false);

    const [goal, setGoal] = useState(0);

    const hour = new Date().getHours();
    const API = "http://127.0.0.1:8000";

    useEffect(() =>{
        setUserNotifOpen(true);
    },[]);

    const handleSubmitGoal = (value) => {
      setGoal(value);
      setGoalNotifOpen(false);
    };

    const handleDisabled = async (value) =>{
        setDisabled(value);
        if(value){
            const saved=await postJSON(`${API}/events`, {earner_id: earnerId,type: "start_break"});
            console.log(saved);
        }
        else{
            const saved =await postJSON(`${API}/events`, {earner_id: earnerId,type: "end_break"});
            console.log(saved);
        }
    };

    const handleTripCompleted = async(tip) =>{
        const savedData =await postJSON(`${API}/events`, {earner_id: earnerId,type: "tip_received",amount_eur: tip});
        setDuration(savedData.session.minutes_online);
        setTripActive(false);
        setActive("none");
        setNextRec("none"); 
    
        await getDataFromAPI(earnerId);
    }

    const handleSubmitTripData = async (value) =>{
        setTripDataOpen(false);
        
        if(currentRec.recommendation.type !== "break"){
           const savedData =await postJSON(`${API}/events`, {earner_id: earnerId,type: "trip_completed",amount_eur: value.payment,hex_id: currentRec.recommendation.hex_id, duration_minutes: value.duration,});
        }
        setTripActive(true);
    }

    const handleEndSession = async() =>{
        const sum = await getJSON(`${API}/summary/today?earner_id=${earnerId}`);
        setSummary(sum);
        setActive("none");
        setNextRec("none");
        setFinished(true);
        redirect(`/statisticsCard/?earner_id=${earnerId}`);
    }

    async function getJSON(url) {
     const r = await fetch(url);
     if (!r.ok) throw new Error(await r.text());
     return r.json();
    }

    async function postJSON(url, body) {
     const r = await fetch(url, {
     method: "POST",
     headers: {"Content-Type":"application/json"},
     body: JSON.stringify(body)
    });
       if (!r.ok) throw new Error(await r.text());
    return r.json();
    }

    const handleSubmitUser = (earnerId) => {
      setUserNotifOpen(false);
      setGoalNotifOpen(true);  
      setEarnerId(earnerId);
      getDataFromAPI(earnerId); 
    };

    const getDataFromAPI = async (id) => {

     await getJSON(`${API}/profile/${id}`);

     const hexPayload = await getJSON(`${API}/regions/hexes?earner_id=${id}&hour=${hour}`);
     setMapData(hexPayload);

     const rec = await postJSON(`${API}/recommendation`, {
     earner_id: id,
     local_hour: hour,
     session_minutes: duration
    });
    setNextRec(rec);

};



    const onAccept = async ({actionId, targetHex}) => {
        setActive(currentRec);
        await postJSON(`${API}/events`, { earner_id : earnerId, type: "accept_card", action_id: actionId });
        setTripDataOpen(true);
    };

    const onReject = async ({actionId}) => {
        setActive('none');
        await postJSON(`${API}/events`, { earner_id : earnerId, type: "ignore_card", action_id: actionId });
        getDataFromAPI(earnerId);

    };

    return (
        <div className=" flex flex-col text-foreground bg-linear-to-t from-lightpurple to-background w-screen h-screen overflow-y-auto pt-20 items-center space-y-6">
            <UserNotif open={userNotifOpen} setOpen={setUserNotifOpen} onSubmit={handleSubmitUser}></UserNotif>
            <GoalNotif open={goalNotifOpen} onSubmit={handleSubmitGoal} setOpen={setGoalNotifOpen}></GoalNotif>
            <Navbar></Navbar>
            <Map earnerId={earnerId} hex_id_send={activeRec?.recommendation?.target_hex ?? null} ></Map>
            {currentRec !== "none" && <RecommendCard recommendationData={currentRec} onAccept={() => onAccept({actionId: currentRec.action_id,targetHex: currentRec.recommendation.target_hex})} onReject={() => onReject({actionId: currentRec.action_id})}/>}
            <GoalBar progress={currentRec.cash_today_eur} goal={goal}></GoalBar>
            <WellnessBar 
            progress={currentRec !== "none" ? currentRec.fatigue_score : 0} 
            tier={currentRec !== "none" ? currentRec.wellness : "none"} 
            />
            <GetTripData open={tripDataOpen} setOpen={setTripDataOpen} onSubmit={handleSubmitTripData}></GetTripData>
            <EndSessionButton onClick={handleEndSession}></EndSessionButton>
            {activeRec !== "none"&& tripActive && <CompleteTripButton onSubmit={handleTripCompleted} disabled={disabled} />}
            <BreakDiv onClick={handleDisabled}></BreakDiv>
        </div>
    )
}