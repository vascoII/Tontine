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
  const RocketPoolMock = await ethers.getContractFactory("RocketTokenRETHMock");
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

  /*******************************************************/
  /***************  INTERACTION BACKEND  *****************/
  /*******************************************************/

  /**********************  TINE  *************************/
  const tineInstance = await ethers.getContractAt(
    "Tine",
    tineSmartContractAddress
  );
  const tineInstanceWithGoldStaker = tineInstance.connect(goldStaker);

  // Achat de 1 Tine sur Tine smart contract
  const ethAmountToBuyTine = hre.ethers.parseEther("1.0");
  const tineAmountToBuy = hre.ethers.parseEther("1.0");
  await tineInstance.buyTine(tineAmountToBuy, {
    value: ethAmountToBuyTine,
  });
  await tineInstanceWithGoldStaker.buyTine(tineAmountToBuy, {
    value: ethAmountToBuyTine,
  });
  console.log("We bought 2 Tine as first step to access the gold vault.");

  // Verrouiller le TINE
  await tineInstance.lockTine();
  await tineInstanceWithGoldStaker.lockTine();
  console.log(`Lock Tine's owner on ${tineSmartContractAddress}`);

  /*********************  TONTINE  ***********************/
  const tontineInstance = await ethers.getContractAt(
    "Tontine",
    tontineSmartContractAddress
  );
  const tontineInstanceWithGoldStaker = tontineInstance.connect(goldStaker);

  // Ajout de 10 ETH en staking sur un RocketPool par silver
  const silverVaultInitialBalance = hre.ethers.parseEther("5.0");
  await tontineInstance.depositEth(false, {
    value: silverVaultInitialBalance,
  });
  await tontineInstanceWithGoldStaker.depositEth(false, {
    value: silverVaultInitialBalance,
  });
  console.log(
    "The Tontine's Silver Vault has been launched and funded with 10 ETH."
  );

  // Ajout de 32 ETH en staking sur un node RocketPool de Tontine par gold
  const goldVaultInitialBalance = hre.ethers.parseEther("16.0");
  await tontineInstance.depositEth(true, {
    value: goldVaultInitialBalance,
  });
  await tontineInstanceWithGoldStaker.depositEth(true, {
    value: goldVaultInitialBalance,
  });
  console.log(
    "The Tontine's Gold Vault has been launched and funded with 32 ETH."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
