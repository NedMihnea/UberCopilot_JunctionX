export default function RecommendCard({ recommendationData, onReject, onAccept }){
    return(
        <div className=" w-[80%] rounded-2xl bg-linear-to-r from-background to-green-950 border-2 border-lightpurple border-solid h-1/4 flex text-start justify-between items-center relative">
            <p className="p-5 w-full h-full">Recommendation to be given...</p>
            <div className=" flex flex-row justify-around items-center w-[15%] absolute bottom-3 right-2">
                <svg onClick={onReject} className=" w-9 h-9 hover:fill-red-900 hover:stroke-red-200 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <svg onClick={onAccept} className=" w-9 h-9 fill-customblue hover:fill-green-500 hover:stroke-green-50 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        </div>
    )
}