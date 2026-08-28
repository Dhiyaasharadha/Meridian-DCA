# Meridian DCA

> **Your DCA capital works while it waits.**

An autonomous, yield-optimized Dollar-Cost Averaging (DCA) engine powered by OpenZeppelin ERC-4626 Yield Vaults, Uniswap v4 Hooks, and an explainable, deterministic 12-step AI decision orchestration engine.

---

##  Problem

Traditional Dollar-Cost Averaging (DCA) protocols require users to deposit capital into idle wallet balances or static smart contracts where it waits for execution without earning return. Furthermore, traditional DCA engines execute on rigid time schedules regardless of market volatility, depth, or pool slippage, leading to significant value leakage during temporary price spikes and low-liquidity conditions.

##  Solution

**Meridian DCA** solves both inefficiencies:
1. **Capital Efficiency (ERC-4626 Yield Vault)**: Committed capital intended for future DCA tranches is deposited into an ERC-4626 yield vault, earning a continuous ~5.4% APY while waiting for execution.
2. **Market-Aware Execution (Uniswap v4 Hook + Decision Engine)**: Instead of executing blindly on schedule, Meridian DCA evaluates real-time market telemetry (TWAP, Volatility, Liquidity, Slippage, Execution Urgency). It dynamically scales tranche sizes, delays execution during adverse market spikes, or vetoes delays when waiting is economically non-viable.

---

##  System Architecture

```
                                  ┌───────────────────────────┐
                                  │       User Web App        │
                                  │   (Next.js / Wagmi / UI)  │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │      DCAManager.sol       │
                                  │  (Strategy State Registry)│
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
    ┌───────────────────────────┐                               ┌───────────────────────────┐
    │     VaultAdapter.sol      │                               │   ExecutionContract.sol   │
    │ (Exact Tranche Withdrawal)│                               │    (Atomic Transaction)   │
    └────────────┬──────────────┘                               └─────────────┬─────────────┘
                 │                                                            │
                 ▼                                                            ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐┌───────────────────────────┐
    │      YieldVault.sol       │   │  AI Decision Orchestrator ││        DCAHook.sol        │
    │   (ERC-4626 Yield APY)    │◄──┤  (12-Step Pipeline Engine)├┤    (Uniswap v4 Hook)      │
    └───────────────────────────┘   └────────────┬──────────────┘└───────────────────────────┘
                                                 │
                                                 ▼
                                    ┌───────────────────────────┐
                                    │    Decision Log & Audit   │
                                    │ (Explainable Factor Feed) │
                                    └───────────────────────────┘
```

---

##  The Four Novelty Features

1. **DCA Fidelity Engine (`fidelityEngine.ts`)**:
   Calculates a strategy health score ($0\text{--}100$) based on delay penalties, allocation drift, and missed execution cycles. If $\text{Fidelity} < 70$, execution is **FORCED** to prevent schedule starvation.
2. **Economic Viability Engine (`economicEngine.ts`)**:
   Evaluates $\text{Benefit} = \text{Yield} + \text{Quality}$ vs $\text{Cost} = \text{Gas} + \text{Slippage}$. If preliminary decision is `DELAY` but $\text{Benefit} \le \text{Cost}$, an **Economic Veto** overrides `DELAY` $\to$ `EXECUTE`.
3. **Explainable AI / Dynamic Reason Ranking (`explainability.ts`)**:
   Dynamically ranks factor contributions descending by absolute impact magnitude ($|C_i|$) and outputs the top 2–3 dominant drivers (*High Slippage*, *Low Liquidity Depth*, *High Volatility*).
4. **Forced Catch-Up Execution (`ExecutionContract.sol` & `DCAManager.isForced`)**:
   Hard contract guardrails force a 100% tranche execution when `delayCount >= maxDelay` or $\text{Fidelity} < 70$, preventing market timing or indefinite delays.

---

##  Technology Stack

- **Smart Contracts**: Solidity 0.8.24, Foundry, OpenZeppelin ERC-4626, Uniswap v4 Hook architecture
- **AI / Decision Engine**: TypeScript, Viem, Deterministic 12-Step Pipeline, Explainability Engine
- **REST API**: Node.js, Express, Viem Anvil Client, Automated Keeper Loop
- **Frontend UI**: Next.js 14, React, TypeScript, Tailwind CSS, Lucide-React, Recharts
- **Local Blockchain**: Anvil (Chain ID `31337`, `http://127.0.0.1:8545`)

---

##  Quick Start Guide (Local Anvil Setup)

### Prerequisites
- Node.js v20+ & npm
- Foundry (`forge` & `anvil`)

### Terminal 1: Local Anvil Node
```bash
anvil
```

### Terminal 2: Smart Contracts & Express REST API
```bash
cd backend
npm install
npm run deploy:local
npm run seed
npm run dev:api
```
*API running on `http://localhost:4000` (`GET /health` returns `status: "ok"`).*

### Terminal 3: Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend running on `http://localhost:3000`.*

---

##  3-Minute Live Demo Walkthrough

