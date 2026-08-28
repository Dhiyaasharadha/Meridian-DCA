# 🌐 Meridian DCA — Public Deployment Status & Verification Report

This document details the live Ethereum Sepolia contract addresses, transaction verification, cloud configuration, and operational status for **Meridian DCA**.

---

### 📊 Public Deployment Verification Scorecard

| Component | Status | Details |
|---|---|---|
| **Public Blockchain Network** | `Ethereum Sepolia` | Chain ID `11155111` |
| **Smart Contract Status** | `LIVE & VERIFIED` | All 10 contracts broadcast & bytecode verified on-chain |
| **Deployer Wallet** | `0x487273f6260BE0Bb718A07C1971a2105603138ab` | Total Paid: `0.007945 ETH` |
| **Backend REST API (Render)**| `CONFIGURED` | `render.yaml` blueprint ready with Sepolia environment variables |
| **Frontend Web App (Vercel)** | `CONFIGURED` | Next.js 14 production build ready (`frontend/.env.example`) |
| **Local Anvil Fallback** | `ACTIVE 100%` | Anvil Chain `31337` (`http://127.0.0.1:8545`) fully functional |

---

### 📜 Verified Live On-Chain Contract Addresses (Ethereum Sepolia - Chain ID 11155111)

| Contract | Verified Sepolia Address | Creation Tx Hash | Bytecode Size |
|---|---|---|---|
| **DCAManager** | [`0x4cbc684ee8d7bcc698ab66e9b6bbe55e9c19392d`](https://sepolia.etherscan.io/address/0x4cbc684ee8d7bcc698ab66e9b6bbe55e9c19392d) | `0x42e80f9b021821acb02d157434864edba70f3aad53b50b9e2be5739c61497130` | 8616 bytes |
| **ExecutionContract** | [`0x5eac8011895bbab365238300f95117e943aaea84`](https://sepolia.etherscan.io/address/0x5eac8011895bbab365238300f95117e943aaea84) | `0xab37d1dc0339a3f8d9f169de2fb15df81f119fce1a2dd5f158e7fe6f69f22ead` | 6984 bytes |
| **VaultAdapter** | [`0x2b634c2f6146ead29e582435114b41d0e95701af`](https://sepolia.etherscan.io/address/0x2b634c2f6146ead29e582435114b41d0e95701af) | `0x205d47e5669116e0cfb4e3a96acd39f126e214ca04baff32a7f2fcf93b3fc49b` | 6406 bytes |
| **YieldVault** | [`0x7ed8ab5514d1bebb190be6d16106e69120f921c4`](https://sepolia.etherscan.io/address/0x7ed8ab5514d1bebb190be6d16106e69120f921c4) | `0x89c2c9faa21ded6b378a57cf0f725e5c7357d4d4185c97090c79536dad873137` | 7712 bytes |
| **DCAHook** | [`0xe212b833551b4ce3979dc77a8994fd189dffc089`](https://sepolia.etherscan.io/address/0xe212b833551b4ce3979dc77a8994fd189dffc089) | `0x71388d08524660bbc1382df30e2ef41ff3f0cb996d98830f5146f714d4215161` | 2638 bytes |
| **MockMarketOracle** | [`0xcd6b1a9e5c6a92a61ee446bfc93d61e5e9acfd46`](https://sepolia.etherscan.io/address/0xcd6b1a9e5c6a92a61ee446bfc93d61e5e9acfd46) | `0x61d8b66d1b11e8e008c2a1789f3b662225b5fff511cbce3c7db63b4a671941a2` | 2604 bytes |
| **MockUSDC** | [`0xcf93a6e5b9e42019ebad8b3c7af8986b6ece210f`](https://sepolia.etherscan.io/address/0xcf93a6e5b9e42019ebad8b3c7af8986b6ece210f) | `0x89f47af522b9a39fb09ffafa0fe1338fa55402d44fa67fe517df5fa77e1ade6f` | 4172 bytes |
| **MockETH** | [`0x78e9c3739271079356ee5281d64201bf7e217af9`](https://sepolia.etherscan.io/address/0x78e9c3739271079356ee5281d64201bf7e217af9) | `0xb35c22a5f99037b1906303a66049bd3e2777aded15c267943916cabddb436e7b` | 4172 bytes |
| **MockBTC** | [`0xda248c0fd691513085162cc4b4508f3e71da1ff2`](https://sepolia.etherscan.io/address/0xda248c0fd691513085162cc4b4508f3e71da1ff2) | `0x86a71e0676b58658c4fd1c461db7d3d87633eeb2bdb434cd101474d1f4cc37ea` | 4172 bytes |
| **MockSOL** | [`0x39b6ea84bbe4af63b51f0886e285859c5e8a2a5b`](https://sepolia.etherscan.io/address/0x39b6ea84bbe4af63b51f0886e285859c5e8a2a5b) | `0x809a14dfd7f6370908f08dbabe8c00ec631c58fd0758d3e75276c66adad548c4` | 4172 bytes |

---

### 🔒 Security Audit Confirmation
- [x] Zero private keys committed to GitHub.
- [x] `.env` and `.env.local` included in `.gitignore`.
- [x] `backend/deployments/localhost.json` preserved for local development fallback.
