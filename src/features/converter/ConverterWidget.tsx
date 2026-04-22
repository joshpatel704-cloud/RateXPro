import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { useCurrencies, useConversion } from '../../hooks/useRates';
import { CurrencySelect } from '../../components/ui/CurrencySelect';
import { formatCurrency, cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ConverterWidgetProps {
  onFromChange?: (from: string) => void;
  onToChange?: (to: string) => void;
}

export function ConverterWidget({ onFromChange, onToChange }: ConverterWidgetProps) {
  const [amount, setAmount] = useState<string>('');
  const [from, setFrom] = useState(() => localStorage.getItem('conv_from') || 'USD');
  const [to, setTo] = useState(() => localStorage.getItem('conv_to') || 'EUR');
  
  const parsedAmount = parseFloat(amount) || 0;
  
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: conversion, isLoading: conversionLoading, isError, refetch } = useConversion(
    parsedAmount,
    from,
    to
  );

  const isZero = parsedAmount === 0;

  useEffect(() => {
    localStorage.setItem('conv_from', from);
    if (onFromChange) {
      onFromChange(from);
    }
  }, [from, onFromChange]);

  useEffect(() => {
    localStorage.setItem('conv_to', to);
    if (onToChange) {
      onToChange(to);
    }
  }, [to, onToChange]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  if (currenciesLoading) {
    return (
      <div className="sleek-card p-8 flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-secondary font-medium">Initializing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sleek-card p-8 md:p-12 flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 items-end">
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-widest pl-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="sleek-input text-xl font-bold py-4"
            placeholder="0.00"
          />
        </div>

        <div className="flex items-end gap-0">
          <div className="flex-1 min-w-0">
            <CurrencySelect
              label="From"
              value={from}
              onChange={setFrom}
              options={currencies || {}}
            />
          </div>
          
          <button
            onClick={swapCurrencies}
            className="mx-4 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center cursor-pointer text-primary transition-all hover:bg-primary/5 hover:scale-110 active:scale-95 mb-[3px] shrink-0"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <CurrencySelect
              label="To"
              value={to}
              onChange={setTo}
              options={currencies || {}}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-border">
        <div className="flex flex-col gap-2">
           {isZero && !conversionLoading && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <p className="text-primary font-black text-xl md:text-2xl opacity-90">
                0 {from} =
              </p>
              <h3 className="text-4xl md:text-6xl font-black text-ink-deep tracking-tight mt-1">
                {formatCurrency(0, to)} {to}
              </h3>
            </motion.div>
           )}

           {conversion && !conversionLoading && !isZero && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <p className="text-primary font-black text-xl md:text-2xl opacity-90">
                {parsedAmount.toLocaleString()} {from} =
              </p>
              <h3 className="text-4xl md:text-6xl font-black text-ink-deep tracking-tight mt-1">
                {formatCurrency(conversion.rates[to] * parsedAmount, to)} {to}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <span className="text-sm font-bold text-secondary bg-background border border-border px-3 py-1 rounded-lg">
                  1 {from} = {conversion.rates[to].toFixed(6)} {to}
                </span>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Last updated: {new Date().toLocaleTimeString([], { hour12: false })} UTC
                </span>
              </div>
            </motion.div>
          )}
          
          {conversionLoading && (
            <div className="flex flex-col gap-4">
               <div className="h-8 w-48 bg-background border border-border rounded-lg animate-pulse" />
               <div className="h-16 w-64 bg-background border border-border rounded-lg animate-pulse" />
            </div>
          )}
        </div>

        <button
          onClick={() => refetch()}
          disabled={conversionLoading}
          className="w-full md:w-auto md:min-w-[280px] py-6 bg-primary hover:opacity-90 text-white rounded-2xl text-xl font-black transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest px-10"
        >
          {conversionLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Convert'}
        </button>
      </div>

      <div className="text-center md:text-left mt-4">
        <p className="text-secondary text-xs font-bold uppercase tracking-widest">
          Mid-market rates. For informational purposes only.
        </p>
      </div>
    </div>
  );
}
