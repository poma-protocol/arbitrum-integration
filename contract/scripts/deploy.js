async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const Poma = await hre.ethers.getContractFactory("Poma");
  const poma = await Poma.deploy();

  console.log("Contract deployed to:", poma);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
