import React from 'react';
import { getDecisionBadgeStyle } from '@/lib/formatting';

interface DecisionBadgeProps {
  decision: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({
  decision,
  size = 'md',
  showDot = true,
}) => {
  const style = getDecisionBadgeStyle(decision);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1 gap-2 font-semibold',
    lg: 'text-base px-4 py-1.5 gap-2.5 font-bold tracking-wide',
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${style.bg} ${sizeClasses}`}
    >
      {showDot && (
        <span className={`rounded-full animate-pulse ${style.dot} ${dotSizes}`} />
      )}
      <span>{style.label}</span>
    </span>
  );
};
