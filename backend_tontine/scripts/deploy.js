// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Obtenir les signers
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  /*******************************************************/
  /*****************  CHAINLINK MOCK  ********************/
  /*******************************************************/
  const ChainlinkPricesOracleMock = await ethers.getContractFactory(
    "ChainlinkPricesOracleMock"
  );
  let chainlinkPricesOracleMock = await ChainlinkPricesOracleMock.connect(
    deployer
  ).deploy();
  await chainlinkPricesOracleMock.waitForDeployment();
  const chainlinkPricesOracleMockSmartContractAddress =
    await chainlinkPricesOracleMock.getAddress();

  console.log(
    "ChainlinkPricesOracleMock contract deployed to:",
    chainlinkPricesOracleMockSmartContractAddress
  );

  /*******************************************************/
  /**********************  TINE  *************************/
  /*******************************************************/
  const Tine = await ethers.getContractFactory("Tine");
  let tine = await Tine.connect(deployer).deploy(
    chainlinkPricesOracleMockSmartContractAddress
  );
  await tine.waitForDeployment();
  const tineSmartContractAddress = await tine.getAddress();

  console.log("Tine contract deployed to:", tineSmartContractAddress);

  // Envoi de 50 ethers au contrat
  const transaction = {
    to: tineSmartContractAddress,
    value: hre.ethers.parseEther("50.0"), // Convertit 50 ethers en wei
  };

  const tx = await deployer.sendTransaction(transaction); // Envoie la transaction
  await tx.wait(); // Attend que la transaction soit minée

  console.log(`50 ethers send to ${tineSmartContractAddress}`);

  /*******************************************************/
  /**********************  TTETH  ************************/
  /*******************************************************/
  const Tteth = await ethers.getContractFactory("Tteth");
  let tteth = await Tteth.connect(deployer).deploy();
  await tteth.waitForDeployment();
  const ttethSmartContractAddress = await tteth.getAddress();

  console.log("Tteth contract deployed to:", ttethSmartContractAddress);

  /*******************************************************/
  /*********************  TONTINE  ***********************/
  /*******************************************************/
  const Tontine = await ethers.getContractFactory("Tontine");
  let tontine = await Tontine.connect(deployer).deploy(
    tineSmartContractAddress,
    ttethSmartContractAddress,
    chainlinkPricesOracleMockSmartContractAddress
  );
  await tontine.waitForDeployment();
  const tontineSmartContractAddress = await tontine.getAddress();

  console.log("Tontine contract deployed to:", tontineSmartContractAddress);

  // Transférez ownership de Tteth au contrat Tontine.sol pour lui permettre de mint, burn et increaseMaxSupply
  await tteth.connect(deployer).transferOwnership(tontineSmartContractAddress);
  console.log("Transferred ownership Tteth to Tontine contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
