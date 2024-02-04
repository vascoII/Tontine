// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Import from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ChainlinkPricesOracleMock.sol";

/// @title Tine Token Contract
/// @notice Implements ERC20 token with additional features like minting, buying, selling, and locking tokens.
contract Tine is ERC20, Ownable {
    using SafeERC20 for IERC20;
    // IERC20 interface for interacting with Tine tokens using SafeERC20
    IERC20 private _tineToken = IERC20(address(this));

    // Oracle for getting price information
    ChainlinkPricesOracleMock private chainlinkPricesOracleMock;

    // State variables
    uint256 public lastMintEvent;
    // Définir le temps de verrouillage minimum en secondes
    uint256 public MIN_LOCK_TIME = 60; // 60 secondes, ou 1 minute
    uint256 public MIN_LOCK_AMOUNT = 1 * 10 ** decimals();
    uint256 public MAX_SUPPLY = 21_000 * 10 ** decimals();
    uint256 public MAX_BALANCE = 100 * 10 ** decimals();
    uint256 private decimalTine = (10 ** uint256(decimals()));
    uint256 private currentSupply = 0;

    // Mapping to keep track of locked tokens
    mapping(address => uint256) public tineLocked;

    // Events
    event BuyTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 ethAmount
    );
    event LockTineEvent(address indexed userAddress);
    event UnlockTineEvent(address indexed userAddress);
    event SellTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 ethAmount
    );

    // Modifier to check token allowance
    modifier checkAllowance(uint _amount) {
        require(
            _tineToken.allowance(msg.sender, address(this)) >= _amount,
            "Error_checkAllowance"
        );
        _;
    }

    /// @notice Constructor to create Tine token
    /// @param _chainlinkPricesOracleMock Address of the Chainlink Price Oracle Mock
    constructor(
        ChainlinkPricesOracleMock _chainlinkPricesOracleMock
    ) ERC20("Tine", "TINE") Ownable(msg.sender) {
        chainlinkPricesOracleMock = _chainlinkPricesOracleMock;
        _mint(msg.sender, 1_000 * decimalTine);
        _mint(address(this), 1_000 * decimalTine);
        currentSupply = 2_000 * decimalTine;
        lastMintEvent = block.timestamp;
    }

    // Allow to show how many tokens owns this smart contract
    function getSmartContractTokenBalance() external view returns (uint) {
        return _tineToken.balanceOf(address(this));
    }

    // Allow to show how many tokens owns this smart contract
    function getSmartContractEthBalance() external view returns (uint) {
        return address(this).balance;
    }

    /// @notice Mint new tokens monthly up to a maximum supply
    function mintMonthly() public onlyOwner {
        require(
            totalSupply() + 100 * decimalTine <= MAX_SUPPLY * decimalTine,
            "Error_mintMonthly_supply_exceeded"
        );
        require(
            block.timestamp >= lastMintEvent + 30 days,
            "Error_mintMonthly_not_allowed"
        );

        _mint(owner(), 100 * decimalTine);
        currentSupply += 100;
        lastMintEvent = block.timestamp;
    }

    /// @notice Allows users to buy TINE tokens with ETH
    /// @param _tineAmount The amount of TINE tokens to buy
    function buyTine(uint256 _tineAmount) public payable {
        require(_tineAmount > 0, "Error_buyTine_amount_0");

        // Récupérer le taux de change de l'oracle
        uint256 ethRate = chainlinkPricesOracleMock.getLatestTinePriceInEth(); // Le prix de 1 TINE en ETH, par exemple si 1 TINE = 0.5 ETH, ethRate serait 0.5 * 10**18 (en wei)

        // Calculer la valeur totale en ETH que l'utilisateur doit envoyer pour les TINE qu'il souhaite acheter
        uint256 tineAmountValue = _tineAmount * ethRate;

        // S'assurer que l'ajout dans la balance du smart contract ne depasse pas la limit actuelle
        require(
            tineAmountValue + address(this).balance <= MAX_BALANCE,
            "Error_buyTine_MAX_BALANCE_ETH"
        );

        // S'assurer que l'utilisateur envoie la bonne quantité d'ETH selon le taux de change
        require(
            msg.value == tineAmountValue,
            "Error_buyTine_uncorrect_ETH_amount"
        );

        // Vérifier que le contrat a suffisamment de TINE à vendre
        uint256 tontineTineBalance = IERC20(_tineToken).balanceOf(
            address(this)
        );
        require(
            _tineAmount * decimalTine <= tontineTineBalance,
            "Error_buyTine_not_enough_TINE_in_Tontine"
        );

        // Après avoir vérifié que vous avez assez de TINE et avant le transfert
        uint256 excessAmount = msg.value - tineAmountValue;
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }

        // Transférer les TINE à l'utilisateur
        SafeERC20.safeTransfer(
            IERC20(_tineToken),
            msg.sender,
            _tineAmount * decimalTine
        );

        // Émettre un événement pour enregistrer l'achat
        emit BuyTineEvent(msg.sender, _tineAmount * decimalTine, msg.value);
    }

    /// @notice Allows users to lock their TINE tokens
    function lockTine() public {
        require(
            balanceOf(msg.sender) >= decimalTine,
            "Error_lockTine_insufficient_TINE_to_lock"
        );
        require(
            tineLocked[msg.sender] == 0,
            "Error_lockTine_TINE_already_locked"
        );

        tineLocked[msg.sender] = block.timestamp;

        emit LockTineEvent(msg.sender);
    }

    /// @notice Allows users to unlock their TINE tokens
    function unlockTine() public {
        require(tineLocked[msg.sender] != 0, "Error_unlockTine_no_TINE_locked");
        require(
            block.timestamp - tineLocked[msg.sender] >= MIN_LOCK_TIME,
            "Error_unlockTine_not_over_yet"
        );

        tineLocked[msg.sender] = 0;

        emit UnlockTineEvent(msg.sender);
    }

    /// @notice Allows users to sell their TINE tokens for ETH
    /// @param _tineAmount The amount of TINE tokens to sell
    function sellTine(uint256 _tineAmount) public checkAllowance(_tineAmount) {
        require(_tineAmount > 0, "Error_sellTine_amount_0");
        uint256 userTotalTine = balanceOf(msg.sender);

        if (tineLocked[msg.sender] != 0) {
            require(
                userTotalTine - _tineAmount * decimalTine >= MIN_LOCK_AMOUNT,
                "Error_sellTine_must_retain_MIN_LOCK_AMOUNT_locked"
            );
        }

        // Simplification: 1 TINE = 1 ETH pour le mock
        uint256 ethRate = chainlinkPricesOracleMock.getLatestEthPriceInTine();
        uint256 ethAmount = _tineAmount * ethRate;
        require(
            address(this).balance >= ethAmount,
            "Error_sellTine_insufficient_Eth_balance_in_protocol"
        );

        _tineToken.transferFrom(
            msg.sender,
            address(this),
            _tineAmount * decimalTine
        );

        (bool sent, ) = payable(msg.sender).call{value: ethAmount}("");
        require(sent, "Error_sellTine_failed_send_ETH");

        emit SellTineEvent(msg.sender, _tineAmount, ethAmount);
    }

    /// @notice Set minimum lock time
    /// @param _minLockTime New minimum lock time in minutes
    function setMinLockTime(uint256 _minLockTime) public onlyOwner {
        require(
            _minLockTime > 0,
            "Error_setMinLockTime_Lock_time_must_be_greater_than_0"
        );
        MIN_LOCK_TIME = _minLockTime;
    }

    /// @notice Set minimum lock amount
    /// @param _minLockAmount New minimum lock amount in TINE tokens
    function setMinLockAmount(uint256 _minLockAmount) public onlyOwner {
        require(
            _minLockAmount > 0,
            "Error_setMinLockAmount_amount_must_be_greater_than_0"
        );
        MIN_LOCK_AMOUNT = _minLockAmount * 10 ** decimals();
    }

    /// @notice Set total supply
    /// @param _maxSupply New total supply in TINE tokens
    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        MAX_SUPPLY = _maxSupply * 10 ** decimals();
    }

    /// @notice Set total balance
    /// @param _maxBalance New max supply in Eth tokens
    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        MAX_BALANCE = _maxBalance * 10 ** decimals();
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
        require(_amount > 0, "Error_withdrawEth_amount_must_be_greater_than_0");
        require(
            _amount <= address(this).balance,
            "Error_withdrawEth_insufficient_Eth_balance_in_protocol"
        );
        require(
            _recipient != address(0),
            "Error_withdrawEth_invalid_recipient_address"
        );

        // Transfer ETH to the specified recipient
        _recipient.transfer(_amount);
    }

    /**
     * @dev Receives ETH sent directly to the contract address.
     * This function is invoked when ETH is sent to the contract without calling a specific function.
     */
    receive() external payable {
        // Additional logic can be added here.
    }
}
