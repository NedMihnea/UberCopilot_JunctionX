'use client'

import Navbar from "@/app/navbar/page";
import { useState, useEffect } from "react";

const mockSuggestions = [
  "Drink a glass of water to stay hydrated",
  "Take a 5 min stretch break",
  "Go for a 10 min walk",
  "Practice deep breathing for 2 min",
  "Check your posture while sitting",
  "Write down something you’re grateful for",
];

export default function RecPage() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(mockSuggestions.slice(-5));
  }, []);

  if (suggestions.length === 0) {
    return (
      <div className="w-screen h-screen bg-gradient-to-t from-lightpurple to-background flex flex-col items-center pt-20 space-y-6">
        <Navbar />
        <p className="text-xl text-white">No new suggestions right now 🙂</p>
      </div>
    );
  }

  const lastSuggestion = suggestions[suggestions.length - 1];
  const prevSuggestions = suggestions.slice(0, -1);

  return (
    <div className="w-screen h-screen bg-gradient-to-t from-lightpurple to-background flex flex-col items-center pt-20 space-y-6 overflow-y-auto">
      <Navbar />

      {/* Header 1 */}
      <header className="w-[90%] px-6 animate-fadeUp">
        <h1 className="text-2xl font-bold text-white">Most recent suggestion:</h1>
      </header>

      {/* Big last suggestion */}
      <div className="w-[90%] p-6 rounded-2xl bg-gradient-to-r from-background to-customblue border-2 border-lightpurple shadow-lg text-white text-xl font-semibold animate-fadeUp delay-200">
        {lastSuggestion}
      </div>

      {/* Header 2 */}
      <header className="w-[90%] px-6 animate-fadeUp delay-400">
        <h3 className="text-xl font-bold text-white">Previous suggestions:</h3>
      </header>

      {/* Previous 4 smaller suggestions */}
      <div className="grid grid-cols-2 gap-4 w-[90%] animate-fadeUp delay-600">
        {prevSuggestions.map((s, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-gradient-to-r from-background to-customblue border border-lightpurple text-white text-sm"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}