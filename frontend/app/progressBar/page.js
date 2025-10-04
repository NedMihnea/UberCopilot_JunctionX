export default function ProgressBar({ progress }){
    return(
        <div className="w-[90%] flex flex-col h-fit">
        <p>Progress:</p>
        <div className="w-full bg-background mb-5 rounded-full">
          <div className="bg-customblue h-6 rounded-full transition-all duration-500" style={{width : progress+ '%'}}></div>
        </div>
        </div>
    )
}