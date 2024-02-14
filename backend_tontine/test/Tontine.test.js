const { expect } = require("chai");
const { hre } = require("hardhat");

// Import the ABI of the interfaces
/*const ITineABI =
  require("../artifacts/contracts/Interface/ITine.sol/ITine.json").abi;
const IRocketTokenRETHMockABI =
  require("../artifacts/contracts/Interface/IRocketTokenRETHMock.sol/IRocketTokenRETHMock.json").abi;
*/
describe("Tontine contract", function () {
  let tontine;
  let mockTine;
  let mockRETH;
  let owner, addr1, addr2;

  beforeEach(async function () {
    /*  [owner, addr1, addr2] = await ethers.getSigners();
    console.log("Signers loaded");

    // Deploying mock contracts
    mockTine = await deployMockContract(owner, ITineABI);
    console.log("Mock Tine deployed");

    mockRETH = await deployMockContract(owner, IRocketTokenRETHMockABI);
    console.log("Mock RETH deployed");
    
    const Tontine = await ethers.getContractFactory("Tontine");
    tontine = await Tontine.deploy(mockTine.address, mockRETH.address);
    console.log("Tontine deployed");
  */
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {});

    it("Should set the initial values correctly", async function () {});
  });

  describe("getTotalDeposits", function () {
    it("Should return the correct total deposits", async function () {});
  });

  describe("getContractBalance", function () {
    it("Should return the correct contract balance", async function () {});
  });

  describe("addUser", function () {
    it("Should add a user correctly", async function () {});
    it("Should emit the AddUserEvent", async function () {});
  });

  describe("findUser", function () {
    it("Should return the correct user index", async function () {});
  });

  describe("isAlreadyUser", function () {
    it("Should return true if the user is already added", async function () {});
    it("Should return false if the user is not added", async function () {});
  });

  describe("getSilverVaultBalance", function () {
    it("Should return the correct Silver Vault balance", async function () {});
  });

  describe("getGoldVaultBalance", function () {
    it("Should return the correct Gold Vault balance", async function () {});
  });

  describe("depositEth", function () {
    it("Should record the deposit correctly", async function () {});
    it("Should emit the DepositEvent", async function () {});
  });

  describe("withdrawEth", function () {
    it("Should record the withdraw correctly", async function () {});
    it("Should emit the WithdrawEvent", async function () {});
  });

  describe("getSilverVaultDepositsForUser", function () {
    it("Should return the correct Silver Vault deposits for the user", async function () {});
  });

  describe("getGoldVaultDepositsForUser", function () {
    it("Should return the correct Gold Vault deposits for the user", async function () {});
  });

  describe("getSilverVaultWithdrawsForUser", function () {
    it("Should return the correct Silver Vault withdraws for the user", async function () {});
  });

  describe("getGoldVaultWithdrawsForUser", function () {
    it("Should return the correct Gold Vault withdraws for the user", async function () {});
  });

  describe("getSilverVaultExchangeRate", function () {
    it("Should return the correct Silver Vault exchange rate", async function () {});
  });

  describe("getGoldVaultExchangeRate", function () {
    it("Should return the correct Gold Vault exchange rate", async function () {});
  });

  describe("ownerWithdrawEth", function () {
    it("Should withdraw the correct amount of ETH", async function () {});
  });

  describe("simulateSixMonthsInterest", function () {
    it("Should simulate six months interest correctly", async function () {});
  });
});
