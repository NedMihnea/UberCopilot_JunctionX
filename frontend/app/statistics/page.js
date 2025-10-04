import Navbar from "../navbar/page"
import StatisticCard from "./statisticsCard/page"

export default function Statistics(){
    return(
        <div className="w-screen h-screen bg-linear-to-t from-lightpurple to-background flex flex-col items-center pt-20 space-y-6">
            <Navbar></Navbar>
            <StatisticCard date="today"></StatisticCard>
        </div>
    )
}