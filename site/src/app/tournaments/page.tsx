"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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


export default function Tournaments() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    useEffect(() => {
        async function getTournaments() {
            try {
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/activity`
                );
                if (resp.status === 200) {
                    setTournaments(await resp.json());
                } else {
                    throw new Error("Could not get tournaments")
                }
            } catch (err) {
                toast.error("Could not get tournaments");
            }
        }
        getTournaments();
    }, [])
    const IMAGE_HOSTNAME = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME;

    return (
        <div className="bg-black text-white min-h-screen py-10 px-4 md:px-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Tournaments</h1>

            <div className="flex justify-center space-x-4 mb-8">
                {['Upcoming', 'Playing', 'Finished', 'All'].map((tab, index) => (
                    <button
                        key={index}
                        className="px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all bg-gray-700 hover:bg-gray-600"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                    <Link href={`/tournaments/${tournament.id}`} passHref>
                        <div
                            key={tournament.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                        >
                            <div className="relative">
                                <img
                                    src={`${IMAGE_HOSTNAME}/${tournament.image}`}
                                    alt={tournament.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-green-500 text-black text-xs px-2 py-1 rounded">
                                    IN {daysUntil(tournament.endDate)} DAYS
                                </div>
                            </div>

                            <div className="p-4">
                                <h2 className="text-lg font-bold mb-2">{tournament.name}</h2>
                                <p className="text-sm text-gray-400 mb-4">Fifa</p>

                                <div className="flex justify-between items-center text-sm mb-4">
                                    <div className="flex items-center">
                                        <span className="bg-yellow-500 text-black px-2 py-1 rounded mr-2">
                                            0$
                                        </span>
                                        <span>{tournament.reward}</span>
                                    </div>
                                    <span className="bg-gray-700 px-2 py-1 rounded">Free Entry</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 18.75L15.75 12l-7.5-6.75"
                                            />
                                        </svg>
                                        {formatISODate(tournament.startDate)}
                                    </div>
                                    <div>
                                        <span>{tournament.players} Players</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
