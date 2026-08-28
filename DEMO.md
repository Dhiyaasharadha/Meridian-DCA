# MERIDIAN DCA — Live Demo & Presentation Master Guide

This document outlines the complete setup, execution commands, demo strategy inputs, 3-minute presentation timeline, and reset procedure for **MERIDIAN DCA**.

---

## ⚡ 1. Service Startup Sequence

To run the complete Meridian DCA application stack, open 3 terminal windows and execute the commands below in order:

### Terminal 1: Local Anvil Blockchain
```bash
# Start local Anvil node (Chain ID: 31337)
anvil
```
*Expected output*: Listening on `127.0.0.1:8545` with 10 funded accounts.

### Terminal 2: Smart Contract Deploy & Express REST API Server
```bash
cd backend
# Deploy contracts to Anvil, export ABIs & start API server + keeper
npm run deploy:local
npm run seed
npm run dev:api
```
*Expected output*:
- Express REST API running on `http://localhost:4000`
- `GET http://localhost:4000/health` returning `status: "ok"`
- Automated strategy keeper loop polling every 10 seconds

### Terminal 3: Next.js Frontend Application
```bash
cd frontend
npm run dev
```
*Expected output*: Next.js app running on `http://localhost:3000`.

---

## 📋 2. Demo Strategy Parameters

When demonstrating strategy creation on `http://localhost:3000/create`, enter the following exact values:

| Form Field | Value to Enter | Notes |
|---|---|---|
| **Target Asset** | `ETH` (Wrapped Ethereum) | Select from dropdown |
| **Strategy Amount** | `100` | Tranche amount in USD |
| **Frequency** | `Weekly` (`60 seconds`) | Fast cycle for demo |
| **Max Delay Cycles** | `3` | Maximum allowed delays |
| **Max Slippage Cap** | `0.5%` | Execution threshold |

*Transaction Execution*: Click **Create Strategy**. Real `DCAManager.createStrategy()` contract call is sent to Anvil → `StrategyCreated` event log is decoded → dynamic `strategyId` (e.g. `#1`) is set → automatically redirects to Dashboard.

---

## ⏱️ 3. 3-Minute Presentation Timeline

| Timestamp | Page / View | Demo Action & Focus | Presenter Key Point |
|---|---|---|---|
| **00:00 - 00:15** | Landing (`/`) | Hero section & value proposition | "Meridian DCA keeps committed DCA capital productive in yield vaults while waiting." |
| **00:15 - 00:40** | Create Strategy (`/create`) | Fill form (ETH, $100, 3 max delays) & Submit | "Notice the real Web3 transaction submitted to DCAManager.sol on Anvil." |
| **00:40 - 01:00** | Dashboard (`/dashboard`) | View strategy ID, Vault Balance & Yield | "Capital enters an ERC-4626 vault generating continuous ~5.4% APY." |
| **01:00 - 01:20** | Dashboard (`/dashboard`) | Demo Simulator: `GOOD MARKET → EXECUTE` | "Score > 80: Optimal conditions trigger full 100% tranche execution." |
| **01:20 - 01:40** | Dashboard (`/dashboard`) | Demo Simulator: `BAD MARKET → DELAY` | "Score < 60: Unfavorable market triggers DELAY. Capital stays in vault earning APY." |
| **01:40 - 02:00** | Decision Log (`/decisions`) | View ranked drivers for DELAY | "Explainable AI dynamically ranks top reasons: High Slippage & Low Liquidity." |
| **02:00 - 02:20** | Dashboard (`/dashboard`) | Demo Simulator: `MODERATE MARKET → PARTIAL` | "Score 60–80: PARTIAL (60%) execution. $600 swaps, $400 stays productive in vault." |
| **02:20 - 02:40** | Dashboard (`/dashboard`) | Demo Simulator: `ECONOMIC VETO → EXECUTE` | "Gas/Slippage cost exceeds yield benefit. Economic Veto overrides DELAY → EXECUTE." |
| **02:40 - 03:00** | Dashboard (`/dashboard`) | Demo Simulator: `FIDELITY < 70 → FORCED` | "Repeated delays lower DCA Fidelity. Fidelity < 70 forces execution." |
| **03:00 - 03:20** | Dashboard (`/dashboard`) | Demo Simulator: `MAX DELAY → FORCED` | "delayCount = 3/3: Hard contract rule overrides bad score and FORCES 100% execution." |
| **03:20 - 03:40** | Metrics (`/metrics`) | View Recharts bar chart comparison | "Meridian DCA achieves 89/100 efficiency score (+43.5% over static DCA)." |

---

## 🔄 4. Exact Demo Reset Procedure

If you need to reset the demo state between recording takes:

1. **Option A (Instant API Reset)**:
   Call `POST http://localhost:4000/demo/reset` or click the **Reset Demo** button in the top header.
   ```bash
   curl -X POST http://localhost:4000/demo/reset
   ```
2. **Option B (Complete Clean Reset)**:
   - Stop Anvil (`Ctrl+C` in Terminal 1) and restart (`anvil`).
   - Run `npm run deploy:local` and `npm run seed` in `backend`.
