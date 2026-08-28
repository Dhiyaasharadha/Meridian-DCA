import assert from 'assert';
import { calculateDCAFidelity } from '../src/fidelityEngine';
import { calculateEconomicViability } from '../src/economicEngine';
import { evaluateDecision } from '../src/decisionEngine';
import { calculateFactorContributions } from '../src/explainability';
import { getScenarioInputs } from '../../api/src/services/strategyService';

console.log('==================================================');
console.log(' Running YieldGuard AI Decision Engine Unit Tests ');
console.log('==================================================');

// 1. DCA Fidelity Engine Tests
console.log('\n[1/4] Testing DCA Fidelity Engine...');

const fidelityHealthy = calculateDCAFidelity({
  ...getScenarioInputs('good', 0, 5),
  intendedAllocation: 1000,
  actualAllocation: 1000,
  missedExecutions: 0,
});
assert.strictEqual(fidelityHealthy.fidelity, 100, 'Healthy fidelity should be 100');
assert.strictEqual(fidelityHealthy.forced, false, 'Healthy fidelity should not force execution');

const fidelityLow = calculateDCAFidelity({
  ...getScenarioInputs('bad', 4, 5),
  intendedAllocation: 1000,
  actualAllocation: 400,
  missedExecutions: 3,
});
assert.ok(fidelityLow.fidelity < 70, 'Low fidelity should be < 70');
assert.strictEqual(fidelityLow.forced, true, 'Fidelity < 70 must force execution (Guardrail 2)');
console.log(`  ✓ DCA Fidelity Healthy: ${fidelityHealthy.fidelity}/100`);
console.log(`  ✓ DCA Fidelity Low: ${fidelityLow.fidelity}/100 (Forced = ${fidelityLow.forced})`);

// 2. Economic Viability Engine Tests
console.log('\n[2/4] Testing Economic Viability Engine...');

const econFavorable = calculateEconomicViability({
  ...getScenarioInputs('bad'),
  slippage: 0.15,
  yieldOpportunity: 8.5,
}, 2500);
assert.strictEqual(econFavorable.delayJustified, true, 'Yield benefit > cost should justify delay');

const econVeto = calculateEconomicViability({
  ...getScenarioInputs('bad'),
  yieldOpportunity: 0.1, // very low yield -> cost > benefit
  slippage: 1.5,         // high slippage cost
}, 500);
assert.strictEqual(econVeto.delayJustified, false, 'High cost vs low yield should veto delay');
console.log(`  ✓ Economic Delay Justified: Benefit $${econFavorable.benefit} > Cost $${econFavorable.cost}`);
console.log(`  ✓ Economic Veto: Benefit $${econVeto.benefit} <= Cost $${econVeto.cost} (Veto = true)`);

// 3. Explainability & Dynamic Reason Ranking Tests
console.log('\n[3/4] Testing Explainability & Dynamic Factor Ranking...');

const highSlippageInputs = { ...getScenarioInputs('good'), slippage: 0.9 };
const slippageRank = calculateFactorContributions(highSlippageInputs);
assert.strictEqual(slippageRank[0].factor, 'slippage', 'Worst slippage must rank #1 driver');

const lowLiquidityInputs = { ...getScenarioInputs('good'), liquidity: 1 };
const liquidityRank = calculateFactorContributions(lowLiquidityInputs);
assert.strictEqual(liquidityRank[0].factor, 'liquidity', 'Low liquidity must rank #1 driver');

console.log(`  ✓ High Slippage scenario top reason: "${slippageRank[0].label}"`);
console.log(`  ✓ Low Liquidity scenario top reason: "${liquidityRank[0].label}"`);

// 4. Decision Pipeline & Guardrails Integration Tests
console.log('\n[4/4] Testing Integrated 12-Step Decision Pipeline...');

// Good market -> EXECUTE 100%
const decGood = evaluateDecision(getScenarioInputs('good'));
assert.strictEqual(decGood.decision, 'execute');
assert.strictEqual(decGood.recommendedTranchePercentage, 100);

// Moderate market -> PARTIAL 60%
const decMod = evaluateDecision(getScenarioInputs('moderate'));
assert.strictEqual(decMod.decision, 'partial');
assert.strictEqual(decMod.recommendedTranchePercentage, 60);

// Bad market -> DELAY 0% (when economic delay is justified)
const decBad = evaluateDecision({
  ...getScenarioInputs('bad'),
  slippage: 0.15,
  yieldOpportunity: 8.5,
});
assert.strictEqual(decBad.decision, 'delay');
assert.strictEqual(decBad.recommendedTranchePercentage, 0);

// Economic Veto -> Overrides DELAY -> EXECUTE 60%
const decEconomicVeto = evaluateDecision({
  ...getScenarioInputs('bad'),
  yieldOpportunity: 0.1,
  slippage: 1.5,
});
assert.strictEqual(decEconomicVeto.decision, 'execute');
assert.strictEqual(decEconomicVeto.recommendedTranchePercentage, 60);

// MaxDelay Guardrail -> FORCED 100%
const decForced = evaluateDecision(getScenarioInputs('forced'));
assert.strictEqual(decForced.decision, 'forced');
assert.strictEqual(decForced.forced, true);
assert.strictEqual(decForced.recommendedTranchePercentage, 100);

// Fidelity Guardrail -> FORCED 100%
const decFidelityForced = evaluateDecision({
  ...getScenarioInputs('bad', 2, 5),
  intendedAllocation: 1000,
  actualAllocation: 400,
  missedExecutions: 3,
});
assert.strictEqual(decFidelityForced.decision, 'forced');
assert.strictEqual(decFidelityForced.forced, true);

console.log(`  ✓ GOOD scenario decision: ${decGood.decision} (${decGood.recommendedTranchePercentage}%)`);
console.log(`  ✓ MODERATE scenario decision: ${decMod.decision} (${decMod.recommendedTranchePercentage}%)`);
console.log(`  ✓ BAD scenario decision: ${decBad.decision} (${decBad.recommendedTranchePercentage}%)`);
console.log(`  ✓ ECONOMIC VETO decision: ${decEconomicVeto.decision} (${decEconomicVeto.recommendedTranchePercentage}%)`);
console.log(`  ✓ FORCED scenario decision: ${decForced.decision} (${decForced.recommendedTranchePercentage}%)`);
console.log(`  ✓ FIDELITY FORCED decision: ${decFidelityForced.decision} (${decFidelityForced.recommendedTranchePercentage}%)`);

console.log('\n==================================================');
console.log(' ALL 4 NOVELTY ENGINE UNIT TESTS PASSED 100%! ');
console.log('==================================================');
