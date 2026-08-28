import { DecisionInputs, NormalizedMarket } from './types';
import { normalizeMarketInputs } from './normalization';

/**
 * Exact Scoring Model:
 * score = 0.30 * liquidity_norm
 *       + 0.25 * (1 - slippage_norm)  --> using slippageNorm where 100 = low slippage
 *       + 0.20 * (1 - volatility_norm)--> using volatilityNorm where 100 = low volatility
 *       + 0.15 * yield_norm
 *       + 0.10 * urgency_norm
 */
export function calculateMarketScore(inputs: DecisionInputs): { score: number; normalized: NormalizedMarket } {
  const normalized = normalizeMarketInputs(inputs);

  const score = Math.round(
    0.30 * normalized.liquidityNorm +
    0.25 * normalized.slippageNorm +
    0.20 * normalized.volatilityNorm +
    0.15 * normalized.yieldNorm +
    0.10 * normalized.urgencyNorm
  );

  const boundedScore = Math.max(0, Math.min(100, score));

  return {
    score: boundedScore,
    normalized,
  };
}
