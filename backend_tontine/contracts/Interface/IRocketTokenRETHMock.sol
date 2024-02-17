// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @title IRocketTokenRETHMock Interface
/// @dev Interface for the RocketTokenRETHMock contract.
/// This interface outlines the functions for depositing ETH to receive rETH, withdrawing ETH by burning rETH, and querying exchange rates and values.
interface IRocketTokenRETHMock {
    /// @notice Deposits ETH and mints rETH to the sender's address.
    /// @dev Function to deposit ETH and receive rETH.
    function depositETH() external payable;

    /// @notice Withdraws ETH by burning rETH from the sender's address.
    /// @dev Function to withdraw ETH by burning rETH.
    /// @param _rethAmount The amount of rETH to burn.
    function withdrawETH(uint256 _rethAmount) external;

    /// @notice Gets the exchange rate based on the type of stake.
    /// @dev Returns the exchange rate for a specified stake type.
    /// @param _typeStake The type of stake (e.g., 1 for Silver, 2 for Gold).
    /// @return The exchange rate as a uint256.
    function getExchangeRate(uint _typeStake) external view returns (uint256);

    /// @notice Calculates the ETH value for a given amount of rETH.
    /// @dev Calculates and returns the equivalent ETH amount for a specified rETH amount.
    /// @param _rethAmount The amount of rETH.
    /// @return The equivalent ETH value as a uint256.
    function getEthValue(uint256 _rethAmount) external view returns (uint256);

    /// @notice Calculates the rETH value for a given amount of ETH.
    /// @dev Calculates and returns the equivalent rETH amount for a specified ETH amount.
    /// @param _ethAmount The amount of ETH.
    /// @return The equivalent rETH value as a uint256.
    function getRethValue(uint256 _ethAmount) external view returns (uint256);

    /// @notice Queries the rETH balance of a specified account.
    /// @dev Returns the rETH balance of the provided account address.
    /// @param account The account to query the balance of.
    /// @return The rETH balance as a uint256.
    function balanceOf(address account) external view returns (uint256);
}
