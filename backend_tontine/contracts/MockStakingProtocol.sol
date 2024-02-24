// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Importing the interface that this mock will implement. The interface defines
// the functions that must be included in any contract that claims to follow the
// IStakingProtocol interface.
import "./Interface/IStakingProtocol.sol";

/// @title MockStakingProtocol
/// @dev This contract is a mock implementation of the IStakingProtocol interface,
/// intended for development and testing purposes. It simulates the behavior of
/// staking and unstaking operations without interacting with real staking protocols.
/// All operations in this mock simply return true, indicating success.
contract MockStakingProtocol is IStakingProtocol {

    // Maps a "day" to an interest rate.
    mapping(uint256 => uint256) public interestSilverRates;
    mapping(uint256 => uint256) public interestGoldRates;

    function updateInterestRate(uint256 newRate, bool _isGoldVault) external {
        uint256 today = block.timestamp / 86400;
        if (_isGoldVault) {
            interestGoldRates[today] = newRate;
        } else {
            interestSilverRates[today] = newRate;
        }
    }

    function calculateInterest(uint256 amount, uint256 lastUpdateDay, uint256 today, bool isGold) external override returns (uint256) {
        uint256 totalInterest = 0;
        for (uint256 day = lastUpdateDay + 1; day <= today; day++) {
            uint256 rate = isGold ? interestGoldRates[day] : interestSilverRates[day];
            totalInterest += (amount * rate) / 100000; // Exemple: ajuster la formule selon votre système d'intérêt.
        }
        return totalInterest;
    }
    
  
    /// @notice Simulates staking on silver vault.
    /// @dev In a real implementation, this function would interact with a staking
    /// protocol to stake the specified amount of tokens. Here, it merely returns true.
    /// @param _amount The amount of tokens to be staked.
    /// @return Always returns true in this mock.
    function silverStake(uint256 _amount) external override returns (bool) {
        // In a real staking contract, logic to stake tokens would be implemented here.
        // This might involve transferring tokens to the staking protocol and updating
        // internal state to reflect the staking operation.
        
        // For this mock, simply return true to indicate success.
        return true;
    }

    /// @notice Simulates staking on gold vault, similar to silverStake.
    /// @param _amount The amount of tokens to be staked.
    /// @return Always returns true in this mock.
    function goldStake(uint256 _amount) external override returns (bool) {
        // The logic for goldStake would be similar to silverStake, tailored for a
        // different type of token or staking conditions.
        
        return true; // Mock success
    }

    /// @notice Simulates unstaking on silver vault.
    /// @param _amount The amount of tokens to be unstaked.
    /// @return Always returns true in this mock.
    function silverUnstake(uint256 _amount) external override returns (bool) {
        // In a real implementation, this would involve interacting with the staking
        // protocol to release the staked tokens back to the user.
        
        return true; // Mock success
    }

    /// @notice Simulates unstaking on gold vault, similar to silverUnstake.
    /// @param _amount The amount of tokens to be unstaked.
    /// @return Always returns true in this mock.
    function goldUnstake(uint256 _amount) external override returns (bool) {
        // Unstaking logic for gold tokens, which would be similar to that for
        // silver tokens, but could differ based on specific protocol requirements.
        
        return true; // Mock success
    }

}
