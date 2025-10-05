'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Navbar from "../navbar/page";
import GoalBar from "../goalBar/page";
import WellnessBar from "../wellnessBar/page";

export default function StatisticCard({ goal }) {
  const [summary, setSummary] = useState(null);
  const searchParams = useSearchParams();
  const earnerId = searchParams.get("earner_id");

  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    if (!earnerId) return;
    async function fetchSummary() {
      const res = await fetch(`${API}/summary/today?earner_id=${earnerId}`);
      const data = await res.json();
      setSummary(data);
    }
    fetchSummary();
  }, [earnerId]);

  if (!summary) return <p>Loading summary...</p>;


return (

  <div className="w-full h-screen bg-linear-to-t from-lightpurple to-background">

            <Navbar />
    <div className="w-[90%] h-screen space-y-5 ml-10 mt-20">
        <div className="w-[90%] min-h-fit p-6 h-[20%] bg-gradient-to-r from-background to-customblue border-2 rounded-2xl border-lightpurple shadow-lg text-white animate-fadeUp delay-200">
            <p>Cash Earned: €{summary.cash_eur}</p>
            <div>
                <p>Earnings Breakdown:</p>
                <div>
                    <p>Trips: €{summary.earnings_breakdown.trips}</p>
                    <p>Tips: €{summary.earnings_breakdown.tips}</p>
                    <p>Quests: €{summary.earnings_breakdown.quests}</p>
                    <p>Bonuses: €{summary.earnings_breakdown.surge}</p>
                </div>
            </div>
            <GoalBar progress={summary.cash_eur} goal={goal} />
        </div>

        <div className="w-[90%] min-h-fit p-6 h-[20%] bg-gradient-to-r from-background to-customblue border-2 rounded-2xl border-lightpurple shadow-lg text-white animate-fadeUp delay-400">
            <p>Minutes Online: {summary.minutes_online}</p>
            <p>Breaks Taken: {summary.breaks}</p>
            <p>Total Break Minutes: {summary.total_break_minutes}</p>
            <p>Last Break Duration: {summary.last_break_minutes}</p>
            <p>On Break: {summary.on_break ? "Yes" : "No"}</p>
        </div>

        <div className="w-[90%] min-h-fit p-6 h-[20%] bg-gradient-to-r from-background to-customblue border-2 rounded-2xl border-lightpurple shadow-lg text-white animate-fadeUp delay-600">
            <p>Accepted Recommendations: {summary.accepted_recommendations}</p>
            <p>Ignored Recommendations: {summary.ignored_recommendations}</p>
            <p>Last Recommendation: {summary.last_rec?.type || "N/A"}</p>
            <WellnessBar
                progress={summary.fatigue_score || 0}
                tier={summary.wellness || "none"}
            />
        </div>
    </div>
</div>
);
}