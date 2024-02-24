// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./Interface/IPriceConsumer.sol";
/**
 * @title PriceConsumer
 * @dev Price consumer using Chainlink Data Feeds to fetch the current native blockchain
 * token price in USD. This contract is currently set up with a simple mock for the
 * initial development and testing phase.
 */
contract PriceConsumerV1 is IPriceConsumer {
    AggregatorV3Interface internal dataFeed;

    /**
     * @notice Initializes the contract with the address of the Chainlink Data Feed
     * for the native blockchain token (e.g., ETH/USD on Ethereum).
     * @param _dataFeedAddress The address of the Chainlink Data Feed contract.
     */
    constructor(address _dataFeedAddress) {
        dataFeed = AggregatorV3Interface(_dataFeedAddress);
    }

    /**
     * @notice Returns the latest price.
     * Currently, this function mocks returning a fixed value for simplicity.
     * In the future, this will be replaced with actual data fetched from Chainlink.
     * @return The latest price (mocked as 1 for initial development).
     */
    function getLatestPrice() public view returns (int) {
        // Here we mock the price to simplify initial development and testing.
        // Replace the return value with actual logic to fetch data from Chainlink.
        return 1; // Mocked value
    }

    /**
     * @dev Allows updating the data feed address, enabling the contract to adapt to new
     * Chainlink Data Feed addresses or to switch data sources if necessary.
     * @param _newDataFeedAddress The new address of the Chainlink Data Feed contract.
     */
    function updateDataFeedAddress(address _newDataFeedAddress) public {
        // Additional access control logic should be added here (e.g., onlyOwner)
        dataFeed = AggregatorV3Interface(_newDataFeedAddress);
    }

    // Additional functions and logic to interact with the data feed can be added below.
}
