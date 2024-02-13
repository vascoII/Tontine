// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Interface/ITine.sol";
import "./Interface/IRocketTokenRETHMock.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

error FailedToSendEther();

contract Tontine is Ownable {
    ITine public tine;
    IRocketTokenRETHMock rEth;

    struct Deposit {
        uint256 amount;
        uint256 timeDeposited;
    }

    struct Withdraw {
        uint256 amount;
        uint256 timeWithdrawed;
    }

    struct Account {
        address userAddress;
        uint256 amountEthInSilverVault;
        uint256 amountEthInteretInSilverVault;
        uint256 amountEthInGoldVault;
        uint256 amountEthInteretInGoldVault;
    }

    Account[] public accounts;

    mapping(address => Deposit[]) public silverVaultDepositsByUser;
    mapping(address => Deposit[]) public goldVaultDepositsByUser;

    mapping(address => Withdraw[]) public silverVaultWithdrawsByUser;
    mapping(address => Withdraw[]) public goldVaultWithdrawsByUser;

    // Solde des Silver et Gold Vaults
    uint256 public silverVaultBalance = 0;
    uint256 public goldVaultBalance = 0;
    // Interets des Silver et Gold Vaults
    uint256 public silverVaultInteretBalance = 0;
    uint256 public goldVaultInteretBalance = 0;

    // Date de la dernière mise à jour des intérêts
    uint256 public lastInterestCalculationDate;

    //Events
    event AddUserEvent(
        address _userAddress,
        uint256 _amountInSilverVault,
        uint256 _amountInGoldVault
    );
    event DepositEvent(
        address indexed _user,
        uint256 _amount,
        bool _isGoldVault
    );
    event WithdrawEvent(
        address indexed _user,
        uint256 _amount,
        bool _isGoldVault
    );
    event CalculateDailyInterestsEvent(uint256 _lastInterestCalculationDate);

    // Fonction pour obtenir le total des dépôts dans la Tontine
    function getTotalDeposits() public view returns (uint256) {
        return silverVaultBalance + goldVaultBalance;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function addUser(
        address _userAddress,
        uint256 _amountInSilverVault,
        uint256 _amountInGoldVault
    ) private {
        require(accounts.length < 1000, "User limit reached");
        accounts.push(
            Account(
                _userAddress,
                _amountInSilverVault,
                0,
                _amountInGoldVault,
                0
            )
        );
        emit AddUserEvent(
            _userAddress,
            _amountInSilverVault,
            _amountInGoldVault
        );
    }

    function findUser(address _userAddress) internal view returns (int256) {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].userAddress == _userAddress) {
                return int256(i); // L'utilisateur a été trouvé, renvoie son indice
            }
        }
        return -1; // L'utilisateur n'a pas été trouvé
    }

    function findSilverVaultUserCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].amountEthInSilverVault > 0) {
                count++;
            }
        }
        return count;
    }

    function findGoldVaultUserCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].amountEthInGoldVault > 0) {
                count++;
            }
        }
        return count;
    }

    function isAlreadyUser(address _userAddress) public view returns (bool) {
        return findUser(_userAddress) != -1;
    }

    function getSilverVaultBalance(
        address _user
    ) public view returns (uint256) {
        int256 userIndex = findUser(_user);
        require(userIndex != -1, "User not found");
        return accounts[uint256(userIndex)].amountEthInSilverVault;
    }

    function getGoldVaultBalance(address _user) public view returns (uint256) {
        int256 userIndex = findUser(_user);
        require(userIndex != -1, "User not found");
        return accounts[uint256(userIndex)].amountEthInGoldVault;
    }

    /*************************************/
    /********* CONSTRUCTOR ***************/
    /*************************************/
    constructor(
        address _tineAddress,
        address _rEthAddress
    ) Ownable(msg.sender) {
        tine = ITine(_tineAddress);
        rEth = IRocketTokenRETHMock(_rEthAddress);
    }

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

        if (_isGoldVault) {
            // Gold Vault
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
            // Silver Vault
            if (userIndex != -1) {
                accounts[uint256(userIndex)].amountEthInSilverVault += _amount;
                silverVaultDepositsByUser[_user].push(newDeposit);
            } else {
                addUser(_user, _amount, 0);
            }
            silverVaultBalance += _amount;
        }
    }

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

        if (_isGoldVault) {
            // Gold Vault
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
            // Silver Vault
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

    function depositEth(bool _isGoldVault) public payable {
        require(msg.value >= 1 ether, "Minimum deposit is 1 ETH");

        // Enregistrer le dépôt dans le vault approprié avant d'envoyer les ETH
        // pour garder une trace de l'opération même en cas d'échec de l'appel suivant.
        _recordDeposit(msg.sender, msg.value, _isGoldVault);

        // Envoyer les ETH à RocketTokenRETHMock et mint des rETH
        rEth.depositETH{value: msg.value}();

        emit DepositEvent(msg.sender, msg.value, _isGoldVault);
    }

    function withdrawEth(bool _isGoldVault, uint256 _ethAmount) public {
        int256 userIndex = findUser(msg.sender);
        require(userIndex != -1, "User not found");

        Account storage userAccount = accounts[uint256(userIndex)];

        if (_isGoldVault) {
            // Vérifier si les TINE de l'utilisateur sont libérés pour Gold Vault
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

        // Calculer le montant de rETH nécessaire pour le retrait
        uint256 rEthAmountNeeded = rEth.getRethValue(_ethAmount);

        // S'assurer que le contrat Tontine a suffisamment de rETH pour effectuer le retrait
        require(
            rEth.balanceOf(address(this)) >= rEthAmountNeeded,
            "Not enough rETH in Tontine contract"
        );

        // Effectuer le retrait de rETH en ETH depuis RocketTokenRETHMock
        rEth.withdrawETH(rEthAmountNeeded);

        // Enregistrer le retrait
        _recordWithdraw(msg.sender, _ethAmount, _isGoldVault);

        // Calculer le montant net à envoyer après les frais
        uint256 netAmountToSend = (_ethAmount * 995) / 1000; // 0.995 pour représenter 99.5% du montant, reflétant les frais de 0.05%

        // Vérifier que le contrat a suffisamment d'ETH pour effectuer l'envoi après avoir reçu de rETH
        require(
            address(this).balance >= netAmountToSend,
            "Not enough ETH in contract after exchange"
        );

        // Envoyer les ETH net à l'utilisateur
        (bool success, ) = payable(msg.sender).call{value: netAmountToSend}("");
        require(success, "Failed to send Ether");

        emit WithdrawEvent(msg.sender, _ethAmount, _isGoldVault);
    }

    function getSilverVaultDepositsForUser(
        address _userAddress
    ) external view returns (Deposit[] memory) {
        return silverVaultDepositsByUser[_userAddress];
    }

    function getGoldVaultDepositsForUser(
        address _userAddress
    ) external view returns (Deposit[] memory) {
        return goldVaultDepositsByUser[_userAddress];
    }

    function getSilverVaultWithdrawsForUser(
        address _userAddress
    ) external view returns (Withdraw[] memory) {
        return silverVaultWithdrawsByUser[_userAddress];
    }

    function getGoldVaultWithdrawsForUser(
        address _userAddress
    ) external view returns (Withdraw[] memory) {
        return goldVaultWithdrawsByUser[_userAddress];
    }

    function getSilverVaultExchangeRate() public view returns (uint256) {
        return rEth.getExchangeRate(1);
    }

    function getGoldVaultExchangeRate() public view returns (uint256) {
        return rEth.getExchangeRate(2);
    }

    /**
     * @dev Allows the owner to withdraw ETH from the contract's balance.
     * @param _amount The amount of ETH to withdraw.
     * @param _recipient The address to which the ETH should be sent.
     */
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

        // Transfer ETH to the specified recipient
        _recipient.transfer(_amount);
    }

    /**
     * @dev Receives ETH sent directly to the contract address.
     * This function is invoked when ETH is sent to the contract without calling a specific function.
     */
    receive() external payable {
        // Additional logic can be added here if required.
    }

    /*************** FUNCTION TO SIMULATE 6 MONTH INTERESTS ***********/
    function simulateSixMonthsInterest() public onlyOwner {
        uint256 silverRateForSixMonths = rEth.getExchangeRate(1); // 500 pour 0.5% sur 6 mois
        uint256 goldRateForSixMonths = rEth.getExchangeRate(2); // 1000 pour 1% sur 6 mois

        for (uint256 i = 0; i < accounts.length; i++) {
            Account storage account = accounts[i];

            // Appliquer directement le taux pour 6 mois
            uint256 silverInterest = (account.amountEthInSilverVault *
                silverRateForSixMonths) / 1000;
            uint256 goldInterest = (account.amountEthInGoldVault *
                goldRateForSixMonths) / 1000;

            account.amountEthInteretInSilverVault += silverInterest;

            account.amountEthInteretInGoldVault += goldInterest;
        }

        // Interets des Silver et Gold Vaults
        silverVaultInteretBalance +=
            (silverVaultBalance * silverRateForSixMonths) /
            1000;
        goldVaultInteretBalance +=
            (goldVaultBalance * goldRateForSixMonths) /
            1000;
    }
}
