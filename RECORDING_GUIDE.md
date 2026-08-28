# MERIDIAN DCA — Step-by-Step Screen Recording Guide

This guide gives the exact screen recording instructions, browser navigation steps, mouse click targets, pause points, and visual highlights for producing a crisp 3–4 minute hackathon demo video.

---

## 📽️ 1. Recording Setup & Screen Layout

- **Resolution**: 1920 x 1080 (1080p, 16:9 aspect ratio).
- **Browser Window**: Chrome / Brave set to 100% zoom level.
- **Wallet Extension**: MetaMask / Coinbase Wallet connected to **Anvil Localnet** (`http://127.0.0.1:8545`, Chain ID `31337`).
- **Hidden Items**: Hide browser bookmark bar, extension icons (except wallet), and system taskbar.

---

## 🎬 2. Step-by-Step Recording Actions

### STEP 1: Landing Page Overview (00:00 - 00:15)
- Open `http://localhost:3000`.
- Mouse smooth scroll down slightly to feature grid, then back to header.
- Click **Launch App** or **Create Strategy** button in navigation bar.

### STEP 2: Real Strategy Creation (00:15 - 00:40)
- Page URL: `http://localhost:3000/create`.
- **Target Asset**: Select `ETH — Wrapped Ethereum`.
- **Strategy Tranche Amount**: Type `100`.
- **Frequency**: Click `Weekly` button.
- **Max Delay Cycles**: Ensure `3` is entered.
- **Max Slippage Cap**: Ensure `0.5%` is entered.
- Click **Create Strategy** button.
- *Visual Pause (3 sec)*: Wallet prompt appears → click **Confirm** in wallet → Toast notification appears `"Submitting DCAManager.createStrategy..."` → Redirects to `/dashboard`.

### STEP 3: Dashboard & Vault Yield Accrual (00:40 - 01:00)
- Page URL: `http://localhost:3000/dashboard`.
- *Visual Pause (2 sec)*: Highlight **Strategy ID #1** banner.
- Hover mouse over **Vault Balance** (`$2,510.42`) and **Yield Earned** (`$10.42 / +0.42%`). Point out that capital is actively earning yield in the ERC-4626 vault.

### STEP 4: Good Market Execution (01:00 - 01:20)
- Click **Demo Simulator** dropdown in top header bar.
- Select `GOOD MARKET → EXECUTE`.
- *Visual Pause (2 sec)*: Point mouse to **Decision Badge: EXECUTE** (Green) and **Execution Score: 82/100**.
- Point to **Recommended Tranche: 100%**.

### STEP 5: Bad Market Delay & Dynamic Reasons (01:20 - 01:40)
- Click **Demo Simulator** dropdown → Select `BAD MARKET → DELAY`.
- *Visual Pause (2 sec)*: Point mouse to **Decision Badge: DELAY** (Amber) and **Execution Score: 34/100**.
- Highlight **Primary Execution Reason**: *High Slippage*, *Low Liquidity Depth*, *High Volatility*.

### STEP 6: Explainable Decision Log (01:40 - 02:00)
- Click **View Decision Log** in sidebar or dashboard header link.
- Page URL: `http://localhost:3000/decisions`.
- Click on the top decision log row to expand the factor contribution breakdown.
- Point to ranked drivers (*High Slippage -25pt*, *Low Liquidity -21pt*, *High Volatility -16pt*).

### STEP 7: Moderate Market Partial Execution (02:00 - 02:20)
- Navigate back to `/dashboard`.
- Click **Demo Simulator** dropdown → Select `MODERATE MARKET → PARTIAL`.
- *Visual Pause (2 sec)*: Point mouse to **Decision Badge: PARTIAL** (Blue) and **Recommended Tranche: 60%**.
- Point out that only $600 swaps while $400 remains productive in the yield vault.

### STEP 8: Economic Veto (02:20 - 02:40)
- Select `ECONOMIC VETO → EXECUTE` in Demo Simulator.
- Point to Economic Viability card showing Benefit ($3.51) <= Cost ($8.70), demonstrating that waiting has no economic benefit so execution is forced.

### STEP 9: Fidelity & Max Delay Forced Catch-Up (02:40 - 03:20)
- Select `FIDELITY < 70 → FORCED`. Point out Fidelity score = 42/100 triggering forced execution.
- Select `MAX DELAY → FORCED`.
- *Visual Pause (3 sec)*: Point to **Bounded Autonomy Bar: 3 / 3 delays reached**.
- Point to **Decision Badge: FORCED** (Red/Dark Green). Highlight reason: *"Maximum delay reached — strategy constraint requires execution."*

### STEP 10: Capital Efficiency Metrics (03:20 - 03:40)
- Click **Capital Efficiency** in sidebar.
- Page URL: `http://localhost:3000/metrics`.
- Hover mouse over **Traditional Static DCA (62/100)** vs **Meridian DCA (89/100)** card.
- Highlight the Recharts performance breakdown bar chart and end video.
