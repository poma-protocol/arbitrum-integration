"use client"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {useAccount } from 'wagmi';

export default function JoinActivity() {
    const [activities, setActivities] = useState<{id: number, name: string, reward: number, goal: number}[]>([]);
    const {address} = useAccount();
    async function getActivities() {
        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/activity`
            );
            const activities = await resp.json();
            setActivities(activities);
        } catch(err) {
            toast.error("Could Not Get Activities");
        }
    }
    async function joinActivity(activity_id: number) {
        try {
            if(!address) {
                toast.error("Connect wallet to join activity");
                return;
            }

            await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        activity_id,
                        player_address: address
                    })
                }
            );
        } catch(err) {
            toast.error("Could not join activity");
        }
    }

    useEffect(() => {
        getActivities();
    }, []);

    return (
        <div className="grid grid-cols-4 gap-4 mb-4">
            {activities.map((activity) => (
            <Dialog
                key={activity.id}
            >
              <DialogTrigger asChild>
                <div 
                    className="bg-poma_grey p-4 rounded-2xl"
                    onClick={() => {
                        
                    }}
                >
                    <p>{activity.name}</p>
                    <p>Goal: {activity.goal}</p>
                    <p>Reward: {activity.reward}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Join Activity</DialogTitle>
                        <DialogDescription>
                            Click on the join button to participate in the activity.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Button 
                        type="submit" 
                        size="sm" 
                        className="px-3"
                        onClick={() => {
                            joinActivity(activity.id);
                        }}
                      >
                        <p>Join</p>
                      </Button>
                    </div>
               </DialogContent>
            </Dialog>
            ))}        
        </div>
    );
}
