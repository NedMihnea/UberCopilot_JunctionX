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
            alert("You must write a goal and it must be a number!")
        }
        setOpen(false);
        onSubmit(value);
        setValue("");
    };
    return(
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent className=" bg-lightpurple p-3 h-[40%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50%">
                <AlertDialogHeader>
                <AlertDialogTitle>What is your goal for today?</AlertDialogTitle>
                <AlertDialogDescription>
                    Once you enter how much you have gained, this trip will end.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <input id="submitTip" onChange={(e) => setValue(e.target.value)} value={value} type="text" placeholder="Enter the tip.."></input>
                </div>
                <AlertDialogFooter>
                    <button className=" cursor-pointer" onClick={handleInput}>Submit</button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}