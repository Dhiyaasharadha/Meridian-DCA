import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  iconColor = 'text-[#1E4D40]',
  badge,
  badgeColor = 'bg-[#E8F3EE] text-[#1E4D40] border-[#B6DBC9]',
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E3DDD1] bg-white p-5 shadow-sm transition-all hover:border-[#C8C2B4] hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#686660]">{title}</span>
        {Icon && (
          <div className={`rounded-xl bg-[#F5F2EB] p-2 ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-[#1A1D1A] font-serif">{value}</span>
        {badge && (
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-bold ${
                changeType === 'positive'
                  ? 'text-[#1E4D40]'
                  : changeType === 'negative'
                  ? 'text-[#A83232]'
                  : 'text-[#686660]'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-[#686660]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
