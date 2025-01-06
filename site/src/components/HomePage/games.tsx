import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Chakra_Petch } from "next/font/google";
import Link from "next/link";
const chakra = Chakra_Petch({
    subsets: ["latin"],
    weight: ["400"],
});

function Games() {
    // Array of image URLs
    const images = [
        "/assets/images/game1.jpeg",
        "/assets/images/game3.jpeg",
        "/assets/images/game4.jpeg",
        "/assets/images/game5.jpeg",
    ];

    return (
        <div
            className={`${chakra.className} text-white w-full px-32 py-8`}
        >
            {/* Header */}
            <h2 className="text-xl font-bold mb-4">Games</h2>

            {/* Carousel */}
            <Carousel
                opts={{
                    align: "start",
                }}
                className="relative w-full flex items-center gap-4"
            >
                <CarouselPrevious className="absolute left-0 z-10 bg-black/50 p-2 rounded-full">
                    <span className="text-white">{"<"}</span>
                </CarouselPrevious>

                <CarouselContent className="">
                    {images.map((image, index) => (
                        <CarouselItem
                            key={index}
                            className="lg:basis-1/3 h-[357px] w-[276px] relative"
                        >
                        
                                <Image
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    width={276}
                                    height={357}
                                    objectFit="contain"
                                />
                            


                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselNext className="absolute right-0 z-10 bg-black/50 p-2 rounded-full">
                    <span className="text-white">{">"}</span>
                </CarouselNext>
            </Carousel>

            {/* Explore More */}
            <div className="mt-4 text-right">
                <Link href="/games">
                <button className="text-sm underline hover:text-purple-500">
                    Explore more
                </button>
                </Link>
                
            </div>
        </div>
    );
}

export default Games;
