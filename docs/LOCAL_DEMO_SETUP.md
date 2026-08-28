# 🚀 Meridian DCA — Local Live Demo Setup Guide

This guide details the exact three-terminal startup procedure, MetaMask configuration, live demo sequence, and environment health checks for **Meridian DCA**.

---

### 🌐 System Summary & Connection Parameters

| Parameter | Value |
|---|---|
| **Frontend Web App** | [`http://localhost:3000`](http://localhost:3000) |
| **Backend REST API** | [`http://localhost:4000`](http://localhost:4000) |
| **Backend Health Endpoint** | [`http://localhost:4000/health`](http://localhost:4000/health) |
| **Local Anvil RPC** | `http://127.0.0.1:8545` |
| **Chain ID** | `31337` (`0x7A69` in hex) |
| **Native Currency Symbol** | `ETH` |

---

### 🖥️ Three-Terminal Startup Procedure

To run a complete, live local demo, open three separate terminal windows and execute the commands below:

#### ------------------------------------------------------------
#### TERMINAL 1 — Anvil Local Blockchain Node
#### ------------------------------------------------------------
```bash
anvil
```
> Starts local Ethereum blockchain on `http://127.0.0.1:8545` (Chain ID `31337`). Keep running continuously.

#### ------------------------------------------------------------
#### TERMINAL 2 — Deploy Contracts & Start Backend REST API
#### ------------------------------------------------------------
```bash
cd backend
npm run deploy:local
npm run seed
npm run dev:api
```
> Deploys all 6 smart contracts (`DCAManager`, `VaultAdapter`, `YieldVault`, `ExecutionContract`, `DCAHook`, `MockMarketOracle`), seeds initial demo data, and starts the Express REST API & AI Keeper on `http://localhost:4000`. Keep running continuously.

#### ------------------------------------------------------------
#### TERMINAL 3 — Start Next.js Frontend Web Application
#### ------------------------------------------------------------
```bash
cd frontend
npm run dev
```
> Starts the Next.js Web3 application on `http://localhost:3000`. Keep running continuously.

---

### 🦊 MetaMask Wallet Configuration

Add the local Anvil network to your browser wallet (MetaMask):
- **Network Name**: `Anvil Localhost`
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: `ETH`

*Note: You can import any pre-funded Anvil private key into MetaMask for instant testing (e.g. Account #0: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`).*

---

### 📊 Health Check Script

Before beginning a live demo or presentation, run the automated health check script:
```bash
node scripts/checkDemoEnvironment.js
```
This script verifies:
1. Anvil RPC connection on `http://127.0.0.1:8545` & block height.
2. Deployed bytecode on Anvil for all 6 smart contracts.
3. Backend REST API server health on `http://localhost:4000/health`.
4. Frontend Web App responsiveness on `http://localhost:3000`.

---

### 🎬 Step-by-Step Live Demo Presentation Flow (3 Minutes)

1. **Open Frontend**: Navigate to [`http://localhost:3000`](http://localhost:3000).
2. **Connect Wallet**: Click **Connect Wallet** $\to$ approve MetaMask connection to **Anvil Localhost (31337)**. Real address (`0x...`) appears in green.
3. **Create Strategy (`/create`)**:
   - Asset: `ETH`
   - Deposit Amount: `$100` USDC
   - Frequency: `Weekly` (`60 seconds`)
   - Max Delays: `3`
   - Max Slippage: `0.5%`
   - Click **Create Strategy** $\to$ approve in MetaMask $\to$ transaction mines on Anvil $\to$ decodes `StrategyCreated` event $\to$ redirects to `/dashboard?strategyId=<NEW_ID>`.
4. **Demonstrate ERC-4626 Vault Yield**: Show unused DCA capital earning ~5.4% APY in `YieldVault.sol`.
5. **Demonstrate 4 Novelty Features via Demo Simulator**:
   - **GOOD MARKET**: Select `GOOD MARKET → EXECUTE` in header dropdown $\to$ AI score 82/100 $\to$ 100% tranche execution.
   - **MODERATE MARKET**: Select `MODERATE MARKET → PARTIAL` $\to$ AI score 58/100 $\to$ 60% partial tranche execution.
   - **BAD MARKET**: Select `BAD MARKET → DELAY` $\to$ AI score 34/100 $\to$ execution delayed, delay count increments.
   - **ECONOMIC VETO**: Select `ECONOMIC VETO → EXECUTE` $\to$ Slippage cost exceeds delay benefit $\to$ Veto triggered.
   - **FIDELITY < 70**: Select `FIDELITY < 70 → FORCED` $\to$ Dynamic fidelity reduction forces execution to protect asset accumulation schedule.
   - **MAX DELAY**: Select `MAX DELAY → FORCED` $\to$ Bounded autonomy circuit forces 100% completion.
6. **Inspect Explainable AI Decision Log (`/decisions`)**: Show dynamic factor rankings and execution reasons.
7. **Inspect Capital Efficiency Metrics (`/metrics`)**: Show Recharts comparative graphs (+43.5% capital efficiency advantage over traditional DCA).

---

### 🔄 Fast Reset Procedure

If you need to reset the demo state completely during a live presentation:

1. **Restart Anvil** (Terminal 1): Press `Ctrl+C`, then run `anvil`.
2. **Re-deploy & Seed** (Terminal 2): Run `cd backend && npm run deploy:local && npm run seed && npm run dev:api`.
3. **Reset State via API**: Open [`http://localhost:4000/demo/reset`](http://localhost:4000/demo/reset) or click **Reset Demo** in the frontend header.

---

### 🛠️ Troubleshooting

- **MetaMask Transaction Pending**: Reset your MetaMask account nonce history via `Settings -> Advanced -> Clear activity tab data`.
- **Contract Bytecode Missing**: Ensure Terminal 1 (`anvil`) was started BEFORE running `npm run deploy:local` in Terminal 2.
- **Port 3000 / 4000 Busy**: Kill any hanging background node processes using `taskkill /F /IM node.exe` (Windows) or `pkill -f node` (Linux/Mac).
