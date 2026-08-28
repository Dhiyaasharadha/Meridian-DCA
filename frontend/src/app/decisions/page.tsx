'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DecisionRow } from '@/components/ui/DecisionRow';
import { useDecisionLog, DecisionFilter } from '@/hooks/useDecisionLog';
import { useStrategy } from '@/hooks/useStrategy';
import { Layers, Filter, ArrowUpDown, Sparkles, ShieldCheck } from 'lucide-react';

export default function DecisionLogPage() {
  const { strategy } = useStrategy();
  const { logs, isLoading, filter, setFilter, sortByScore, setSortByScore } =
    useDecisionLog(strategy?.strategyId);

  const filters: { id: DecisionFilter; label: string }[] = [
    { id: 'all', label: 'All Decisions' },
    { id: 'execute', label: 'Execute' },
    { id: 'partial', label: 'Partial' },
    { id: 'delay', label: 'Delay' },
    { id: 'forced', label: 'Forced' },
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
                <Layers className="h-4 w-4" /> Explainable AI Decision Engine
              </div>
              <h1 className="mt-1 text-3xl font-serif font-extrabold tracking-tight text-[#1A1D1A] sm:text-4xl">
                Decision Log
              </h1>
              <p className="mt-1 text-sm text-[#5A5852]">
                Every autonomous execution decision is transparent, explainable, and verifiable.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#B6DBC9] bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E4D40]">
              <Sparkles className="h-4 w-4" />
              <span>Reverse Chronological Audit Feed</span>
            </div>
          </div>

          {/* Filter & Sorting Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E3DDD1] bg-white p-4 shadow-sm">
            {/* Decision Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-[#686660] flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </span>
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    filter === f.id
                      ? 'bg-[#1E4D40] text-white shadow-sm'
                      : 'border border-[#E3DDD1] bg-[#FAFAFA] text-[#5A5852] hover:border-[#C8C2B4]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Score Sorting Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#686660] flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" /> Sort:
              </span>
              <button
                onClick={() =>
                  setSortByScore((prev) =>
                    prev === 'none' ? 'desc' : prev === 'desc' ? 'asc' : 'none'
                  )
                }
                className="rounded-xl border border-[#E3DDD1] bg-[#FAFAFA] px-3 py-1.5 font-mono text-xs font-semibold text-[#1A1D1A] transition-all hover:border-[#C8C2B4]"
              >
                {sortByScore === 'none'
                  ? 'Default (Time)'
                  : sortByScore === 'desc'
                  ? 'Score (High → Low)'
                  : 'Score (Low → High)'}
              </button>
            </div>
          </div>

          {/* Decision Log List */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E3DDD1] bg-white">
              <div className="text-center space-y-2">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1E4D40] border-t-transparent" />
                <p className="text-sm font-semibold text-[#686660]">Loading decision audit records...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#E3DDD1] bg-white text-center p-8">
              <ShieldCheck className="h-12 w-12 text-[#686660] mb-3" />
              <h3 className="text-base font-bold text-[#1A1D1A]">No Decision Records Found</h3>
              <p className="text-xs text-[#686660] mt-1">
                No decision logs match the selected filter query ({filter}).
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((record, index) => (
                <DecisionRow
                  key={record.id}
                  record={record}
                  defaultExpanded={index === 0}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
