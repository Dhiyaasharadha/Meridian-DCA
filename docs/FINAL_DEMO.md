# 🎬 Meridian DCA — Final Demo Script & Presenter Guide

This document contains the step-by-step 3-minute presenter voiceover script, scenario control instructions, and reset procedures for the final live hackathon demo of **Meridian DCA**.

---

### ⏱️ 3-Minute Presenter Voiceover Script

| Time | Action | Presenter Voiceover |
|---|---|---|
| **00:00 - 00:15** | Open [`http://localhost:3000`](http://localhost:3000) | *"Welcome to Meridian DCA, the yield-aware, market-adaptive DCA execution engine powered by ERC-4626 vaults and Uniswap v4 Hooks. Your DCA capital works while it waits."* |
| **00:15 - 00:30** | Click **Connect Wallet** in header | *"We connect our Web3 browser wallet (MetaMask) directly to our local Anvil blockchain node on Chain ID 31337."* |
| **00:30 - 00:50** | Open `/create`, submit ETH $100 strategy | *"We create a new DCA strategy: $100 USDC into Wrapped ETH, weekly frequency (60s), 3 max delay cycles, and 0.5% max slippage cap. We confirm in MetaMask, and the transaction is mined on-chain, emitting `StrategyCreated` event #2."* |
| **00:50 - 01:15** | Dashboard opens (`/dashboard?strategyId=2`) | *"Our strategy is live! While waiting for the execution block, our $100 uncommitted capital enters the ERC-4626 Yield Vault, earning 5.4% APY until swap execution."* |
| **01:15 - 01:45** | Select **GOOD MARKET → EXECUTE** | *"In optimal market conditions, the AI engine scores execution at 82/100, executing a 100% tranche swap through Uniswap v4."* |
| **01:45 - 02:15** | Select **BAD MARKET → DELAY** & open `/decisions` | *"When high slippage or volatility is detected, the AI delays execution to protect capital. The Explainable AI Engine ranks exact reasons: 'High Slippage (1.2% > 0.5% cap)', 'Low Liquidity Depth'."* |
| **02:15 - 02:45** | Select **MODERATE MARKET → PARTIAL** | *"In moderate conditions, the engine executes a partial tranche (60%), accumulating assets while keeping 40% capital yield-bearing in the vault."* |
| **02:45 - 03:15** | Select **FIDELITY < 70** & **MAX DELAY → FORCED** | *"To prevent indefinite delays, Bounded Autonomy enforces completion. When delay limits or dynamic fidelity thresholds are reached, the Uniswap v4 Hook forces 100% execution."* |
| **03:15 - 03:30** | Open `/metrics` | *"Overall, Meridian DCA delivers a +43.5% capital efficiency advantage over traditional DCA. Thank you!"* |

---

### 🖥️ Startup Commands

```bash
# Terminal 1: Anvil Blockchain Node
anvil

# Terminal 2: Contract Deployment & Backend API
cd backend
npm run deploy:local
npm run seed
npm run dev:api

# Terminal 3: Next.js Frontend Web App
cd frontend
npm run dev
```

---

### 🔄 Fast Reset Procedure

1. Restart Anvil in Terminal 1 (`Ctrl+C`, then `anvil`).
2. Re-deploy contracts in Terminal 2 (`cd backend && npm run deploy:local && npm run seed && npm run dev:api`).
3. Click **Reset Demo** in the frontend header.
