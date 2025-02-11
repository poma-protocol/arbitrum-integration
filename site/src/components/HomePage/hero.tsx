"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Chakra_Petch } from "next/font/google";
const chakra = Chakra_Petch({
    subsets: ["latin"],
    weight: ["400"],
});
import Link from "next/link";
export default function Hero() {
    return (
        <div className={`relative  text-white min-h-screen flex items-center justify-around px-8 ${chakra.className}`}>
            {/* Left Section */}
            <div className="flex flex-col gap-6 ml-28">
                {/* Main Heading */}
                <h1 className="text-5xl font-bold leading-tight">
                    Play. Earn. Repeat.
                </h1>
                {/* Subheading */}
                <p className="text-2xl text-white leading-relaxed font-semibold">
                    Engage in Thrilling Challenges, Collect NFTs, and Earn Tokens as You Play!
                </p>
                {/* Image Icons */}
                <section className="flex items-center gap-4">
                    <div className="rounded-full bg-gradient-to-tr p-2">
                        <Image
                            src="/assets/images/hero1.png"
                            width={100}
                            height={100}
                            alt="Hero Icon 1"
                            className="rounded-full"
                        />
                    </div>
                    <div className="rounded-full bg-gradient-to-tr  p-2">
                        <Image
                            src="/assets/images/hero2.png"
                            width={100}
                            height={100}
                            alt="Hero Icon 2"
                            className="rounded-full"
                        />
                    </div>
                </section>
                {/* Buttons */}
                <section className="flex items-center gap-4">
                    <Link href="/games">
                        <div className="p-[1px] border-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl">

                            <button className="bg-black text-white font-bold py-1 px-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                                Play
                            </button>


                        </div>
                    </Link>
                    <Link href="/tournaments">
                        <div className="p-[1px] border-[1px]  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl">

                            <button className="px-6 py-1 bg-gradient-to-r from-[#FF56F6] via-[#C546F8] to-[#4CC9F0]  text-sgm font-semibold rounded-3xl">
                                Quests
                            </button>


                        </div>
                    </Link>
                </section>
                {/* Stats Section */}
                {/* <section className="flex gap-6 mt-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-pink-500 font-bold text-lg">300,000+ Hours</p>
                        <p className="text-gray-400 text-sm">Playtime Logged</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-pink-500 font-bold text-lg">650,000+ Players</p>
                        <p className="text-gray-400 text-sm">Worldwide Join</p>
                    </div>
                </section> */}
            </div>
            {/* Right Section */}
            <div className="">
                <Image
                    src="/assets/images/homepage.png"
                    width={650}
                    height={650}
                    alt="3D Blob"
                    className="drop-shadow-2xl"
                />
            </div>
        </div>
    );
}
