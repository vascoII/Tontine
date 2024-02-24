// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @title IStakingProtocol Interface
/// @dev Interface for the Staking protocol contract.
interface IStakingProtocol {
  
    /// @notice Staking on silver vault.
    /// protocol to stake the specified amount of tokens.
    /// @param _amount The amount of tokens to be staked.
    /// @return boolean.
    function silverStake(uint256 _amount) external returns (bool);

    /// @notice Staking on gold vault.
    /// @param _amount The amount of tokens to be staked.
    /// @return boolean.
    function goldStake(uint256 _amount) external returns (bool);

    /// @notice Unstaking on silver.
    /// @param _amount The amount of tokens to be unstaked.
    /// @return boolean.
    function silverUnstake(uint256 _amount) external returns (bool);

    /// @notice Unstaking on gold tokens.
    /// @param _amount The amount of tokens to be unstaked.
    /// @return boolean.
    function goldUnstake(uint256 _amount) external returns (bool);

    /// @notice Calculate interest on a period.
    /// @param _amount The amount of tokens.
    /// @param _amount The amount of tokens.
    /// @param _amount The amount of tokens.
    /// @param _amount The amount of tokens.
    /// @return The interest for a period.
    function calculateInterest(
        uint256 _amount, uint256 _lastUpdateDay, uint256 _today, bool _isGoldVault
    ) external returns (uint256);
}
