import React from 'react';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface DelayProgressProps {
  delayCount: number;
  maxDelay: number;
}

export const DelayProgress: React.FC<DelayProgressProps> = ({
  delayCount,
  maxDelay,
}) => {
  const safeMax = Math.max(1, maxDelay);
  const currentDelay = Math.min(delayCount, safeMax);
  const percentage = Math.round((currentDelay / safeMax) * 100);
  const remaining = Math.max(0, safeMax - currentDelay);

  let status: 'Safe' | 'Approaching Limit' | 'Forced';
  let badgeColor: string;
  let progressColor: string;
  let Icon: React.ElementType;

  if (currentDelay >= safeMax) {
    status = 'Forced';
    badgeColor = 'bg-[#FCEAEB] text-[#A83232] border-[#F4C5C5]';
    progressColor = 'bg-[#A83232]';
    Icon = Zap;
  } else if (percentage >= 60) {
    status = 'Approaching Limit';
    badgeColor = 'bg-[#FDF4EB] text-[#C27D38] border-[#F5D8B8]';
    progressColor = 'bg-[#C27D38]';
    Icon = AlertTriangle;
  } else {
    status = 'Safe';
    badgeColor = 'bg-[#E8F3EE] text-[#1E4D40] border-[#B6DBC9]';
    progressColor = 'bg-[#1E4D40]';
    Icon = ShieldCheck;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm transition-all hover:border-[#C8C2B4]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
            Time to Forced Execution
          </h3>
          <p className="mt-0.5 text-xs text-[#686660]">
            Bounded Autonomy Safety Circuit
          </p>
        </div>
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badgeColor}`}>
          <Icon className="h-3.5 w-3.5" />
          <span>{status.toUpperCase()}</span>
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-serif text-[#1A1D1A]">{currentDelay}</span>
          <span className="text-lg font-medium text-[#686660]">/ {safeMax}</span>
          <span className="text-xs text-[#686660]">delayed cycles</span>
        </div>
        <span className="font-mono text-sm font-bold text-[#1A1D1A]">
          {percentage}% limit used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#F5F2EB] p-0.5 border border-[#E3DDD1]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Cycle Segment Indicators */}
      <div className="mt-2 flex justify-between gap-1">
        {Array.from({ length: safeMax }).map((_, idx) => {
          const isFilled = idx < currentDelay;
          return (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                isFilled
                  ? status === 'Forced'
                    ? 'bg-[#A83232]'
                    : status === 'Approaching Limit'
                    ? 'bg-[#C27D38]'
                    : 'bg-[#1E4D40]'
                  : 'bg-[#EAE6DF]'
              }`}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#E3DDD1] pt-4 text-xs font-medium">
        <div className="text-[#5A5852]">
          <span className="font-bold text-[#1A1D1A]">{currentDelay} of {safeMax}</span> allowed delays used
        </div>
        <div className="text-[#686660]">
          <span className="font-bold text-[#C27D38]">{remaining}</span> cycles remaining until forced execution
        </div>
      </div>
    </div>
  );
};
