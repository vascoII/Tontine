// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IRocketTokenRETHMock {
    function depositETH() external payable;

    function withdrawETH(uint256 _rethAmount) external;

    function getExchangeRate(uint _typeStake) external view returns (uint256);

    function getEthValue(uint256 _rethAmount) external view returns (uint256);

    function getRethValue(uint256 _ethAmount) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}
