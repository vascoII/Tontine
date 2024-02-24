// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@chainlink/contracts@0.8.0/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface internal dataFeed;

    /**
     * Aggregator: ChainNativeToken/USD
     */
    constructor(address _nativeTokenAddress) {
        dataFeed = AggregatorV3Interface(
            _nativeTokenAddress
        );
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}