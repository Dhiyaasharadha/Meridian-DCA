// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDCAManager {
    enum StrategyStatus { ACTIVE, PAUSED, COMPLETED }

    struct Strategy {
        uint256 strategyId;
        address owner;
        address asset;           // Source token (e.g. USDC)
        address targetAsset;     // Target token (e.g. BTC, ETH, SOL)
        uint256 amount;          // Tranche amount per DCA interval
        uint256 frequency;       // Interval in seconds
        uint256 maxDelay;        // Max allowed delay cycles
        uint256 maxSlippage;     // Max allowed slippage in basis points (e.g. 50 = 0.5%)
        uint256 createdAt;       // Timestamp
        uint256 lastExecution;   // Timestamp
        uint256 nextDca;         // Next eligible timestamp
        uint256 delayCount;      // Number of delayed cycles
        uint256 totalInvested;   // Total capital deposited
        uint256 totalExecuted;   // Total capital executed
        StrategyStatus status;
    }

    event StrategyCreated(
        uint256 indexed strategyId,
        address indexed user,
        address asset,
        address targetAsset,
        uint256 amount,
        uint256 frequency,
        uint256 maxDelay,
        uint256 maxSlippage
    );

    event DecisionMade(
        uint256 indexed strategyId,
        uint8 decision,            // 0=EXECUTE, 1=PARTIAL, 2=DELAY, 3=FORCED
        uint256 score,
        uint256 executionPercentage,
        uint256 delayCount,
        uint256 timestamp
    );

    event DCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);
    event PartialDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);
    event DCADelayed(uint256 indexed strategyId, uint256 delayCount);
    event ForcedDCAExecuted(uint256 indexed strategyId, uint256 amountExecuted, uint256 targetReceived);

    function createStrategy(
        address asset,
        address targetAsset,
        uint256 amount,
        uint256 frequency,
        uint256 maxDelay,
        uint256 maxSlippage
    ) external returns (uint256 strategyId);

    function executeStrategy(
        uint256 strategyId,
        uint8 decision,
        uint256 tranchePercentage,
        uint256 score
    ) external;

    function getStrategy(uint256 strategyId) external view returns (Strategy memory);
}