1. **Create Strategy (`/create`)**:
   Enter Target Asset `ETH`, Amount `$100`, Frequency `Weekly` (`60s`), Max Delays `3`, Slippage Cap `0.5%`. Submit real contract transaction to `DCAManager.sol` on Anvil.
2. **Productive Vault Yield (`/dashboard`)**:
   Capital enters `YieldVault.sol` earning continuous APY while waiting for optimal market conditions.
3. **GOOD MARKET**: Demo Simulator $\to$ `GOOD MARKET` $\to$ Score > 80 $\to$ **EXECUTE (100%)**.
4. **BAD MARKET & EXPLAINABILITY**: Demo Simulator $\to$ `BAD MARKET` $\to$ Score < 60 $\to$ **DELAY (0%)**. Decision Log displays ranked drivers (*High Slippage*, *Low Liquidity Depth*).
5. **MODERATE MARKET & ECONOMIC VETO**: Demo Simulator $\to$ `MODERATE MARKET` $\to$ **PARTIAL (60%)**. $600 executes, $400 stays productive in vault. Economic Veto overrides delay if cost > benefit.
6. **BOUNDED AUTONOMY & FORCED EXECUTION**: Demo Simulator $\to$ `MAX DELAY` ($3/3$ delays) $\to$ Contract rule forces **FORCED EXECUTION (100%)** despite bad score.
7. **METRICS (`/metrics`)**: Meridian DCA achieves **89/100** Capital Efficiency (+43.5% over static DCA).

---

##  Express REST API Reference (`http://localhost:4000`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server, Anvil network & contract deployment health |
| `GET` | `/strategy/:strategyId` | Strategy state & intended/actual allocation |
| `GET` | `/market/:strategyId` | Telemetry & current market conditions |
| `GET` | `/score/:strategyId` | 0–100 score & weighted factor contributions |
| `GET` | `/fidelity/:strategyId` | DCA Fidelity score breakdown |
| `GET` | `/economic/:strategyId` | Economic benefit vs cost evaluation |
| `GET` | `/log/:strategyId` | Reverse-chronological decision log |
| `GET` | `/metrics/:strategyId` | Capital efficiency metrics & benchmark score |
| `GET` | `/demo/state/:strategyId` | Aggregated live demo dashboard state |
| `GET` | `/audit` | In-memory raw decision audit trail |
| `POST` | `/evaluate/:strategyId` | Runs 12-step decision pipeline & submits on-chain tx |
| `POST` | `/demo/market-condition` | Sets scenario (`good`, `moderate`, `bad`, `forced`, `economic_veto`, `fidelity_low`) |
| `POST` | `/demo/force-execution` | Triggers forced catch-up execution |
| `POST` | `/demo/reset` | Resets demo state to initial GOOD MARKET |

---

##  Testing & DevSecOps

### Smart Contract Test Suite (`forge test -vv`)
```bash
cd backend
npm run test:contracts
```
- `VaultAdapterTest`: Verifies partial tranche withdrawal ($400 withdrawn from $1000 deposit leaves $600 in vault).
- `ExecutionContractTest`: Verifies atomic transaction rollback on swap failure.
- `YieldVaultTest`: Verifies ERC-4626 deposit, shares & 30-day APY yield accrual.
- `IntegrationTest`: End-to-end strategy lifecycle test (Execute $\to$ Partial $\to$ Delay $\to$ Forced).

### Decision Engine Unit Tests
```bash
cd backend
npm run test:decision
```

---

##  DevSecOps & Security Highlights

- **Zero Hardcoded Secrets**: Repository scrubbed of all private keys; `.env.example` configured with standard public Anvil test keys.
- **Reentrancy Protection**: State-changing contract functions enforce OpenZeppelin `ReentrancyGuard` (`nonReentrant`).
- **GitHub Actions CI**: Automated CI pipeline (`.github/workflows/ci.yml`) compiles and tests contracts, decision engine, and Next.js frontend on every push.

---

##  Documentation Reference

- [`docs/PROBLEM_STATEMENT_MAPPING.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/PROBLEM_STATEMENT_MAPPING.md): Compliance matrix for Problem Statement #12 requirements.
- [`docs/NOVELTY.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/NOVELTY.md): In-depth documentation of the 4 novelty engines.
- [`docs/SECURITY.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/SECURITY.md): DevSecOps security review report.
- [`docs/API.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/API.md): Detailed REST API reference.
- [`docs/CONTRACTS.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/CONTRACTS.md): Smart contract architecture documentation.
- [`docs/DEMO.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/DEMO.md): Presentation & recording guide.
- [`docs/TEAM.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/TEAM.md): Team roles and project structure.
- [`docs/EVALUATION_CHECKLIST.md`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/docs/EVALUATION_CHECKLIST.md): Final judging checklist.

---

## ⚠️ Disclaimer

*Yield values, market telemetry scores, and capital efficiency benchmarks displayed in demo simulator modes are for illustrative hackathon demonstration purposes on local Anvil testnet and do not represent guaranteed financial returns.*
