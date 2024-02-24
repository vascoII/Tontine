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
    uint256 public minLockTime = 86400; // 1 day
    uint256 public minLockTime = 86400; // 1 day
    uint256 public minLockAmount = 1 * 10 ** decimals();
    uint256 public maxSupply = 21_000 * 10 ** decimals();
    uint256 public maxBalance = 100 * 10 ** decimals();

    mapping(address => uint256) public tineLocked; // Tracks locked Tine tokens by address.
    
    event BuyTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 tokenAmount
        uint256 tokenAmount
    );
    event LockTineEvent(address indexed userAddress);
    event UnlockTineEvent(address indexed userAddress);
    event SellTineEvent(
        address indexed userAddress,
        uint256 tineAmount,
        uint256 tokenAmount
        uint256 tokenAmount
    );

    constructor(ChainlinkPricesOracleMock _chainlinkPricesOracleMock) ERC20("Tine", "TINE") Ownable(msg.sender) {
        chainlinkPricesOracleMock = _chainlinkPricesOracleMock;
        _mint(address(this), 1_000 * 10 ** decimals()); // Initial minting to the contract itself for liquidity.
    }

    /// @notice Returns the contract's token balance.
    function getSmartContractTokenBalance() external view returns (uint) {
        return balanceOf(address(this));
    }

    /// @notice Returns the contract's ETH balance.
    function getSmartContractEthBalance() external view returns (uint) {
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
            block.timestamp >= lastMintEvent + 1 days,
            block.timestamp >= lastMintEvent + 1 days,
            "Minting not yet allowed"
        );
        require(
            totalSupply() + 1000 * 10 ** decimals() <= maxSupply,
            totalSupply() + 1000 * 10 ** decimals() <= maxSupply,
            "Max supply exceeded"
        );

        _mint(address(this), 1000 * 10 ** decimals());
        _mint(address(this), 1000 * 10 ** decimals());
        lastMintEvent = block.timestamp;
    }

    /// @notice Buys Tine tokens with ETH.
    /// @param _tineAmount Amount of Tine tokens to buy.
    function buyTine(uint256 _tineAmount) public payable nonReentrant {
        require(_tineAmount > 0, "Amount must be greater than 0");
        uint256 tokenRate = chainlinkPricesOracleMock.getLatestTinePrice();
        uint256 requiredToken = (_tineAmount * tokenRate) / 10 ** 18;
        require(msg.value >= requiredToken, "Incorrect Token amount");
        uint256 tokenRate = chainlinkPricesOracleMock.getLatestTinePrice();
        uint256 requiredToken = (_tineAmount * tokenRate) / 10 ** 18;
        require(msg.value >= requiredToken, "Incorrect Token amount");

        uint256 excessToken = msg.value - requiredToken;
        uint256 excessToken = msg.value - requiredToken;
        _transfer(address(this), msg.sender, _tineAmount);
        if (excessToken > 0) {
            payable(msg.sender).transfer(excessToken);
        
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

    /// @notice Sells Tine tokens in exchange for ETH.
    /// @param _tineAmountInWei Amount of Tine tokens to sell in Wei.
    function sellTine(uint256 _tineAmountInWei) public nonReentrant {
        require(_tineAmountInWei > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _tineAmountInWei, "Insufficient TINE balance");
        require(allowance(msg.sender, address(this)) >= _tineAmountInWei, "Insufficient allowance");

        uint256 tokenRate = chainlinkPricesOracleMock.getLatestTokenPriceInTine();
        uint256 tokenRate = chainlinkPricesOracleMock.getLatestTokenPriceInTine();
        // Ajuster le calcul pour utiliser le ratio inverse
        uint256 tokenAmount = _tineAmountInWei / tokenRate;
        uint256 tokenAmount = _tineAmountInWei / tokenRate;

        require(
            address(this).balance >= tokenAmount,
            address(this).balance >= tokenAmount,
            "Insufficient ETH balance in contract"
        );

        _transfer(msg.sender, address(this), _tineAmountInWei);

        // Envoyer les ETH net à l'utilisateur
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

    /// @notice Allows the owner to withdraw ETH from the contract.
    /// @param _amount Amount of ETH to withdraw.
    /// @param _recipient Recipient of the withdrawn ETH.
    function withdrawEth(uint256 _amount, address payable _recipient) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient ETH balance");
        require(_recipient != address(0), "Invalid recipient");

        _recipient.transfer(_amount);
    }

    /// @dev Allows the contract to receive ETH.
    receive() external payable {}
}
