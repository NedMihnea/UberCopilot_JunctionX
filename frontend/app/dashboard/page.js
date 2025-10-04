import Navbar from "../navbar/page"
import Map from "../map/page"
import RecommendCard from "../recommendation/page"
import ProgressBar from "../progressBar/page"
import GoalBar from "../goalBar/page"

export default function Dash(){
    return (
        <div className=" flex flex-col bg-linear-to-t from-lightpurple to-background w-screen h-screen overflow-y-auto pt-20 items-center space-y-6">
            <Navbar></Navbar>
            <Map></Map>
            <RecommendCard></RecommendCard>
            <GoalBar progress={0} goal={0}></GoalBar>
            <ProgressBar progress={40}></ProgressBar>
        </div>
    )
}