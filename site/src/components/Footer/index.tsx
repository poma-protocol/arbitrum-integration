import React from "react";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Montserrat } from "next/font/google";
const mont = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
})
const Footer = () => {
    return (
        <footer className={`bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-8 ${mont.className}`}>
            <div className="flex justify-around items-center">
                <section className="flex flex-col items-start space-y-4">
                    <div>
                        <Image src="/assets/images/logo.png" width={100} height={50} alt="Poma logo" />
                    </div>
                    <section className="flex items-center space-x-2">
                        <MdEmail />
                        <span>info@pomaprotocol.com</span>
                    </section>
                    <section className="flex space-x-4">
                        <Link
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-purple-800 border border-white rounded-full flex items-center justify-center hover:bg-purple-700 transition"
                        >
                            <FaLinkedinIn className="text-white text-lg" />
                        </Link>
                        <Link
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-purple-800 border border-white rounded-full flex items-center justify-center hover:bg-purple-700 transition"
                        >
                            <FaFacebookF className="text-white text-lg" />
                        </Link>
                        <Link
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-purple-800 border border-white rounded-full flex items-center justify-center hover:bg-purple-700 transition"
                        >
                            <FaInstagram className="text-white text-lg" />
                        </Link>
                        <Link
                            href="https://www.twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-purple-800 border border-white rounded-full flex items-center justify-center hover:bg-purple-700 transition"
                        >
                            <FaXTwitter className="text-white text-lg" />
                        </Link>
                    </section>

                </section>
                <section className="flex flex-col items-start space-y-4 font-semibold">
                    <Link href="https://pomaprotocol.com/search/1508488904037x864166748244315400" target="_blank" rel="noopener noreferrer">
                        <p>Activities</p>
                    </Link>

                    <Link href="https://pomaprotocol.com/about" target="_blank" rel="noopener noreferrer">
                        <p>About Us</p>
                    </Link>
                </section>
                <section className="flex flex-col items-start space-y-4 font-semibold">
                    <Link href="https://pomaprotocol.com/search/1508488904037x864166748244315400" target="_blank" rel="noopener noreferrer">
                        <p>Activities</p>
                    </Link>
                    <Link href="https://pomaprotocol.com/how_it_works" target="_blank" rel="noopener noreferrer">
                        <p>How it Works</p>
                    </Link>
                    <Link href="https://pomaprotocol.com/about" target="_blank" rel="noopener noreferrer">
                        <p>About Us</p>
                    </Link>
                </section>
                <section className="flex flex-col items-start space-y-4">
                    <span className="font-semibold">Subscribe to our newsletter</span>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="email" placeholder="Email" />
                        <Button type="submit">Subscribe</Button>
                    </div>
                </section>
            </div>
        </footer>
    );
};

export default Footer;
