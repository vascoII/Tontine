// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @title IRocketTokenRMATICMock Interface
/// @dev Interface for the RocketTokenRMATICMock contract.
/// This interface outlines the functions for depositing MATIC to receive rMATIC, withdrawing MATIC by burning rMATIC, and querying exchange rates and values.
interface IRocketTokenRMATICMock {
    /// @notice Deposits MATIC and mints rMATIC to the sender's address.
    /// @dev Function to deposit MATIC and receive rMATIC.
    function depositMATIC() external payable;

    /// @notice Withdraws MATIC by burning rMATIC from the sender's address.
    /// @dev Function to withdraw MATIC by burning rMATIC.
    /// @param _rmaticAmount The amount of rMATIC to burn.
    function withdrawMATIC(uint256 _rmaticAmount) external;

    /// @notice Gets the exchange rate based on the type of stake.
    /// @dev Returns the exchange rate for a specified stake type.
    /// @param _typeStake The type of stake (e.g., 1 for Silver, 2 for Gold).
    /// @return The exchange rate as a uint256.
    function getExchangeRate(uint _typeStake) external view returns (uint256);

    /// @notice Calculates the MATIC value for a given amount of rMATIC.
    /// @dev Calculates and returns the equivalent MATIC amount for a specified rMATIC amount.
    /// @param _rmaticAmount The amount of rMATIC.
    /// @return The equivalent MATIC value as a uint256.
    function getMaticValue(
        uint256 _rmaticAmount
    ) external view returns (uint256);

    /// @notice Calculates the rMATIC value for a given amount of MATIC.
    /// @dev Calculates and returns the equivalent rMATIC amount for a specified MATIC amount.
    /// @param _maticAmount The amount of MATIC.
    /// @return The equivalent rMATIC value as a uint256.
    function getRmaticValue(
        uint256 _maticAmount
    ) external view returns (uint256);

    /// @notice Queries the rMATIC balance of a specified account.
    /// @dev Returns the rMATIC balance of the provided account address.
    /// @param account The account to query the balance of.
    /// @return The rMATIC balance as a uint256.
    function balanceOf(address account) external view returns (uint256);
}
