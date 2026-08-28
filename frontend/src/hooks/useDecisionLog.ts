import { useState, useEffect, useMemo } from 'react';
import { fetchDecisionLog, DecisionRecord } from '@/lib/api';
import { useStrategyStore } from '@/store/strategyStore';

export type DecisionFilter = 'all' | 'execute' | 'partial' | 'delay' | 'forced';

export function useDecisionLog(strategyId?: string) {
  const { getActiveStrategy, demoScenario } = useStrategyStore();
  const activeStrategy = getActiveStrategy();
  const targetId = strategyId || activeStrategy?.strategyId || '';

  const [logs, setLogs] = useState<DecisionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<DecisionFilter>('all');
  const [sortByScore, setSortByScore] = useState<'desc' | 'asc' | 'none'>('none');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchDecisionLog(targetId, demoScenario)
      .then((data) => {
        if (isMounted) {
          setLogs(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching decision log:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetId, demoScenario]);

  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];

    // Filter by decision type
    if (filter !== 'all') {
      result = result.filter((item) => item.decision.toLowerCase() === filter);
    }

    // Sort by score
    if (sortByScore === 'desc') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortByScore === 'asc') {
      result.sort((a, b) => a.score - b.score);
    }
    // Default: reverse chronological order (handled by dataset / API)

    return result;
  }, [logs, filter, sortByScore]);

  return {
    logs: filteredAndSortedLogs,
    rawLogsCount: logs.length,
    isLoading,
    filter,
    setFilter,
    sortByScore,
    setSortByScore,
  };
}
