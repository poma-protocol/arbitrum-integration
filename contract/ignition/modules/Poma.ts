// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("PomaModule", (m) => {
  const lock = m.contract("Poma");

  return { lock };
});

export default LockModule;
