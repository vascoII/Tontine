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
    it("Should fail if depositing 0 ETH", async function () {
      await expect(
        rocketTokenRETHMock.connect(user).depositETH({ value: 0 })
      ).to.be.revertedWith("ETH amount is zero");
    });

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
    it("Should fail if withdrawing 0 rETH", async function () {
      await expect(
        rocketTokenRETHMock.connect(user).withdrawETH(0)
      ).to.be.revertedWith("rETH amount is zero");
    });

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

  describe("getExchangeRate", () => {
    it("returns SILVER_RATE for typeStake 1", async () => {
      const silverRate = await rocketTokenRETHMock.getExchangeRate(1);
      expect(Number(silverRate)).to.equal(500);
    });

    it("returns GOLD_RATE for typeStake not 1", async () => {
      const goldRate = await rocketTokenRETHMock.getExchangeRate(2);
      expect(Number(goldRate)).to.equal(1000);
    });
  });

  describe("getEthValue", () => {
    it("returns correct ETH value for rETH amount", async () => {
      const rETHAmount = 100;
      const expectedEthValue = 101; // 100 rETH * 1.01 ETH/rETH
      const ethValue = await rocketTokenRETHMock.getEthValue(rETHAmount);
      expect(Number(ethValue)).to.equal(expectedEthValue);
    });
  });

  describe("getRethValue", () => {
    it("returns correct rETH value for ETH amount", async () => {
      const ethAmount = 100;
      const expectedRethValue = 99; // 100 ETH * 0.99 rETH/ETH
      const rethValue = await rocketTokenRETHMock.getRethValue(ethAmount);
      expect(Number(rethValue)).to.equal(expectedRethValue);
    });
  });
});
