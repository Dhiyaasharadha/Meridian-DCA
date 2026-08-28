import { getMarketTelemetry } from './marketService';
import { calculateMarketScore } from '../../../decision-engine/src/marketScore';
import { calculateDCAFidelity } from '../../../decision-engine/src/fidelityEngine';
import { calculateEconomicViability } from '../../../decision-engine/src/economicEngine';
import { calculateFactorContributions } from '../../../decision-engine/src/explainability';
import { executeStrategyOnChain, delayStrategyOnChain } from './blockchainService';
import { DecisionJSON, AuditRecord } from '../types/schemas';
import { addDecisionLog } from './strategyService';

// In-memory audit record storage for audit trail endpoint
const auditRecordStore: AuditRecord[] = [];

export function getAuditRecords(): AuditRecord[] {
  return auditRecordStore;
}

export async function evaluateStrategy(strategyId: string | number = 1, autoExecute = true): Promise<DecisionJSON> {
  const sId = String(strategyId);

  // Demo strategy state
  const strategy = {
    strategyId: sId,
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    asset: 'USDC',
    targetAsset: 'BTC',
    amount: 2500,
    frequency: 604800,
    maxDelay: 5,
    maxSlippage: 0.5,
    delayCount: 2,
    totalInvested: 2500,
    totalExecuted: 1000,
    intendedAllocation: 2500,
    actualAllocation: 1000,
    active: true,
  };

  // STEP 3: Read market data
  const { inputs, data: marketData } = getMarketTelemetry(strategyId, strategy.delayCount, strategy.maxDelay);

  // STEP 4 & 5: Normalize market inputs and calculate Market Score
  const { score, normalized } = calculateMarketScore(inputs);

  // STEP 6: Calculate DCA Fidelity
  const fidelityDetails = calculateDCAFidelity({
    ...inputs,
    intendedAllocation: strategy.intendedAllocation,
    actualAllocation: strategy.actualAllocation,
  });

  // STEP 7: Calculate Economic Viability
  const economicViability = calculateEconomicViability(inputs, 500);

  // STEP 8: Preliminary decision from Market Score
  let preliminaryDecision: 'execute' | 'partial' | 'delay' = 'execute';
  let recommendedTranchePct = 100;

  if (score > 80) {
    preliminaryDecision = 'execute';
    recommendedTranchePct = 100;
  } else if (score >= 60) {
    preliminaryDecision = 'partial';
    recommendedTranchePct = 60;
  } else {
    preliminaryDecision = 'delay';
    recommendedTranchePct = 0;
  }

  let decision: 'execute' | 'partial' | 'delay' | 'forced' = preliminaryDecision;
  let vetoApplied = false;

  // STEP 9: Economic Veto
  if (preliminaryDecision === 'delay' && !economicViability.delayJustified) {
    decision = 'execute';
    recommendedTranchePct = 60;
    vetoApplied = true;
  }

  let forced = false;

  // STEP 10: Fidelity Guardrail (fidelity < 70)
  if (fidelityDetails.forced) {
    decision = 'forced';
    recommendedTranchePct = 100;
    forced = true;
  }

  // STEP 11: MaxDelay Guardrail (delayCount >= maxDelay)
  if (strategy.delayCount >= strategy.maxDelay) {
    decision = 'forced';
    recommendedTranchePct = 100;
    forced = true;
  }

  // STEP 12: Determine tranche amount
  const baseTrancheUsd = 500;
  const recommendedTrancheAmount = (baseTrancheUsd * recommendedTranchePct) / 100;

  // STEP 10 (Explainability): Dynamic reason ranking
  const factorContributions = calculateFactorContributions(inputs);
  const topReasons = factorContributions.slice(0, 3);

  // Blockchain Execution
  let txHash: string | null = null;
  let submitted = false;

  if (autoExecute) {
    if (decision === 'execute' || decision === 'partial' || decision === 'forced') {
      txHash = await executeStrategyOnChain(sId, recommendedTranchePct);
      submitted = true;
    } else if (decision === 'delay') {
      txHash = await delayStrategyOnChain(sId, topReasons[0]?.label || 'Delayed due to market conditions');
      submitted = true;
    }
  }

  const scoreBreakdown = {
    liquidity: Number((0.30 * normalized.liquidityNorm).toFixed(1)),
    slippage: Number((0.25 * normalized.slippageNorm).toFixed(1)),
    volatility: Number((0.20 * normalized.volatilityNorm).toFixed(1)),
    yield: Number((0.15 * normalized.yieldNorm).toFixed(1)),
    urgency: Number((0.10 * normalized.urgencyNorm).toFixed(1)),
  };

  const decisionJSON: DecisionJSON = {
    strategyId: sId,
    decision,
    score,
    executionPercentage: recommendedTranchePct,
    recommendedTranchePercentage: recommendedTranchePct,
    recommendedTrancheAmount,
    fidelity: fidelityDetails.fidelity,
    delayCount: strategy.delayCount,
    maxDelay: strategy.maxDelay,
    forced,
    market: marketData,
    scoreBreakdown,
    fidelityDetails: {
      fidelity: fidelityDetails.fidelity,
      delayPenalty: fidelityDetails.delayPenalty,
      allocationDrift: fidelityDetails.allocationDrift,
      missedExecutionPenalty: fidelityDetails.missedExecutionPenalty,
      forced: fidelityDetails.forced,
    },
    economicViability,
    reasons: topReasons,
    timestamp: new Date().toISOString(),
    execution: {
      submitted,
      txHash,
    },
  };

  const auditRecord: AuditRecord = {
    ...decisionJSON,
    rawInputs: inputs,
    normalizedInputs: normalized,
    preliminaryDecision,
    vetoApplied,
    finalDecision: decision,
  };

  auditRecordStore.unshift(auditRecord);

  // Log in decision log store
  addDecisionLog(sId, {
    id: 'log-' + Date.now(),
    strategyId: sId,
    timestamp: decisionJSON.timestamp,
    decision,
    score,
    executionPercentage: recommendedTranchePct,
    delayCount: strategy.delayCount,
    reasons: topReasons as any,
    tranche: recommendedTranchePct,
    marketState: {
      currentPrice: marketData.currentPrice,
      twapPrice: marketData.twap,
      priceDeviation: marketData.priceDeviation,
      volatility: inputs.volatility === 1 ? 'Low' : inputs.volatility === 2 ? 'Medium' : 'High',
      liquidityDepth: inputs.liquidity === 3 ? 'High' : inputs.liquidity === 2 ? 'Medium' : 'Low',
      slippage: inputs.slippage,
      executionUrgency: inputs.executionUrgency === 1 ? 'Low' : inputs.executionUrgency === 2 ? 'Normal' : 'High',
    },
  });

  console.log(`[YieldGuard AI Orchestrator] Strategy #${sId} | Score: ${score}/100 | Fidelity: ${fidelityDetails.fidelity}/100 | Decision: ${decision.toUpperCase()} (${recommendedTranchePct}%) | txHash: ${txHash}`);

  return decisionJSON;
}
