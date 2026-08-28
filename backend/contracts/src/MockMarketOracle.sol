// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IMarketOracle.sol";

contract MockMarketOracle is IMarketOracle {
    address public owner;
    MarketConditions private conditions;

    modifier onlyOwner() {
        require(msg.sender == owner, "MockMarketOracle: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Default GOOD market conditions:
        // Price: 94,250 USD (scaled 1e8 = 9425000000000)
        // TWAP: 94,110 USD
        // Volatility: 1 (Low)
        // Liquidity: 3 (High)
        // Slippage: 18 bps (0.18%)
        // PriceImpact: 4 bps (0.04%)
        // Urgency: 1 (Low)
        conditions = MarketConditions({
            currentPrice: 9425000000000,
            twap: 9411000000000,
            volatility: 1,
            liquidity: 3,
            slippage: 18,
            priceImpact: 4,
            executionUrgency: 1
        });
    }

    function getMarketConditions() external view override returns (MarketConditions memory) {
        return conditions;
    }

    function priceDeviation() external view override returns (int256) {
        if (conditions.twap == 0) return 0;
        int256 diff = int256(conditions.currentPrice) - int256(conditions.twap);
        return (diff * 10000) / int256(conditions.twap); // in basis points
    }

    function setMarketConditions(
        uint256 currentPrice,
        uint256 twap,
        uint256 volatility,
        uint256 liquidity,
        uint256 slippage,
        uint256 priceImpact,
        uint256 executionUrgency
    ) external override onlyOwner {
        conditions = MarketConditions({
            currentPrice: currentPrice,
            twap: twap,
            volatility: volatility,
            liquidity: liquidity,
            slippage: slippage,
            priceImpact: priceImpact,
            executionUrgency: executionUrgency
        });
    }

    function setPresetScenario(string calldata scenario) external onlyOwner {
        bytes32 scHash = keccak256(abi.encodePacked(scenario));
        if (scHash == keccak256(abi.encodePacked("good"))) {
            conditions = MarketConditions(9425000000000, 9411000000000, 1, 3, 18, 4, 1);
        } else if (scHash == keccak256(abi.encodePacked("moderate"))) {
            conditions = MarketConditions(9480000000000, 9411000000000, 2, 2, 45, 12, 2);
        } else if (scHash == keccak256(abi.encodePacked("bad"))) {
            conditions = MarketConditions(9650000000000, 9411000000000, 3, 1, 120, 35, 3);
        } else if (scHash == keccak256(abi.encodePacked("forced"))) {
            conditions = MarketConditions(9650000000000, 9411000000000, 3, 1, 150, 45, 3);
        }
    }
}
