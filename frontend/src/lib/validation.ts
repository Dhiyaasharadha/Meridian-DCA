export interface CreateStrategyFormInput {
  asset: 'BTC' | 'ETH' | 'SOL';
  amount: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  maxDelay: string;
  maxSlippage: string;
}

export interface ValidationError {
  field: keyof CreateStrategyFormInput;
  message: string;
}

export function validateStrategyForm(input: CreateStrategyFormInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Asset validation
  if (!['BTC', 'ETH', 'SOL'].includes(input.asset)) {
    errors.push({ field: 'asset', message: 'Please select a valid supported asset (BTC, ETH, SOL).' });
  }

  // Amount validation
  const amountNum = parseFloat(input.amount);
  if (!input.amount || isNaN(amountNum)) {
    errors.push({ field: 'amount', message: 'Amount must be a valid number.' });
  } else if (amountNum <= 0) {
    errors.push({ field: 'amount', message: 'Capital amount must be strictly greater than 0.' });
  } else if (amountNum > 10000000) {
    errors.push({ field: 'amount', message: 'Amount exceeds maximum allowed single strategy capital ($10,000,000).' });
  }

  // Frequency validation
  if (!['Daily', 'Weekly', 'Monthly'].includes(input.frequency)) {
    errors.push({ field: 'frequency', message: 'Please select a valid execution frequency.' });
  }

  // Max Delay validation
  const delayNum = parseInt(input.maxDelay, 10);
  if (!input.maxDelay || isNaN(delayNum)) {
    errors.push({ field: 'maxDelay', message: 'Maximum delay must be a valid integer.' });
  } else if (delayNum < 1 || delayNum > 15) {
    errors.push({ field: 'maxDelay', message: 'Maximum delay must be between 1 and 15 execution cycles.' });
  }

  // Max Slippage validation
  const slippageNum = parseFloat(input.maxSlippage);
  if (!input.maxSlippage || isNaN(slippageNum)) {
    errors.push({ field: 'maxSlippage', message: 'Maximum slippage must be a valid numeric percentage.' });
  } else if (slippageNum <= 0) {
    errors.push({ field: 'maxSlippage', message: 'Maximum slippage must be greater than 0%.' });
  } else if (slippageNum > 5.0) {
    errors.push({ field: 'maxSlippage', message: 'Maximum slippage cannot exceed 5.0% to protect against excessive loss.' });
  }

  return errors;
}

export function frequencyToSeconds(frequency: 'Daily' | 'Weekly' | 'Monthly' | string): number {
  switch (frequency) {
    case 'Daily':
      return 86400;
    case 'Weekly':
      return 604800;
    case 'Monthly':
      return 2592000;
    default:
      return 604800;
  }
}
