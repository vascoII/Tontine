// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @title Chainlink Prices Oracle Mock
/// @dev This contract simulates a price oracle for testing and development purposes.
/// It provides functions to get the simulated price of a fictional asset named "Tine" in MATIC and vice versa.
contract ChainlinkPricesOracleMock {
    /// @dev Contract constructor.
    constructor() {}

    /// @notice Retrieves the latest price of Tine in MATIC.
    /// @dev This function returns a fixed value and does not consume gas as it is `pure`.
    /// @return The price of Tine in MATIC as a uint256.
    function getLatestTinePriceInMatic() public pure returns (uint256) {
        // 0.1 MATIC in Wei
        return 10 ** 17; // equivalent to 1 * 10 ** 18
    }

    /// @notice Retrieves the latest MATIC price in Tine.
    /// @dev This function also returns a fixed value for simulation purposes.
    /// @return The price of MATIC in Tine as a uint256.
    function getLatestMaticPriceInTine() public pure returns (uint256) {
        // Simulates a fixed price of MATIC in Tine
        return 10;
    }
}
