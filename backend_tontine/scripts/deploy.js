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

  // Envoi de 50 ethers au contrat
  const transaction = {
    to: tineSmartContractAddress,
    value: hre.ethers.parseEther("50.0"), // Convertit 50 ethers en wei
  };

  const tx = await deployer.sendTransaction(transaction); // Envoie la transaction
  await tx.wait(); // Attend que la transaction soit minée

  console.log(`50 ethers send to ${tineSmartContractAddress}`);

  // Lock des Tine du owner pour par la suite lancer le vault Gold
  // Récupérer l'instance du contrat Tine
  const tineInstance = await ethers.getContractAt(
    "Tine",
    tineSmartContractAddress
  );
  // Verrouiller les TINE
  await tineInstance.lockTine();
  console.log(`Lock Tine's owner on ${tineSmartContractAddress}`);

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

  // Ajout de 10 ETH en staking sur un node RocketPool de Tontine par silver
  const tontineInstance = await ethers.getContractAt(
    "Tontine",
    tontineSmartContractAddress
  );
  const silverVaultInitialBalance = hre.ethers.parseEther("10.0");
  await tontineInstance.depositEth(false, {
    value: silverVaultInitialBalance,
  });
  console.log(
    "The Tontine's Silver Vault has been launched and funded with 10 ETH."
  );

  // Ajout de 32 ETH en staking sur un node RocketPool de Tontine par gold
  const goldVaultInitialBalance = hre.ethers.parseEther("32.0");
  await tontineInstance.depositEth(true, {
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
