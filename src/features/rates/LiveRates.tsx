import { useState, memo } from 'react';
import { useRates, useCurrencies } from '../../hooks/useRates';
import { Globe, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight } from 'lucide-react';
import { cn, getFlagUrl } from '../../lib/utils';
import { motion } from 'motion/react';
import { CurrencyDetailModal } from './CurrencyDetailModal';
import { HoverLiftWrapper } from '../../components/animations/HoverLiftWrapper';
import { Skeleton } from '../../components/ui/Skeleton';

interface LiveRatesProps {
  base: string;
  isGlassModeEnabled?: boolean;
}

const MAJOR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 
  'INR', 'RUB', 'BRL', 'ZAR', 'SGD', 'AED'
];

const RateItem = memo(({ 
  code, 
  rate, 
  index, 
  isGlassModeEnabled, 
  name, 
  onClick 
}: { 
  code: string; 
  rate: number; 
  index: number; 
  isGlassModeEnabled: boolean; 
  name: string;
  onClick: () => void;
}) => (
  <HoverLiftWrapper liftAmount={-4} scaleAmount={1.02} strongShadow={isGlassModeEnabled}>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group cursor-pointer active:scale-95 transform-gpu",
        isGlassModeEnabled 
          ? "glass-card" 
          : "bg-background border-border hover:bg-card-bg"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-card-bg shadow-sm rounded-xl overflow-hidden flex items-center justify-center font-black text-xs text-primary border border-border group-hover:scale-110 transition-transform">
          <img 
            src={getFlagUrl(code)} 
            alt={code} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-ink text-sm tracking-tight">{code}</span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-tight truncate max-w-[80px]">
              {name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
          <span className="text-lg font-black text-emerald-500 tabular-nums">{rate.toFixed(4)}</span>
          <ChevronRight className="w-4 h-4 text-border group-hover:text-primary transition-colors" />
      </div>
    </motion.div>
  </HoverLiftWrapper>
));

export function LiveRates({ base, isGlassModeEnabled = false }: LiveRatesProps) {
  const { data: ratesData, isLoading, refetch, isFetching } = useRates(base);
  const { data: currencies } = useCurrencies();
  
  const [selectedCurrency, setSelectedCurrency] = useState<{code: string; name: string} | null>(null);

  const rates = Object.entries(ratesData?.rates || {})
    .filter(([code]) => code !== base && MAJOR_CURRENCIES.includes(code))
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <>
      <div className={cn(isGlassModeEnabled ? "glass-card" : "sleek-card", "p-8 md:p-10")}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-ink-deep leading-none tracking-tight">Live Exchange Rates</h2>
              <p className="text-secondary font-bold text-[11px] uppercase tracking-widest">Market benchmark for 1 {base}</p>
            </div>
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border hover:bg-primary/5 text-secondary rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
              Sync Rates
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border border-transparent",
                  isGlassModeEnabled ? "glass-card" : "bg-card-bg border-border"
                )}>
                  <div className="flex items-center gap-4">
                    <Skeleton variant="circle" className="w-10 h-10" isGlass={isGlassModeEnabled} />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-12" isGlass={isGlassModeEnabled} />
                      <Skeleton className="h-2 w-20" isGlass={isGlassModeEnabled} />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" isGlass={isGlassModeEnabled} />
                </div>
              ))
            ) : rates.length > 0 ? (
              rates.map(([code, rate], index) => (
                <RateItem 
                  key={code}
                  code={code}
                  rate={rate}
                  index={index}
                  isGlassModeEnabled={isGlassModeEnabled}
                  name={currencies?.[code] || code}
                  onClick={() => setSelectedCurrency({
                    code,
                    name: currencies?.[code] || code
                  })}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-secondary text-sm font-bold uppercase tracking-widest bg-background border-2 border-dashed border-border rounded-3xl">
                No live data available for this market
              </div>
            )}
          </div>
        </div>

      <CurrencyDetailModal
        isOpen={!!selectedCurrency}
        onClose={() => setSelectedCurrency(null)}
        currencyCode={selectedCurrency?.code || ''}
        currencyName={selectedCurrency?.name || ''}
      />
    </>
  );
}
