// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Interface/ITine.sol";
import "./Interface/IStakingProtocol.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// Implements a tontine structure for managing deposits and withdrawals in two vaults (Silver and Gold).
/// Utilizes ITine for custom token interactions and IStakingProtocol for staking functionality.
/// Ensures contract management through Ownable and secures against reentrancy attacks with ReentrancyGuard.
contract Tontine is Ownable, ReentrancyGuard {
    ITine public tine; // Interface to the custom Tine token.
    IStakingProtocol public stakingProtocol; // Interface to the staking protocol.

    // Defines account structure with balances and interests for both vaults.
    struct Account {
        uint256 amountInSilverVault;
        uint256 amountInteretInSilverVault;
        uint256 lastInterestUpdateDaySilver;
        uint256 amountInGoldVault;
        uint256 amountInteretInGoldVault;
        uint256 lastInterestUpdateDayGold;
    }

    mapping(address => Account) public accounts; // Tracks accounts participating in the tontine.

    // Represents a financial transaction within the contract.
    struct Transaction {
        uint256 amount;
        uint256 dayDeposit;
        bool isDeposit; // Differentiates between deposits and withdrawals.
    }

    // Tracks transactions for each user and vault.
    mapping(address => mapping(uint256 => Transaction)) public silverVaultTransactions;
    mapping(address => mapping(uint256 => Transaction)) public goldVaultTransactions;

    // Next transaction ID for each user and vault, facilitating transaction tracking.
    mapping(address => uint256) public nextSilverVaultTransactionId;
    mapping(address => uint256) public nextGoldVaultTransactionId;

    // Active user counters for each vault.
    uint256 public activeUsersInSilverVault;
    uint256 public activeUsersInGoldVault;

    // Total balances and interest balances for each vault.
    uint256 public silverVaultBalance = 0;
    uint256 public goldVaultBalance = 0;
    uint256 public silverVaultInteretBalance = 0;
    uint256 public goldVaultInteretBalance = 0;

    uint256 public lastInterestCalculationDate; // Tracks the last interest calculation.

    // Events for external tracking of contract actions.
    event StakeEvent(address indexed _userAddress, uint256 _amount, bool _isGoldVault);
    event UnstakeEvent(address indexed _userAddress, uint256 _amount, bool _isGoldVault);
    event CalculateDailyInterestsEvent(uint256 _lastInterestCalculationDate);

    /// Sets up the tontine with references to the Tine and stakingProtocol contracts upon deployment.
    constructor(address _tineAddress, address _stakingProtocolAddress) Ownable(msg.sender) {
        tine = ITine(_tineAddress);
        stakingProtocol = IStakingProtocol(_stakingProtocolAddress);
    }

    /// Returns the total amount of deposits across both vaults.
    function getTotalDeposits() public view returns (uint256) {
        return silverVaultBalance + goldVaultBalance;
    }

    /// Returns the contract's ETH balance. Useful for managing and auditing contract funds.
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    /// Returns the count of users with a balance in the Silver Vault.
    function findSilverVaultUserCount() public view returns (uint256) {
        return activeUsersInSilverVault;
    }

    /// Returns the count of users with a balance in the Gold Vault.
    function findGoldVaultUserCount() public view returns (uint256) {
        return activeUsersInGoldVault;
    }

    /// Checks if an address is already participating in the tontine.
    function isAlreadyUser(address _userAddress) public view returns (bool) {
        Account storage account = accounts[_userAddress];
        // An address is considered a user if it has a balance in either vault.
        return account.amountInSilverVault > 0 || account.amountInGoldVault > 0;
    }

    /// Allows users to stake native tokens into the Tontine, choosing between the Silver and Gold Vaults.
    /// Ensures a minimum stake amount and records the stake transaction for the chosen vault.
    function stake(bool _isGoldVault) public payable nonReentrant {
        require(msg.value >= 1 * 10 ** 18, "Minimum stake is 1 unit of native token");
        _recordStake(msg.sender, msg.value, _isGoldVault);
        if (_isGoldVault) {
            stakingProtocol.goldStake(msg.value);
        } else {
            stakingProtocol.silverStake(msg.value);
        }
        emit StakeEvent(msg.sender, msg.value, _isGoldVault);
    }

    /// @dev Records a deposit into either the Silver or Gold Vault for a user.
    /// @param _userAddress The address of the user making the deposit.
    /// @param _amount The amount of ETH deposited.
    /// @param _isGoldVault Boolean indicating if the deposit is for the Gold Vault.
    function _recordStake(address _userAddress, uint256 _amount, bool _isGoldVault) private {
        Transaction memory newTransaction = Transaction({
            amount: _amount,
            dayDeposit: block.timestamp / 86400,
            isDeposit: true
        });

        // Distinguish between Gold and Silver Vault for deposit recording
        if (_isGoldVault) {
            // Gold Vault specific logic
            require(
                tine.hasLockedTine(_userAddress),
                "TINE must be locked for Gold Vault"
            );
            if (accounts[_userAddress].amountInGoldVault == 0) {
                activeUsersInGoldVault += 1;
            }
            accounts[_userAddress].amountInGoldVault += _amount;
            goldVaultTransactions[_userAddress][nextGoldVaultTransactionId[_userAddress]] = newTransaction;
            nextGoldVaultTransactionId[_userAddress] += 1;
            goldVaultBalance += _amount;
        } else {
            // Silver Vault specific logic
            if (accounts[_userAddress].amountInSilverVault == 0) {
                activeUsersInSilverVault += 1;
            }
            accounts[_userAddress].amountInSilverVault += _amount;
            silverVaultTransactions[_userAddress][nextSilverVaultTransactionId[_userAddress]] = newTransaction;
            nextSilverVaultTransactionId[_userAddress] += 1;
            silverVaultBalance += _amount;
        }
    }

    /// Allows users to unstake their tokens from the chosen vault.
    /// Verifies user balance before unstaking and updates the user's account accordingly.
    function unstake(bool _isGoldVault, uint256 _amount) public nonReentrant {
        Account storage userAccount = accounts[msg.sender];
        require(_amount >= 1 * 10 ** 18, "Minimum unstake is 1 unit of native token");
        if (_isGoldVault) {
            require(userAccount.amountInGoldVault >= _amount, "Not enough native token in user balance for Gold Vault");
            stakingProtocol.goldUnstake(_amount);
        } else {
            require(userAccount.amountInSilverVault >= _amount, "Not enough native token in user balance for Silver Vault");
            stakingProtocol.silverUnstake(_amount);
        }
        _recordUnstake(msg.sender, _amount, _isGoldVault);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Failed to send native token");
        emit UnstakeEvent(msg.sender, _amount, _isGoldVault);
    }

    /// @dev Records a withdrawal from either the Silver or Gold Vault for a user.
    /// @param _userAddress The address of the user making the withdrawal.
    /// @param _amount The amount of ETH withdrawn.
    /// @param _isGoldVault Boolean indicating if the withdrawal is for the Gold Vault.
    function _recordUnstake(address _userAddress, uint256 _amount, bool _isGoldVault) private {
        Transaction memory newTransaction = Transaction({
            amount: _amount,
            dayDeposit: block.timestamp / 86400,
            isDeposit: false
        });

        // Apply withdrawal logic based on vault type, adjusting balances accordingly
        if (_isGoldVault) {
            // Gold Vault specific logic for withdrawals
            if (accounts[_userAddress].amountInGoldVault == 0) {
                activeUsersInGoldVault -= 1;
            }
            goldVaultTransactions[_userAddress][nextGoldVaultTransactionId[_userAddress]] = newTransaction;
            nextGoldVaultTransactionId[_userAddress] += 1;
            goldVaultBalance -= _amount;
        } else {
            // Silver Vault specific logic for withdrawals
            if (accounts[_userAddress].amountInSilverVault == 0) {
                activeUsersInSilverVault -= 1;
            }
            silverVaultTransactions[_userAddress][nextSilverVaultTransactionId[_userAddress]] = newTransaction;
            nextSilverVaultTransactionId[_userAddress] += 1;
            silverVaultBalance -= _amount;
        }
    }

    /// Retrieves the balance for a given user in the Silver Vault. 
    function getSilverVaultBalance(address _userAddress) public view returns (uint256) {
        return accounts[_userAddress].amountInSilverVault;
    }

    /// Retrieves the balance for a given user in the Gold Vault.
    function getGoldVaultBalance(address _userAddress) public view returns (uint256) {
        return accounts[_userAddress].amountInGoldVault;
    }

    /// @notice Retrieves all silver vault deposits for a specific user.
    /// @param _userAddress The address of the user.
    /// @param _isDeposit boolean as true if deposit transaction needed.
    /// @param _isGoldVault Boolean indicating if transactions is for the Gold Vault.
    /// @return An array of `Transaction` structs representing each deposit made by the user into the silver vault.
    function getVaultTransactionsForUser(address _userAddress, bool _isDeposit, bool _isGoldVault) external view returns (Transaction[] memory) {
        uint256 transactionCount = _isGoldVault ? nextGoldVaultTransactionId[_userAddress] : nextSilverVaultTransactionId[_userAddress];
        uint256 matchingTransactionsCount = 0;

        // Step 1: Count matching transactions
        for (uint256 i = 0; i < transactionCount; i++) {
            Transaction storage transaction = _isGoldVault ?
                goldVaultTransactions[_userAddress][i] :
                silverVaultTransactions[_userAddress][i];
            if (transaction.isDeposit == _isDeposit) {
                matchingTransactionsCount++;
            }
        }

        // Step 2: Build the table of corresponding transactions
        Transaction[] memory matchingTransactions = new Transaction[](matchingTransactionsCount);
        uint256 j = 0;
        for (uint256 i = 0; i < transactionCount; i++) {
            Transaction storage transaction = _isGoldVault ?
                goldVaultTransactions[_userAddress][i] :
                silverVaultTransactions[_userAddress][i];
            if (transaction.isDeposit == _isDeposit) {
                matchingTransactions[j] = transaction;
                j++;
            }
        }

        return matchingTransactions;
    }

    /// @notice Retrieves the total interest accrued in vault for a specific user.
    /// @param _userAddress The address of the user.
    /// @param _isGoldVault Boolean indicating if interests is for the Gold Vault.
    /// @return The total interest amount in native token that has accrued in the user's silver vault account.
    function getInterestsForUser(address _userAddress, bool _isGoldVault) external view returns (uint256) {
        if (_isGoldVault) {
            return accounts[_userAddress].amountInteretInGoldVault;
        } 
        return accounts[_userAddress].amountInteretInSilverVault;
    }

    /// @param _userAddress The address of the user.
    /// @param _isGoldVault Boolean indicating if interests is for the Gold Vault.
    function updateUserInterest(address _userAddress, bool _isGoldVault) public {
        Account storage account = accounts[_userAddress];
        uint256 today = block.timestamp / 86400;
        
        // Determine if the update concerns the Silver or Gold Vault.
        if (_isGoldVault) {
            // Check if interests have already been updated today.
            if (account.lastInterestUpdateDayGold < today) {
                // Calculate the interest accrued since the last update.
                uint256 interests = stakingProtocol.calculateInterest(account.amountInGoldVault, account.lastInterestUpdateDayGold, today, true);
                // Update the interest balance and last updated date.
                account.amountInGoldVault += interests;
                account.amountInteretInGoldVault += interests;
                account.lastInterestUpdateDayGold = today;
            }
        } else {
            if (account.lastInterestUpdateDaySilver < today) {
                uint256 interests = stakingProtocol.calculateInterest(account.amountInSilverVault, account.lastInterestUpdateDaySilver, today, false);
                account.amountInteretInSilverVault += interests;
                account.amountInSilverVault += interests;
                account.lastInterestUpdateDaySilver = today;
            }
        }
    }
}
