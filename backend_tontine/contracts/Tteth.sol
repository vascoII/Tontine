// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Import from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Tteth Token Contract
/// @notice This contract implements an ERC20 token with minting, burning, and max supply management functionalities.
contract Tteth is ERC20, Ownable {
    // Maximum token supply.
    uint256 public maxSupply;

    /// @notice Constructor to initialize the token.
    constructor() ERC20("Tteth", "TTETH") Ownable(msg.sender) {
        // Set the initial maximum supply.
        maxSupply = 10 * (10 ** decimals());
    }

    /// @notice Function to mint new tokens.
    /// @param _to Address to receive the newly minted tokens.
    /// @param _amount Number of tokens to mint.
    function mint(address _to, uint256 _amount) external onlyOwner {
        // Check to ensure max supply is not exceeded.
        require(totalSupply() + _amount <= maxSupply, "Max supply exceeded");

        // Mint the tokens.
        _mint(_to, _amount);
    }

    /// @notice Function to burn tokens.
    /// @param _from Address from which tokens will be burned.
    /// @param _amount Number of tokens to burn.
    function burn(address _from, uint256 _amount) external onlyOwner {
        // Check to ensure the address has enough tokens to burn.
        require(balanceOf(_from) >= _amount, "Insufficient balance to burn");

        // Burn the tokens.
        _burn(_from, _amount);
    }

    /// @notice Allows to increase the maximum supply of tokens.
    /// @param _amount Amount to be added to the max supply.
    function increaseMaxSupply(uint256 _amount) external onlyOwner {
        // Increase the max supply.
        maxSupply += _amount * (10 ** decimals());
    }
}
