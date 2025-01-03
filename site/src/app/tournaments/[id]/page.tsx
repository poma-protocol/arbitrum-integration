"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from 'wagmi';

interface Tournament {
    id: number;
    title: string;
    game: string;
    eventType: string;
    entryFee: number;
    prizePool: string;
    players: number;
    maxPlayers: number;
    date: string;
    time: string;
    daysLeft: number;
    image: string;
    mode: string;
    format: string;
    type: string;
}

const selectedTournament: Tournament = {
    id: 2,
    title: "Escape del Polo Norte",
    game: "Minecraft",
    eventType: "Evento Minijuegos",
    entryFee: 0,
    prizePool: "$29.93",
    players: 188,
    maxPlayers: 300,
    date: "JAN 04",
    time: "11:00 PM",
    daysLeft: 3,
    image: "/assets/images/3.jpeg",
    mode: "Solo",
    format: "Leaderboard",
    type: "Final",
};

export default function TournamentDetail() {
    const { address } = useAccount();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
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
            const targetDate = new Date(`${selectedTournament.date} ${selectedTournament.time}`);
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

                <h1 className="text-3xl md:text-4xl font-bold mb-6">{selectedTournament.title}</h1>

                <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={selectedTournament.image}
                        alt={selectedTournament.title}
                        className="w-full h-64 object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-purple-500 text-black text-xs px-3 py-1 rounded">
                        Starting in {timeLeft.days} Days {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                    </div>

                    <div className="absolute bottom-4 left-4 text-gray-300 text-sm">
                        <p>
                            {selectedTournament.date}, {selectedTournament.time}
                        </p>
                        <p>
                            {selectedTournament.players}/{selectedTournament.maxPlayers} Players
                        </p>
                    </div>

                    <button className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600">
                        Share
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8 bg-gray-800 p-6 rounded-lg">
                    <div className="text-center">
                        <p className="text-yellow-400 text-xl font-bold">{selectedTournament.prizePool}</p>
                        <p className="text-gray-400 text-sm">Prize Pool</p>
                    </div>

                    <div className="text-center">
                        <p className="text-green-400 text-xl font-bold">
                            {selectedTournament.entryFee === 0 ? "Free" : `$${selectedTournament.entryFee}`}
                        </p>
                        <p className="text-gray-400 text-sm">Entry Fee</p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-xl font-bold">{selectedTournament.mode}</p>
                        <p className="text-gray-400 text-sm">Mode</p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-xl font-bold">{selectedTournament.format}</p>
                        <p className="text-gray-400 text-sm">Format</p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-xl font-bold">{selectedTournament.type}</p>
                        <p className="text-gray-400 text-sm">Type</p>
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
