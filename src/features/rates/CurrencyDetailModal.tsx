import { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrencies } from '../../hooks/useRates';
import { CurrencySelect } from '../../components/ui/CurrencySelect';
import { HistoricalChart } from '../charts/HistoricalChart';
import { cn, getFlagUrl } from '../../lib/utils';

interface CurrencyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencyCode: string;
  currencyName: string;
}

export function CurrencyDetailModal({ isOpen, onClose, currencyCode, currencyName }: CurrencyDetailModalProps) {
  const { data: currencies } = useCurrencies();
  const [compareWith, setCompareWith] = useState('USD');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 cursor-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-card-bg rounded-[32px] border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-border flex items-center justify-between sticky top-0 bg-card-bg/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center text-primary border border-primary/20">
                  <img 
                    src={getFlagUrl(currencyCode)} 
                    alt={currencyCode} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-3xl font-black text-ink-deep leading-tight tracking-tight uppercase">
                    {currencyCode} Analysis
                  </h3>
                  <p className="text-secondary font-bold text-xs uppercase tracking-widest">
                    {currencyName || currencyCode} Market Detail
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-background border border-transparent hover:border-border rounded-2xl transition-all group"
              >
                <X className="w-6 h-6 text-secondary group-hover:text-ink-deep transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col gap-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-1">Comparison Market</p>
                  <p className="text-ink-deep font-medium text-lg leading-relaxed max-w-md">
                    Analyze the performance of <span className="text-primary font-bold">{currencyCode}</span> against other global benchmarks. 
                  </p>
                </div>
                
                <div className="w-full md:w-[320px]">
                  <CurrencySelect
                    label="Compare with:"
                    value={compareWith}
                    onChange={setCompareWith}
                    options={currencies || {}}
                  />
                </div>
              </div>

              <div className="w-full">
                <HistoricalChart from={currencyCode} to={compareWith} isEmbed={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                 <div className="p-6 bg-background rounded-3xl border border-border flex flex-col gap-4">
                    <p className="text-primary font-black text-[10px] uppercase tracking-widest">Market Recommendation</p>
                    <p className="text-ink text-sm font-medium leading-relaxed">
                        Currently analyzing {currencyCode}/{compareWith} trends. Ensure you monitor the 1-month outlook for consistent market volatility patterns.
                    </p>
                 </div>
                 <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col gap-4">
                    <p className="text-primary font-black text-[10px] uppercase tracking-widest">Secure Core Analytics</p>
                    <p className="text-ink text-sm font-medium leading-relaxed">
                        Data provided via Alpha Global Stream. Encrypted, high-fidelity financial insights for professional accuracy.
                    </p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
