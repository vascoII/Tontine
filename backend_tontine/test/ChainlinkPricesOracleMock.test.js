const { expect } = require("chai");
const hre = require("hardhat");

describe("ChainlinkPricesOracleMock", function () {
  let chainlinkPricesOracleMock;

  beforeEach(async function () {
    const ChainlinkPricesOracleMock = await ethers.getContractFactory(
      "ChainlinkPricesOracleMock"
    );
    chainlinkPricesOracleMock = await ChainlinkPricesOracleMock.deploy();
  });

  it("Should return the correct Tine price in ETH", async function () {
    const expectedTinePriceInEth = 10n ** 17n;
    const actualTinePriceInEth =
      await chainlinkPricesOracleMock.getLatestTinePriceInEth();
    expect(actualTinePriceInEth).to.equal(expectedTinePriceInEth);
  });

  it("Should return the correct ETH price in Tine", async function () {
    const expectedEthPriceInTine = 10;
    const actualEthPriceInTine =
      await chainlinkPricesOracleMock.getLatestEthPriceInTine();
    expect(actualEthPriceInTine).to.equal(expectedEthPriceInTine);
  });
});
