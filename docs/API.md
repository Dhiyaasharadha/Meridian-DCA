# Meridian DCA — REST API Reference Documentation

**Base Server URL**: `http://localhost:4000`  
**Content-Type**: `application/json`  

---

## 🌐 Endpoint Summary

### 1. `GET /health`
- **Description**: Returns system health status, network connection, block number, and deployed contract health flags.
- **Response Example**:
```json
{
  "status": "ok",
  "network": "anvil",
  "chainId": 31337,
  "blockNumber": "1",
  "api": true,
  "contracts": {
    "dcaManager": true,
    "vaultAdapter": true,
    "executionContract": true,
    "hook": true,
    "oracle": true
  },
  "decisionEngine": true
}
```

---

### 2. `GET /strategy/:strategyId`
- **Description**: Retrieves on-chain strategy details, parameters, and current delay status for a given strategy ID.

---

### 3. `GET /market/:strategyId`
- **Description**: Returns live market telemetry inputs (Spot Price, TWAP, Price Deviation %, Volatility, Liquidity, Slippage, Price Impact, Urgency).

---

### 4. `GET /score/:strategyId`
- **Description**: Returns 0–100 Market Score and normalized factor weights.

---

### 5. `GET /fidelity/:strategyId`
- **Description**: Returns DCA Fidelity score breakdown, delay penalty, allocation drift, and Guardrail 2 status.

---

### 6. `GET /economic/:strategyId`
- **Description**: Returns Economic Viability benefit vs cost evaluation.

---

### 7. `GET /log/:strategyId`
- **Description**: Returns reverse-chronological array of past decision records with dynamic ranked reasons and transaction hashes.

---

### 8. `GET /metrics/:strategyId`
- **Description**: Returns quantitative capital efficiency metrics ($ Yield Generated, $ Slippage Saved, $ Liquidity Advantage, $ Execution Cost) and score benchmarks.

---

### 9. `GET /demo/state/:strategyId`
- **Description**: Unified aggregated dashboard state object for frontend rendering in a single API call.

---

### 10. `GET /audit`
- **Description**: Returns complete raw decision audit records stored in memory for post-execution explainability auditing.

---

### 11. `POST /evaluate/:strategyId`
- **Description**: Evaluates the 12-step decision pipeline for the specified strategy ID, produces frozen decision JSON, and optionally submits an on-chain transaction.

---

### 12. `POST /demo/market-condition`
- **Description**: Sets demo scenario mode (`good`, `moderate`, `bad`, `forced`, `economic_veto`, `fidelity_low`).
- **Request Body**:
```json
{
  "scenario": "bad",
  "strategyId": "1"
}
```

---

### 13. `POST /demo/force-execution`
- **Description**: Triggers immediate forced catch-up execution override.

---

### 14. `POST /demo/reset`
- **Description**: Resets demo state and clears decision log for a strategy ID.
