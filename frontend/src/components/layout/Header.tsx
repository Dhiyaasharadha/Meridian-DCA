'use client';

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { shortenAddress } from '@/lib/formatting';
import { Wallet, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useStrategyStore } from '@/store/strategyStore';
import { postMarketCondition } from '@/lib/api';

export const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { toasts, removeToast, demoScenario, setDemoScenario, activeStrategyId } = useStrategyStore();

  const handleScenarioChange = async (scenario: string) => {
    setDemoScenario(scenario as any);

    let apiScenario = 'good';
    if (scenario === 'moderate_market') apiScenario = 'moderate';
    else if (scenario === 'bad_market') apiScenario = 'bad';
    else if (scenario === 'economic_veto') apiScenario = 'economic_veto';
    else if (scenario === 'fidelity_low') apiScenario = 'fidelity_low';
    else if (scenario === 'max_delay') apiScenario = 'forced';

    await postMarketCondition(apiScenario, activeStrategyId || '1');
  };

  const handleResetDemo = async () => {
    try {
      await fetch('http://localhost:4000/demo/reset', { method: 'POST' });
      setDemoScenario('good_market' as any);
      window.location.reload();
    } catch (err) {
      console.warn('Demo reset error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#E3DDD1] bg-[#F5F2EB]/90 px-6 backdrop-blur-xl">
      {/* Dev Simulator / Demo Scenario Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
          Demo Simulator:
        </span>
        <select
          value={demoScenario}
          onChange={(e) => handleScenarioChange(e.target.value)}
          className="rounded-xl border border-[#E3DDD1] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#1A1D1A] shadow-sm focus:border-[#1E4D40] focus:outline-none"
        >
          <option value="good_market">GOOD MARKET → EXECUTE</option>
          <option value="moderate_market">MODERATE MARKET → PARTIAL</option>
          <option value="bad_market">BAD MARKET → DELAY</option>
          <option value="economic_veto">ECONOMIC VETO → EXECUTE</option>
          <option value="fidelity_low">FIDELITY &lt; 70 → FORCED</option>
          <option value="max_delay">MAX DELAY → FORCED</option>
          <option value="live">REAL CONTRACT / API LIVE MODE</option>
        </select>

        <button
          onClick={handleResetDemo}
          title="Reset Demo State"
          className="flex h-8 items-center gap-1 rounded-lg border border-[#E3DDD1] bg-white px-2.5 text-[11px] font-bold text-[#5A5852] hover:bg-[#F9F7F2]"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Wallet Connection & Network */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#E3DDD1] bg-white px-3 py-1 text-xs text-[#5A5852] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#1E4D40]" />
          <span className="font-semibold">Anvil (31337)</span>
        </div>

        {isConnected ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[#B6DBC9] bg-[#E8F3EE] px-3.5 py-1.5 font-mono text-xs font-bold text-[#1E4D40]">
              <Wallet className="h-4 w-4" />
              <span>{shortenAddress(address)}</span>
            </div>
            <button
              onClick={() => disconnect()}
              title="Disconnect Wallet"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] text-[#5A5852] transition-colors hover:border-[#F4C5C5] hover:bg-[#FCEAEB] hover:text-[#A83232]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              const injectedConn = connectors.find((c) => c.id === 'injected') || connectors[0];
              if (injectedConn) connect({ connector: injectedConn });
            }}
            className="flex items-center gap-2 rounded-xl bg-[#1E4D40] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#14382F] active:scale-95"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

      {/* Toast Notifications Overlay */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all ${
                toast.type === 'success'
                  ? 'border-[#B6DBC9] bg-[#E8F3EE] text-[#1E4D40]'
                  : toast.type === 'error'
                  ? 'border-[#F4C5C5] bg-[#FCEAEB] text-[#A83232]'
                  : toast.type === 'warning'
                  ? 'border-[#F5D8B8] bg-[#FDF4EB] text-[#C27D38]'
                  : 'border-[#D6D0C4] bg-[#EAE6DF] text-[#5A5852]'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1E4D40]" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-[#A83232]" />
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-bold">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs">{toast.description}</p>
                )}
                {toast.txHash && (
                  <p className="font-mono text-[10px] font-bold">
                    Tx: {shortenAddress(toast.txHash)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
