import Image from "next/image";
import CreateGame from "@/components/games/create-game";
export default function Home() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center space-y-6">
            <CreateGame />
        </div>
    );
}
