import React from 'react';
import { getScoreColor } from '@/lib/formatting';

interface ExecutionScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const ExecutionScore: React.FC<ExecutionScoreProps> = ({
  score,
  size = 'md',
  showBreakdown = true,
}) => {
  const color = getScoreColor(score);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const contributions = [
    { label: 'Price Conditions', weight: '30%', score: Math.min(100, score + 5) },
    { label: 'Volatility', weight: '25%', score: Math.min(100, score + 2) },
    { label: 'Liquidity Depth', weight: '20%', score: Math.max(10, score - 3) },
    { label: 'Slippage Tolerance', weight: '15%', score: Math.min(100, score + 8) },
    { label: 'Execution Urgency', weight: '10%', score: score },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <div className="relative inline-flex items-center justify-center">
        <svg className="h-28 w-28 -rotate-90 transform">
          {/* Background Track */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-[#E3DDD1]"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Active Value Arc */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-serif font-black text-[#1A1D1A]">{score}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#686660]">/ 100</span>
        </div>
      </div>

      <span className="mt-2 text-xs font-bold uppercase tracking-wider text-[#1A1D1A]">
        Execution Score
      </span>

      {/* Contribution Breakdown */}
      {showBreakdown && (
        <div className="mt-4 w-full space-y-2.5 border-t border-[#E3DDD1] pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
            Score Factor Breakdown
          </span>
          {contributions.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#1A1D1A] font-medium">{item.label}</span>
                <span className="font-mono text-[#686660]">{item.score}/100</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAE6DF]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: getScoreColor(item.score),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
