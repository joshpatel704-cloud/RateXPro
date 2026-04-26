import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useHistoricalRates, TimeFilter } from '../../hooks/useRates';
import { cn } from '../../lib/utils';
import { TrendingUp, Clock, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { HoverLiftWrapper } from '../../components/animations/HoverLiftWrapper';
import { Skeleton } from '../../components/ui/Skeleton';

interface HistoricalChartProps {
  from: string;
  to: string;
  isEmbed?: boolean;
  isGlassModeEnabled?: boolean;
}

export function HistoricalChart({ from, to, isEmbed, isGlassModeEnabled = false }: HistoricalChartProps) {
  const [filter, setFilter] = useState<TimeFilter>('1M');
  const { data, isLoading, isError } = useHistoricalRates(from, to, filter);

  const filters: TimeFilter[] = ['1W', '1M', '1Y', '5Y'];

  const chartData = data || [];
  const firstRate = chartData[0]?.rate;
  const lastRate = chartData[chartData.length - 1]?.rate;
  const change = firstRate && lastRate ? ((lastRate - firstRate) / firstRate) * 100 : 0;

  if (isLoading) {
    return (
      <HoverLiftWrapper liftAmount={-3} strongShadow={isGlassModeEnabled}>
        <div className={cn(isGlassModeEnabled ? "glass-card" : "sleek-card", "p-8 md:p-10 flex flex-col gap-10 h-[500px]")}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-32" isGlass={isGlassModeEnabled} />
              <Skeleton className="h-4 w-48" isGlass={isGlassModeEnabled} />
            </div>
            <Skeleton className="h-10 w-64" isGlass={isGlassModeEnabled} />
          </div>
          <Skeleton className="flex-1 w-full" isGlass={isGlassModeEnabled} />
          <div className="flex items-center justify-between gap-4">
             <Skeleton className="h-4 w-32" isGlass={isGlassModeEnabled} />
             <Skeleton className="h-6 w-24 rounded-full" isGlass={isGlassModeEnabled} />
          </div>
        </div>
      </HoverLiftWrapper>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg/95 backdrop-blur shadow-2xl border border-border p-4 rounded-2xl min-w-[160px]">
          <p className="text-[10px] uppercase tracking-widest text-secondary font-black mb-1.5">{label}</p>
          <p className="text-base font-black text-primary leading-none">
            {payload[0].value.toFixed(6)} <span className="text-secondary text-xs">{to}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const chartContent = (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-ink-deep leading-none tracking-tight">
              {from} to {to} Chart
            </h2>
            {change !== 0 && !isLoading && (
              <span className={cn(
                "px-2.5 py-1 rounded-lg text-sm font-black tracking-tight",
                change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            )}
          </div>
          <p className="text-secondary font-bold text-[11px] uppercase tracking-[0.1em]">
            Real-time market analysis for {from} / {to}
          </p>
        </div>

        <div className={cn(
          "flex p-1.5 w-fit transition-all duration-300",
          isGlassModeEnabled 
            ? "glass-card" 
            : "bg-background border border-border rounded-[14px]"
        )}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 text-[11px] font-black rounded-lg transition-all uppercase tracking-widest",
                filter === f
                  ? cn(
                      "text-primary shadow-sm rounded-lg",
                      isGlassModeEnabled 
                        ? "glass-card" 
                        : "bg-card-bg border border-border"
                    )
                  : "text-secondary hover:text-ink-deep"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
            <div className="max-w-xs flex flex-col items-center gap-4">
              <TrendingUp className="w-12 h-12 text-slate-300" />
              <p className="text-slate-400 text-sm font-bold leading-relaxed uppercase tracking-widest">
                Analytics Unavailable
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              hide={true}
            />
            <YAxis 
              domain={['auto', 'auto']}
              orientation="right"
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => val.toFixed(4)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="#2563eb" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRate)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none">Powered by Alpha Global Stream</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-emerald-500",
          isGlassModeEnabled 
            ? "glass-card" 
            : "bg-emerald-500/10 border border-emerald-500/20"
        )}>
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Active Market</span>
        </div>
      </div>
    </>
  );

  if (isEmbed) {
    return (
      <div className="flex flex-col gap-10">
        {chartContent}
      </div>
    );
  }

  return (
    <div className={cn(isGlassModeEnabled ? "glass-card" : "sleek-card", "p-8 md:p-10 flex flex-col gap-10 h-full")}>
      {chartContent}
    </div>
  );
}
