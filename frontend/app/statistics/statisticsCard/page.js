import GoalBar from "@/app/goalBar/page";
import WellnessBar from "@/app/wellnessBar/page";


export default function StatisticCard({ date }){

    return(
        <div className="w-1/2 h-screen space-y-5">
        <div className="w-[100%] min-h-fit p-3 h-[30%] bg-background border-2 rounded-2xl border-lightpurple">
            <p>Cash Earned: </p>
            <div>
                <p>Earnings Breakdown </p>
                <div>
                    <p>Trips: </p>
                    <p>Tips: </p>
                    <p>Quests: </p>
                    <p>Bonuses: </p>
                </div>
            </div>
        </div>

        <div className="w-[100%] min-h-fit p-3 h-[30%] bg-background border-2 rounded-2xl border-lightpurple">
            <p>Minutes Online: </p>
            <p>Breaks Taken: </p>
        </div>

        <div className="w-[100%] min-h-fit p-3 h-[30%] bg-background border-2 rounded-2xl border-lightpurple">
            <p>Accepted Recommendations: </p>
            <p>Ignored Recommendations: </p>
        </div>
        </div>
    )
}