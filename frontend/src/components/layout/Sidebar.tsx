'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Layers, BarChart3, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStrategyStore } from '@/store/strategyStore';
import { shortenAddress } from '@/lib/formatting';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { getActiveStrategy, strategies, setActiveStrategyId, activeStrategyId } = useStrategyStore();
  const activeStrategy = getActiveStrategy();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create', label: 'Create Strategy', icon: PlusCircle },
    { href: '/decisions', label: 'Decision Log', icon: Layers, badge: 'Explainable AI' },
    { href: '/metrics', label: 'Metrics', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#E3DDD1] bg-[#EFECE4] backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-[#E3DDD1] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E4D40] font-extrabold text-xs text-white shadow-md">
          MD
        </div>
        <div>
          <h1 className="text-base font-serif font-extrabold tracking-tight text-[#1A1D1A]">
            Meridian-DCA
          </h1>
          <p className="text-[10px] font-semibold text-[#1E4D40] tracking-wider uppercase">
            Uniswap v4 Engine
          </p>
        </div>
      </div>

      {/* Active Strategy Indicator Card */}
      <div className="p-4">
        <div className="rounded-xl border border-[#B6DBC9] bg-[#E8F3EE] p-3 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#1E4D40] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Active Strategy
            </span>
            <span className="font-mono text-[10px] bg-[#1E4D40] text-white px-1.5 py-0.5 rounded font-bold">
              {activeStrategy?.asset || 'BTC'}
            </span>
          </div>

          <div className="mt-2 font-mono text-xs font-bold text-[#1A1D1A] truncate">
            {shortenAddress(activeStrategy?.strategyId)}
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#5A5852]">
            <span>Capital: ${activeStrategy?.amount?.toLocaleString() || '2,500'}</span>
            <span className="text-[#C27D38] font-semibold">{activeStrategy?.maxDelay || 5} Max Delays</span>
          </div>

          {/* Strategy Switcher Dropdown */}
          {Object.keys(strategies).length > 1 && (
            <select
              value={activeStrategyId || ''}
              onChange={(e) => setActiveStrategyId(e.target.value)}
              className="mt-2.5 w-full rounded-lg border border-[#E3DDD1] bg-white px-2 py-1 font-mono text-xs text-[#1A1D1A] focus:border-[#1E4D40] focus:outline-none"
            >
              {Object.values(strategies).map((s) => (
                <option key={s.strategyId} value={s.strategyId}>
                  {s.asset} - {shortenAddress(s.strategyId)} (${s.amount})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1E4D40] text-white shadow-sm font-semibold'
                  : 'text-[#5A5852] hover:bg-[#E2DDD2] hover:text-[#1A1D1A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-[#686660] group-hover:text-[#1A1D1A]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[#E8F3EE] text-[#1E4D40]'}`}>
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`h-4 w-4 opacity-0 transition-opacity ${isActive ? 'opacity-100 text-white' : 'group-hover:opacity-100 text-[#686660]'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="border-t border-[#E3DDD1] p-4">
        <div className="flex items-center gap-2 text-xs text-[#5A5852]">
          <span className="h-2 w-2 rounded-full bg-[#1E4D40] animate-pulse" />
          <span className="font-semibold text-[#1A1D1A]">Anvil Node Connected</span>
        </div>
        <div className="mt-1 font-mono text-[10px] text-[#686660]">
          Chain ID: 31337 (Localhost)
        </div>
      </div>
    </aside>
  );
};
