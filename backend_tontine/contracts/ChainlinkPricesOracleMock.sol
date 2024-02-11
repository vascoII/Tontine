// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract ChainlinkPricesOracleMock {
    constructor() {}

    function getLatestTinePriceInEth() public pure returns (uint256) {
        return 10 ** 18;
    }

    function getLatestEthPriceInTine() public pure returns (uint256) {
        return 10 ** 18;
    }
}
