// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVaultAdapter {
    function depositForStrategy(uint256 strategyId, uint256 amount) external returns (uint256 shares);
    function withdrawForStrategy(uint256 strategyId, uint256 amount) external returns (uint256 sharesBurned);
    function getYield(uint256 strategyId) external view returns (uint256 yieldEarned);
    function getVaultBalance(uint256 strategyId) external view returns (uint256 totalBalance);
    function getPrincipal(uint256 strategyId) external view returns (uint256 principal);
}
