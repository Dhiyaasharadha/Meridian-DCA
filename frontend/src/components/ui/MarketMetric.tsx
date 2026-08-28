import React from 'react';

interface MarketMetricProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: 'positive' | 'negative' | 'warning' | 'neutral';
}

export const MarketMetric: React.FC<MarketMetricProps> = ({
  label,
  value,
  subValue,
  highlight = 'neutral',
}) => {
  const textColor = {
    positive: 'text-[#1E4D40]',
    negative: 'text-[#A83232]',
    warning: 'text-[#C27D38]',
    neutral: 'text-[#1A1D1A]',
  }[highlight];

  return (
    <div className="rounded-xl border border-[#E3DDD1] bg-[#F9F7F2] p-3.5 shadow-xs transition-all hover:border-[#C8C2B4]">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#686660]">
        {label}
      </div>
      <div className={`mt-1 font-mono text-base font-bold ${textColor}`}>
        {value}
      </div>
      {subValue && (
        <div className="mt-0.5 text-[11px] text-[#686660]">
          {subValue}
        </div>
      )}
    </div>
  );
};
