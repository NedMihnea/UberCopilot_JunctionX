'use client';
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

export default function GoalNotif({open, onSubmit, setOpen}) {
    const [value, setValue] = useState("");

    const handleInput = () => {
        if(value == "" || isNaN(value)){
            alert("You must write a goal and it must be a number!");
            return;
        }
        setOpen(false);
        onSubmit(value);
        setValue("");
    };
    return(
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent className=" bg-background p-3 h-[30%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50% flex flex-col items-center">
                <AlertDialogHeader className="border-b-2 rounded-2xl border-lightpurple py-2">
                <AlertDialogTitle>What is your goal for today?</AlertDialogTitle>
                <AlertDialogDescription>
                    Once you enter how much you have gained, this trip will end.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <input className="bg-lightpurple rounded-2xl w-fit px-2 py-2" onChange={(e) => setValue(e.target.value)} value={value} type="text" placeholder="Enter the goal.."></input>
                </div>
                <AlertDialogFooter>
                    <button className=" cursor-pointer border-2 border-lightpurple w-40 py-3 px-4 rounded-2xl" onClick={handleInput}>Submit</button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}