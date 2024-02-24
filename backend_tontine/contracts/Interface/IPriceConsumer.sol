// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IPriceConsumer {
    function getLatestPrice() external view returns (int);
}
