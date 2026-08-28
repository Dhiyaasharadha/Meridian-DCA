import React from 'react';
import { Cpu } from 'lucide-react';
import { CreateStrategyFormInput } from '@/lib/validation';
import { SUPPORTED_ASSETS } from '@/contracts/addresses';

interface StrategySummaryProps {
  formData: CreateStrategyFormInput;
}

export const StrategySummary: React.FC<StrategySummaryProps> = ({ formData }) => {
  const assetObj = SUPPORTED_ASSETS.find((a) => a.symbol === formData.asset) || SUPPORTED_ASSETS[0];

  return (
    <div className="rounded-2xl border border-[#B6DBC9] bg-[#E8F3EE] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#B6DBC9] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4D40]">
            Strategy Live Preview
          </span>
          <h3 className="text-lg font-serif font-bold text-[#1A1D1A]">
            Meridian-DCA Strategy
          </h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E4D40] text-white font-bold text-lg shadow-sm">
          {assetObj.icon}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-[#686660]">Target Asset</span>
          <div className="font-mono text-base font-bold text-[#1A1D1A]">
            {formData.asset} <span className="text-xs text-[#686660]">({assetObj.name})</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-[#686660]">Tranche Capital</span>
          <div className="font-mono text-base font-bold text-[#1A1D1A]">
            ${formData.amount ? Number(formData.amount).toLocaleString() : '0'} USD
          </div>
        </div>

        <div>
          <span className="text-xs text-[#686660]">DCA Frequency</span>
          <div className="font-mono text-sm font-semibold text-[#1A1D1A]">
            {formData.frequency}
          </div>
        </div>

        <div>
          <span className="text-xs text-[#686660]">Max Delay Cycles</span>
          <div className="font-mono text-sm font-semibold text-[#C27D38]">
            {formData.maxDelay || '0'} allowed delays
          </div>
        </div>

        <div>
          <span className="text-xs text-[#686660]">Max Slippage Cap</span>
          <div className="font-mono text-sm font-semibold text-[#1E4D40]">
            {formData.maxSlippage || '0'}%
          </div>
        </div>

        <div>
          <span className="text-xs text-[#686660]">Yield Engine</span>
          <div className="font-mono text-sm font-semibold text-[#1A1D1A]">
            ERC-4626 Vault (~5.4% APY)
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#B6DBC9] bg-white/80 p-3 text-xs text-[#5A5852]">
        <Cpu className="h-4 w-4 shrink-0 text-[#1E4D40]" />
        <span>
          Capital will be held in the ERC-4626 Vault accruing yield until Uniswap v4 Hook approves execution.
        </span>
      </div>
    </div>
  );
};
