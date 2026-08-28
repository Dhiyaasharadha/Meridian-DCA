'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/ui/MetricCard';
import { DelayProgress } from '@/components/ui/DelayProgress';
import { MarketMetric } from '@/components/ui/MarketMetric';
import { DecisionBadge } from '@/components/ui/DecisionBadge';
import { ExecutionScore } from '@/components/ui/ExecutionScore';
import { CapitalFlow } from '@/components/ui/CapitalFlow';
import { DecisionReason } from '@/components/ui/DecisionReason';

import { useStrategy } from '@/hooks/useStrategy';
import { useVaultYield } from '@/hooks/useVaultYield';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import { formatCurrency, formatPercent, formatDate, getDecisionBadgeStyle, shortenAddress } from '@/lib/formatting';
import { Wallet, Vault, TrendingUp, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const { strategy, demoState } = useStrategy();
  const { yieldData } = useVaultYield(strategy?.strategyId);
  const { logs } = useDecisionLog(strategy?.strategyId);

  const currentLog = {
    id: logs[0]?.id || 'live-latest',
    strategyId: strategy?.strategyId || '1',
    timestamp: logs[0]?.timestamp || new Date().toISOString(),
    decision: (demoState?.decision as any) || logs[0]?.decision || 'execute',
    score: demoState?.score ?? logs[0]?.score ?? 82,
    reasons: demoState?.reasons?.map((r: any) => (typeof r === 'string' ? r : r.label || r.factor)) || logs[0]?.reasons || [
      'Productive Vault Yield (+5.4% APY)',
      'Low Slippage (0.18% pool depth)',
      'Low Execution Pressure (2/5 delays)',
    ],
    tranche: demoState?.executionPercentage ?? logs[0]?.tranche ?? 100,
    marketState: {
      currentPrice: demoState?.market.currentPrice ?? logs[0]?.marketState.currentPrice ?? 94250,
      twapPrice: demoState?.market.twap ?? logs[0]?.marketState.twapPrice ?? 94110,
      priceDeviation: demoState?.market.priceDeviation ?? logs[0]?.marketState.priceDeviation ?? 0.15,
      volatility: (demoState?.market.volatility as any) ?? logs[0]?.marketState.volatility ?? 'Low',
      liquidityDepth: (demoState?.market.liquidity as any) ?? logs[0]?.marketState.liquidityDepth ?? 'High',
      slippage: demoState?.market.slippage ?? logs[0]?.marketState.slippage ?? 0.18,
      executionUrgency: (strategy?.delayCount ?? 2) >= (strategy?.maxDelay ?? 5) ? 'Critical' : 'Normal',
    },
  };

  const decisionStyle = getDecisionBadgeStyle(currentLog.decision);

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1A1D1A] flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DDD1] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E4D40]">
                <ShieldCheck className="h-4 w-4" /> Live Engine Dashboard
              </div>
              <h1 className="mt-1 text-3xl font-serif font-extrabold tracking-tight text-[#1A1D1A] sm:text-4xl">
                Strategy Dashboard
              </h1>
              <p className="mt-1 font-mono text-xs text-[#5A5852]">
                Strategy ID: <span className="text-[#1A1D1A] font-bold">#{strategy?.strategyId || '1'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/decisions"
                className="flex items-center gap-2 rounded-xl border border-[#E3DDD1] bg-white px-4 py-2.5 text-xs font-bold text-[#1A1D1A] shadow-sm transition-all hover:bg-[#F9F7F2]"
              >
                <span>View Decision Log</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Capital"
              value={formatCurrency(strategy?.amount || 2500)}
              subtitle={`Target Asset: ${strategy?.asset || 'BTC'}`}
              icon={Wallet}
              iconColor="text-[#1E4D40]"
              badge="Active Strategy"
            />

            <MetricCard
              title="Vault Balance"
              value={formatCurrency(yieldData.vaultBalance)}
              subtitle="ERC-4626 Productive Capital"
              icon={Vault}
              iconColor="text-[#1E4D40]"
              change="+0.42%"
              changeType="positive"
            />

            <MetricCard
              title="Yield Earned"
              value={formatCurrency(yieldData.yieldEarned)}
              subtitle={`APY: ${yieldData.apy}% (${formatPercent(yieldData.yieldPercentage)})`}
              icon={TrendingUp}
              iconColor="text-[#1E4D40]"
              badge="Live 5s Polling"
              badgeColor="bg-[#E8F3EE] text-[#1E4D40] border-[#B6DBC9] animate-pulse"
            />

            <MetricCard
              title="Next DCA Execution"
              value={formatDate(Date.now() + 86400000 * 4)}
              subtitle={`Frequency: ${strategy?.frequency || 'Weekly'}`}
              icon={Clock}
              iconColor="text-[#C27D38]"
            />
          </div>

          {/* Bounded Autonomy & Current Decision Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Bounded Autonomy Indicator */}
            <div className="lg:col-span-6">
              <DelayProgress
                delayCount={strategy?.delayCount ?? 2}
                maxDelay={strategy?.maxDelay ?? 5}
              />
            </div>

            {/* AI Execution Decision Card */}
            <div className="lg:col-span-6">
              <div
                className={`relative overflow-hidden rounded-2xl border ${decisionStyle.cardBorder} bg-white p-6 shadow-sm space-y-5`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
                      Real-Time AI Execution Decision
                    </span>
                    <h3 className="mt-0.5 text-lg font-serif font-bold text-[#1A1D1A]">
                      Uniswap v4 Hook Decision State
                    </h3>
                  </div>
                  <DecisionBadge decision={currentLog.decision} size="lg" />
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-4">
                  <div>
                    <span className="text-xs text-[#686660]">Execution Score</span>
                    <div className="font-serif text-2xl font-black text-[#1A1D1A]">
                      {currentLog.score} <span className="text-xs font-normal text-[#686660]">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#686660]">Recommended Tranche</span>
                    <div className="font-mono text-2xl font-black text-[#1E4D40]">
                      {currentLog.tranche}%
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
                    Primary Execution Reason
                  </span>
                  <div className="mt-2">
                    <DecisionReason
                      index={1}
                      reason={currentLog.reasons[0] || 'Market conditions evaluated as optimal'}
                      decisionType={currentLog.decision}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Conditions & Decision Score Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Current Market Conditions */}
            <div className="lg:col-span-8 rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#686660]">
                    Current Market Conditions
                  </h3>
                  <p className="text-xs text-[#5A5852]">
                    Uniswap v4 pool telemetry & TWAP indicators
                  </p>
                </div>
                <span className="rounded-full bg-[#F5F2EB] border border-[#E3DDD1] px-3 py-1 font-mono text-xs text-[#1A1D1A]">
                  Block #19842910
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MarketMetric
                  label="Current Price"
                  value={`$${currentLog.marketState.currentPrice.toLocaleString()}`}
                  subValue="Spot Index"
                />
                <MarketMetric
                  label="24h TWAP"
                  value={`$${currentLog.marketState.twapPrice.toLocaleString()}`}
                  subValue="Time-Weighted Avg"
                />
                <MarketMetric
                  label="Price Deviation"
                  value={`${currentLog.marketState.priceDeviation > 0 ? '+' : ''}${currentLog.marketState.priceDeviation}%`}
                  subValue="Vs TWAP baseline"
                  highlight={currentLog.marketState.priceDeviation > 1 ? 'warning' : 'positive'}
                />
                <MarketMetric
                  label="Volatility"
                  value={currentLog.marketState.volatility}
                  subValue="4h window"
                />
                <MarketMetric
                  label="Liquidity Depth"
                  value={currentLog.marketState.liquidityDepth}
                  subValue="Orderbook thickness"
                  highlight="positive"
                />
                <MarketMetric
                  label="Pool Slippage"
                  value={`${currentLog.marketState.slippage}%`}
                  subValue="Cap: 0.50%"
                  highlight="positive"
                />
                <MarketMetric
                  label="Price Impact"
                  value="0.04%"
                  subValue="Minimal impact"
                  highlight="positive"
                />
                <MarketMetric
                  label="Execution Urgency"
                  value={currentLog.marketState.executionUrgency}
                  subValue="Circuit Evaluator"
                />
              </div>
            </div>

            {/* Decision Score Factor Visualizer */}
            <div className="lg:col-span-4 rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm">
              <ExecutionScore score={currentLog.score} showBreakdown={true} />
            </div>
          </div>

          {/* Strategy Lifecycle Flow */}
          <CapitalFlow activeStage="vault" />

          {/* Recent Decisions Feed */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#686660]">
                  Recent Autonomous Decision History
                </h3>
                <p className="text-xs text-[#5A5852]">
                  Latest execution decisions generated by Meridian-DCA
                </p>
              </div>
              <Link
                href="/decisions"
                className="flex items-center gap-1 text-xs font-bold text-[#1E4D40] hover:underline"
              >
                <span>View Full Decision Log</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {logs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-4 transition-all hover:border-[#C8C2B4] hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <DecisionBadge decision={log.decision} size="sm" />
                    <div>
                      <div className="font-mono text-sm font-bold text-[#1A1D1A]">
                        Score {log.score}/100 — Tranche {log.tranche}%
                      </div>
                      <p className="text-xs text-[#686660] truncate max-w-md">
                        {log.reasons[0]}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-[#686660]">
                    {formatDate(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
