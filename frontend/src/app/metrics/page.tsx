'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/ui/MetricCard';
import { useVaultYield } from '@/hooks/useVaultYield';
import { useStrategy } from '@/hooks/useStrategy';
import { fetchMetrics, MetricsResponse } from '@/lib/api';
import { BarChart3, TrendingUp, Coins, Percent, Scale } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export default function MetricsPage() {
  const { strategy } = useStrategy();
  const { yieldData } = useVaultYield(strategy?.strategyId);

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    fetchMetrics(strategy?.strategyId || '1').then((res) => {
      if (res) setMetrics(res);
    });
  }, [strategy?.strategyId]);

  const yieldEarned = metrics?.yieldGenerated ?? yieldData.yieldEarned;
  const slippageSaved = metrics?.slippageSaved ?? 142.50;
  const liquidityAdvantage = metrics?.liquidityAdvantage ?? 98.00;
  const executionCost = metrics?.executionCost ?? 32.40;

  // Live vs Illustrative calculation
  const isLive = metrics ? metrics.demoBenchmark === false : false;
  const traditionalDcaScore = metrics?.traditionalDcaScore ?? 62;
  const meridianDcaScore = metrics?.yieldGuardScore ?? 89;

  const scoreDifference = meridianDcaScore - traditionalDcaScore; // 89 - 62 = 27
  const relativeImprovement = ((meridianDcaScore - traditionalDcaScore) / traditionalDcaScore) * 100; // 43.55%

  const comparisonLabel = isLive ? "Live Engine Benchmark" : "Illustrative Demo Comparison";
  const percentageText = isLive
    ? `${relativeImprovement.toFixed(1)}% higher efficiency score`
    : "43.5% higher illustrative score";

  // Side by Side Comparison Data for Recharts
  const comparisonData = [
    {
      metric: 'Efficiency Score',
      'Traditional DCA': traditionalDcaScore,
      'Meridian-DCA': meridianDcaScore,
    },
    {
      metric: 'Yield Earned ($)',
      'Traditional DCA': 0,
      'Meridian-DCA': Math.round(yieldEarned),
    },
    {
      metric: 'Slippage Saved ($)',
      'Traditional DCA': 15,
      'Meridian-DCA': Math.round(slippageSaved),
    },
    {
      metric: 'Liquidity Boost ($)',
      'Traditional DCA': 0,
      'Meridian-DCA': Math.round(liquidityAdvantage),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1A1D1A] flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Header />

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DDD1] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E4D40]">
                <BarChart3 className="h-4 w-4" /> Quantitative Performance Analytics
              </div>
              <h1 className="mt-1 text-3xl font-serif font-extrabold tracking-tight text-[#1A1D1A] sm:text-4xl">
                Capital Efficiency
              </h1>
              <p className="mt-1 text-sm text-[#5A5852]">
                Measure how much more efficiently capital is deployed compared to static DCA engines.
              </p>
            </div>

            <div className="rounded-xl border border-[#E3DDD1] bg-white px-4 py-2 text-xs font-bold text-[#1A1D1A]">
              Formula: <span className="font-mono text-[#1E4D40]">(Yield + Slippage + Liquidity) / Cost</span>
            </div>
          </div>

          {/* Headline Comparison Banner */}
          <div className="rounded-2xl border border-[#B6DBC9] bg-[#E8F3EE] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D40]">
                  Headline Capital Efficiency Score
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1A1D1A]">Traditional DCA vs Meridian-DCA</h3>
              </div>
              <span className="rounded-full bg-[#FDF4EB] border border-[#F5D8B8] px-3 py-1 text-xs font-bold text-[#C27D38]">
                {comparisonLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Traditional DCA Card */}
              <div className="rounded-xl border border-[#E3DDD1] bg-white p-5 text-center shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">
                  Traditional Static DCA
                </span>
                <div className="mt-2 font-serif text-5xl font-black text-[#686660]">
                  {traditionalDcaScore} <span className="text-xs font-normal text-[#686660]">/ 100</span>
                </div>
                <p className="mt-2 text-xs text-[#686660]">
                  Zero yield while waiting; vulnerable to volatility spikes & pool slippage.
                </p>
              </div>

              {/* Meridian-DCA Card */}
              <div className="rounded-xl border border-[#B6DBC9] bg-white p-5 text-center shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D40]">
                  Meridian-DCA (v4 Hook)
                </span>
                <div className="mt-2 font-serif text-5xl font-black text-[#1E4D40]">
                  {meridianDcaScore} <span className="text-xs font-normal text-[#1E4D40]">/ 100</span>
                </div>
                <p className="mt-2 text-xs text-[#1E4D40] font-semibold">
                  {percentageText} (+{scoreDifference} pts difference) driven by ERC-4626 vault yield & execution timing.
                </p>
              </div>
            </div>
          </div>

          {/* Core Metric 4 Components Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Yield Generated"
              value={`$${yieldEarned.toFixed(2)}`}
              subtitle="ERC-4626 Vault Accrual"
              icon={TrendingUp}
              iconColor="text-[#1E4D40]"
              badge="Component 1"
            />

            <MetricCard
              title="Slippage Saved"
              value={`$${slippageSaved.toFixed(2)}`}
              subtitle="Avoided volatile pools"
              icon={Percent}
              iconColor="text-[#1E4D40]"
              badge="Component 2"
            />

            <MetricCard
              title="Liquidity Advantage"
              value={`$${liquidityAdvantage.toFixed(2)}`}
              subtitle="Uniswap v4 depth routing"
              icon={Coins}
              iconColor="text-[#1E4D40]"
              badge="Component 3"
            />

            <MetricCard
              title="Execution Cost"
              value={`$${executionCost.toFixed(2)}`}
              subtitle="Gas & pool swap fees"
              icon={Scale}
              iconColor="text-[#A83232]"
              badge="Denominator"
              badgeColor="bg-[#FCEAEB] text-[#A83232] border-[#F4C5C5]"
            />
          </div>

          {/* Comparison Recharts Bar Chart */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#686660]">
                  Performance Breakdown Comparison Chart
                </h3>
                <p className="text-xs text-[#5A5852]">
                  Comparing Traditional DCA vs Meridian-DCA performance metrics
                </p>
              </div>
              <span className="text-xs text-[#686660] italic">
                *{comparisonLabel}
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="metric" stroke="#686660" fontSize={12} tickLine={false} />
                  <YAxis stroke="#686660" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E3DDD1',
                      borderRadius: '0.75rem',
                      color: '#1A1D1A',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Traditional DCA" fill="#8C8982" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Meridian-DCA" fill="#1E4D40" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Activity & Strategy Telemetry */}
          <div className="rounded-2xl border border-[#E3DDD1] bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#686660]">
              Live Strategy Execution Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Capital Deposited</span>
                <div className="font-mono text-sm font-bold text-[#1A1D1A]">${(metrics?.totalCapital || strategy?.amount || 2500).toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Capital Remaining</span>
                <div className="font-mono text-sm font-bold text-[#1E4D40]">${(metrics?.capitalRemaining || 1500).toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Avg Execution Score</span>
                <div className="font-mono text-sm font-bold text-[#1A1D1A]">{metrics?.averageExecutionScore || 85} / 100</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Avg Cycle Delay</span>
                <div className="font-mono text-sm font-bold text-[#C27D38]">{metrics?.averageDelay || 1.8} cycles</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Full Executions</span>
                <div className="font-mono text-sm font-bold text-[#1E4D40]">{metrics?.executeCount || 4} cycles</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Partial Executions</span>
                <div className="font-mono text-sm font-bold text-[#C27D38]">{metrics?.partialCount || 2} cycles</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Delays Triggered</span>
                <div className="font-mono text-sm font-bold text-[#5A5852]">{metrics?.delayCount || 3} cycles</div>
              </div>
              <div className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] p-3.5">
                <span className="text-[10px] uppercase text-[#686660]">Forced Executions</span>
                <div className="font-mono text-sm font-bold text-[#A83232]">{metrics?.forcedCount || 1} cycle</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
