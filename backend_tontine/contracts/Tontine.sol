// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Interface/ITine.sol";
import "./Interface/IRocketTokenRETHMock.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Custom error for failed Ether transfers
error FailedToSendEther();

/// @title Tontine Contract
/// @dev Implements a tontine structure for managing deposits and withdrawals in two vaults (Silver and Gold), with interest calculations.
/// Utilizes external interfaces for ITine (custom token) and IRocketTokenRETHMock (mock of Rocket Pool's rETH).
contract Tontine is Ownable {
    ITine public tine;
    IRocketTokenRETHMock public rEth;

    // Represents a deposit with an amount and the timestamp of deposit
    struct Deposit {
        uint256 amount;
        uint256 timeDeposited;
    }

    // Represents a withdrawal with an amount and the timestamp of withdrawal
    struct Withdraw {
        uint256 amount;
        uint256 timeWithdrawed;
    }

    // Represents an account with balances in both vaults and interest accrued
    struct Account {
        address userAddress;
        uint256 amountEthInSilverVault;
        uint256 amountEthInteretInSilverVault;
        uint256 amountEthInGoldVault;
        uint256 amountEthInteretInGoldVault;
    }

    Account[] public accounts; // List of accounts participating in the tontine

    // Mapping of user addresses to their deposits in each vault
    mapping(address => Deposit[]) public silverVaultDepositsByUser;
    mapping(address => Deposit[]) public goldVaultDepositsByUser;

    // Mapping of user addresses to their withdrawals from each vault
    mapping(address => Withdraw[]) public silverVaultWithdrawsByUser;
    mapping(address => Withdraw[]) public goldVaultWithdrawsByUser;

    // Balances and interest balances for Silver and Gold Vaults
    uint256 public silverVaultBalance = 0;
    uint256 public goldVaultBalance = 0;
    uint256 public silverVaultInteretBalance = 0;
    uint256 public goldVaultInteretBalance = 0;

    // Timestamp of the last interest calculation
    uint256 public lastInterestCalculationDate;

    // Events for tracking actions within the contract
    event AddUserEvent(address _userAddress, uint256 _amountInSilverVault, uint256 _amountInGoldVault);
    event DepositEvent(address indexed _user, uint256 _amount, bool _isGoldVault);
    event WithdrawEvent(address indexed _user, uint256 _amount, bool _isGoldVault);
    event CalculateDailyInterestsEvent(uint256 _lastInterestCalculationDate);

    /// @notice Retrieves the total amount of deposits across both vaults.
    function getTotalDeposits() public view returns (uint256) {
        return silverVaultBalance + goldVaultBalance;
    }

    /// @notice Retrieves the contract's Ether balance.
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    /// @dev Adds a new user to the tontine, restricted to less than 1000 users.
    function addUser(address _userAddress, uint256 _amountInSilverVault, uint256 _amountInGoldVault) private {
        require(accounts.length < 1000, "User limit reached");
        accounts.push(Account(_userAddress, _amountInSilverVault, 0, _amountInGoldVault, 0));
        emit AddUserEvent(_userAddress, _amountInSilverVault, _amountInGoldVault);
    }

    /// @dev Finds a user in the tontine by address, returning their index or -1 if not found.
    function findUser(address _userAddress) internal view returns (int256) {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].userAddress == _userAddress) {
                return int256(i); // User found, return index
            }
        }
        return -1; // User not found
    }

    /// @notice Counts users with a balance in the Silver Vault.
    function findSilverVaultUserCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].amountEthInSilverVault > 0) {
                count++;
            }
        }
        return count;
    }

    /// @notice Counts users with a balance in the Gold Vault.
    function findGoldVaultUserCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].amountEthInGoldVault > 0) {
                count++;
            }
        }
        return count;
    }

    /// @notice Checks if an address is already a user of the tontine.
    function isAlreadyUser(address _userAddress) public view returns (bool) {
        return findUser(_userAddress) != -1;
    }

    /// @notice Retrieves the Silver Vault balance for a given user.
    function getSilverVaultBalance(address _user) public view returns (uint256) {
        int256 userIndex = findUser(_user);
        require(userIndex != -1, "User not found");
        return accounts[uint256(userIndex)].amountEthInSilverVault;
    }

    /// @notice Retrieves the Gold Vault balance for a given user.
    function getGoldVaultBalance(address _user) public view returns (uint256) {
        int256 userIndex = findUser(_user);
        require(userIndex != -1, "User not found");
        return accounts[uint256(userIndex)].amountEthInGoldVault;
    }

    /// @dev Constructor sets up the tontine with references to the Tine and rEth contracts.
    constructor(address _tineAddress, address _rEthAddress) Ownable(msg.sender) {
        tine = ITine(_tineAddress);
        rEth = IRocketTokenRETHMock(_rEthAddress);
    }

    /// @dev Records a deposit into either the Silver or Gold Vault for a user.
    /// @param _user The address of the user making the deposit.
    /// @param _amount The amount of ETH deposited.
    /// @param _isGoldVault Boolean indicating if the deposit is for the Gold Vault.
    function _recordDeposit(
        address _user,
        uint256 _amount,
        bool _isGoldVault
    ) private {
        Deposit memory newDeposit = Deposit({
            amount: _amount,
            timeDeposited: block.timestamp
        });

        int256 userIndex = findUser(_user);

        // Distinguish between Gold and Silver Vault for deposit recording
        if (_isGoldVault) {
            // Gold Vault specific logic
            require(
                tine.hasLockedTine(_user),
                "TINE must be locked for Gold Vault"
            );
            if (userIndex != -1) {
                accounts[uint256(userIndex)].amountEthInGoldVault += _amount;
                goldVaultDepositsByUser[_user].push(newDeposit);
            } else {
                addUser(_user, 0, _amount);
            }
            goldVaultBalance += _amount;
        } else {
            // Silver Vault specific logic
            if (userIndex != -1) {
                accounts[uint256(userIndex)].amountEthInSilverVault += _amount;
                silverVaultDepositsByUser[_user].push(newDeposit);
            } else {
                addUser(_user, _amount, 0);
            }
            silverVaultBalance += _amount;
        }
    }

    /// @dev Records a withdrawal from either the Silver or Gold Vault for a user.
    /// @param _user The address of the user making the withdrawal.
    /// @param _amount The amount of ETH withdrawn.
    /// @param _isGoldVault Boolean indicating if the withdrawal is for the Gold Vault.
    function _recordWithdraw(
        address _user,
        uint256 _amount,
        bool _isGoldVault
    ) private {
        Withdraw memory newWithdraw = Withdraw({
            amount: _amount,
            timeWithdrawed: block.timestamp
        });

        int256 userIndex = findUser(_user);
        require(userIndex != -1, "User not found");

        Account storage account = accounts[uint256(userIndex)];

        // Apply withdrawal logic based on vault type, adjusting balances accordingly
        if (_isGoldVault) {
            // Gold Vault specific logic for withdrawals
            if (_amount <= account.amountEthInGoldVault) {
                account.amountEthInGoldVault -= _amount;
            } else {
                uint256 remaining = _amount - account.amountEthInGoldVault;
                account.amountEthInGoldVault = 0;
                account.amountEthInteretInGoldVault -= remaining;
            }

            goldVaultWithdrawsByUser[_user].push(newWithdraw);
            goldVaultBalance -= _amount;
        } else {
            // Silver Vault specific logic for withdrawals
            if (_amount <= account.amountEthInSilverVault) {
                account.amountEthInSilverVault -= _amount;
            } else {
                uint256 remaining = _amount - account.amountEthInSilverVault;
                account.amountEthInSilverVault = 0;
                account.amountEthInteretInSilverVault -= remaining;
            }

            silverVaultWithdrawsByUser[_user].push(newWithdraw);
            silverVaultBalance -= _amount;
        }
    }

    /// @notice Allows users to deposit ETH into the Tontine, choosing between the Silver and Gold Vaults.
    /// @param _isGoldVault Boolean indicating if the deposit is for the Gold Vault.
    function depositEth(bool _isGoldVault) public payable {
        require(msg.value >= 1 ether, "Minimum deposit is 1 ETH");

        // Record the deposit before sending ETH to ensure transaction traceability
        _recordDeposit(msg.sender, msg.value, _isGoldVault);

        // Deposit ETH and mint rETH through the rEth contract
        rEth.depositETH{value: msg.value}();

        emit DepositEvent(msg.sender, msg.value, _isGoldVault);
    }

    /// @notice Allows users to withdraw ETH from the Tontine, choosing between the Silver and Gold Vaults.
    /// @param _isGoldVault Boolean indicating if the withdrawal is from the Gold Vault.
    /// @param _ethAmount The amount of ETH to withdraw.
    function withdrawEth(bool _isGoldVault, uint256 _ethAmount) public {
        int256 userIndex = findUser(msg.sender);
        require(userIndex != -1, "User not found");

        Account storage userAccount = accounts[uint256(userIndex)];

        // Ensure user meets withdrawal criteria based on vault type
        if (_isGoldVault) {
            require(
                !tine.hasLockedTine(msg.sender),
                "TINE must be unlocked for Gold Vault"
            );

            uint256 totalGoldBalance = userAccount.amountEthInGoldVault +
                userAccount.amountEthInteretInGoldVault;
            require(
                totalGoldBalance >= _ethAmount,
                "Insufficient balance in Gold Vault"
            );
        } else {
            uint256 totalSilverBalance = userAccount.amountEthInSilverVault +
                userAccount.amountEthInteretInSilverVault;
            require(
                totalSilverBalance >= _ethAmount,
                "Insufficient balance in Silver Vault"
            );
        }

        // Convert the ETH amount to rETH for withdrawal
        uint256 rEthAmountNeeded = rEth.getRethValue(_ethAmount);

        // Ensure the Tontine contract has enough rETH for the withdrawal
        require(
            rEth.balanceOf(address(this)) >= rEthAmountNeeded,
            "Not enough rETH in Tontine contract"
        );

        // Withdraw rETH in exchange for ETH
        rEth.withdrawETH(rEthAmountNeeded);

        // Record the withdrawal
        _recordWithdraw(msg.sender, _ethAmount, _isGoldVault);

        // Calculate the net amount to send to the user after fees
        uint256 netAmountToSend = (_ethAmount * 995) / 1000; // Applying a 0.5% fee

        // Ensure the contract has enough ETH to send after the exchange
        require(
            address(this).balance >= netAmountToSend,
            "Not enough ETH in contract after exchange"
        );

        // Send the net ETH amount to the user
        (bool success, ) = payable(msg.sender).call{value: netAmountToSend}("");
        require(success, "Failed to send Ether");

        emit WithdrawEvent(msg.sender, _ethAmount, _isGoldVault);
    }

    /// @notice Retrieves all silver vault deposits for a specific user.
    /// @param _userAddress The address of the user.
    /// @return An array of `Deposit` structs representing each deposit made by the user into the silver vault.
    function getSilverVaultDepositsForUser(
        address _userAddress
    ) external view returns (Deposit[] memory) {
        return silverVaultDepositsByUser[_userAddress];
    }

    /// @notice Retrieves all gold vault deposits for a specific user.
    /// @param _userAddress The address of the user.
    /// @return An array of `Deposit` structs representing each deposit made by the user into the gold vault.
    function getGoldVaultDepositsForUser(
        address _userAddress
    ) external view returns (Deposit[] memory) {
        return goldVaultDepositsByUser[_userAddress];
    }

    /// @notice Retrieves the total interest accrued in the silver vault for a specific user.
    /// @param _userAddress The address of the user.
    /// @return The total interest amount in ETH that has accrued in the user's silver vault account.
    function getSilverVaultInterestsForUser(
        address _userAddress
    ) external view returns (uint256) {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].userAddress == _userAddress) {
                return accounts[i].amountEthInteretInSilverVault;
            }
        }
        return 0; // Returns 0 if the user is not found
    }

    /// @notice Retrieves the total interest accrued in the gold vault for a specific user.
    /// @param _userAddress The address of the user.
    /// @return The total interest amount in ETH that has accrued in the user's gold vault account.
    function getGoldVaultInterestsForUser(
        address _userAddress
    ) external view returns (uint256) {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].userAddress == _userAddress) {
                return accounts[i].amountEthInteretInGoldVault;
            }
        }
        return 0; // Returns 0 if the user is not found
    }

    /// @notice Retrieves all silver vault withdrawals for a specific user.
    /// @param _userAddress The address of the user.
    /// @return An array of `Withdraw` structs representing each withdrawal made by the user from the silver vault.
    function getSilverVaultWithdrawsForUser(
        address _userAddress
    ) external view returns (Withdraw[] memory) {
        return silverVaultWithdrawsByUser[_userAddress];
    }

    /// @notice Retrieves all gold vault withdrawals for a specific user.
    /// @param _userAddress The address of the user.
    /// @return An array of `Withdraw` structs representing each withdrawal made by the user from the gold vault.
    function getGoldVaultWithdrawsForUser(
        address _userAddress
    ) external view returns (Withdraw[] memory) {
        return goldVaultWithdrawsByUser[_userAddress];
    }

    /// @notice Gets the current exchange rate for deposits into the silver vault.
    /// @return The exchange rate used for converting ETH to the equivalent value in the silver vault.
    function getSilverVaultExchangeRate() public view returns (uint256) {
        return rEth.getExchangeRate(1); // Assumes 1 represents the silver vault in the external contract
    }

    /// @notice Gets the current exchange rate for deposits into the gold vault.
    /// @return The exchange rate used for converting ETH to the equivalent value in the gold vault.
    function getGoldVaultExchangeRate() public view returns (uint256) {
        return rEth.getExchangeRate(2); // Assumes 2 represents the gold vault in the external contract
    }

    /// @notice Allows the owner of the contract to withdraw ETH from the contract's balance.
    /// This function enforces that only the contract owner can initiate a withdrawal,
    /// checks that the withdrawal amount is positive and does not exceed the contract's current balance,
    /// and validates the recipient's address before transferring ETH.
    /// @param _amount The amount of ETH to be withdrawn from the contract.
    /// @param _recipient The payable address to which the withdrawn ETH is to be sent.
    function ownerWithdrawEth(
        uint256 _amount,
        address payable _recipient
    ) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _amount <= address(this).balance,
            "Amount exceeds contract balance"
        );
        require(_recipient != address(0), "Invalid recipient address");

        // Execute the transfer of ETH to the specified recipient.
        _recipient.transfer(_amount);
    }

    /// @notice Fallback function to accept incoming ETH payments directly to the contract.
    /// This function is triggered when the contract receives ETH without a function call.
    /// Additional logic can be implemented here if needed, for example, logging the event of receiving ETH.
    receive() external payable {
        // Implement any additional logic for receiving ETH if required.
    }

    /// @notice Simulates the calculation and application of 12 months' interest for both Silver and Gold Vaults.
    /// This function iterates through all accounts, calculates the interest based on the vault balances,
    /// and applies the interest to both the vault balance and the interest balance. It is intended to be
    /// called by the contract owner to simulate interest accrual over a 12-month period.
    /// The interest rates are hardcoded: 5% for the Silver Vault and 10% for the Gold Vault.
    function simulateTwelveMonthsInterest() public onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            Account storage account = accounts[i];

            // Direct application of 12-month interest rates: 5% for Silver, 10% for Gold
            uint256 silverInterest = account.amountEthInSilverVault / 20; // 5% interest
            uint256 goldInterest = account.amountEthInGoldVault / 10; // 10% interest

            // Apply the calculated interest to the account's vault interest balances
            account.amountEthInteretInSilverVault += silverInterest;
            account.amountEthInteretInGoldVault += goldInterest;
        }

        // Update the overall interest balances for the Silver and Gold Vaults
        silverVaultInteretBalance += (silverVaultBalance / 20); // Apply 5% interest to Silver Vault balance
        goldVaultInteretBalance += (goldVaultBalance / 10); // Apply 10% interest to Gold Vault balance
    }

}
