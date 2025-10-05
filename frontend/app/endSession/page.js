export default function EndSessionButton({onClick}){
    return(
        <button onClick={onClick} className=" w-40 h-10 bg-customblue border-2 border-foreground rounded-2xl hover:bg-red-700 hover:text-red-50 hover:border-red-50">End Session</button>
    )
}