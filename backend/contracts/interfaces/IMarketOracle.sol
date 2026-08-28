// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMarketOracle {
    struct MarketConditions {
        uint256 currentPrice;       // Current spot price (e.g., 94250 USD, scaled 1e8)
        uint256 twap;               // Time-Weighted Average Price
        uint256 volatility;         // Volatility index (1 = Low, 2 = Med, 3 = High)
        uint256 liquidity;          // Liquidity depth index (1 = Low, 2 = Med, 3 = High)
        uint256 slippage;           // Expected pool slippage in basis points (18 = 0.18%)
        uint256 priceImpact;        // Expected price impact in basis points (4 = 0.04%)
        uint256 executionUrgency;   // Urgency level (1 = Low, 2 = Normal, 3 = High)
    }

    function getMarketConditions() external view returns (MarketConditions memory);
    function priceDeviation() external view returns (int256 deviationBps);
    function setMarketConditions(
        uint256 currentPrice,
        uint256 twap,
        uint256 volatility,
        uint256 liquidity,
        uint256 slippage,
        uint256 priceImpact,
        uint256 executionUrgency
    ) external;
}
