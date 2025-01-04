"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from 'wagmi';
import axios from "axios";
import { useRouter } from "next/router";
import { daysUntil, formatISODate } from "@/components/utils/tournaments";
interface Tournament {
    id: number;
    name: string;
    // game?: string;
    reward: string;
    players: number;
    startDate: string;
    endDate: string;
    image: string;
}



export default function TournamentDetail() {
    const { address } = useAccount();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [selectedTournament, setSelectedTournament] = useState<Tournament>({
        id: 0,
        name: "",
        reward: "",
        players: 0,
        startDate: "",
        endDate: "",
        image: "",
    })
    const id = useRouter().query.id;
    useEffect(() => {
        async function fetchActivity() {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/activity/one/${id}`)
            if (response.status === 200 || response.status === 201) {
                setSelectedTournament(response.data)
            }
            else {
                toast.error("Could not get tournament")

            }
        }
        fetchActivity()
    }, [])
    async function joinActivity(activity_id: number) {
        try {
            if (!address) {
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
        } catch (err) {
            toast.error("Could not join activity");
        }
    }
    useEffect(() => {
        const calculateTimeLeft = () => {
            const targetDate = new Date(`${selectedTournament.startDate} ${selectedTournament.startDate}`);
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / (1000 * 60)) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-black text-white min-h-screen py-10 px-4 md:px-16">
            <div className="max-w-5xl mx-auto">
                <button className="text-gray-400 hover:text-white mb-6">&larr; Back</button>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">{selectedTournament.name}</h1>

                <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={selectedTournament.image}
                        alt={selectedTournament.name}
                        className="w-full h-64 object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-purple-500 text-black text-xs px-3 py-1 rounded">
                        Starting in {timeLeft.days} Days {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                    </div>

                    <div className="absolute bottom-4 left-4 text-gray-300 text-sm">
                        <p>
                            {formatISODate(selectedTournament.startDate)} - {formatISODate(selectedTournament.endDate)}
                        </p>
                        <p>
                            {selectedTournament.players} Players
                        </p>
                    </div>

                    <button className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600">
                        Share
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8 bg-gray-800 p-6 rounded-lg">
                    <div className="text-center">
                        <p className="text-yellow-400 text-xl font-bold">{selectedTournament.reward}</p>
                        <p className="text-gray-400 text-sm">Prize Pool</p>
                    </div>

                    <div className="text-center">
                        <p className="text-green-400 text-xl font-bold">
                            Free
                        </p>
                        <p className="text-gray-400 text-sm">Entry Fee</p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-xl font-bold">Solo</p>
                        <p className="text-gray-400 text-sm">Mode</p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg">
                        Join Tournament
                    </button>
                </div>
            </div>
        </div>
    );
}
