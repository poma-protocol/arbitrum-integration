"use client";
import Link from "next/link";
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
}

const tournaments: Tournament[] = [
    {
        id: 1,
        title: "Liga da Fama",
        game: "Free Fire",
        eventType: "Circuito da Fama",
        entryFee: 0,
        prizePool: "$50",
        players: 131,
        maxPlayers: 216,
        date: "JAN 03",
        time: "5:00 AM",
        daysLeft: 1,
        image: "/assets/images/2.jpeg",
    },
    {
        id: 2,
        title: "Escape del Polo Norte",
        game: "Minecraft",
        eventType: "Evento Minijuegos",
        entryFee: 30,
        prizePool: "$29.93",
        players: 184,
        maxPlayers: 300,
        date: "JAN 04",
        time: "11:00 PM",
        daysLeft: 3,
        image: "/assets/images/3.jpeg",
    },
    {
        id: 3,
        title: "TIO ROSEN CUP COD MOVIL",
        game: "Call of Duty Mobile",
        eventType: "Decima Edicion",
        entryFee: 0,
        prizePool: "$100",
        players: 350,
        maxPlayers: 350,
        date: "JAN 05",
        time: "12:30 AM",
        daysLeft: 4,
        image: "/assets/images/1.jpeg",
    },
    // Add more tournaments as needed
];

export default function Tournaments() {
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
                                src={tournament.image}
                                alt={tournament.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-green-500 text-black text-xs px-2 py-1 rounded">
                                IN {tournament.daysLeft} DAYS
                            </div>
                        </div>

                        <div className="p-4">
                            <h2 className="text-lg font-bold mb-2">{tournament.title}</h2>
                            <p className="text-sm text-gray-400 mb-4">{tournament.game} - {tournament.eventType}</p>

                            <div className="flex justify-between items-center text-sm mb-4">
                                <div className="flex items-center">
                                    <span className="bg-yellow-500 text-black px-2 py-1 rounded mr-2">
                                        {tournament.entryFee}
                                    </span>
                                    <span>{tournament.prizePool}</span>
                                </div>
                                <span className="bg-gray-700 px-2 py-1 rounded">{tournament.entryFee === 0 ? 'Free Entry' : `$${tournament.entryFee}`}</span>
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
                                    {tournament.date}, {tournament.time}
                                </div>
                                <div>
                                    <span>{tournament.players}/{tournament.maxPlayers} Players</span>
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
