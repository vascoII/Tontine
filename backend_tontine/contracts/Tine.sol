// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ChainlinkPricesOracleMock.sol";

contract Tine is ERC20, Ownable, ReentrancyGuard {
    ChainlinkPricesOracleMock private chainlinkPricesOracleMock;

    uint256 public lastMintEvent;
    uint256 public minLockTime = 60; // 1 minute
    uint256 public minLockAmount = 1 * 10 ** decimals();
    uint256 public maxSupply = 21_000 * 10 ** decimals();
    uint256 public maxBalance = 100 * 10 ** decimals();

    mapping(address => uint256) public tineLocked;

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

    constructor(
        ChainlinkPricesOracleMock _chainlinkPricesOracleMock
    ) ERC20("Tine", "TINE") Ownable(msg.sender) {
        chainlinkPricesOracleMock = _chainlinkPricesOracleMock;
        //_mint(msg.sender, 1_000 * 10 ** decimals());
        _mint(address(this), 1_000 * 10 ** decimals());
    }

    function getSmartContractTokenBalance() external view returns (uint) {
        return balanceOf(address(this));
    }

    function getSmartContractEthBalance() external view returns (uint) {
        return address(this).balance;
    }

    function hasLockedTine(address user) external view returns (bool) {
        return tineLocked[user] != 0;
    }

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

    function buyTine(uint256 _tineAmount) public payable nonReentrant {
        require(_tineAmount > 0, "Amount must be greater than 0");
        uint256 ethRate = chainlinkPricesOracleMock.getLatestTinePriceInEth();
        uint256 requiredEth = (_tineAmount * ethRate) / 10 ** 18; // Assurez-vous que cela calcule correctement le coût en ETH.
        require(msg.value >= requiredEth, "Incorrect ETH amount");

        uint256 excessEth = msg.value - requiredEth;
        _transfer(address(this), msg.sender, _tineAmount);
        if (excessEth > 0) {
            payable(msg.sender).transfer(excessEth);
        }

        emit BuyTineEvent(msg.sender, _tineAmount, msg.value);
    }

    function lockTine() public {
        require(
            balanceOf(msg.sender) >= minLockAmount,
            "Insufficient TINE to lock"
        );
        require(tineLocked[msg.sender] == 0, "TINE already locked");

        tineLocked[msg.sender] = block.timestamp;
        emit LockTineEvent(msg.sender);
    }

    function unlockTine() public {
        require(tineLocked[msg.sender] != 0, "No TINE locked");
        require(
            block.timestamp - tineLocked[msg.sender] >= minLockTime,
            "Lock period not over"
        );

        tineLocked[msg.sender] = 0;
        emit UnlockTineEvent(msg.sender);
    }

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

        uint256 ethRate = chainlinkPricesOracleMock.getLatestEthPriceInTine(); // 10 Tine pour 1 ETH
        // Ajuster le calcul pour utiliser le ratio inverse
        uint256 ethAmount = _tineAmountInWei / ethRate; // Utilise 1e18 pour augmenter la précision

        require(
            address(this).balance >= ethAmount,
            "Insufficient ETH balance in contract"
        );

        _transfer(msg.sender, address(this), _tineAmountInWei);

        // Envoyer les ETH net à l'utilisateur
        (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
        require(success, "Failed to send Ether");

        emit SellTineEvent(msg.sender, _tineAmountInWei, ethAmount);
    }

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

    function withdrawEth(
        uint256 _amount,
        address payable _recipient
    ) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient ETH balance");
        require(_recipient != address(0), "Invalid recipient");

        _recipient.transfer(_amount);
    }

    receive() external payable {}
}
