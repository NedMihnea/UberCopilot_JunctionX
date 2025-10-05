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
import { useState } from "react";

export default function CompleteTripButton({onSubmit}){
    const [tips, setTips] = useState(0.0);
    const handleSubmit = () => {
        const floatTip = parseFloat(tips) || 0;
        onSubmit(floatTip);
        setTips(0.0);
    };
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
            <button className=" bg-customblue cursor-pointer border-2 rounded-4xl border-foreground fixed bottom-30 right-5 w-30 h-10">
               Complete
            </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#161629] p-3 h-[40%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50% flex flex-col items-center">
                <AlertDialogHeader className="border-b-2 border-background py-3">
                <AlertDialogTitle>Have you earned a tip? If so, how much?</AlertDialogTitle>
                <AlertDialogDescription>
                    Once you enter how much you have gained, this trip will end.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <input className="bg-lightpurple rounded-2xl w-60 mb-5 px-2 py-2" onChange={(e) => setTips(e.target.value)} id="submitTip" type="text" placeholder="Enter the tip.."></input>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel className=" cursor-pointer w-40">Cancel</AlertDialogCancel>
                    <AlertDialogAction className=" cursor-pointer bg-lightpurple border-1 border-foreground w-40" onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}