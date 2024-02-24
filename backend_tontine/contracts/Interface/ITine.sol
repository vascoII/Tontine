// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @title ITine Interface
/// @dev Interface for the Tine contract.
/// This interface extends the standard ERC20 functionality with a custom function to check for locked Tine tokens.
interface ITine {
    /// @notice Checks if a _user has locked Tine tokens.
    /// @dev Returns true if the specified user has locked Tine tokens, false otherwise.
    /// This function is intended to extend standard ERC20 interfaces with custom logic for locked tokens.
    /// @param _user The address of the user to check for locked tokens.
    /// @return boolean indicating whether the user has locked Tine tokens.
    function hasLockedTine(address _user) external view returns (bool);
}
