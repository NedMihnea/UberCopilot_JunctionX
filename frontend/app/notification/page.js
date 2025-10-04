'use client';
import { useState } from "react";

export default function Notification({type, text}){
    const [visible, setVisible] = useState(true);

    return(
        <div className="w-30 h-50 bg-lightpurple">
            <div>
                <p>{text}</p>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    )
}