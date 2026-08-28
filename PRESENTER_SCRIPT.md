# MERIDIAN DCA — 3-Minute Presenter Voiceover Script

This script provides the exact spoken voiceover for the 3-minute hackathon demo video. It aligns second-by-second with the video recording guide.

---

## 🎙️ Spoken Script

### 00:00 - 00:15 | Introduction & Core Problem
> *"Traditional Dollar-Cost Averaging forces future DCA capital to sit completely idle in a wallet while waiting for execution. When market conditions spike in volatility or liquidity drops, static schedules execute blindly into high slippage. Welcome to **Meridian DCA** — a yield-optimized DCA engine built with Uniswap v4 Hooks."*

### 00:15 - 00:40 | Real Strategy Creation & On-Chain Deposit
> *"Let's create a strategy. We select Wrapped Ethereum, deposit a committed capital tranche of $100, set a 60-second execution frequency, 3 maximum delay cycles, and a 0.5% slippage cap. When we submit, a real smart contract transaction executes on DCAManager.sol via local Anvil. Our strategy ID is assigned dynamically on-chain."*

### 00:40 - 01:00 | Productive Vault Yield
> *"Now on the dashboard, notice that our capital doesn't wait idly. Unused strategy capital is deposited into an ERC-4626 yield vault, earning a continuous 5.4% APY while waiting for optimal market conditions."*

### 01:00 - 01:20 | Good Market Full Execution
> *"Under favorable market conditions — low volatility, high liquidity depth, and minimal slippage — our 12-step decision engine computes an execution score above 80. The Uniswap v4 Hook executes the full 100% tranche."*

### 01:20 - 02:00 | Bad Market Delay & Dynamic Explainability
> *"When market volatility spikes or liquidity thins, the score drops below 60. Meridian DCA automatically **DELAYS** execution. Opening the Decision Log shows our Explainable AI layer in action: it dynamically ranks the exact drivers — High Slippage, Low Liquidity, and Volatility."*

### 02:00 - 02:40 | Partial Execution & Economic Veto
> *"In moderate conditions, the engine calculates a **PARTIAL** 60% tranche execution. Only $600 swaps on Uniswap v4 while the remaining $400 stays productive in the yield vault. Furthermore, if waiting costs more in gas and slippage than vault yield accrued, our Economic Veto overrides DELAY to execute."*

### 02:40 - 03:20 | Bounded Autonomy & Forced Catch-Up Execution
> *"To prevent market timing or indefinite delays, Meridian DCA enforces strict Bounded Autonomy guardrails. If DCA Fidelity drops below 70, or if maximum delay cycles reach 3 out of 3, the engine overrides market scores and **FORCES 100% EXECUTION**."*

### 03:20 - 03:40 | Performance Metrics & Summary
> *"On the Metrics page, we see the quantitative impact: Meridian DCA achieves an 89 out of 100 capital efficiency score — a +43.5% advantage over static DCA engines. Thank you!"*
