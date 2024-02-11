// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface ITine {
    // Déclaration de la fonction hasLockedTine en plus des fonctions standard ERC20
    function hasLockedTine(address user) external view returns (bool);
}
