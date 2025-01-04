"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Game {
    name: string,
    category: string,
    image: string,

}
export default function Games() {
    
    const [games, setGames] = useState<Game[]>([]);
    useEffect(() => {
        async function getGames() {
            try {
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/game`
                );

                if (resp.status === 200) {
                    setGames(await resp.json());
                } else {
                    throw new Error("Could Not Get Games")
                }
            } catch (err) {
                toast.error("Could Not Get Games");
            }
        }
        getGames()
    }, [])

    const categories = [
        "Arcade",
        "Adventure",
        "Strategy",
        "Sports",
        "Puzzle",
        "Simulation",
        "Racing",
        "Fighting",
    ];

    const publishers = ["EA", "Ubisoft", "Rockstar", "Bethesda"];

    const playerCounts = ["Single Player", "Co-op", "Multiplayer"];

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-gray-800 text-white p-4 rounded-lg lg:rounded-l-lg mb-4 lg:mb-0">
                <div className="mb-6">
                    <Input
                        placeholder="Search the games"
                        className="w-full bg-gray-700 border-none text-white focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    {categories.map((category) => (
                        <div key={category} className="flex items-center mb-2">
                            <Checkbox className="mr-2" />
                            <label className="text-sm">{category}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <Button variant="ghost" className="text-sm text-blue-400">
                        Show all
                    </Button>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Publisher</h3>
                    {publishers.map((publisher) => (
                        <div key={publisher} className="flex items-center mb-2">
                            <Checkbox className="mr-2" />
                            <label className="text-sm">{publisher}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Player Count</h3>
                    {playerCounts.map((count) => (
                        <div key={count} className="flex items-center mb-2">
                            <Checkbox className="mr-2" />
                            <label className="text-sm">{count}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-900 p-4 lg:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {games.map((game, index) => (
                        <div
                            key={index}
                            className="relative bg-gray-800 h-[218px] w-full rounded overflow-hidden shadow hover:shadow-lg hover:scale-105 transition-transform duration-200"
                        >
                            <div className="w-full h-40 object-cover">
                                <Image
                                    src={`http://localhost:4000/${game.image}`}
                                    alt={game.name}
                                    width={225}
                                    height={400}
                                />
                            </div>

                            <div className="p-4 text-white">
                                <h3 className="text-lg font-bold truncate">{game.name}</h3>
                                <span className="text-sm text-gray-400">{game.category}</span>
                            </div>
                            <span className="absolute top-2 left-2 bg-[#1A2E46] text-white text-xs px-2 py-1 rounded">
                                {game.category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
