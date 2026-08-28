import { DecisionInputs, EconomicResult } from './types';

/**
 * NOVELTY 2: ECONOMIC VIABILITY ENGINE
 * Formula:
 * benefit = yield_earned_while_waiting + improved_execution_quality_estimate
 * cost = gas_cost_estimate + slippage_cost_estimate
 *
 * Decision:
 * if benefit > cost: delay can be economically justified
 * else: delay is NOT justified (Economic Veto -> override DELAY -> EXECUTE)
 */
export function calculateEconomicViability(inputs: DecisionInputs, trancheAmountUsd = 500): EconomicResult {
  // Weekly yield accrued in ERC-4626 vault at current APY
  const annualYield = (trancheAmountUsd * (inputs.yieldOpportunity || 5.4)) / 100;
  const yieldBenefit = Number((annualYield / 52).toFixed(2));

  // Execution quality benefit: waiting avoids high current slippage / volatility
  const executionQualityBenefit = inputs.volatility === 3 ? 3.50 : inputs.volatility === 2 ? 1.20 : 0.40;

  const benefit = Number((yieldBenefit + executionQualityBenefit).toFixed(2));

  const gasCost = 1.20;
  const slippageCost = Number((trancheAmountUsd * (inputs.slippage / 100)).toFixed(2));

  const cost = Number((gasCost + slippageCost).toFixed(2));

  const delayJustified = benefit > cost;

  return {
    benefit,
    cost,
    yieldBenefit,
    executionQualityBenefit,
    gasCost,
    slippageCost,
    delayJustified,
  };
}
