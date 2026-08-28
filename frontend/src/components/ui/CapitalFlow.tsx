import React from 'react';
import { Wallet, Vault, Cpu, GitMerge, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface CapitalFlowProps {
  activeStage?: 'capital' | 'vault' | 'analysis' | 'decision' | 'uniswap';
}

export const CapitalFlow: React.FC<CapitalFlowProps> = ({
  activeStage = 'vault',
}) => {
  const stages = [
    { id: 'capital', label: 'CAPITAL', icon: Wallet, desc: 'DCA Funds Committed' },
    { id: 'vault', label: 'YIELD VAULT', icon: Vault, desc: 'ERC-4626 Accruing Yield' },
    { id: 'analysis', label: 'MARKET CHECK', icon: Cpu, desc: 'TWAP & Volatility Eval' },
    { id: 'decision', label: 'AI DECISION', icon: GitMerge, desc: 'Execute / Delay / Forced' },
    { id: 'uniswap', label: 'UNISWAP V4', icon: Zap, desc: 'Optimized Swap Execution' },
  ];

  return (
    <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#686660]">
          Strategy Lifecycle & Flow
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-[#1E4D40] font-bold">
          <CheckCircle2 className="h-3.5 w-3.5" /> Live Yield Loop Active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStage;
          const isPast = stages.findIndex((s) => s.id === activeStage) > idx;

          return (
            <div key={stage.id} className="relative flex flex-col items-center text-center">
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                  isActive
                    ? 'border-[#1E4D40] bg-[#E8F3EE] text-[#1E4D40] shadow-md ring-2 ring-[#B6DBC9]'
                    : isPast
                    ? 'border-[#B6DBC9] bg-[#E8F3EE]/50 text-[#1E4D40]'
                    : 'border-[#E3DDD1] bg-[#F9F7F2] text-[#686660]'
                }`}
              >
                <Icon className="h-6 w-6" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E4D40] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1E4D40]"></span>
                  </span>
                )}
              </div>

              <span className={`mt-2 font-mono text-xs font-bold ${isActive ? 'text-[#1E4D40]' : 'text-[#1A1D1A]'}`}>
                {stage.label}
              </span>
              <span className="mt-0.5 text-[10px] text-[#686660]">{stage.desc}</span>

              {idx < stages.length - 1 && (
                <ArrowRight className="hidden sm:block absolute -right-3 top-5 h-4 w-4 text-[#D8D2C5]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
