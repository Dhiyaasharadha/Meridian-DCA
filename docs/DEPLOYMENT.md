# 🌐 Meridian DCA — Public Deployment Guide (Vercel & Render)

This guide provides instructions for deploying **Meridian DCA** to public cloud infrastructure (**Vercel** for Frontend, **Render** for Backend API) while keeping the local Anvil development fallback 100% operational.

---

### 🌐 System Architecture & Environment Modes

```
                       LOCAL DEVELOPMENT MODE
  +---------------------------------------------------------------+
  |  Frontend: http://localhost:3000                              |
  |  Backend:  http://localhost:4000                              |
  |  Anvil:    http://127.0.0.1:8545 (Chain ID 31337)            |
  +---------------------------------------------------------------+

                       PUBLIC CLOUD PRODUCTION MODE
  +---------------------------------------------------------------+
  |  Frontend: https://meridian-dca.vercel.app (Vercel)           |
  |  Backend:  https://meridian-dca-api.onrender.com (Render)     |
  |  RPC:      Configurable Public RPC / Testnet                  |
  +---------------------------------------------------------------+
```

---

### 1️⃣ Frontend Deployment — Vercel

#### Step-by-Step Vercel Setup:
1. Log in to [Vercel](https://vercel.com) and click **Add New -> Project**.
2. Connect your GitHub repository (`Dhiyaasharadha/Meridian-DCA`).
3. Set **Root Directory** to `frontend`.
4. Configure **Environment Variables**:
   - `NEXT_PUBLIC_DECISION_API_URL` = `https://meridian-dca-api.onrender.com` (Your Render API URL)
   - `NEXT_PUBLIC_RPC_URL` = `http://127.0.0.1:8545` (or public testnet RPC)
   - `NEXT_PUBLIC_CHAIN_ID` = `31337` (or public testnet Chain ID)
5. Click **Deploy**.
6. Copy your deployed Vercel production URL (e.g. `https://meridian-dca.vercel.app`).

---

### 2️⃣ Backend REST API Deployment — Render

#### Option A: Automatic Blueprint Deployment (`render.yaml`)
1. Log in to [Render](https://render.com) and click **New -> Blueprint**.
2. Connect your GitHub repository (`Dhiyaasharadha/Meridian-DCA`).
3. Render will auto-detect `render.yaml` and configure:
   - Service Name: `meridian-dca-api`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Health Path: `/health`
4. Set the `FRONTEND_ORIGIN` environment variable to your Vercel URL (`https://meridian-dca.vercel.app`).
5. Click **Apply**.

#### Option B: Manual Web Service Setup
1. Click **New -> Web Service**.
2. Select repository: `Dhiyaasharadha/Meridian-DCA`.
3. Root Directory: `backend`.
4. Build Command: `npm install && npm run build`.
5. Start Command: `npm run start`.
6. Add Environment Variables:
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
   - `CHAIN_ID` = `31337`
   - `RPC_URL` = `http://127.0.0.1:8545`
   - `FRONTEND_ORIGIN` = `https://meridian-dca.vercel.app`
   - `DCA_MANAGER_ADDRESS` = `0x5FbDB2315678afecb367f032d93F642f64180aa3`
   - `VAULT_ADAPTER_ADDRESS` = `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
   - `YIELD_VAULT_ADDRESS` = `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
   - `EXECUTION_CONTRACT_ADDRESS` = `0x9A676e781A523b5d0C0e43731313A708CB607508`
   - `DCA_HOOK_ADDRESS` = `0xCf7Ed3AccA5a467e9e75457215744945220f6844`
   - `MARKET_ORACLE_ADDRESS` = `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`

---

### 3️⃣ Verification & Health Checks

Once deployed, verify your public API endpoint:
```bash
curl https://meridian-dca-api.onrender.com/health
```
Expected JSON Response:
```json
{
  "status": "ok",
  "service": "Meridian DCA API",
  "version": "1.0.0",
  "network": "production",
  "chainId": 31337,
  "contracts": {
    "dcaManager": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "vaultAdapter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  }
}
```

---

### 🔒 Security Best Practices
- Never commit private keys, secret tokens, or `.env` files to Git.
- Always use environment variables in Render and Vercel dashboards.
- Ensure CORS in `server.ts` is restricted to `FRONTEND_ORIGIN` in production.
