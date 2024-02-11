// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RocketTokenRETHMock is ERC20, ReentrancyGuard {
    uint256 private constant SILVER_RATE = 500; // Taux pour Silver Vault, pourcentage * 100
    uint256 private constant GOLD_RATE = 1000; // Taux pour Gold Vault, pourcentage * 100

    constructor() ERC20("Rocket Pool ETH", "rETH") {}

    // Fonction simplifiée pour déposer des ETH et recevoir des rETH
    function depositETH() external payable nonReentrant {
        require(msg.value > 0, "ETH amount is zero");
        uint256 rethAmount = getRethValue(msg.value);
        _mint(msg.sender, rethAmount);
    }

    // Fonction simplifiée pour récupérer des ETH en brûlant des rETH
    function withdrawETH(uint256 _rethAmount) external nonReentrant {
        require(_rethAmount > 0, "rETH amount is zero");
        uint256 ethAmount = getEthValue(_rethAmount);
        _burn(msg.sender, _rethAmount);
        require(
            address(this).balance >= ethAmount,
            "Not enough ETH in contract"
        );
        payable(msg.sender).transfer(ethAmount);
    }

    // Fonction pour obtenir le taux d'échange
    function getExchangeRate(
        uint256 _typeStake
    ) external pure returns (uint256) {
        return _typeStake == 1 ? SILVER_RATE : GOLD_RATE;
    }

    function getEthValue(uint256 _rethAmount) public pure returns (uint256) {
        // Supposons un taux fixe pour simplifier: 1 rETH = 1.01 ETH, par exemple
        return (_rethAmount * 101) / 100;
    }

    function getRethValue(uint256 _ethAmount) public pure returns (uint256) {
        // Inverse du taux ci-dessus: 1 ETH = 0.99 rETH
        return (_ethAmount * 99) / 100;
    }
}
