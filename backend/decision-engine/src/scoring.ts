import { DecisionInputs } from './types';

/**
 * 0–100 Execution Scoring Model
 * Weights:
 * - Price Deviation: 20%
 * - Volatility: 20%
 * - Liquidity: 15%
 * - Slippage: 15%
 * - Price Impact: 10%
 * - Urgency: 10%
 * - Yield Opportunity: 10%
 */
export function calculateExecutionScore(inputs: DecisionInputs): { score: number; factorScores: Record<string, number> } {
  // 1. Price Deviation Score (20%): Lower deviation from TWAP is better
  const absDev = Math.abs(inputs.priceDeviation);
  const devScore = Math.max(0, Math.min(100, 100 - absDev * 30));

  // 2. Volatility Score (20%): 1 = Low (100), 2 = Med (60), 3 = High (20)
  const volScore = inputs.volatility === 1 ? 100 : inputs.volatility === 2 ? 60 : 20;

  // 3. Liquidity Depth Score (15%): 3 = High (100), 2 = Med (70), 1 = Low (30)
  const liqScore = inputs.liquidity === 3 ? 100 : inputs.liquidity === 2 ? 70 : 30;

  // 4. Slippage Score (15%): Slippage vs 0.5% max limit
  const slipScore = Math.max(0, Math.min(100, 100 - (inputs.slippage / 0.5) * 60));

  // 5. Price Impact Score (10%): Impact < 0.1% = 100
  const impactScore = Math.max(0, Math.min(100, 100 - inputs.priceImpact * 200));

  // 6. Urgency Score (10%): High urgency pushes score up
  const urgencyScore = inputs.executionUrgency === 3 ? 100 : inputs.executionUrgency === 2 ? 75 : 50;

  // 7. Yield Opportunity Score (10%): Productive vault APY
  const yieldScore = Math.min(100, (inputs.yieldOpportunity / 10) * 100);

  const finalScore = Math.round(
    devScore * 0.2 +
    volScore * 0.2 +
    liqScore * 0.15 +
    slipScore * 0.15 +
    impactScore * 0.1 +
    urgencyScore * 0.1 +
    yieldScore * 0.1
  );

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    factorScores: {
      priceDeviation: Math.round(devScore),
      volatility: Math.round(volScore),
      liquidity: Math.round(liqScore),
      slippage: Math.round(slipScore),
      priceImpact: Math.round(impactScore),
      executionUrgency: Math.round(urgencyScore),
      yieldOpportunity: Math.round(yieldScore),
    },
  };
}
