import { DecisionInputs } from '../../../decision-engine/src/types';
import { MarketData } from '../types/schemas';

let activeScenario: 'good' | 'moderate' | 'bad' | 'forced' | 'economic_veto' | 'fidelity_low' | 'custom' = 'good';
let customMarketInputs: Partial<DecisionInputs> | null = null;

export function setMarketScenario(
  scenario: 'good' | 'moderate' | 'bad' | 'forced' | 'economic_veto' | 'fidelity_low',
  customInputs?: Partial<DecisionInputs>
) {
  activeScenario = scenario;
  if (customInputs) {
    customMarketInputs = customInputs;
  } else {
    customMarketInputs = null;
  }
}

export function getActiveScenario() {
  return activeScenario;
}

export function getMarketTelemetry(strategyId: string | number = 1, delayCount = 2, maxDelay = 5): { inputs: DecisionInputs; data: MarketData } {
  let inputs: DecisionInputs;

  if (activeScenario === 'good') {
    inputs = {
      priceDeviation: 0.15,
      volatility: 1, // Low
      liquidity: 3,  // High
      slippage: 0.18,
      priceImpact: 0.04,
      executionUrgency: 1, // Low
      yieldOpportunity: 5.4,
      delayCount: Math.min(delayCount, maxDelay - 1),
      maxDelay,
    };
  } else if (activeScenario === 'moderate') {
    inputs = {
      priceDeviation: 0.45,
      volatility: 2, // Medium
      liquidity: 2,  // Medium
      slippage: 0.25,
      priceImpact: 0.08,
      executionUrgency: 2, // Normal
      yieldOpportunity: 5.4,
      delayCount: Math.min(delayCount, maxDelay - 1),
      maxDelay,
    };
  } else if (activeScenario === 'bad') {
    inputs = {
      priceDeviation: 1.45,
      volatility: 3, // High
      liquidity: 1,  // Low
      slippage: 0.85,
      priceImpact: 0.35,
      executionUrgency: 3, // High
      yieldOpportunity: 5.4,
      delayCount: Math.min(delayCount, maxDelay - 1),
      maxDelay,
    };
  } else if (activeScenario === 'economic_veto') {
    inputs = {
      priceDeviation: 1.45,
      volatility: 3,
      liquidity: 1,
      slippage: 1.5,
      priceImpact: 0.45,
      executionUrgency: 3,
      yieldOpportunity: 0.1, // Low yield -> Cost ($8.70) > Benefit ($3.51) -> Veto!
      delayCount: Math.min(delayCount, maxDelay - 1),
      maxDelay,
    };
  } else if (activeScenario === 'fidelity_low') {
    inputs = {
      priceDeviation: 1.45,
      volatility: 3,
      liquidity: 1,
      slippage: 0.85,
      priceImpact: 0.35,
      executionUrgency: 3,
      yieldOpportunity: 5.4,
      delayCount: Math.min(delayCount, maxDelay - 1),
      maxDelay,
      intendedAllocation: 1000,
      actualAllocation: 400,
      missedExecutions: 3, // Fidelity < 70 -> Forced!
    };
  } else {
    // forced
    inputs = {
      priceDeviation: 1.45,
      volatility: 3,
      liquidity: 1,
      slippage: 0.85,
      priceImpact: 0.35,
      executionUrgency: 3,
      yieldOpportunity: 5.4,
      delayCount: maxDelay, // Delay limit reached!
      maxDelay,
    };
  }

  if (customMarketInputs) {
    inputs = { ...inputs, ...customMarketInputs };
  }

  const twap = 94110;
  const currentPrice = Number((twap * (1 + inputs.priceDeviation / 100)).toFixed(2));
  const calculatedDev = Number((((currentPrice - twap) / twap) * 100).toFixed(2));

  const data: MarketData = {
    currentPrice,
    twap,
    priceDeviation: calculatedDev,
    volatility: inputs.volatility === 1 ? 15 : inputs.volatility === 2 ? 38 : 78,
    liquidity: inputs.liquidity === 3 ? 92 : inputs.liquidity === 2 ? 65 : 28,
    slippage: Math.round(inputs.slippage * 100),
    priceImpact: Math.round(inputs.priceImpact * 100),
    urgency: Math.round((inputs.delayCount / inputs.maxDelay) * 100),
  };

  return { inputs, data };
}
