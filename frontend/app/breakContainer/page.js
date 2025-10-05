'use client';
import { useState } from "react";

export default function BreakDiv({onStart, onEnd}){
    const [started, setStarted ]= useState(false);
    return(
        <div className=" flex w-fit h-fit flex-row justify-center">
            <button className=" bg-background border-2 border-lightpurple disabled:bg-lightpurple disabled:border-background disabled:text-background cursor-pointer" disabled={started} onClick={onStart}>Start</button>
            <button className=" bg-background border-2 border-lightpurple disabled:bg-lightpurple disabled:border-background disabled:text-background cursor-pointer" disabled={!started} onClick={onEnd}>End</button>
        </div>
    )
}