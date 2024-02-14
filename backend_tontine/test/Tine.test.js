const { expect } = require("chai");
const { hre } = require("hardhat");

describe("Tine contract", function () {
  let tine;
  let owner, addr1, addr2;
  let chainlinkPricesOracleMock;
  let tineAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ChainlinkPricesOracleMock = await ethers.getContractFactory(
      "ChainlinkPricesOracleMock"
    );
    chainlinkPricesOracleMock = await ChainlinkPricesOracleMock.deploy();
    await chainlinkPricesOracleMock.waitForDeployment();
    const chainlinkPricesOracleMockSmartContractAddress =
      await chainlinkPricesOracleMock.getAddress();

    const Tine = await ethers.getContractFactory("Tine");
    tine = await Tine.deploy(chainlinkPricesOracleMockSmartContractAddress);
    await tine.waitForDeployment();
    tineAddress = await tine.getAddress();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tine.owner()).to.equal(owner.address);
    });

    it("Should deploy with initial supply", async function () {
      expect(await tine.totalSupply()).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint monthly", async function () {
      await tine.mintMonthly();
      expect(await tine.totalSupply()).to.equal(ethers.parseEther("1100"));
    });

    it("Should prevent non-owner from minting", async function () {
      await expect(tine.connect(addr1).mintMonthly()).to.be.reverted;
    });

    it("Should not allow minting more than once a month", async function () {
      await tine.mintMonthly();
      await expect(tine.mintMonthly()).to.be.reverted;
    });
  });

  describe("Buying Tine", function () {
    it("Should allow users to buy Tine", async function () {
      // Example assumes the mock oracle is set up to return a specific rate.
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("1"),
      });
      expect(await tine.balanceOf(addr1.address)).to.equal(
        ethers.parseEther("10")
      );
    });

    it("Should emit BuyTineEvent on purchase", async function () {
      await expect(
        tine.connect(addr1).buyTine(ethers.parseEther("10"), {
          value: ethers.parseEther("1"),
        })
      )
        .to.emit(tine, "BuyTineEvent")
        .withArgs(
          addr1.address,
          ethers.parseEther("10"),
          ethers.parseEther("1")
        );
    });

    it("Should not allow users to buy Tine with insufficient ETH", async function () {
      const tineAmount = ethers.parseEther("10"); // Attempting to buy 10 Tine
      const insufficientEthAmount = ethers.parseEther("0.01"); // Insufficient ETH
      await expect(
        tine
          .connect(addr1)
          .buyTine(tineAmount, { value: insufficientEthAmount })
      ).to.be.revertedWith("Incorrect ETH amount");
    });
  });

  describe("Locking Tine", function () {
    beforeEach(async function () {
      // Setting up by buying Tine for addr1
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("1"),
      });
    });

    it("Should allow users to lock their Tine", async function () {
      await tine.connect(addr1).lockTine();
      expect(await tine.hasLockedTine(addr1.address)).to.equal(true);
    });

    it("Should emit LockTineEvent on locking", async function () {
      await expect(tine.connect(addr1).lockTine())
        .to.emit(tine, "LockTineEvent")
        .withArgs(addr1.address);
    });

    it("Should not allow users to lock Tine when it's already locked", async function () {
      await tine.connect(addr1).lockTine();
      await expect(tine.connect(addr1).lockTine()).to.be.revertedWith(
        "TINE already locked"
      );
    });
  });

  describe("Locking Tine without Tine in balance", function () {
    it("Should not allow users to lock Tine without enough balance", async function () {
      await expect(tine.connect(addr1).lockTine()).to.be.revertedWith(
        "Insufficient TINE to lock"
      );
    });
  });

  describe("Unlocking Tine", function () {
    beforeEach(async function () {
      // Setting up by buying and locking Tine for addr1
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("1"),
      });
      await tine.connect(addr1).lockTine();
    });

    it("Should not allow users to unlock Tine before the lock period", async function () {
      // Assuming addr1 has locked their Tine
      await expect(tine.connect(addr1).unlockTine()).to.be.revertedWith(
        "Lock period not over"
      );
    });

    it("Should allow users to unlock their Tine after the lock period", async function () {
      // Fast-forward time to simulate lock period passing
      await ethers.provider.send("evm_increaseTime", [60]); // Increase time by 60 seconds
      await ethers.provider.send("evm_mine");

      await tine.connect(addr1).unlockTine();
      expect(await tine.hasLockedTine(addr1.address)).to.equal(false);
    });

    it("Should emit UnlockTineEvent on unlocking", async function () {
      await ethers.provider.send("evm_increaseTime", [60]); // Increase time by 60 seconds
      await ethers.provider.send("evm_mine");

      await expect(tine.connect(addr1).unlockTine())
        .to.emit(tine, "UnlockTineEvent")
        .withArgs(addr1.address);
    });
  });

  describe("Unlocking Tine without having lock any", function () {
    it("Should not allow users to unlock Tine if none is locked", async function () {
      await expect(tine.connect(addr2).unlockTine()).to.be.revertedWith(
        "No TINE locked"
      );
    });
  });

  describe("Selling Tine", function () {
    beforeEach(async function () {
      // Setting up by buying Tine for addr1
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("1"),
      });
      // Approving the contract to spend Tine on behalf of addr1
      await tine.connect(addr1).approve(tineAddress, ethers.parseEther("10"));
    });

    it("Should allow users to sell Tine back to the contract", async function () {
      const initialEthBalance = await ethers.provider.getBalance(addr1.address);
      await tine.connect(addr1).sellTine(ethers.parseEther("5"));
      const finalEthBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalEthBalance).to.be.gt(initialEthBalance); // User should have more ETH after the sale
    });

    it("Should emit SellTineEvent on sale", async function () {
      await expect(
        tine.connect(addr1).sellTine(ethers.parseEther("5"))
      ).to.emit(tine, "SellTineEvent");
    });

    it("Should not allow users to sell more Tine than they hold", async function () {
      const excessiveTineAmount = ethers.parseEther("100"); // More than the user has
      await expect(
        tine.connect(addr1).sellTine(excessiveTineAmount)
      ).to.be.revertedWith("Insufficient TINE balance");
    });
  });

  describe("Selling Tine without Approval", function () {
    beforeEach(async function () {
      // Setting up by buying Tine for addr1
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("1"),
      });
    });

    it("Should not allow users to sell Tine without approval", async function () {
      const tineAmount = ethers.parseEther("1");
      await expect(tine.connect(addr1).sellTine(tineAmount)).to.be.revertedWith(
        "Insufficient allowance"
      );
    });
  });

  describe("Selling Tine without enough Approval", function () {
    beforeEach(async function () {
      // Setting up by buying Tine for addr1
      await tine.connect(addr1).buyTine(ethers.parseEther("10"), {
        value: ethers.parseEther("10"),
      });
      // Approving the contract to spend Tine on behalf of addr1
      await tine.connect(addr1).approve(tineAddress, ethers.parseEther("1"));
    });

    it("Should not allow users to sell Tine without approval", async function () {
      const tineAmount = ethers.parseEther("10");
      await expect(tine.connect(addr1).sellTine(tineAmount)).to.be.revertedWith(
        "Insufficient allowance"
      );
    });
  });

  describe("Contract Settings by Owner", function () {
    it("Should allow the owner to set minimum lock time", async function () {
      const newMinLockTime = 120; // 2 minutes
      await tine.setMinLockTime(newMinLockTime);
      expect(await tine.minLockTime()).to.equal(newMinLockTime);
    });

    it("Should allow the owner to set minimum lock amount", async function () {
      const newMinLockAmount = ethers.parseEther("2");
      await tine.setMinLockAmount(2); // Setting 2 TINE as the new minimum
      expect(await tine.minLockAmount()).to.equal(newMinLockAmount);
    });

    it("Should allow the owner to set maximum supply", async function () {
      const newMaxSupply = ethers.parseEther("25000");
      await tine.setMaxSupply(25000); // Setting 25,000 TINE as the new maximum supply
      expect(await tine.maxSupply()).to.equal(newMaxSupply);
    });

    it("Should prevent non-owners from changing contract settings", async function () {
      await expect(tine.connect(addr1).setMinLockTime(120)).to.be.reverted;
      await expect(tine.connect(addr1).setMinLockAmount(2)).to.be.reverted;
      await expect(tine.connect(addr1).setMaxSupply(25000)).to.be.reverted;
    });
  });

  describe("Owner Operations", function () {
    it("Should allow the owner to withdraw ETH", async function () {
      // Ensure the contract has some ETH by simulating a purchase.
      await tine.connect(addr2).buyTine(ethers.parseEther("1"), {
        value: ethers.parseEther("0.1"),
      });

      const initialOwnerBalance = await ethers.provider.getBalance(
        owner.address
      );

      const txResponse = await tine.withdrawEth(
        ethers.parseEther("0.05"),
        owner.address
      );
      const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined.

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

      expect(finalOwnerBalance).to.be.closeTo(
        initialOwnerBalance + ethers.parseEther("0.05"),
        ethers.parseEther("0.01")
      );
    });

    it("Should prevent non-owners from withdrawing ETH", async function () {
      await expect(
        tine.connect(addr1).withdrawEth(ethers.parseEther("1"), addr1.address)
      ).to.be.reverted;
    });

    it("Should not allow the owner to withdraw more ETH than the contract balance", async function () {
      const excessiveEthAmount = ethers.parseEther("10000");
      await expect(
        tine.withdrawEth(excessiveEthAmount, owner.address)
      ).to.be.revertedWith("Insufficient ETH balance");
    });
  });

  // Additional tests can include edge cases, stress testing, and integration tests with other contracts or oracles.
});
