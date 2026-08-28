# ⚡ Meridian DCA — Quick Start Live Demo Guide

Follow these 7 steps to launch and present the **Meridian DCA** live hackathon demo.

---

### 🚀 Quick Start (Three Terminals)

#### 1️⃣ Terminal 1 — Start Anvil Blockchain
```bash
anvil
```
> Starts local Ethereum chain at `http://127.0.0.1:8545` (Chain ID `31337`).

#### 2️⃣ Terminal 2 — Deploy Contracts & Start Backend API
```bash
cd backend
npm run deploy:local
npm run seed
npm run dev:api
```
> Deploys all 6 smart contracts, seeds demo state, and starts Express API on `http://localhost:4000`.

#### 3️⃣ Terminal 3 — Start Frontend Web Application
```bash
cd frontend
npm run dev
```
> Starts Next.js 14 web application on `http://localhost:3000`.

---

### 🦊 Browser & MetaMask Setup

4. Open **[`http://localhost:3000`](http://localhost:3000)** in your Web3 browser.
5. Click **Connect Wallet** in the top header to link MetaMask to **Anvil Localhost (31337)**.

---

### 🎬 Live Demo Walkthrough (3 Minutes)

6. **Create Strategy (`/create`)**:
   - Asset: `ETH`
   - Deposit: `$100` USDC
   - Frequency: `Weekly` (`60 seconds`)
   - Max Delay: `3` | Max Slippage: `0.5%`
   - Sign transaction in MetaMask $\to$ redirects to `/dashboard?strategyId=<NEW_ID>`.

7. **Test AI Demo Scenarios (Header Dropdown)**:
   - `GOOD MARKET` $\to$ **EXECUTE (100%)**
   - `BAD MARKET` $\to$ **DELAY (0%)** (Inspect `/decisions` for Explainable AI factor rankings)
   - `MODERATE MARKET` $\to$ **PARTIAL (60%)**
   - `ECONOMIC VETO` $\to$ **EXECUTE** (Override high slippage when delay cost exceeds benefit)
   - `FIDELITY < 70` $\to$ **FORCED (100%)** (Protect accumulation schedule)
   - `MAX DELAY` $\to$ **FORCED (100%)** (Bounded autonomy circuit limit reached)
   - View capital efficiency comparison on `/metrics` (+43.5% performance advantage).

---

### 🔄 Fast Demo Reset
If you need to reset the demo state between presentations:
```bash
# Restart Anvil (Terminal 1) -> Ctrl+C -> anvil
# Re-deploy (Terminal 2)    -> cd backend && npm run deploy:local && npm run seed && npm run dev:api
```
Or click **Reset Demo** in the header dropdown.
