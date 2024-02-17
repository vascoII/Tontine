// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Rocket Token rETH Mock
/// @dev This contract simulates the Rocket Pool's ETH token (rETH) for testing and development.
/// It includes simplified functions for depositing ETH and receiving rETH, and vice versa, with mock exchange rates.
contract RocketTokenRETHMock is ERC20, ReentrancyGuard {
    uint256 private constant SILVER_RATE = 500; // Rate for Silver Vault, percentage * 100
    uint256 private constant GOLD_RATE = 1000; // Rate for Gold Vault, percentage * 100

    /// @dev Contract constructor that sets up the rETH token.
    constructor() ERC20("Rocket Pool ETH", "rETH") {}

    /// @notice Deposits ETH and mints rETH to the sender's address.
    /// @dev Simplified function to deposit ETH and receive rETH, ensuring non-reentrancy.
    /// Requires the deposit amount to be greater than 0.
    function depositETH() external payable nonReentrant {
        require(msg.value > 0, "ETH amount is zero");
        uint256 rethAmount = getRethValue(msg.value);
        _mint(msg.sender, rethAmount);
    }

    /// @notice Withdraws ETH by burning rETH from the sender's address.
    /// @dev Simplified function to withdraw ETH by burning rETH, ensuring non-reentrancy.
    /// Requires the rETH amount to be greater than 0 and that the contract has enough ETH balance.
    function withdrawETH(uint256 _rethAmount) external nonReentrant {
        require(_rethAmount > 0, "rETH amount is zero");
        uint256 ethAmount = getEthValue(_rethAmount);
        _burn(msg.sender, _rethAmount);
        require(
            address(this).balance >= ethAmount,
            "Not enough ETH in contract"
        );
        payable(msg.sender).transfer(ethAmount);
    }

    /// @notice Gets the exchange rate based on the type of stake.
    /// @dev Returns the exchange rate for Silver or Gold Vault, determined by `_typeStake`.
    /// @param _typeStake The type of stake (1 for Silver, otherwise Gold).
    /// @return The exchange rate as a uint256.
    function getExchangeRate(uint256 _typeStake) external pure returns (uint256) {
        return _typeStake == 1 ? SILVER_RATE : GOLD_RATE;
    }

    /// @notice Calculates the ETH value for a given amount of rETH.
    /// @dev Assumes a fixed exchange rate for simplification: 1 rETH = 1.01 ETH, for example.
    /// @param _rethAmount The amount of rETH.
    /// @return The equivalent ETH value.
    function getEthValue(uint256 _rethAmount) public pure returns (uint256) {
        return (_rethAmount * 101) / 100;
    }

    /// @notice Calculates the rETH value for a given amount of ETH.
    /// @dev Assumes the inverse of the above exchange rate: 1 ETH = 0.99 rETH.
    /// @param _ethAmount The amount of ETH.
    /// @return The equivalent rETH value.
    function getRethValue(uint256 _ethAmount) public pure returns (uint256) {
        return (_ethAmount * 99) / 100;
    }
}
