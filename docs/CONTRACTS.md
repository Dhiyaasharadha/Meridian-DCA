# Meridian DCA — Smart Contract Architecture & Reference

This document details the Solidity smart contracts powering the capital, strategy, and execution layers of **Meridian DCA**.

---

## 📜 Contract Overview

```
                          ┌────────────────────────┐
                          │     DCAManager.sol     │
                          │   (Strategy Registry)  │
                          └───────────┬────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
    ┌────────────────────┐                        ┌────────────────────┐
    │  VaultAdapter.sol  │                        │ExecutionContract.sol│
    └──────────┬─────────┘                        └──────────┬─────────┘
               │                                             │
               ▼                                             ▼
    ┌────────────────────┐                        ┌────────────────────┐
    │   YieldVault.sol   │                        │    DCAHook.sol     │
    │ (ERC-4626 Yield)   │                        │ (Uniswap v4 Hook)  │
    └────────────────────┘                        └────────────────────┘
```

---

### 1. `DCAManager.sol`
- **Purpose**: Primary strategy registry and lifecycle manager.
- **Key Functions**:
  - `createStrategy(asset, targetAsset, amount, frequency, maxDelay, maxSlippage)`: Creates a new DCA strategy.
  - `isDue(strategyId)`: Checks if the strategy execution timestamp is reached.
  - `isForced(strategyId)`: Checks if `delayCount >= maxDelay`.
  - `recordExecution(strategyId, amountExecuted, wasForced)`: Records execution accounting.
  - `recordDelay(strategyId)`: Increments delay counter.
- **Important Events**: `StrategyCreated`, `StrategyExecuted`, `StrategyDelayed`, `StrategyForced`.
- **Security Role**: Central source of truth for strategy authorization and schedule constraints.

---

### 2. `VaultAdapter.sol`
- **Purpose**: Interface between `ExecutionContract` and the `YieldVault`.
- **Key Functions**:
  - `withdrawForStrategy(strategyId, trancheAmount)`: Withdraws exact tranche capital from vault while leaving remaining strategy balance invested.
  - `getYield(strategyId)`: Calculates accrued yield for strategy principal.
  - `getVaultBalance(strategyId)`: Returns current share value in USD.
- **Security Role**: Enforces partial tranche withdrawal safety ($400 withdrawn from $1000 deposit leaves $600 accruing APY).

---

### 3. `YieldVault.sol`
- **Purpose**: Standard OpenZeppelin `ERC4626` yield vault with deterministic time-based yield accumulator (~5.4% APY).
- **Key Functions**: `deposit`, `withdraw`, `mint`, `redeem`, `totalAssets`, `convertToShares`, `convertToAssets`.
- **Security Role**: Ensures user principal is protected and yield accrues predictably during waiting cycles.

---

### 4. `ExecutionContract.sol`
- **Purpose**: Authoritative execution layer.
- **Key Functions**:
  - `execute(strategyId, tranchePct)`: Withdraws tranche capital, invokes swap hook, updates strategy state atomically.
  - `delay(strategyId, reason)`: Records delay cycle on-chain.
- **Security Role**: Guarantees atomic transaction rollback if swap hook fails.

---

### 5. `DCAHook.sol`
- **Purpose**: Uniswap v4 Hook execution harness.
- **Key Functions**: `executeSwapHook`, `beforeSwap`, `afterSwap`.
- **Security Role**: Enforces pre-swap slippage and price impact checks.

---

### 6. `MockMarketOracle.sol`
- **Purpose**: Configurable market telemetry oracle.
- **Key Functions**: `getSpotPrice`, `getTWAP`, `getLiquidityDepth`, `getVolatility`.
- **Security Role**: Provides deterministic telemetry to decision engine during local Anvil testing.
