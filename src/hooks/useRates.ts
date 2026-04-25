import { useQuery } from '@tanstack/react-query';
import { fetchCurrencies, fetchLatestRates, fetchHistoricalData, convertCurrency } from '../services/api';
import { subDays, subMonths, format } from 'date-fns';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useRates(base: string) {
  return useQuery({
    queryKey: ['rates', base],
    queryFn: () => fetchLatestRates(base),
    enabled: !!base,
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 mins
  });
}

export function useConversion(amount: number, from: string, to: string) {
  return useQuery({
    queryKey: ['convert', amount, from, to],
    queryFn: () => convertCurrency(amount, from, to),
    enabled: amount > 0 && !!from && !!to,
    staleTime: 1000 * 60 * 1, // 1 min
  });
}

export type TimeFilter = '1W' | '1M' | '1Y' | '5Y';

export function useHistoricalRates(from: string, to: string, filter: TimeFilter) {
  return useQuery({
    queryKey: ['historical', from, to, filter],
    queryFn: async () => {
      const end = new Date();
      let start: Date;

      switch (filter) {
        case '1W':
          start = subDays(end, 7);
          break;
        case '1M':
          start = subMonths(end, 1);
          break;
        case '1Y':
          start = subMonths(end, 12);
          break;
        case '5Y':
          start = subMonths(end, 60);
          break;
        default:
          start = subDays(end, 7);
      }

      const response = await fetchHistoricalData(
        from,
        to,
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );

      // Transform data for recharts
      return Object.entries(response.rates).map(([date, rates]) => ({
        date,
        rate: rates[to],
      }));
    },
    enabled: !!from && !!to,
  });
}

export function useMultiHistoricalRates(
  from: string, 
  targets: string[], 
  filter: TimeFilter | 'custom',
  customStart?: string,
  customEnd?: string
) {
  return useQuery({
    queryKey: ['multi-historical', from, targets, filter, customStart, customEnd],
    queryFn: async () => {
      let startStr: string;
      let endStr: string;

      if (filter === 'custom' && customStart && customEnd) {
        startStr = customStart;
        endStr = customEnd;
      } else {
        const end = new Date();
        let start: Date;

        switch (filter) {
          case '1W':
            start = subDays(end, 7);
            break;
          case '1M':
            start = subMonths(end, 1);
            break;
          case '1Y':
            start = subMonths(end, 12);
            break;
          case '5Y':
            start = subMonths(end, 60);
            break;
          default:
            start = subDays(end, 7);
        }
        startStr = format(start, 'yyyy-MM-dd');
        endStr = format(end, 'yyyy-MM-dd');
      }

      const response = await fetchHistoricalData(
        from,
        targets.join(','),
        startStr,
        endStr
      );

      // Transform data for recharts: [{ date, EUR: 0.85, GBP: 0.75 }, ...]
      return Object.entries(response.rates).map(([date, rates]) => ({
        date,
        ...rates,
      }));
    },
    enabled: !!from && targets.length > 0 && (filter !== 'custom' || (!!customStart && !!customEnd)),
  });
}
