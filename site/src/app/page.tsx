import Image from "next/image";
import CreateGame from "@/components/games/create-game";
import Games from "@/components/HomePage/games";
import Hero from "@/components/HomePage/hero";
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <Hero />
            <Games />
        </div>
    );
}
