# Meridian DCA — The Four Mandatory Novelty Engines

This document provides technical documentation for the **Four Mandatory Novelty Features** built into Meridian DCA.

---

## 🌟 NOVELTY 1: DCA Fidelity Engine

### 🔍 Overview
Traditional market-timing bots often drift indefinitely from the user's intended schedule, creating severe allocation lag. The **DCA Fidelity Engine** calculates a health score (0–100) representing how strictly the strategy adheres to its scheduled schedule over time.

### 📐 Mathematical Formula
$$\text{Fidelity} = 100 - \text{delay\_penalty} - \text{allocation\_drift} - \text{missed\_execution\_penalty}$$

- $\text{delay\_penalty} = \text{consecutive\_delays} \times 5$
- $\text{allocation\_drift} = \left|\frac{\text{intended\_allocation} - \text{actual\_allocation}}{\text{intended\_allocation}}\right| \times 100$
- $\text{missed\_execution\_penalty} = \text{missed\_cycles} \times 10$

### 🔒 Guardrail 2 Rule
$$\text{If } \text{Fidelity} < 70 \implies \text{Decision} = \text{FORCED } (100\% \text{ Tranche})$$

### 📂 Technical Details
- **Implementation File**: [`backend/decision-engine/src/fidelityEngine.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/src/fidelityEngine.ts)
- **API Endpoint**: `GET /fidelity/:strategyId`
- **Frontend Component**: Bounded Autonomy & Fidelity progress cards on Dashboard (`/dashboard`)
- **Automated Test**: Unit test in [`backend/decision-engine/test/runDecisionTests.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/test/runDecisionTests.ts) (`calculateDCAFidelity`)

---

## 🌟 NOVELTY 2: Economic Viability Engine

### 🔍 Overview
Delaying a DCA execution is only rational if the economic benefit of waiting (accrued vault yield + lower entry price) exceeds the cost of waiting (gas cost + slippage). The **Economic Viability Engine** quantifies this tradeoff before permitting a delay.

### 📐 Mathematical Formula
$$\text{Benefit} = \text{yield\_earned\_while\_waiting} + \text{improved\_execution\_quality\_estimate}$$
$$\text{Cost} = \text{gas\_cost\_estimate} + \text{slippage\_cost\_estimate}$$

### ⚖️ Economic Veto Rule
$$\text{If Preliminary Decision} = \text{DELAY} \quad \text{AND} \quad \text{Benefit} \le \text{Cost} \implies \text{Override: DELAY} \to \text{EXECUTE } (60\% \text{ Tranche})$$

*If waiting costs more in gas/slippage than accrued yield, delaying is non-viable and the engine vetoes the delay.*

### 📂 Technical Details
- **Implementation File**: [`backend/decision-engine/src/economicEngine.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/src/economicEngine.ts)
- **API Endpoint**: `GET /economic/:strategyId`
- **Frontend Component**: Economic Viability Card on Dashboard & Metrics page
- **Automated Test**: Unit test in [`backend/decision-engine/test/runDecisionTests.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/test/runDecisionTests.ts) (`calculateEconomicViability`)

---

## 🌟 NOVELTY 3: Explainable AI / Dynamic Reason Ranking

### 🔍 Overview
Black-box AI models reduce user trust in financial applications. **Explainable AI** calculates the exact mathematical contribution of every market factor (`slippage`, `liquidity`, `volatility`, `yield`, `urgency`) and dynamically ranks the top 2–3 dominant drivers.

### 📐 Factor Ranking Logic
1. Calculate normalized factor impacts: $C_i = W_i \times (\text{Norm}_i - 100)$.
2. Sort contributions descending by absolute impact magnitude: $\text{Math.abs}(C_i)$.
3. Return top 2–3 factors dynamically.

### 💡 Example Output
```json
"reasons": [
  { "factor": "slippage", "label": "High Slippage", "contribution": -25 },
  { "factor": "liquidity", "label": "Low Liquidity Depth", "contribution": -21 },
  { "factor": "volatility", "label": "High Volatility", "contribution": -16 }
]
```

### 📂 Technical Details
- **Implementation File**: [`backend/decision-engine/src/explainability.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/src/explainability.ts)
- **API Endpoint**: `GET /log/:strategyId` (Decision Log)
- **Frontend Component**: `DecisionReason.tsx` & Decision Log Page (`/decisions`)
- **Automated Test**: Unit test in [`backend/decision-engine/test/runDecisionTests.ts`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/decision-engine/test/runDecisionTests.ts) (`calculateFactorContributions`)

---

## 🌟 NOVELTY 4: Forced Catch-Up Execution

### 🔍 Overview
To strictly enforce Bounded Autonomy and prevent market timing, the smart contract layer maintains a hard ceiling on allowable delays. When `delayCount >= maxDelay` or `Fidelity < 70`, the smart contract forces an execution regardless of market score.

### 📐 Smart Contract Rule
$$\text{If } \text{delayCount} \ge \text{maxDelay} \quad \text{or } \text{Fidelity} < 70 \implies \text{DCAManager.isForced()} = \text{true}$$

*When `isForced()` is true, `ExecutionContract.sol` overrides market scores and executes a 100% tranche.*

### 📂 Technical Details
- **Implementation File**: [`backend/contracts/src/DCAManager.sol`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/contracts/src/DCAManager.sol) & [`ExecutionContract.sol`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/contracts/src/ExecutionContract.sol)
- **API Endpoint**: `POST /demo/force-execution`
- **Frontend Component**: Bounded Autonomy progress indicator on Dashboard
- **Automated Test**: Integration test in [`backend/contracts/test/Integration.t.sol`](file:///C:/Users/saswin/.gemini/antigravity-ide/scratch/backend/contracts/test/Integration.t.sol) (`testFullIntegrationFlow`)
