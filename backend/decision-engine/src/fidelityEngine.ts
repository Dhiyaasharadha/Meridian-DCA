import { DecisionInputs, FidelityResult } from './types';

/**
 * NOVELTY 1: DCA FIDELITY ENGINE
 * Formula:
 * fidelity = 100 - delay_penalty - allocation_drift - missed_execution_penalty
 *
 * Parameters:
 * - delay_penalty: 5 points per consecutive delay
 * - allocation_drift: absolute difference between actual allocation to date and intended schedule allocation (%)
 * - missed_execution_penalty: 10 points per missed scheduled execution
 *
 * Guardrail 2: If fidelity < 70, force execution!
 */
export function calculateDCAFidelity(inputs: DecisionInputs): FidelityResult {
  const delayPenalty = inputs.delayCount * 5;

  const intended = inputs.intendedAllocation ?? 1000;
  const actual = inputs.actualAllocation ?? 600;
  const driftAmount = Math.abs(intended - actual);
  const allocationDrift = Math.round(Math.min(40, (driftAmount / (intended || 1)) * 30));

  const missedCount = inputs.missedExecutions ?? (inputs.delayCount > 2 ? inputs.delayCount - 1 : 0);
  const missedExecutionPenalty = missedCount * 10;

  const calculated = 100 - delayPenalty - allocationDrift - missedExecutionPenalty;
  const fidelity = Math.max(0, Math.min(100, Math.round(calculated)));

  const forced = fidelity < 70;

  return {
    fidelity,
    delayPenalty,
    allocationDrift,
    missedExecutionPenalty,
    forced,
  };
}
