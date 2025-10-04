import Navbar from "../navbar/page"
import Map from "../map/page"

export default function Dash(){
    return (
        <div className=" flex w-screen bg-darkpurple h-screen container justify-center items-center flex-col">
            <Navbar></Navbar>
            <Map></Map>
        </div>
    )
}