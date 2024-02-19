// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Rocket Token rMATIC Mock
/// @dev This contract simulates the Rocket Pool's MATIC token (rMATIC) for testing and development.
/// It includes simplified functions for depositing MATIC and receiving rMATIC, and vice versa, with mock exchange rates.
contract RocketTokenRMATICMock is ERC20, ReentrancyGuard {
    uint256 private constant SILVER_RATE = 500; // Rate for Silver Vault, percentage * 100
    uint256 private constant GOLD_RATE = 1000; // Rate for Gold Vault, percentage * 100

    /// @dev Contract constructor that sets up the rMATIC token.
    constructor() ERC20("Rocket Pool MATIC", "rMATIC") {}

    /// @notice Deposits MATIC and mints rMATIC to the sender's address.
    /// @dev Simplified function to deposit MATIC and receive rMATIC, ensuring non-reentrancy.
    /// Requires the deposit amount to be greater than 0.
    function depositMATIC() external payable nonReentrant {
        require(msg.value > 0, "MATIC amount is zero");
        uint256 rmaticAmount = getRmaticValue(msg.value);
        _mint(msg.sender, rmaticAmount);
    }

    /// @notice Withdraws MATIC by burning rMATIC from the sender's address.
    /// @dev Simplified function to withdraw MATIC by burning rMATIC, ensuring non-reentrancy.
    /// Requires the rMATIC amount to be greater than 0 and that the contract has enough MATIC balance.
    function withdrawMATIC(uint256 _rmaticAmount) external nonReentrant {
        require(_rmaticAmount > 0, "rMATIC amount is zero");
        uint256 maticAmount = getMaticValue(_rmaticAmount);
        _burn(msg.sender, _rmaticAmount);
        require(
            address(this).balance >= maticAmount,
            "Not enough MATIC in contract"
        );
        payable(msg.sender).transfer(maticAmount);
    }

    /// @notice Gets the exchange rate based on the type of stake.
    /// @dev Returns the exchange rate for Silver or Gold Vault, determined by `_typeStake`.
    /// @param _typeStake The type of stake (1 for Silver, otherwise Gold).
    /// @return The exchange rate as a uint256.
    function getExchangeRate(
        uint256 _typeStake
    ) external pure returns (uint256) {
        return _typeStake == 1 ? SILVER_RATE : GOLD_RATE;
    }

    /// @notice Calculates the MATIC value for a given amount of rMATIC.
    /// @dev Assumes a fixed exchange rate for simplification: 1 rMATIC = 1.01 MATIC, for example.
    /// @param _rmaticAmount The amount of rMATIC.
    /// @return The equivalent MATIC value.
    function getMaticValue(
        uint256 _rmaticAmount
    ) public pure returns (uint256) {
        return (_rmaticAmount * 101) / 100;
    }

    /// @notice Calculates the rMATIC value for a given amount of MATIC.
    /// @dev Assumes the inverse of the above exchange rate: 1 MATIC = 0.99 rMATIC.
    /// @param _maticAmount The amount of MATIC.
    /// @return The equivalent rMATIC value.
    function getRmaticValue(
        uint256 _maticAmount
    ) public pure returns (uint256) {
        return (_maticAmount * 99) / 100;
    }
}
