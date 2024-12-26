import { Web3 } from "web3";

const web3 = new Web3('wss://ethereum-rpc.publicnode.com');

async function main() {
    // Testing logic where a websocket listens for every new block
    const subscription = await web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', data => console.log(data));
}

main();