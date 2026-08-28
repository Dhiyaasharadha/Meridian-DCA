'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StrategySummary } from '@/components/ui/StrategySummary';
import { useCreateStrategy } from '@/hooks/useCreateStrategy';
import { CreateStrategyFormInput } from '@/lib/validation';
import { SUPPORTED_ASSETS } from '@/contracts/addresses';
import { PlusCircle, Loader2, Info, ArrowRight } from 'lucide-react';

export default function CreateStrategyPage() {
  const { submitStrategy, isSubmitting } = useCreateStrategy();

  const [formInput, setFormInput] = useState<CreateStrategyFormInput>({
    asset: 'BTC',
    amount: '2500',
    frequency: 'Weekly',
    maxDelay: '5',
    maxSlippage: '0.5',
  });

  const handleChange = (field: keyof CreateStrategyFormInput, value: string) => {
    setFormInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitStrategy(formInput);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1A1D1A] flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <main className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E4D40]">
              <PlusCircle className="h-4 w-4" /> Strategy Configuration
            </div>
            <h1 className="mt-1 text-3xl font-serif font-extrabold tracking-tight text-[#1A1D1A] sm:text-4xl">
              Create DCA Strategy
            </h1>
            <p className="mt-1 text-sm text-[#5A5852]">
              Define how your capital should be deployed across market cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Form Section */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm space-y-6">
                {/* Asset Dropdown */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Target Asset
                  </label>
                  <select
                    value={formInput.asset}
                    onChange={(e) => handleChange('asset', e.target.value as any)}
                    className="mt-2 w-full rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] px-4 py-3 font-semibold text-[#1A1D1A] focus:border-[#1E4D40] focus:outline-none"
                  >
                    {SUPPORTED_ASSETS.map((asset) => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.icon} {asset.symbol} — {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Strategy Tranche Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formInput.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="e.g. 2500"
                    className="mt-2 w-full rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] px-4 py-3 font-mono text-base font-bold text-[#1A1D1A] focus:border-[#1E4D40] focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-[#686660]">
                    Must be greater than $0. Total committed strategy capital.
                  </p>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Execution Frequency
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleChange('frequency', freq)}
                        className={`rounded-xl border py-3 text-xs font-bold transition-all ${
                          formInput.frequency === freq
                            ? 'border-[#1E4D40] bg-[#1E4D40] text-white shadow-sm'
                            : 'border-[#E3DDD1] bg-[#FAFAFA] text-[#5A5852] hover:border-[#C8C2B4]'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Delay */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Maximum Delay Cycles
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formInput.maxDelay}
                    onChange={(e) => handleChange('maxDelay', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] px-4 py-3 font-mono text-base font-bold text-[#1A1D1A] focus:border-[#1E4D40] focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-[#686660]">
                    Maximum number of delayed cycles before forced execution by Uniswap v4 Hook.
                  </p>
                </div>

                {/* Max Slippage */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Maximum Slippage Cap (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={formInput.maxSlippage}
                    onChange={(e) => handleChange('maxSlippage', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] px-4 py-3 font-mono text-base font-bold text-[#1A1D1A] focus:border-[#1E4D40] focus:outline-none"
                  />
                  <p className="mt-1.5 text-xs text-[#686660]">
                    Execution will delay if estimated Uniswap pool slippage exceeds this cap.
                  </p>
                </div>

                {/* Create Strategy Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E4D40] py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#14382F] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Submitting Transaction to Anvil...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Strategy</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Informational Panel */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#E3DDD1] bg-white p-4 text-xs text-[#5A5852] shadow-sm">
                <Info className="h-5 w-5 shrink-0 text-[#1E4D40]" />
                <span>
                  Your capital will remain productive in the ERC-4626 vault generating continuous yield between eligible DCA executions.
                </span>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-5">
              <StrategySummary formData={formInput} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
