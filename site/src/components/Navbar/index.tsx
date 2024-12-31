"use client"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { IoMdMenu } from "react-icons/io";
import { Chakra_Petch } from "next/font/google"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const chakra = Chakra_Petch({
    subsets: ["latin"],
    weight: ["400"]
})
export default function Navbar() {

    return (
        <header className={`flex h-20 w-full shrink-0 items-center px-4 md:px-6 ${chakra.className}`}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <IoMdMenu />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                        <div>
                            <Image src="/assets/images/logo.png" width={100} height={50} alt="Poma logo" />
                        </div>
                        <span className="sr-only">Poma Inc</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                            Activities
                        </Link>
                        <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                            Games
                        </Link>
                        <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                            How it works
                        </Link>
                        <Link href="#" className="flex w-full items-center py-2  font-semibold" prefetch={false}>
                            About Us
                        </Link>
                        <ConnectButton accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }}
                            showBalance={{
                                smallScreen: false,
                                largeScreen: true,
                            }}
                        />

                    </div>
                </SheetContent>
            </Sheet>
            <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                <div>
                    <Image src="/assets/images/logo.png" width={100} height={50} alt="Poma logo" />
                </div>
                <span className="sr-only">Acme Inc</span>
            </Link>
            <nav className="ml-auto hidden lg:flex gap-6">
                <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-2xl font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-transparent dark:hover:bg-gray-800 dark:hover:text-gray-50  dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    Activities
                </Link>
                <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-2xl font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-transparent dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    Games
                </Link>
                <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-2xl font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-transparent dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    How it works
                </Link>
                <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-2xl font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-transparent dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    About Us
                </Link>
                <ConnectButton accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                }}
                    showBalance={{
                        smallScreen: false,
                        largeScreen: true,
                    }}
                />

            </nav>
        </header>
    )
}
