import React from 'react';

interface DecisionReasonProps {
  index: number;
  reason: string;
  decisionType?: 'execute' | 'partial' | 'delay' | 'forced';
}

export const DecisionReason: React.FC<DecisionReasonProps> = ({
  index,
  reason,
  decisionType = 'execute',
}) => {
  const numberStyles = {
    execute: 'bg-[#E8F3EE] text-[#1E4D40] border-[#B6DBC9]',
    partial: 'bg-[#FDF4EB] text-[#C27D38] border-[#F5D8B8]',
    delay: 'bg-[#EAE6DF] text-[#5A5852] border-[#D6D0C4]',
    forced: 'bg-[#FCEAEB] text-[#A83232] border-[#F4C5C5]',
  }[decisionType];

  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5 shadow-xs transition-all hover:border-[#C8C2B4] hover:bg-white">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold ${numberStyles}`}
      >
        {index}
      </div>
      <p className="text-sm font-medium leading-snug text-[#1A1D1A]">
        {reason}
      </p>
    </div>
  );
};
