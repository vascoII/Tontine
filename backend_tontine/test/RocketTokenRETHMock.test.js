const { expect } = require("chai");
const hre = require("hardhat");

describe("RocketTokenRETHMock", function () {
  let rocketTokenRETHMock;
  let owner;
  let user;

  beforeEach(async function () {
    // Deploy the contract
    const RocketTokenRETHMock = await ethers.getContractFactory(
      "RocketTokenRETHMock"
    );
    [owner, user] = await hre.ethers.getSigners();
    rocketTokenRETHMock = await RocketTokenRETHMock.deploy();
  });

  describe("Deposit ETH", function () {
    it("Should allow a user to deposit ETH and receive rETH", async function () {
      const depositAmount = hre.ethers.parseEther("1");
      await rocketTokenRETHMock
        .connect(user)
        .depositETH({ value: depositAmount });
      const balance = await rocketTokenRETHMock.balanceOf(user.address);
      expect(balance).to.equal((depositAmount * 99n) / 100n); // 0.99 rETH for 1 ETH deposited
    });
  });

  describe("Withdraw ETH", function () {
    it("Should allow a user to withdraw ETH by burning rETH", async function () {
      const depositAmount = hre.ethers.parseEther("1");
      await rocketTokenRETHMock
        .connect(user)
        .depositETH({ value: depositAmount });

      const rethAmount = (depositAmount * 99n) / 100n; // Amount of rETH received
      await rocketTokenRETHMock.connect(user).withdrawETH(rethAmount);
      const balanceAfterWithdraw = await rocketTokenRETHMock.balanceOf(
        user.address
      );
      expect(balanceAfterWithdraw).to.equal(0);
    });
  });
});
