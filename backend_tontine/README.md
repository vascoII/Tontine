# Smart Contract, deploy file, enabling vaults file, tests files

## Overview

These Solidity smart contracts are designed for a staking dApp. The dApp has an ERC20 native token that can be bought, locked, unlocked, and sold. It features two vaults with interest. One vault is accessible without prior conditions, while the other requires users to buy and lock a certain amount of Tine. The amount and lock duration can be managed in admin mode. Users earn interest in both vaults.

## Features

User Features:

 - Buy TINE with ETH: Users can purchase TINE tokens using ETH.
 - Lock TINE: Users have the option to lock their TINE tokens, a prerequisite for accessing the Gold Vault.
 - Deposit into Silver Vault: Users can deposit ETH into the Silver Vault to earn interest, irrespective of their TINE tokens' status.
 - Earn Interest (Silver Vault): Deposits in the Silver Vault accrue interest over time.
 - Withdraw Funds (Silver Vault): Users can withdraw their funds from the Silver Vault at any time.
 - Deposit into Gold Vault: Users with locked TINE tokens are eligible to deposit into the Gold Vault to earn higher interest.
 - Earn Interest (Gold Vault): Similar to the Silver Vault, deposits in the Gold Vault also earn interest.
 - Unlock TINE: Users must unlock their TINE tokens before withdrawing funds from the Gold Vault.
 - Withdraw Funds (Gold Vault): Post unlocking, users can withdraw their funds from the Gold Vault.

Admin Features:

 - Mint TINEs (Maximum Frequency of 1 Month): The admin can mint new TINE tokens, subject to a maximum frequency of once per month to regulate supply.
 - Change Maximum Balance Granted to the DApp: The admin can adjust the maximum ETH balance that the DApp is allowed to hold, enhancing security, especially during the project's initial phases.
 - Change the TINE Requirement for Gold Vault Access: The required amount of TINE that users must lock to access the Gold Vault can be adjusted by the admin.
 - Change TINE Lock Duration for Gold Vault Access: The admin can modify the lock duration for TINE tokens, impacting liquidity and user participation.
 - Withdraw ETH from Contract Balance: The admin has the capability to withdraw ETH from the contract's balance, facilitating fund management or redistribution.

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vascoII/Tontine.git
   ```

2. Deploy the contracts on hardhat localnode or on sépolia testnet. <br>
   ```bash
   cd backend_tontine
   npx hardhat run scripts/deploy.js --network localhost  (for localnode) 
   or 
   npx hardhat run scripts/deploy.js --network sepolia  (for sepolia testnet) 
   ```
3. Run the tests. <br>
   There is currently 62 tests
   ```bash
   npx hardhat test
   npx hardhat coverage
   ```

![coverage](https://github.com/vascoII/Tontine/assets/7952254/c19b82f5-91fc-4d20-9de5-e74a255d7153)


## Contracts overview

We currently use 2 mocks for the Chainlink oracle and the RocketPool protocol, both are consumed through interfaces. <br>
There is a contract for the ERC20 native token Tine. <br> 
There is a contract for the dapp. <br>

### Tine.sol
This contract use ERC20.sol, Ownable.sol and ReentrancyGuard.sol from openzeppelin. <br>
It use the mock of Chainlink using its interface. <br>

Events <br>
- event BuyTineEvent(address indexed userAddress, uint256 tineAmount, uint256 ethAmount)
- event LockTineEvent(address indexed userAddress)
- event UnlockTineEvent(address indexed userAddress)
- event SellTineEvent(address indexed userAddress, uint256 tineAmount, uint256 ethAmount)

Functions <br>
- function getSmartContractTokenBalance() external view returns (uint)
- function getSmartContractEthBalance() external view returns (uint)
- function hasLockedTine(address user) external view returns (bool)
- function mintMonthly() public onlyOwner
- function buyTine(uint256 _tineAmount) public payable nonReentrant 
- function lockTine() public 
- function unlockTine() public
- function sellTine(uint256 _tineAmountInWei) public nonReentrant
- function setMinLockTime(uint256 _minLockTime) public onlyOwner
- function setMinLockAmount(uint256 _minLockAmount) public onlyOwner 
- function setMaxSupply(uint256 _maxSupply) public onlyOwner 
- function setMaxBalance(uint256 _maxBalance) public onlyOwner 
- function withdrawEth(uint256 _amount, address payable _recipient ) public onlyOwner 
- receive() external payable 


### Tontine.sol
This contract use Ownable.sol and ReentrancyGuard.sol from openzeppelin. <br>
It use the mock of RocketPool and Tine using there interfaces. <br>

Events <br>
- event AddUserEvent(address _userAddress, uint256 _amountInSilverVault, uint256 _amountInGoldVault)
- event DepositEvent(address indexed _user, uint256 _amount, bool _isGoldVault)
- event WithdrawEvent(address indexed _user, uint256 _amount, bool _isGoldVault)
- event CalculateDailyInterestsEvent(uint256 _lastInterestCalculationDate)

Functions <br>
- function getTotalDeposits() public view returns (uint256)
- function getContractBalance() public view returns (uint)  
- function addUser(address _userAddress, uint256 _amountInSilverVault, uint256 _amountInGoldVault) private 
- function findUser(address _userAddress) internal view returns (int256) 
- function findSilverVaultUserCount() public view returns (uint256)
- function findGoldVaultUserCount() public view returns (uint256)
- function isAlreadyUser(address _userAddress) public view returns (bool) 
- function getSilverVaultBalance(address _user) public view returns (uint256)
- function getGoldVaultBalance(address _user) public view returns (uint256) 
- function _recordDeposit(address _user, uint256 _amount, bool _isGoldVault) private
- function _recordWithdraw(address _user, uint256 _amount, bool _isGoldVault) private 
- function depositEth(bool _isGoldVault) public payable nonReentrant
- function withdrawEth(bool _isGoldVault, uint256 _ethAmount) public nonReentrant
- function getSilverVaultDepositsForUser(address _userAddress) external view returns (Deposit[] memory) 
- function getGoldVaultDepositsForUser(address _userAddress) external view returns (Deposit[] memory) 
- function getSilverVaultInterestsForUser(address _userAddress) external view returns (uint256) 
- function getGoldVaultInterestsForUser(address _userAddress) external view returns (uint256)
- function getSilverVaultWithdrawsForUser(address _userAddress) external view returns (Withdraw[] memory) 
- function getGoldVaultWithdrawsForUser(address _userAddress) external view returns (Withdraw[] memory)
- function getSilverVaultExchangeRate() public view returns (uint256)
- function getGoldVaultExchangeRate() public view returns (uint256)
- function ownerWithdrawEth(uint256 _amount, address payable _recipient) public onlyOwner 
- receive() external payable 
- function simulateTwelveMonthsInterest() public onlyOwner 


## Authors

    vascoII

## License

This project is licensed under the MIT License
