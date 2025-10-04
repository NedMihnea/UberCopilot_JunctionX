'use client';
import Navbar from "../navbar/page"
import Map from "../map/page"
import RecommendCard from "../recommendation/page"
import WellnessBar from "../wellnessBar/page"
import GoalBar from "../goalBar/page"
import { useState } from "react";
import CompleteTripButton from "../completeTrip/page";
import GoalNotif from "../notification/goalNotification/page";

export default function Dash(){
    var currentRec= "testRec lol";
    const [activeRec, setActive] = useState("none");

    const [notifOpen, setNotifOpen] = useState(true);
    const [goal, setGoal] = useState(0);

    const handleSubmit = (value) => {
      setGoal(value);
      setNotifOpen(false);    
    };


    const onAccept = () => {
        setActive(currentRec);
    };

    const onReject = () => {
        setActive('none');
        currentRec="nextOne";
    };

    return (
        <div className=" flex flex-col text-foreground bg-linear-to-t from-lightpurple to-background w-screen h-screen overflow-y-auto pt-20 items-center space-y-6">
            <GoalNotif open={notifOpen} onSubmit={handleSubmit} setOpen={setNotifOpen}></GoalNotif>
            <Navbar></Navbar>
            <Map></Map>
            <RecommendCard recommendationData={currentRec} onAccept={onAccept} onReject={onReject}></RecommendCard>
            <GoalBar progress={0} goal={goal}></GoalBar>
            <WellnessBar progress={40}></WellnessBar>
            {activeRec !== "none" && <CompleteTripButton />}
        </div>
    )
}