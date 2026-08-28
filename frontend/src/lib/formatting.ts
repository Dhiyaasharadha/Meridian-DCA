/**
 * Meridian-DCA - Formatting Utilities & Warm Color Palette Mappings
 */

export function formatCurrency(val: number | string | bigint | undefined, decimals = 2): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '$0.00';
  const num = Number(val);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatNumber(val: number | string | undefined, decimals = 2): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  const num = Number(val);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(val: number | string | undefined, decimals = 2): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '0.00%';
  const num = Number(val);
  const prefix = num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(decimals)}%`;
}

export function shortenAddress(addr: string | undefined): string {
  if (!addr) return '0x000...0000';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatTimestamp(timestamp: string | number | undefined): string {
  if (!timestamp) return 'Just now';
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDate(timestamp: string | number | undefined): string {
  if (!timestamp) return '';
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDecisionBadgeStyle(decision: string) {
  const normalized = (decision || '').toLowerCase();
  switch (normalized) {
    case 'execute':
      return {
        bg: 'bg-[#E8F3EE] border-[#B6DBC9] text-[#1E4D40]',
        dot: 'bg-[#1E4D40]',
        cardBorder: 'border-[#B6DBC9] shadow-[#1E4D40]/5',
        gradient: 'from-[#E8F3EE] via-white to-white',
        label: 'EXECUTE',
      };
    case 'partial':
      return {
        bg: 'bg-[#FDF4EB] border-[#F5D8B8] text-[#C27D38]',
        dot: 'bg-[#C27D38]',
        cardBorder: 'border-[#F5D8B8] shadow-[#C27D38]/5',
        gradient: 'from-[#FDF4EB] via-white to-white',
        label: 'PARTIAL',
      };
    case 'delay':
      return {
        bg: 'bg-[#EAE6DF] border-[#D6D0C4] text-[#5A5852]',
        dot: 'bg-[#5A5852]',
        cardBorder: 'border-[#D6D0C4] shadow-black/5',
        gradient: 'from-[#EAE6DF]/40 via-white to-white',
        label: 'DELAY',
      };
    case 'forced':
      return {
        bg: 'bg-[#FCEAEB] border-[#F4C5C5] text-[#A83232]',
        dot: 'bg-[#A83232]',
        cardBorder: 'border-[#F4C5C5] shadow-[#A83232]/5',
        gradient: 'from-[#FCEAEB] via-white to-white',
        label: 'FORCED',
      };
    default:
      return {
        bg: 'bg-gray-100 border-gray-300 text-gray-700',
        dot: 'bg-gray-500',
        cardBorder: 'border-gray-200',
        gradient: 'from-gray-50 to-white',
        label: (decision || 'UNKNOWN').toUpperCase(),
      };
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#1E4D40'; // Forest Green
  if (score >= 50) return '#C27D38'; // Terracotta Ochre
  if (score >= 30) return '#686660'; // Taupe Gray
  return '#A83232'; // Crimson Red
}
