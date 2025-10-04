import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CompleteTripButton({setGoal}){
    const handleSubmit = () => {

    };
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
            <button className=" bg-customblue cursor-pointer border-2 rounded-4xl border-foreground fixed bottom-10 right-5 w-30 h-10">
               Complete
            </button>
            </AlertDialogTrigger>
            <AlertDialogContent className=" bg-lightpurple p-3 h-[40%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50%">
                <AlertDialogHeader>
                <AlertDialogTitle>Have you earned a tip? If so, how much?</AlertDialogTitle>
                <AlertDialogDescription>
                    Once you enter how much you have gained, this trip will end.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <input onSubmit={handleSubmit} id="submitTip" type="text" placeholder="Enter the tip.."></input>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel className=" cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className=" cursor-pointer" onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}