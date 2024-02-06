// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./Tine.sol";
import "./Tteth.sol";
import "./ChainlinkPricesOracleMock.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error FailedToSendEther();

contract Tontine is Ownable {
    Tine public tine;
    Tteth public tteth;

    //AggregatorV3Interface internal dataFeed;
    ChainlinkPricesOracleMock public chainlinkPricesOracleMock;

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
        uint256 amountEthInGoldVault;
        uint256 amountTtEthInSilverVault;
        uint256 amountTtEthInGoldVault;
    }

    Account[] public accounts;

    uint256 public constant GOLD_VAULT_ACCESS_TINE_AMOUNT = 1 * (10 ** 18); // 100 TINE pour accéder au Gold Vault
    uint256 public constant GOLD_VAULT_MULTIPLIER = 150; // 150% pour les intérêts du Gold Vault

    // Définissez les taux d'intérêt annuels pour la Tontine
    uint256 public annualInterestRateTontine = 5;

    mapping(address => Deposit[]) public silverVaultDepositsByUser;
    mapping(address => Deposit[]) public goldVaultDepositsByUser;

    mapping(address => Withdraw[]) public silverVaultWithdrawsByUser;
    mapping(address => Withdraw[]) public goldVaultWithdrawsByUser;

    // Solde des Silver et Gold Vaults
    uint256 public silverVaultBalance;
    uint256 public goldVaultBalance;

    // Date de la dernière mise à jour des intérêts
    uint256 public lastInterestCalculationDate;

    //Events
    event SetAnnualInterestRateTontineEvent(uint256 _annualInterestRateTontine);
    event AddUserEvent(
        address _userAddress,
        uint256 _amountInSilverVault,
        uint256 _amountInGoldVault,
        uint256 _amountTtEthInSilverVault,
        uint256 _amountTtEthInGoldVault
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

    function setAnnualInterestRateTontine(
        uint256 _annualInterestRateTontine
    ) public onlyOwner {
        annualInterestRateTontine = _annualInterestRateTontine;
        emit SetAnnualInterestRateTontineEvent(_annualInterestRateTontine);
    }

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
        uint256 _amountInGoldVault,
        uint256 _amountTtEthInSilverVault,
        uint256 _amountTtEthInGoldVault
    ) private {
        require(accounts.length < 1000, "User limit reached");
        accounts.push(
            Account(
                _userAddress,
                _amountInSilverVault,
                _amountInGoldVault,
                _amountTtEthInSilverVault,
                _amountTtEthInGoldVault
            )
        );
        emit AddUserEvent(
            _userAddress,
            _amountInSilverVault,
            _amountInGoldVault,
            _amountTtEthInSilverVault,
            _amountTtEthInGoldVault
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

    function getTtEthBalance(address _user) public view returns (uint256) {
        return tteth.balanceOf(_user);
    }

    /*************************************/
    /********* CONSTRUCTOR ***************/
    /*************************************/
    constructor(
        Tine _tine,
        Tteth _tteth,
        ChainlinkPricesOracleMock _chainlinkPricesOracleMock
    ) Ownable(msg.sender) {
        tine = _tine;
        tteth = _tteth;
        /**dataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );*/
        chainlinkPricesOracleMock = _chainlinkPricesOracleMock;
        // Initialiser lastInterestCalculationDate lors du déploiement
        lastInterestCalculationDate = block.timestamp;
    }

    /*****************************************************************/
    /********************* Tteth contract    *************************/
    /*****************************************************************/
    /// @notice Function to mint new tokens.
    /// @param _to Address to receive the newly minted tokens.
    /// @param _amount Number of tokens to mint.
    function mint(address _to, uint256 _amount) internal onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        // Mint the tokens.
        tteth.mint(_to, _amount);
    }

    /// @notice Function to burn tokens.
    /// @param _from Address from which tokens will be burned.
    /// @param _amount Number of tokens to burn.
    function burn(address _from, uint256 _amount) internal onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        // Burn the tokens.
        tteth.burn(_from, _amount);
    }

    /// @notice Allows to increase the maximum supply of tokens.
    /// @param _amount Amount to be added to the max supply.
    function increaseMaxSupply(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        // Increase the max supply.
        tteth.increaseMaxSupply(_amount);
    }

    /*****************************************************************/
    /********************* Tontine contract    *************************/
    /*****************************************************************/

    function depositEthAndMintTteth(bool _isGoldVault) public payable {
        require(msg.value >= 1 ether, "Minimum deposit is 1 ETH");

        // Calculer le montant de ttETH à mint basé sur le taux de change ETH/ttETH
        uint256 ttethAmount = calculateTtethAmount(msg.value);

        // Enregistrer le dépôt dans le vault approprié
        Deposit memory newDeposit = Deposit({
            amount: msg.value,
            timeDeposited: block.timestamp
        });

        // Vérifier si l'utilisateur existe déjà dans le tableau accounts
        int256 userIndex = findUser(msg.sender);

        if (userIndex != -1) {
            // L'utilisateur existe déjà, mettez à jour sa cagnotte
            if (_isGoldVault) {
                require(
                    tine.tineLocked(msg.sender) != 0,
                    "TINE must be locked for Gold Vault"
                );
                accounts[uint256(userIndex)].amountEthInGoldVault += msg.value;
                accounts[uint256(userIndex)]
                    .amountTtEthInGoldVault += ttethAmount;
                goldVaultBalance += msg.value;
                goldVaultDepositsByUser[msg.sender].push(newDeposit);
            } else {
                accounts[uint256(userIndex)].amountEthInSilverVault += msg
                    .value;
                accounts[uint256(userIndex)]
                    .amountEthInSilverVault += ttethAmount;
                silverVaultBalance += msg.value;
                silverVaultDepositsByUser[msg.sender].push(newDeposit);
            }
        } else {
            // L'utilisateur n'existe pas encore, ajoutez-le
            if (_isGoldVault) {
                require(
                    tine.tineLocked(msg.sender) != 0,
                    "TINE must be locked for Gold Vault"
                );
                addUser(msg.sender, 0, msg.value, 0, ttethAmount);
                goldVaultBalance += msg.value;
                goldVaultDepositsByUser[msg.sender].push(newDeposit);
            } else {
                addUser(msg.sender, msg.value, 0, ttethAmount, 0);
                silverVaultBalance += msg.value;
                silverVaultDepositsByUser[msg.sender].push(newDeposit);
            }
        }

        // Mint ttETH et l'envoyer à l'utilisateur
        mint(msg.sender, ttethAmount);
        emit DepositEvent(msg.sender, msg.value, _isGoldVault);
    }

    function withdrawTtEthAndBurnTteth(
        bool _isGoldVault,
        uint256 _ttEthAmount
    ) public payable {
        uint256 ethAmount = 0;

        // Vérifier si l'utilisateur existe déjà dans le tableau accounts
        int256 userIndex = findUser(msg.sender);

        // Vérifier si l'utilisateur possède suffisamment de ttETH
        require(
            tteth.balanceOf(msg.sender) >= _ttEthAmount,
            "Insufficient ttETH balance"
        );

        if (_isGoldVault) {
            // Vérifier si l'utilisateur possède suffisamment de ttETH
            require(
                accounts[uint256(userIndex)].amountTtEthInGoldVault >=
                    _ttEthAmount,
                "Insufficient ttETH balance"
            );

            // Calculer la quantité d'ETH à envoyer à l'utilisateur
            ethAmount =
                (accounts[uint256(userIndex)].amountEthInGoldVault *
                    _ttEthAmount) /
                accounts[uint256(userIndex)].amountTtEthInGoldVault;

            Withdraw memory newWithdraw = Withdraw({
                amount: ethAmount,
                timeWithdrawed: block.timestamp
            });

            goldVaultWithdrawsByUser[msg.sender].push(newWithdraw);
            accounts[uint256(userIndex)].amountEthInGoldVault -= ethAmount;
            goldVaultBalance -= ethAmount;
        } else {
            require(
                accounts[uint256(userIndex)].amountTtEthInSilverVault >=
                    _ttEthAmount,
                "Insufficient ttETH balance"
            );
            // Calculer la quantité d'ETH à envoyer à l'utilisateur
            ethAmount =
                (accounts[uint256(userIndex)].amountEthInSilverVault *
                    _ttEthAmount) /
                accounts[uint256(userIndex)].amountTtEthInSilverVault;

            Withdraw memory newWithdraw = Withdraw({
                amount: ethAmount,
                timeWithdrawed: block.timestamp
            });

            silverVaultWithdrawsByUser[msg.sender].push(newWithdraw);
            accounts[uint256(userIndex)].amountEthInSilverVault -= ethAmount;
            silverVaultBalance -= ethAmount;
        }

        // Mint ttETH et l'envoyer à l'utilisateur
        tteth.burn(msg.sender, _ttEthAmount);

        (bool sent, ) = payable(msg.sender).call{value: ethAmount}("");
        if (!sent) {
            revert FailedToSendEther();
        }
        emit WithdrawEvent(msg.sender, _ttEthAmount, _isGoldVault);
    }

    function calculateDailyInterests() public {
        require(
            block.timestamp > lastInterestCalculationDate + 1 days,
            "Can only calculate once per day"
        );

        // Calculer les intérêts quotidiens en fonction de la balance totale et du taux d'intérêt quotidien (X/365)
        uint256 dailyInterests = (getContractBalance() *
            annualInterestRateTontine) / 365;

        // Répartir les intérêts entre silver et gold
        uint256 silverInterests = (2 * dailyInterests) / 5;
        uint256 goldInterests = (3 * dailyInterests) / 5;

        // Mettre à jour les soldes des utilisateurs en fonction de leur participation dans les vaults
        // et de la quantité de TINE verrouillée
        for (uint256 i = 0; i < accounts.length; i++) {
            Account storage user = accounts[i];
            uint256 interestSilver = calculateInterestSilverRatio(
                user,
                silverInterests
            );
            uint256 interestGold = calculateInterestGoldRatio(
                user,
                goldInterests
            );

            accounts[i].amountEthInSilverVault += interestSilver;
            accounts[i].amountEthInGoldVault += interestGold;
        }

        // Mettre à jour lastInterestCalculationDate
        lastInterestCalculationDate = block.timestamp;
        emit CalculateDailyInterestsEvent(lastInterestCalculationDate);
    }

    function calculateInterestSilverRatio(
        Account memory _account,
        uint256 _silverInterests
    ) private view returns (uint256) {
        return
            (_account.amountEthInSilverVault * _silverInterests) /
            silverVaultBalance;
    }

    function calculateInterestGoldRatio(
        Account memory _account,
        uint256 _goldInterests
    ) private view returns (uint256) {
        return
            (_account.amountEthInGoldVault * _goldInterests) / goldVaultBalance;
    }

    function calculateTtethAmount(
        uint256 ethAmount
    ) private pure returns (uint256) {
        // Logique pour déterminer le montant de ttETH basé sur ethAmount
        // Par exemple, si 1 ETH = 1 ttETH
        return ethAmount;
    }

    /**
     * @dev Allows the owner to withdraw ETH from the contract's balance.
     * @param _amount The amount of ETH to withdraw.
     * @param _recipient The address to which the ETH should be sent.
     */
    function withdrawEth(
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
}
