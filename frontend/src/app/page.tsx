import React from 'react';
import Link from 'next/link';
import { ArrowRight, Vault, Cpu, ShieldAlert, Sparkles } from 'lucide-react';
import { CapitalFlow } from '@/components/ui/CapitalFlow';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1A1D1A] selection:bg-[#1E4D40] selection:text-white">
      {/* Top Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#E3DDD1] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E4D40] font-extrabold text-sm text-white shadow-md">
            MD
          </div>
          <div>
            <span className="text-lg font-serif font-black tracking-tight text-[#1A1D1A]">Meridian-DCA</span>
            <span className="ml-2 rounded-full bg-[#E8F3EE] px-2.5 py-0.5 text-[10px] font-bold text-[#1E4D40] border border-[#B6DBC9]">
              Uniswap v4 Hook
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#5A5852] transition-colors hover:text-[#1A1D1A]"
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-[#1E4D40] px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#14382F] active:scale-95"
          >
            <span>Launch App</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative mx-auto max-w-7xl px-6 pt-16 pb-24">
        {/* Floating Card Badges (OriginTrace style) */}
        <div className="hidden lg:block absolute left-8 top-28 rounded-2xl border border-[#E3DDD1] bg-white p-4 shadow-xl shadow-black/5 rotate-[-3deg] transition-transform hover:rotate-0">
          <div className="text-[10px] font-mono font-bold text-[#C27D38]">STRATEGY-4471</div>
          <div className="text-xl font-serif font-bold text-[#1A1D1A]">$248,900</div>
          <div className="text-[11px] font-semibold text-[#1E4D40]">Yield Accruing • 5.4% APY</div>
        </div>

        <div className="hidden lg:block absolute right-8 top-24 rounded-2xl border border-[#E3DDD1] bg-white p-4 shadow-xl shadow-black/5 rotate-[3deg] transition-transform hover:rotate-0">
          <div className="text-[10px] font-mono font-bold text-[#686660]">EXEC-2210</div>
          <div className="text-xl font-serif font-bold text-[#1A1D1A]">$12,400</div>
          <div className="text-[11px] font-semibold text-[#1E4D40]">Uniswap v4 Cleared</div>
        </div>

        <div className="hidden lg:block absolute left-12 bottom-36 rounded-2xl border border-[#E3DDD1] bg-white p-4 shadow-xl shadow-black/5 rotate-[2deg] transition-transform hover:rotate-0">
          <div className="text-[10px] font-mono font-bold text-[#686660]">CYCLE-1176</div>
          <div className="text-xl font-serif font-bold text-[#1A1D1A]">$5,120</div>
          <div className="text-[11px] font-semibold text-[#C27D38]">Delayed • Volatility Check</div>
        </div>

        <div className="hidden lg:block absolute right-12 bottom-32 rounded-2xl border border-[#E3DDD1] bg-white p-4 shadow-xl shadow-black/5 rotate-[-2deg] transition-transform hover:rotate-0">
          <div className="text-[10px] font-mono font-bold text-[#A83232]">AUTONOMY-9083</div>
          <div className="text-xl font-serif font-bold text-[#1A1D1A]">$71,250</div>
          <div className="text-[11px] font-semibold text-[#A83232]">Forced Execution Limit</div>
        </div>

        {/* Central Hero Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C27D38]/30 bg-[#FDF4EB] px-4 py-1.5 text-xs font-bold text-[#C27D38]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>YIELD-AWARE, MARKET-ADAPTIVE DCA ENGINE</span>
          </div>

          <h1 className="text-5xl font-serif font-extrabold tracking-tight text-[#1A1D1A] sm:text-6xl lg:text-7xl leading-tight">
            Your DCA capital <br />
            <span className="italic font-serif text-[#C27D38]">works while it waits.</span>
          </h1>

          <p className="text-base text-[#5A5852] leading-relaxed sm:text-lg max-w-2xl mx-auto">
            Meridian-DCA maps market conditions, deposits uncommitted funds into ERC-4626 yield vaults, and executes swaps via Uniswap v4 Hooks with explainable AI decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-full bg-[#1E4D40] px-7 py-3.5 text-base font-bold text-white shadow-xl transition-all hover:bg-[#14382F] active:scale-95"
            >
              <span>Launch App</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-[#E3DDD1] bg-white px-7 py-3.5 text-base font-bold text-[#1A1D1A] shadow-sm transition-all hover:bg-[#F9F7F2]"
            >
              <span>View Demo</span>
            </Link>
          </div>

          <div className="pt-2 text-xs font-semibold uppercase tracking-wider text-[#686660]">
            POWERED BY ERC-4626 VAULTS & UNISWAP V4 HOOKS
          </div>
        </div>

        {/* Visual Capital Lifecycle Diagram */}
        <div className="mt-16 max-w-4xl mx-auto">
          <CapitalFlow activeStage="vault" />
        </div>

        {/* 3 Feature Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm transition-all hover:border-[#C8C2B4] hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3EE] text-[#1E4D40]">
              <Vault className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-serif font-bold text-[#1A1D1A]">Yield While Waiting</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#686660]">
              Uncommitted DCA funds remain deposited in ERC-4626 vaults, generating continuous yield up until the exact block of swap execution.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm transition-all hover:border-[#C8C2B4] hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3EE] text-[#1E4D40]">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-serif font-bold text-[#1A1D1A]">Adaptive Execution</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#686660]">
              Evaluates real-time TWAP deviation, orderbook liquidity, and volatility before triggering execution, partial tranches, or delays.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm transition-all hover:border-[#C8C2B4] hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3EE] text-[#1E4D40]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-serif font-bold text-[#1A1D1A]">Bounded Autonomy</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#686660]">
              Guarantees strategy completion via hard delay limits. The Uniswap v4 Hook automatically forces execution once max delay bounds are reached.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E3DDD1] py-8 text-center text-xs font-medium text-[#686660]">
        Meridian-DCA — Built for Hackathon Demo. Powered by Uniswap v4 Hooks & ERC-4626 Vaults.
      </footer>
    </div>
  );
}
