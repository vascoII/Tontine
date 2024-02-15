const { expect } = require("chai");
const { hre } = require("hardhat");
const { deployMockContract } = require("@ethereum-waffle/mock-contract");

// Import the ABI of the interfaces
const ITineABI =
  require("../artifacts/contracts/Interface/ITine.sol/ITine.json").abi;
const IRocketTokenRETHMockABI =
  require("../artifacts/contracts/Interface/IRocketTokenRETHMock.sol/IRocketTokenRETHMock.json").abi;

describe("Tontine contract", function () {
  let tontine;
  let mockTine;
  let mockRETH;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Mock contracts
    mockTine = await deployMockContract(owner, ITineABI);
    mockRETH = await deployMockContract(owner, IRocketTokenRETHMockABI);

    // Deploy the Tontine contract with the address of the mock contracts
    const Tontine = await ethers.getContractFactory("Tontine");
    tontine = await Tontine.deploy(mockTine.address, mockRETH.address);

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tontine.owner()).to.equal(owner.address);
    });

    it("Should set the initial values correctly", async function () {
      // Assuming your contract has getter functions or public variables to access these values
      expect(await tontine.tine()).to.equal(mockTine.address);
      expect(await tontine.rEth()).to.equal(mockRETH.address);
      // Add any other initial values that should be checked, for example:
      expect(await tontine.silverVaultBalance()).to.equal(0);
      expect(await tontine.goldVaultBalance()).to.equal(0);
    });
  });

  describe("getTotalDeposits", function () {
    it("Should return the correct total deposits", async function () {
      // Assuming `depositEth` is a public function that can be used to add funds to either vault
      // and that it internally calls `addUser` if necessary.
      // First, deposit into the silver vault
      const depositAmountSilver = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine
        .connect(addr1)
        .depositEth(false, { value: depositAmountSilver });

      // Then, deposit into the gold vault
      const depositAmountGold = ethers.utils.parseEther("2.0"); // 2 ETH
      await tontine
        .connect(addr2)
        .depositEth(true, { value: depositAmountGold });

      // The total deposits should now equal the sum of both deposits
      const totalDeposits = await tontine.getTotalDeposits();
      expect(totalDeposits).to.equal(
        depositAmountSilver.add(depositAmountGold)
      );
    });
  });

  describe("getContractBalance", function () {
    it("Should return the correct contract balance", async function () {
      // Send ETH to the contract. This could be done through the depositEth function or directly if the contract can receive ETH.
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await owner.sendTransaction({
        to: tontine.address,
        value: depositAmount,
      });

      // Now, get the contract's balance and assert it's correct
      const contractBalance = await tontine.getContractBalance();
      expect(contractBalance).to.equal(depositAmount);
    });
  });

  describe("addUser", function () {
    it("Should add a user correctly", async function () {});
    it("Should emit the AddUserEvent", async function () {
      await expect(
        tontine
          .connect(addr1)
          .depositEth(false, { value: ethers.utils.parseEther("1.0") })
      )
        .to.emit(tontine, "AddUserEvent")
        .withArgs(addr1.address, ethers.utils.parseEther("1.0"), 0);
    });
  });

  describe("findUser", function () {
    it("Should return the correct user index", async function () {});
  });

  describe("isAlreadyUser", function () {
    it("Should return true if the user is already added", async function () {
      // First, add a user by making a deposit or through another function that adds users.
      await tontine
        .connect(addr1)
        .depositEth(false, { value: ethers.utils.parseEther("1.0") });

      // Now check if the user is already added
      expect(await tontine.isAlreadyUser(addr1.address)).to.be.true;
    });

    it("Should return false if the user is not added", async function () {
      // Check for a user that has not interacted with the contract
      expect(await tontine.isAlreadyUser(addr2.address)).to.be.false;
    });
  });

  describe("getSilverVaultBalance", function () {
    it("Should return the correct Silver Vault balance", async function () {
      // Ensure there's a balance to retrieve by first making a deposit to the silver vault.
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).depositEth(false, { value: depositAmount });

      // Retrieve the silver vault balance for the user and verify it's correct
      const silverVaultBalance = await tontine.getSilverVaultBalance(
        addr1.address
      );
      expect(silverVaultBalance).to.equal(depositAmount);
    });
  });

  describe("getGoldVaultBalance", function () {
    it("Should return the correct Gold Vault balance", async function () {
      // Make a deposit to the gold vault.
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).depositEth(true, { value: depositAmount });

      // Retrieve the gold vault balance for the user and verify it's correct
      const goldVaultBalance = await tontine.getGoldVaultBalance(addr1.address);
      expect(goldVaultBalance).to.equal(depositAmount);
    });
  });

  describe("depositEth", function () {
    it("Should record the deposit correctly", async function () {
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).depositEth(false, { value: depositAmount });

      // Verify the deposit was recorded correctly
      const silverVaultBalance = await tontine.getSilverVaultBalance(
        addr1.address
      );
      expect(silverVaultBalance).to.equal(depositAmount);

      // If applicable, also check the overall contract balance or vault totals
      const totalDeposits = await tontine.getTotalDeposits();
      expect(totalDeposits).to.equal(depositAmount);
    });

    it("Should emit the DepositEvent", async function () {
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await expect(
        tontine.connect(addr1).depositEth(true, { value: depositAmount })
      )
        .to.emit(tontine, "DepositEvent")
        .withArgs(addr1.address, depositAmount, true);
    });
  });

  describe("withdrawEth", function () {
    it("Should record the withdraw correctly", async function () {
      // Assuming there's already some ETH in the vault for addr1. If not, deposit first.
      const depositAmount = ethers.utils.parseEther("2.0"); // 2 ETH for setup
      await tontine.connect(addr1).depositEth(true, { value: depositAmount });

      const withdrawAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).withdrawEth(true, withdrawAmount);

      // Verify the withdrawal was recorded correctly by checking the new balance
      const goldVaultBalanceAfterWithdraw = await tontine.getGoldVaultBalance(
        addr1.address
      );
      expect(goldVaultBalanceAfterWithdraw).to.equal(
        depositAmount.sub(withdrawAmount)
      );
    });

    it("Should emit the WithdrawEvent", async function () {
      // Ensure there's a balance to withdraw from
      const depositAmount = ethers.utils.parseEther("2.0"); // Setup
      await tontine.connect(addr1).depositEth(true, { value: depositAmount });

      const withdrawAmount = ethers.utils.parseEther("1.0");
      await expect(tontine.connect(addr1).withdrawEth(true, withdrawAmount))
        .to.emit(tontine, "WithdrawEvent")
        .withArgs(addr1.address, withdrawAmount, true);
    });
  });

  describe("getSilverVaultDepositsForUser", function () {
    it("Should return the correct Silver Vault deposits for the user", async function () {
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).depositEth(false, { value: depositAmount });

      // Retrieve the deposit records for addr1 in the silver vault
      const deposits = await tontine.getSilverVaultDepositsForUser(
        addr1.address
      );
      expect(deposits.length).to.equal(1);
      expect(deposits[0].amount).to.equal(depositAmount);
    });
  });

  describe("getGoldVaultDepositsForUser", function () {
    it("Should return the correct Gold Vault deposits for the user", async function () {
      const depositAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).depositEth(true, { value: depositAmount });

      // Retrieve the deposit records for addr1 in the gold vault
      const deposits = await tontine.getGoldVaultDepositsForUser(addr1.address);
      expect(deposits.length).to.equal(1);
      expect(deposits[0].amount).to.equal(depositAmount);
    });
  });

  describe("getSilverVaultWithdrawsForUser", function () {
    it("Should return the correct Silver Vault withdraws for the user", async function () {
      // Setup: Ensure there's a balance to withdraw from
      const depositAmount = ethers.utils.parseEther("2.0"); // 2 ETH
      await tontine.connect(addr1).depositEth(false, { value: depositAmount });
      const withdrawAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).withdrawEth(false, withdrawAmount);

      // Retrieve the withdrawal records for addr1 in the silver vault
      const withdraws = await tontine.getSilverVaultWithdrawsForUser(
        addr1.address
      );
      expect(withdraws.length).to.equal(1);
      expect(withdraws[0].amount).to.equal(withdrawAmount);
    });
  });

  describe("getGoldVaultWithdrawsForUser", function () {
    it("Should return the correct Gold Vault withdraws for the user", async function () {
      // Setup: Ensure there's a balance to withdraw from
      const depositAmount = ethers.utils.parseEther("2.0"); // 2 ETH
      await tontine.connect(addr1).depositEth(true, { value: depositAmount });
      const withdrawAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await tontine.connect(addr1).withdrawEth(true, withdrawAmount);

      // Retrieve the withdrawal records for addr1 in the gold vault
      const withdraws = await tontine.getGoldVaultWithdrawsForUser(
        addr1.address
      );
      expect(withdraws.length).to.equal(1);
      expect(withdraws[0].amount).to.equal(withdrawAmount);
    });
  });

  describe("getSilverVaultExchangeRate", function () {
    it("Should return the correct Silver Vault exchange rate", async function () {
        // Assuming the exchange rate is predefined or set in the contract or mock
        const expectedRate = ...; // The expected rate value

        const rate = await tontine.getSilverVaultExchangeRate();
        expect(rate).to.equal(expectedRate);
    });
  });

  describe("getGoldVaultExchangeRate", function () {
    it("Should return the correct Gold Vault exchange rate", async function () {
        const expectedRate = ...; // The expected rate value

        const rate = await tontine.getGoldVaultExchangeRate();
        expect(rate).to.equal(expectedRate);
    });
  });

  describe("ownerWithdrawEth", function () {
    it("Should withdraw the correct amount of ETH", async function () {
        // Setup: Send some ETH to the contract
        const depositAmount = ethers.utils.parseEther("5.0");
        await owner.sendTransaction({ to: tontine.address, value: depositAmount });

        // Withdraw a portion of the contract's balance
        const withdrawAmount = ethers.utils.parseEther("1.0");
        await tontine.connect(owner).ownerWithdrawEth(withdrawAmount, owner.address);

        // Verify the withdrawal was successful
        const contractBalanceAfterWithdraw = await ethers.provider.getBalance(tontine.address);
        expect(contractBalanceAfterWithdraw).to.equal(depositAmount.sub(withdrawAmount));
    });
  });


  describe("simulateSixMonthsInterest", function () {
    it("Should simulate six months interest correctly", async function () {
        const depositAmount = ethers.utils.parseEther("10.0");
        await tontine.connect(addr1).depositEth(false, {value: depositAmount}); // Silver Vault deposit
        await tontine.connect(addr1).depositEth(true, {value: depositAmount}); // Gold Vault deposit

        // Simulate interest
        await tontine.connect(owner).simulateSixMonthsInterest();
    });
});

});
