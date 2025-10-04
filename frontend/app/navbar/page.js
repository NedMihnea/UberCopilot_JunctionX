'use client'

import Link from "next/link";
import { useState } from "react";

export default function Navbar(){
    const [open, setOpen] = useState(false);

    const toggleMenu = () =>{
        setOpen(!open);
    };

    return(
        <div className="w-full h-fit">
        <div className=" w-full bg-background border-b-2 border-lightpurple fixed top-0 h-15">
            <svg onClick={toggleMenu} className="w-10 h-10 block float-right mr-3 mt-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </div>

        <div className={` fixed top-0 h-full w-[30%] bg-background transition-all duration-500 border-l-2 border-lightpurple ${open ? 'right-0' : '-right-150'} flex flex-col items-center`}>
                <svg onClick={toggleMenu} className="w-10 h-10 self-start cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
                <Link href="/dashboard">Home</Link>
                <Link href="/recommendation/recPage">Current Suggestion</Link>
                <Link href="/statistics">Daily Statistics</Link>
                <Link href="/history">History</Link>
            </div>
        </div>
    )
}