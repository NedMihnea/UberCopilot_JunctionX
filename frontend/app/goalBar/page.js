
export default function GoalBar({progress, goal}){
    return(
        <div className="w-[90%] flex flex-col h-fit">
        <p>Goal: {goal}</p>
        <div className="w-full bg-background rounded-full">
          <div className="bg-customblue h-6 rounded-full transition-all duration-500 max-w-full" style={{width : (progress/goal)*100+ '%'}}></div>
        </div>
        </div>
    )
}