import { DecisionInputs, DecisionOutput, ApiDecisionType } from './types';
import { calculateMarketScore } from './marketScore';
import { calculateDCAFidelity } from './fidelityEngine';
import { calculateEconomicViability } from './economicEngine';
import { calculateFactorContributions } from './explainability';

export function evaluateDecision(
  inputs: DecisionInputs,
  strategyId: string | number = 1,
  totalCapital = 2500
): DecisionOutput {
  // STEP 4 & 5: Normalize inputs and calculate Market Score
  const { score } = calculateMarketScore(inputs);

  // STEP 6: Calculate DCA Fidelity
  const fidelityDetails = calculateDCAFidelity(inputs);

  // STEP 7: Calculate Economic Viability
  const economicViability = calculateEconomicViability(inputs);

  // STEP 8: Preliminary decision from Market Score
  let decision: ApiDecisionType = 'execute';
  let recommendedTranchePct = 100;

  if (score > 80) {
    decision = 'execute';
    recommendedTranchePct = 100;
  } else if (score >= 60) {
    decision = 'partial';
    recommendedTranchePct = 60;
  } else {
    decision = 'delay';
    recommendedTranchePct = 0;
  }

  // STEP 9: Economic Veto check — If preliminary decision = DELAY but delay is NOT economically justified
  if (decision === 'delay' && !economicViability.delayJustified) {
    decision = 'execute';
    recommendedTranchePct = 60; // Economic veto forces execution
  }

  let forced = false;

  // STEP 10: Fidelity Guardrail check — If fidelity < 70, force execution!
  if (fidelityDetails.forced) {
    decision = 'forced';
    recommendedTranchePct = 100;
    forced = true;
  }

  // STEP 11: MaxDelay Guardrail check — If delayCount >= maxDelay, force execution!
  if (inputs.delayCount >= inputs.maxDelay) {
    decision = 'forced';
    recommendedTranchePct = 100;
    forced = true;
  }

  // STEP 12: Calculate recommended tranche amount
  const baseTrancheUsd = 500;
  const recommendedTrancheAmount = (baseTrancheUsd * recommendedTranchePct) / 100;

  const factorContributions = calculateFactorContributions(inputs);

  return {
    strategyId,
    decision,
    apiDecision: decision,
    score,
    executionPercentage: recommendedTranchePct,
    recommendedTranchePercentage: recommendedTranchePct,
    recommendedTrancheAmount,
    fidelity: fidelityDetails.fidelity,
    delayCount: inputs.delayCount,
    maxDelay: inputs.maxDelay,
    reasons: factorContributions.slice(0, 3),
    factorContributions,
    economicViability,
    fidelityDetails,
    forced,
    timestamp: new Date().toISOString(),
  };
}
