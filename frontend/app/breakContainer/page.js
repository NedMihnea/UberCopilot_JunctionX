'use client';
import { useState } from "react";

export default function BreakDiv({onClick}){
    const [started, setStarted ]= useState(false);
    const handleStart = () =>{
        setStarted(true);
        onClick(true);
    };

    const handleEnd = () =>{
        setStarted(false);
        onClick(false);
    };
    return(
        <div className=" flex w-fit h-fit flex-row justify-cente">
            <button className=" bg-customblue w-30 h-10 rounded-2xl border-2 border-lightpurple disabled:bg-customgrey disabled:border-background disabled:text-background cursor-pointer px-3 mx-3" disabled={started} onClick={handleStart}>Start</button>
            <button className=" bg-customblue w-30 h-10 rounded-2xl border-2 border-lightpurple disabled:bg-customgrey disabled:border-background disabled:text-background cursor-pointer px-3 mx-3" disabled={!started} onClick={handleEnd}>End</button>
        </div>
    )
}