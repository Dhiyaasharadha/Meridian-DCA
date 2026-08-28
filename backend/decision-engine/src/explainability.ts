import { DecisionInputs, FactorContribution } from './types';
import { normalizeMarketInputs } from './normalization';

/**
 * NOVELTY 3: EXPLAINABLE AI / DYNAMIC DECISION REASONING
 * Computes factor contributions dynamically based on actual market inputs.
 * Ranks factors by absolute impact descending so top 2–3 dominant drivers are returned first.
 */
export function calculateFactorContributions(inputs: DecisionInputs): FactorContribution[] {
  const norm = normalizeMarketInputs(inputs);

  const contribs: FactorContribution[] = [
    {
      factor: 'slippage',
      label: inputs.slippage > 0.4 ? 'High Slippage' : inputs.slippage > 0.2 ? 'Moderate Slippage' : 'Low Slippage',
      contribution: Math.round(0.25 * (norm.slippageNorm - 100)),
    },
    {
      factor: 'liquidity',
      label: inputs.liquidity === 1 ? 'Low Liquidity Depth' : inputs.liquidity === 2 ? 'Moderate Liquidity' : 'High Liquidity Depth',
      contribution: Math.round(0.30 * (norm.liquidityNorm - 100)),
    },
    {
      factor: 'volatility',
      label: inputs.volatility === 3 ? 'High Volatility' : inputs.volatility === 2 ? 'Moderate Volatility' : 'Low Volatility',
      contribution: Math.round(0.20 * (norm.volatilityNorm - 100)),
    },
    {
      factor: 'yield',
      label: inputs.yieldOpportunity >= 5 ? 'Productive Vault Yield' : 'Low Vault Yield',
      contribution: Math.round(0.15 * norm.yieldNorm),
    },
    {
      factor: 'urgency',
      label: inputs.delayCount >= 3 ? 'High Execution Urgency' : 'Low Execution Pressure',
      contribution: Math.round(0.10 * norm.urgencyNorm),
    },
  ];

  // Sort by absolute contribution magnitude descending (largest negative/positive impact first!)
  contribs.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return contribs;
}
