// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./Interface/IPriceConsumer.sol";

/// @title Tine Token Contract
/// @dev Extends ERC20 token standards with additional functionality such as locking tokens and adjusting supply.
/// Incorporates Ownable and ReentrancyGuard from OpenZeppelin for security.
contract Tine is ERC20, Ownable, ReentrancyGuard {
    /// @notice Allow decoupling priceConsumer and Tine ERC20
    IPriceConsumer public priceConsumer;

    uint256 public lastMintEvent;
    uint256 public minLockTime = 86400; // 1 days
    uint256 public minLockAmount = 1 * 10 ** decimals();
    uint256 public maxSupply = 21_000 * 10 ** decimals();
    uint256 public maxBalance = 100 * 10 ** decimals();

    mapping(address => uint256) public tineLocked; // Tracks locked Tine tokens by address.
    
    event BuyTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 tokenAmount
    );
    event LockTineEvent(address indexed userAddress);
    event UnlockTineEvent(address indexed userAddress);
    event SellTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 tokenAmount
    );

    event PriceConsumerUpdated(address indexed previousConsumer, address indexed newConsumer);

    constructor(IPriceConsumer  _priceConsumer) ERC20("Tine", "TINE") Ownable(msg.sender) {
        priceConsumer = _priceConsumer;
        _mint(address(this), 1_000 * 10 ** decimals()); // Initial minting to the contract itself for liquidity.
    }

    /// @notice Allow to use any futur PriceConsumer implementation
    function updatePriceConsumer(IPriceConsumer _newPriceConsumer) public onlyOwner {
        emit PriceConsumerUpdated(address(priceConsumer), address(_newPriceConsumer));
        priceConsumer = _newPriceConsumer;
    }

    /// @notice Returns the contract's token balance.
    function getSmartContractTokenBalance() external view returns (uint) {
        return balanceOf(address(this));
    }

    /// @notice Returns the contract's balance.
    function getSmartContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    /// @notice Checks if a user has locked Tine tokens.
    /// @param user Address of the user to check.
    /// @return True if the user has locked Tine tokens, false otherwise.
    function hasLockedTine(address user) external view returns (bool) {
        return tineLocked[user] != 0;
    }

    /// @notice Mints TINE tokens to the contract's balance.
    /// @dev Can only be called by the contract up to the max supply limit.
    /// @param _amount The amount of TINE tokens to mint, in wei.
    function mintMonthly(uint256 _amount) public onlyOwner {
        require(
            totalSupply() + _amount * 10 ** decimals() <= maxSupply,
            "Max supply exceeded"
        );

        _mint(address(this), _amount * 10 ** decimals());
        lastMintEvent = block.timestamp;
    }

    /// @notice Buys Tine tokens with blockchain Token.
    /// @param _tineAmount Amount of Tine tokens to buy.
    function buyTine(uint256 _tineAmount) public payable nonReentrant {
        require(_tineAmount > 0, "Amount must be greater than 0");
        int256 tokenRate = priceConsumer.getLatestPrice();
        uint256 requiredToken = (_tineAmount * uint256(tokenRate)) / 10 ** 18;
        require(msg.value >= requiredToken, "Incorrect Token amount");

        uint256 excessToken = msg.value - requiredToken;
        _transfer(address(this), msg.sender, _tineAmount);
        if (excessToken > 0) {
            payable(msg.sender).transfer(excessToken);
        }
        emit BuyTineEvent(msg.sender, _tineAmount, msg.value);
    }

    /// @notice Locks Tine tokens to prevent them from being transferred.
    function lockTine() public {
        require(balanceOf(msg.sender) >= minLockAmount, "Insufficient TINE to lock");
        require(tineLocked[msg.sender] == 0, "TINE already locked");

        tineLocked[msg.sender] = block.timestamp;
        emit LockTineEvent(msg.sender);
    }

    /// @notice Unlocks the Tine tokens after the lock period.
    function unlockTine() public {
        require(tineLocked[msg.sender] != 0, "No TINE locked");
        require(block.timestamp - tineLocked[msg.sender] >= minLockTime, "Lock period not over");

        tineLocked[msg.sender] = 0;
        emit UnlockTineEvent(msg.sender);
    }

    /// @notice Sells Tine tokens in exchange for blockchain Token.
    /// @param _tineAmountInWei Amount of Tine tokens to sell in Wei.
    function sellTine(uint256 _tineAmountInWei) public nonReentrant {
        require(_tineAmountInWei > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _tineAmountInWei, "Insufficient TINE balance");
        require(allowance(msg.sender, address(this)) >= _tineAmountInWei, "Insufficient allowance");

        int256 tokenRate = priceConsumer.getLatestPrice();
        uint256 tokenAmount = _tineAmountInWei / uint256(tokenRate);

        require(
            address(this).balance >= tokenAmount,
            "Insufficient Token balance in contract"
        );

        _transfer(msg.sender, address(this), _tineAmountInWei);

        // Envoyer les Token net à l'utilisateur
        (bool success, ) = payable(msg.sender).call{value: tokenAmount}("");
        require(success, "Failed to send Token");
        emit SellTineEvent(msg.sender, _tineAmountInWei, tokenAmount);
    }

    /// @dev Sets minimum lock time, lock amount, max supply, and max balance restrictions.
    function setMinLockTime(uint256 _minLockTime) public onlyOwner {
        require(_minLockTime > 0, "Lock time must be > 0");
        minLockTime = _minLockTime;
    }

    function setMinLockAmount(uint256 _minLockAmount) public onlyOwner {
        require(_minLockAmount > 0, "Lock amount must be > 0");
        minLockAmount = _minLockAmount * 10 ** decimals();
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply * 10 ** decimals();
    }

    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance * 10 ** decimals();
    }

    /// @notice Allows the owner to withdraw TOKEN from the contract.
    /// @param _amount Amount of TOKEN to withdraw.
    /// @param _recipient Recipient of the withdrawn TOKEN.
    function withdraw(uint256 _amount, address payable _recipient) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient TOKEN balance");
        require(_recipient != address(0), "Invalid recipient");

        _recipient.transfer(_amount);
    }

    /// @dev Allows the contract to receive TOKEN.
    receive() external payable {}
}
