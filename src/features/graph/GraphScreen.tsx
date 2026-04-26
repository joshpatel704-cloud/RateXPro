import { useState, useMemo } from 'react';
import { useCurrencies, useMultiHistoricalRates, TimeFilter, useRates } from '../../hooks/useRates';
import { CurrencySelect } from '../../components/ui/CurrencySelect';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn, getFlagUrl } from '../../lib/utils';
import { TrendingUp, Plus, X, BarChart3, Clock, Calendar, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function GraphScreen({ isGlassModeEnabled = false }: { isGlassModeEnabled?: boolean }) {
  const { data: currencies } = useCurrencies();
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('EUR');
  const [filter, setFilter] = useState<TimeFilter | 'custom'>('1M');
  const [normalize, setNormalize] = useState(true);
  
  // Custom date range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const targets = useMemo(() => [target], [target]);

  const { data: rawChartData, isLoading } = useMultiHistoricalRates(
    base, 
    targets, 
    filter,
    startDate,
    endDate
  );

  const { data: liveRates } = useRates(base);

  const normalizedData = useMemo(() => {
    if (!rawChartData || rawChartData.length === 0 || !normalize) return rawChartData;
    
    const firstRates = rawChartData[0];
    return rawChartData.map(point => {
      const normalizedPoint: any = { date: point.date };
      if (point[target] !== undefined && firstRates[target] !== undefined) {
        // % Change = ((Current - Initial) / Initial) * 100
        normalizedPoint[target] = ((point[target] - firstRates[target]) / firstRates[target]) * 100;
      }
      return normalizedPoint;
    });
  }, [rawChartData, target, normalize]);

  const filters: TimeFilter[] = ['1W', '1M', '1Y', '5Y'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 pb-12"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-ink-deep tracking-tight">
          Performance Analysis
        </h1>
        <p className="text-secondary text-lg font-medium max-w-2xl leading-relaxed">
          Analyze relative performance by tracking <span className="text-primary font-bold">volatility</span> of your chosen currency against {base}.
        </p>
      </div>

      <div className={cn(isGlassModeEnabled ? "glass-card" : "sleek-card", "p-8 flex flex-col gap-10")}>
        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-8">
            <CurrencySelect
              label="Anchor Currency (Base)"
              value={base}
              onChange={(val) => {
                setBase(val);
                if (target === val) setTarget(Object.keys(currencies || {}).find(c => c !== val) || 'EUR');
              }}
              options={currencies || {}}
            />

            <CurrencySelect
              label="Compare With"
              value={target}
              onChange={setTarget}
              options={currencies || {}}
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-black text-secondary uppercase tracking-[0.1em]">Timeframe & Mode</label>
              <button 
                onClick={() => setNormalize(!normalize)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-black uppercase tracking-wider",
                  normalize 
                    ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                    : "bg-background border-border text-secondary"
                )}
              >
                <PieChart className="w-3.5 h-3.5" />
                {normalize ? "Normalize to %" : "Absolute Values"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-background border border-border rounded-xl">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex-1 px-4 py-2 text-[11px] font-black rounded-lg transition-all uppercase tracking-widest min-w-[70px]",
                    filter === f
                      ? "bg-card-bg text-primary shadow-sm border border-border"
                      : "text-secondary hover:text-ink-deep border border-transparent"
                  )}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setFilter('custom')}
                className={cn(
                  "flex-1 px-4 py-2 text-[11px] font-black rounded-lg transition-all uppercase tracking-widest min-w-[70px] flex items-center justify-center gap-2",
                  filter === 'custom'
                    ? "bg-card-bg text-primary shadow-sm border border-border"
                    : "text-secondary hover:text-ink-deep border border-transparent"
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                Custom
              </button>
            </div>

            <AnimatePresence>
              {filter === 'custom' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Start</span>
                       <input 
                         type="date" 
                         value={startDate} 
                         onChange={(e) => setStartDate(e.target.value)}
                         className="sleek-input text-xs py-2.5 px-4 font-bold" 
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">End</span>
                       <input 
                         type="date" 
                         value={endDate} 
                         onChange={(e) => setEndDate(e.target.value)}
                         className="sleek-input text-xs py-2.5 px-4 font-bold" 
                       />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-[450px] w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card-bg/50 z-20 backdrop-blur-[4px] rounded-3xl">
               <div className="flex flex-col items-center gap-4">
                 <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                 <p className="text-primary font-black text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Data...</p>
               </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                hide={true}
              />
              <YAxis 
                domain={normalize ? ['auto', 'auto'] : ['auto', 'auto']}
                orientation="right"
                tick={{ fontSize: 10, fill: '#94a3b8', fontSizer: 900, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => normalize ? `${val > 0 ? '+' : ''}${val.toFixed(2)}%` : val.toFixed(2)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  borderRadius: '20px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                  padding: '16px'
                }}
                labelStyle={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 900, marginBottom: '10px', letterSpacing: '0.15em', color: '#64748b' }}
                itemStyle={{ fontSize: '13px', fontWeight: 800, padding: '4px 0' }}
                formatter={(val: number, name: string) => [
                  normalize ? `${val > 0 ? '+' : ''}${val.toFixed(3)}%` : val.toFixed(4),
                  name
                ]}
              />
              <Legend verticalAlign="top" height={40} iconType="circle" />
              <Line
                key={target}
                type="monotone"
                dataKey={target}
                stroke={CHART_COLORS[0]}
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 7, strokeWidth: 0, fill: CHART_COLORS[0] }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Detail Legend / Live Rates */}
        <div className="flex flex-col gap-6 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <TrendingUp className="w-5 h-5 text-primary" />
               <h3 className="text-sm font-black text-ink-deep uppercase tracking-widest">Live Benchmarks</h3>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Live Updates</span>
            </div>
          </div>

          <div className="max-w-md">
             {(() => {
               const code = target;
               const rate = liveRates?.rates[code];
               const prevRate = rawChartData?.[rawChartData.length - 2]?.[code];
               const diff = rate && prevRate ? ((rate - prevRate) / prevRate) * 100 : 0;
               
               return (
                 <motion.div 
                   key={code}
                   whileHover={{ y: -4 }}
                   className={cn(
                      "p-6 flex flex-col gap-4 group transition-all rounded-[16px]",
                      isGlassModeEnabled 
                        ? "glass-card" 
                        : "bg-background border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                    )}
                 >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <img src={getFlagUrl(code)} alt={code} className="w-10 h-10 rounded-full border border-border" />
                         <span className="text-lg font-black text-ink-deep">{code}</span>
                      </div>
                      {diff !== 0 && (
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                          diff > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                        )}>
                          {diff > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                      )}
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-4xl font-black text-ink-deep tracking-tighter">
                        {rate ? rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '---'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest font-mono">1 {base} = {rate?.toFixed(4) || '---'} {code}</span>
                        {diff !== 0 && (
                          <span className={cn(
                            "text-xs font-black ml-auto",
                            diff > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                          </span>
                        )}
                      </div>
                   </div>
                 </motion.div>
               );
             })()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 mt-4 border-t border-border opacity-60">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] leading-none italic">Temporal Market Intelligence • v4.2.1</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-secondary tracking-[0.3em]">HIFI STREAM</span>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-primary/40 rounded-full" />)}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

