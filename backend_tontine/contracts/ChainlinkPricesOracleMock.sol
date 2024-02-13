// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract ChainlinkPricesOracleMock {
    constructor() {}

    function getLatestTinePriceInEth() public pure returns (uint256) {
        // 0.1 ETH en Wei
        return 10 ** 17; // équivalent à 0.1 * 10 ** 18
    }

    function getLatestEthPriceInTine() public pure returns (uint256) {
        return 10;
    }
}
