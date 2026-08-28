import { DecisionInputs, NormalizedMarket } from './types';

/**
 * Normalization Module
 * Scales all market inputs to 0–100 scale:
 * - Liquidity: 3 = High (100), 2 = Med (70), 1 = Low (30)
 * - Slippage: Lower is better. 0% = 100, 0.5% = 40, >0.83% = 0
 * - Volatility: Lower is better. 1 = Low (100), 2 = Med (60), 3 = High (20)
 * - Yield: Higher is better. (yield / 10) * 100 capped at 100
 * - Urgency: Increases as delayCount approaches maxDelay: (delayCount / maxDelay) * 100
 */
export function normalizeMarketInputs(inputs: DecisionInputs): NormalizedMarket {
  // 1. Liquidity Depth (Higher = Better)
  const liquidityNorm = inputs.liquidity === 3 ? 100 : inputs.liquidity === 2 ? 70 : 30;

  // 2. Slippage (Lower = Better, normalized where 0% -> 100, 0.5% -> 40)
  const slippageNorm = Math.max(0, Math.min(100, 100 - (inputs.slippage / 0.5) * 60));

  // 3. Volatility (Lower = Better)
  const volatilityNorm = inputs.volatility === 1 ? 100 : inputs.volatility === 2 ? 60 : 20;

  // 4. Yield APY (Higher = Better)
  const yieldNorm = Math.min(100, Math.max(0, (inputs.yieldOpportunity / 10) * 100));

  // 5. Execution Urgency (Rises as delayCount approaches maxDelay)
  const delayProgress = inputs.maxDelay > 0 ? inputs.delayCount / inputs.maxDelay : 0;
  const urgencyNorm = Math.min(100, Math.max(0, Math.round(delayProgress * 100)));

  return {
    liquidityNorm,
    slippageNorm,
    volatilityNorm,
    yieldNorm,
    urgencyNorm,
  };
}
