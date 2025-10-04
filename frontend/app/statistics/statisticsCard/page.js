import GoalBar from "@/app/goalBar/page";
import WellnessBar from "@/app/wellnessBar/page";


export default function StatisticCard({ date }){

    return(
        <div className="w-[80%] h-[60%] bg-background border-2 rounded-2xl border-lightpurple">
            <GoalBar progress={80}></GoalBar>
            <WellnessBar progress={60}></WellnessBar>
        </div>
    )
}