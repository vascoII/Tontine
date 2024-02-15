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

  /*******************************************************/
  /***************  INTERACTION BACKEND  *****************/
  /*******************************************************/

  /*********************  TONTINE  ***********************/
  const tontineInstance = await ethers.getContractAt(
    "Tontine",
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  );

  await tontineInstance.simulateTwelveMonthsInterest();
  console.log("The Tontine's Vault has been funded with interests.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
