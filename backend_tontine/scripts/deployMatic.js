// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Obtenir les signers
  const [deployer, goldStaker] = await hre.ethers.getSigners();
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
  /*****************  ROCKETPOOL MOCK  ********************/
  /*******************************************************/
  const RocketPoolMock = await ethers.getContractFactory(
    "RocketTokenRMATICMock"
  );
  let rocketPoolMock = await RocketPoolMock.connect(deployer).deploy();
  await rocketPoolMock.waitForDeployment();
  const rocketPoolMockContractAddress = await rocketPoolMock.getAddress();

  console.log(
    "RocketPoolMock contract deployed to:",
    rocketPoolMockContractAddress
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

  /*******************************************************/
  /*********************  TONTINE  ***********************/
  /*******************************************************/
  const Tontine = await ethers.getContractFactory("Tontine");
  let tontine = await Tontine.connect(deployer).deploy(
    tineSmartContractAddress,
    rocketPoolMockContractAddress
  );
  await tontine.waitForDeployment();
  const tontineSmartContractAddress = await tontine.getAddress();

  console.log("Tontine contract deployed to:", tontineSmartContractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
