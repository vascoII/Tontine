// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ChainlinkPricesOracleMock.sol";

/// @title Tine Token Contract
/// @dev Extends ERC20 token standards with additional functionality such as locking tokens and adjusting supply.
/// Incorporates Ownable and ReentrancyGuard from OpenZeppelin for security.
contract Tine is ERC20, Ownable, ReentrancyGuard {
    ChainlinkPricesOracleMock private chainlinkPricesOracleMock;

    uint256 public lastMintEvent;
    uint256 public minLockTime = 60; // Minimum lock time set to 1 minute.
    uint256 public minLockAmount = 1 * 10 ** decimals(); // Minimum lock amount.
    uint256 public maxSupply = 21_000 * 10 ** decimals(); // Maximum token supply.
    uint256 public maxBalance = 100 * 10 ** decimals(); // Maximum balance a single address can hold.

    mapping(address => uint256) public tineLocked; // Tracks locked Tine tokens by address.

    // Events for token purchase, locking, unlocking, and selling.
    event BuyTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 maticAmount
    );
    event LockTineEvent(address indexed userAddress);
    event UnlockTineEvent(address indexed userAddress);
    event SellTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 maticAmount
    );

    constructor(
        ChainlinkPricesOracleMock _chainlinkPricesOracleMock
    ) ERC20("Tine", "TINE") Ownable(msg.sender) {
        chainlinkPricesOracleMock = _chainlinkPricesOracleMock;
        _mint(address(this), 1_000 * 10 ** decimals()); // Initial minting to the contract itself for liquidity.
    }

    /// @notice Returns the contract's token balance.
    function getSmartContractTokenBalance() external view returns (uint) {
        return balanceOf(address(this));
    }

    /// @notice Returns the contract's MATIC balance.
    function getSmartContractMaticBalance() external view returns (uint) {
        return address(this).balance;
    }

    /// @notice Checks if a user has locked Tine tokens.
    /// @param user Address of the user to check.
    /// @return True if the user has locked Tine tokens, false otherwise.
    function hasLockedTine(address user) external view returns (bool) {
        return tineLocked[user] != 0;
    }

    /// @notice Allows monthly token minting by the owner, adhering to the max supply limit.
    function mintMonthly() public onlyOwner {
        require(
            block.timestamp >= lastMintEvent + 30 days,
            "Minting not yet allowed"
        );
        require(
            totalSupply() + 100 * 10 ** decimals() <= maxSupply,
            "Max supply exceeded"
        );

        _mint(address(this), 100 * 10 ** decimals());
        lastMintEvent = block.timestamp;
    }

    /// @notice Buys Tine tokens with MATIC.
    /// @param _tineAmount Amount of Tine tokens to buy.
    function buyTine(uint256 _tineAmount) public payable nonReentrant {
        require(_tineAmount > 0, "Amount must be greater than 0");
        uint256 maticRate = chainlinkPricesOracleMock
            .getLatestTinePriceInMatic();
        uint256 requiredMatic = (_tineAmount * maticRate) / 10 ** 18;
        require(msg.value >= requiredMatic, "Incorrect MATIC amount");

        uint256 excessMatic = msg.value - requiredMatic;
        _transfer(address(this), msg.sender, _tineAmount);
        if (excessMatic > 0) {
            payable(msg.sender).transfer(excessMatic);
        }

        emit BuyTineEvent(msg.sender, _tineAmount, msg.value);
    }

    /// @notice Locks Tine tokens to prevent them from being transferred.
    function lockTine() public {
        require(
            balanceOf(msg.sender) >= minLockAmount,
            "Insufficient TINE to lock"
        );
        require(tineLocked[msg.sender] == 0, "TINE already locked");

        tineLocked[msg.sender] = block.timestamp;
        emit LockTineEvent(msg.sender);
    }

    /// @notice Unlocks the Tine tokens after the lock period.
    function unlockTine() public {
        require(tineLocked[msg.sender] != 0, "No TINE locked");
        require(
            block.timestamp - tineLocked[msg.sender] >= minLockTime,
            "Lock period not over"
        );

        tineLocked[msg.sender] = 0;
        emit UnlockTineEvent(msg.sender);
    }

    /// @notice Sells Tine tokens in exchange for MATIC.
    /// @param _tineAmountInWei Amount of Tine tokens to sell in Wei.
    function sellTine(uint256 _tineAmountInWei) public nonReentrant {
        require(_tineAmountInWei > 0, "Amount must be greater than 0");
        require(
            balanceOf(msg.sender) >= _tineAmountInWei,
            "Insufficient TINE balance"
        );
        require(
            allowance(msg.sender, address(this)) >= _tineAmountInWei,
            "Insufficient allowance"
        );

        uint256 maticRate = chainlinkPricesOracleMock
            .getLatestMaticPriceInTine();
        uint256 maticAmount = _tineAmountInWei / maticRate;

        require(
            address(this).balance >= maticAmount,
            "Insufficient MATIC balance in contract"
        );

        _transfer(msg.sender, address(this), _tineAmountInWei);
        (bool success, ) = payable(msg.sender).call{value: maticAmount}("");
        require(success, "Failed to send MATIC");

        emit SellTineEvent(msg.sender, _tineAmountInWei, maticAmount);
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

    /// @notice Allows the owner to withdraw MATIC from the contract.
    /// @param _amount Amount of MATIC to withdraw.
    /// @param _recipient Recipient of the withdrawn MATIC.
    function withdrawMatic(
        uint256 _amount,
        address payable _recipient
    ) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient MATIC balance");
        require(_recipient != address(0), "Invalid recipient");

        _recipient.transfer(_amount);
    }

    /// @dev Allows the contract to receive MATIC.
    receive() external payable {}
}
