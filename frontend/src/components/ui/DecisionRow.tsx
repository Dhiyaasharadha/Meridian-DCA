import React, { useState } from 'react';
import { DecisionRecord } from '@/lib/api';
import { DecisionBadge } from './DecisionBadge';
import { DecisionReason } from './DecisionReason';
import { formatTimestamp, formatDate, getDecisionBadgeStyle } from '@/lib/formatting';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface DecisionRowProps {
  record: DecisionRecord;
  defaultExpanded?: boolean;
}

export const DecisionRow: React.FC<DecisionRowProps> = ({
  record,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const style = getDecisionBadgeStyle(record.decision);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all ${style.cardBorder} bg-white shadow-sm hover:border-[#C8C2B4]`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-[#F9F7F2]"
      >
        <div className="flex items-center gap-4">
          <DecisionBadge decision={record.decision} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#1A1D1A]">
                Score: {record.score}/100
              </span>
              <span className="text-xs text-[#686660]">•</span>
              <span className="text-xs text-[#686660]">
                {formatTimestamp(record.timestamp)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#686660]">
              {formatDate(record.timestamp)}
            </p>
          </div>
        </div>

        {/* Right side metrics */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686660]">
              Recommended Tranche
            </span>
            <div className="font-mono text-sm font-bold text-[#1A1D1A]">
              {record.tranche}% allocation
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E3DDD1] bg-[#F5F2EB] text-[#5A5852]">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Primary Top Reason Preview */}
      {!isExpanded && record.reasons.length > 0 && (
        <div className="border-t border-[#E3DDD1] bg-[#F9F7F2] px-5 py-2.5">
          <p className="text-xs text-[#1A1D1A]">
            <span className="font-semibold text-[#686660]">Top Reason:</span>{' '}
            {record.reasons[0]}
          </p>
        </div>
      )}

      {/* Expandable Explanation Body */}
      {isExpanded && (
        <div className="border-t border-[#E3DDD1] bg-[#F9F7F2] p-6 space-y-6">
          {/* Explainability Section Header */}
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#1E4D40]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1D1A]">
                AI Autonomous Decision Explainability Log
              </h4>
            </div>
            <p className="mt-1 text-xs text-[#686660]">
              Evaluated market conditions against strategy parameters and ERC-4626 vault yield state.
            </p>
          </div>

          {/* Ranked Reasons */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#686660]">
              Ranked Decision Factors
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {record.reasons.map((reason, idx) => (
                <DecisionReason
                  key={idx}
                  index={idx + 1}
                  reason={reason}
                  decisionType={record.decision}
                />
              ))}
            </div>
          </div>

          {/* Market Snapshot at Decision Time */}
          {record.marketState && (
            <div className="rounded-xl border border-[#E3DDD1] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#686660]">
                  Market Snapshot at Execution Block
                </span>
                <span className="text-[11px] font-mono text-[#686660]">
                  Strategy ID: {record.strategyId.slice(0, 10)}...
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <span className="text-[10px] text-[#686660]">Current Price</span>
                  <div className="font-mono text-xs font-bold text-[#1A1D1A]">
                    ${record.marketState.currentPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#686660]">TWAP (24h)</span>
                  <div className="font-mono text-xs font-bold text-[#1A1D1A]">
                    ${record.marketState.twapPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#686660]">Deviation</span>
                  <div
                    className={`font-mono text-xs font-bold ${
                      record.marketState.priceDeviation > 1
                        ? 'text-[#C27D38]'
                        : 'text-[#1E4D40]'
                    }`}
                  >
                    {record.marketState.priceDeviation > 0 ? '+' : ''}
                    {record.marketState.priceDeviation}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#686660]">Volatility</span>
                  <div className="font-mono text-xs font-bold text-[#1A1D1A]">
                    {record.marketState.volatility}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
