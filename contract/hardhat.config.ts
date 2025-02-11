import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
console.log(PRIVATE_KEY);
const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        arbitrumSepolia: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",  // Official Nova RPC
            accounts: ["de9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0"],  // Load private key from .env
        },
    },
};

export default config;
