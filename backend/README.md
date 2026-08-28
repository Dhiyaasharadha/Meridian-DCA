# YieldGuard AI — Integration & AI Decision Orchestration Layer

An autonomous, yield-aware DCA engine powered by Uniswap v4 Hooks, OpenZeppelin ERC-4626 Yield Vaults, and an explainable, deterministic 12-step AI decision orchestration pipeline.

---

## 🏗 Architecture & Layer Separation

```
CAPITAL LAYER       → ERC-4626 YieldVault.sol & VaultAdapter.sol (Exact tranche withdrawals)
STRATEGY LAYER      → DCAManager.sol (createStrategy, isDue, isForced, recordExecution)
EXECUTION LAYER     → ExecutionContract.sol & DCAHook.sol (Atomic execution & fallback revert)
AI ORCHESTRATION    → decisionOrchestrator.ts (12-step pipeline & audit logging)
DECISION ENGINES    → marketScore.ts, fidelityEngine.ts, economicEngine.ts, explainability.ts
KEEPER LAYER        → keeper.ts (Automated strategy polling loop every 10s)
OBSERVABILITY LAYER → Express REST API (13 endpoints on port 4000) & /audit trail
```

---

## 🤖 The 12-Step AI Decision Pipeline

```
INPUTS (Strategy, Market, Vault, Yield, DelayCount, MaxDelay, Allocation History)
  ↓
1. Normalize Market Inputs (0–100 scales for Liquidity, Slippage, Volatility, Yield, Urgency)
  ↓
2. Calculate Market Score (0.30*liq + 0.25*slip + 0.20*vol + 0.15*yield + 0.10*urgency)
  ↓
3. Calculate DCA Fidelity (100 - delay_penalty - allocation_drift - missed_execution_penalty)
  ↓
4. Calculate Economic Viability (benefit = yield + quality vs cost = gas + slippage)
  ↓
5. Preliminary Decision (Score > 80 → EXECUTE 100%, 60–80 → PARTIAL 60%, < 60 → DELAY 0%)
  ↓
6. Economic Veto Check (If preliminary == DELAY & benefit <= cost → override DELAY → EXECUTE 60%)
  ↓
7. Fidelity Guardrail Check (If fidelity < 70 → FORCED 100%)
  ↓
8. MaxDelay Guardrail Check (If delayCount >= maxDelay → FORCED 100%)
  ↓
9. Tranche Optimization (Determine tranche percentage: 100%, 60%, 40%, 20%, 0%)
  ↓
10. Dynamic Reason Ranking (Sort factor contributions descending by absolute magnitude)
  ↓
11. Frozen Decision JSON Generation & Audit Trail Persistence
  ↓
12. Blockchain Execution (ExecutionContract.execute / ExecutionContract.delay)
```

---

## 🔒 Decision Priority Hierarchy

1. **MAX DELAY FORCE** (`delayCount >= maxDelay` → FORCED 100%)
2. **FIDELITY FORCE** (`fidelity < 70` → FORCED 100%)
3. **ECONOMIC VETO** (`preliminary == DELAY` & `benefit <= cost` → EXECUTE 60%)
4. **MARKET SCORE BANDS** (>80 EXECUTE, 60–80 PARTIAL, <60 DELAY)

*Hard constraints always override market scores to guarantee bounded autonomy.*

---

## ⚡ Quick Start & Run Commands

### 1. Build Smart Contracts & Export ABIs
```bash
npm run build:contracts
npx ts-node scripts/exportAbis.ts
```

### 2. Run All Test Suites
```bash
# Smart Contract Unit & Integration Tests:
npm run test:contracts

# Decision Engine & 4 Novelty Unit Tests:
npm run test:decision
```

### 3. Start Local Anvil & Deploy Contracts
```bash
# Terminal 1: Start Anvil
anvil

# Terminal 2: Deploy & Seed
npm run deploy:local
npm run seed
```

### 4. Start API Server & Automated Keeper
```bash
# Terminal 3: Start REST API & Keeper
npm run dev:api
```

---

## 🌐 Complete REST API Reference (`http://localhost:4000`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server, Anvil network, contract & decision engine health |
| `GET` | `/strategy/:strategyId` | Strategy state & intended/actual allocation |
| `GET` | `/strategies/:owner` | Strategies owned by specified address |
| `GET` | `/market/:strategyId` | Telemetry & current market conditions |
| `GET` | `/score/:strategyId` | 0–100 score & weighted factor contributions |
| `GET` | `/fidelity/:strategyId` | DCA Fidelity breakdown & penalty parameters |
| `GET` | `/economic/:strategyId` | Economic benefit vs cost evaluation |
| `GET` | `/log/:strategyId` | Reverse chronological decision log |
| `GET` | `/metrics/:strategyId` | Capital efficiency metrics & benchmark score |
| `GET` | `/demo/state/:strategyId` | Aggregated live demo dashboard state |
| `GET` | `/audit` | Audit trail of all evaluated decision records |
| `POST` | `/evaluate/:strategyId` | Runs 12-step pipeline & submits on-chain tx |
| `POST` | `/demo/market-condition` | Sets scenario (`good`, `moderate`, `bad`, `forced`) |
| `POST` | `/demo/force-execution` | Triggers forced catch-up execution |

---

## ❄️ Frozen AI Decision JSON Schema

```json
{
  "strategyId": "1",
  "decision": "execute",
  "apiDecision": "execute",
  "score": 82,
  "executionPercentage": 100,
  "recommendedTranchePercentage": 100,
  "recommendedTrancheAmount": 500,
  "fidelity": 78,
  "delayCount": 2,
  "maxDelay": 5,
  "forced": false,
  "market": {
    "currentPrice": 94251.17,
    "twap": 94110,
    "priceDeviation": 0.15,
    "volatility": 15,
    "liquidity": 92,
    "slippage": 18,
    "priceImpact": 4,
    "urgency": 40
  },
  "scoreBreakdown": {
    "liquidity": 30,
    "slippage": 19.6,
    "volatility": 20,
    "yield": 8.1,
    "urgency": 4
  },
  "fidelityDetails": {
    "fidelity": 78,
    "delayPenalty": 10,
    "allocationDrift": 12,
    "missedExecutionPenalty": 0,
    "forced": false
  },
  "economicViability": {
    "benefit": 0.92,
    "cost": 2.1,
    "yieldBenefit": 0.52,
    "executionQualityBenefit": 0.4,
    "gasCost": 1.2,
    "slippageCost": 0.9,
    "delayJustified": false
  },
  "reasons": [
    { "factor": "yield", "label": "Productive Vault Yield", "contribution": 8 },
    { "factor": "slippage", "label": "Low Slippage", "contribution": -5 },
    { "factor": "urgency", "label": "Low Execution Pressure", "contribution": 4 }
  ],
  "timestamp": "2026-08-28T15:21:55.769Z",
  "execution": {
    "submitted": true,
    "txHash": "0x5c22bc64816c96294d9f8412b16a50fcab1982f4d4605b1d58efdf6f9be73024"
  }
}
```

---

## 🎨 Frontend Integration Guide

The Next.js frontend connects directly to:
- **REST API Base URL**: `http://localhost:4000`
- **Dashboard Unified Endpoint**: `GET http://localhost:4000/demo/state/1`
- **Contract ABIs**: Located in `abi/` (`DCAManager.json`, `VaultAdapter.json`, `ExecutionContract.json`, `YieldVault.json`)
- **Deployed Addresses**: Located in `deployments/localhost.json`
- **CORS Allowed Origin**: `http://localhost:3000`
