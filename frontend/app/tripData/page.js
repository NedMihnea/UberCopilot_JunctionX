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

export default function GetTripData({open,onSubmit, setOpen}){
    const [duration, setDuration] = useState(0);
    const [payment, setPayment] = useState(0.0);
    const handleSubmit = () => {
        const floatPay = parseFloat(payment) || 0;
        const intDuration = parseInt(duration,10);
        onSubmit({duration: intDuration, payment: floatPay});
        setDuration(0);
        setPayment(0.0);
    };
    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className=" bg-[#161629] p-3 h-[40%] border-2 border-lightpurple rounded-2xl absolute top-60% right-50% flex flex-col items-center">
                <AlertDialogHeader className="border-b-2 border-background py-2">
                <AlertDialogTitle>How long will this trip last? And how much will it cost?</AlertDialogTitle>
                <AlertDialogDescription>
                    Once you enter how much you have gained, this trip will begin.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <input className="bg-lightpurple border-2 border-background rounded-2xl w-70 px-2 py-2" onChange={(e) => setPayment(e.target.value)} type="text" placeholder="Enter the payment.."></input>
                </div>
                <div>
                    <input className="bg-lightpurple border-2 border-background rounded-2xl w-70 px-2 py-2" type="text" onChange={(e) => setDuration(e.target.value)} placeholder="Enter the duration.."></input>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel className=" cursor-pointer w-40">Cancel</AlertDialogCancel>
                    <AlertDialogAction className=" cursor-pointer bg-lightpurple border-1 border-foreground w-40" onClick={handleSubmit}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}