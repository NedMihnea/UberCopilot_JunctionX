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
import { useEffect, useState } from "react";

export default function UserNotif({open, onSubmit, setOpen}) {
    const [value, setValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleChoice = () => {
        if(value == ""){
            alert("You must pick a member!");
            return;
        }
        setOpen(false);
        onSubmit(value);
        setValue("");
    };

    const changeValue = (value) => {
        setValue(value);
    }

    return(
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent className=" bg-lightpurple p-3 h-[40%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50%">
                <AlertDialogHeader>
                <AlertDialogTitle>Which user's route would you like to go on today?</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                    <button onClick={() => setDropdownOpen(true)} className=" h-20 w-20 bg-red-800"></button>
                    <ul className={`${dropdownOpen ? "visible" : "hidden"} h-fit w-20 bg-background flex flex-col items-center`}>
                        <li onClick={() => setValue(1)}>Dummy1</li>
                        <li onClick={() => setValue(2)}>Dummy2</li>
                        <li onClick={() => setValue(3)}>Dummy3</li>
                        <li onClick={() => setValue(4)}>Dummy4</li>
                        <li onClick={() => setValue(5)}>Dummy5</li>
                    </ul>
                </div>
                <AlertDialogFooter>
                    <button className=" cursor-pointer" onClick={handleChoice}>Submit</button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}