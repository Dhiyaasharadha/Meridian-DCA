import { DecisionInputs } from './types';

/**
 * Economic Tradeoff Evaluator
 * Compares expected yield from waiting vs total execution costs (fees + slippage + impact)
 */
export function evaluateMarketTradeoff(inputs: DecisionInputs, trancheAmountUsd = 500): {
  waitingValueUsd: number;
  executionCostUsd: number;
  waitingIsFavorable: boolean;
} {
  // Expected yield from waiting 1 DCA frequency period (e.g. 7 days at 5.4% APY)
  const annualYield = (trancheAmountUsd * (inputs.yieldOpportunity || 5.4)) / 100;
  const waitingValueUsd = Number(((annualYield / 52)).toFixed(2)); // weekly yield

  // Execution cost = swap fee (0.05%) + slippage + price impact
  const swapFeeUsd = (trancheAmountUsd * 0.0005);
  const slippageUsd = (trancheAmountUsd * (inputs.slippage / 100));
  const impactUsd = (trancheAmountUsd * (inputs.priceImpact / 100));
  const gasUsd = 1.20; // estimated gas cost on L2 / local

  const executionCostUsd = Number((swapFeeUsd + slippageUsd + impactUsd + gasUsd).toFixed(2));

  const waitingIsFavorable = waitingValueUsd > executionCostUsd || inputs.volatility === 3;

  return {
    waitingValueUsd,
    executionCostUsd,
    waitingIsFavorable,
  };
}
