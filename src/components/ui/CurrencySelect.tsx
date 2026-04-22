import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn, getFlagUrl } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  label: string;
}

export function CurrencySelect({ value, onChange, options, label }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return Object.entries(options).filter(
      ([code, name]) =>
        code.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="relative flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-semibold text-secondary uppercase tracking-[0.5px] mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "sleek-input flex items-center justify-between transition-all duration-200 text-left py-3",
          isOpen && "ring-2 ring-primary/20 border-primary"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-border shrink-0">
             <img 
               src={getFlagUrl(value)} 
               alt={value} 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>
          <span className="font-bold text-ink uppercase tracking-tight">
            {value}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 z-20 mt-2 bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-border bg-background/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search currency..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-input-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-ink"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto overscroll-contain bg-card-bg">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(([code, name]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChange(code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors border-b border-border last:border-0",
                        value === code && "bg-primary/10 text-primary font-bold"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-border shrink-0">
                          <img 
                            src={getFlagUrl(code)} 
                            alt={code} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-ink text-sm leading-none">{code}</span>
                          <span className="text-[10px] text-secondary truncate">{name}</span>
                        </div>
                      </div>
                      {value === code && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-secondary text-sm">
                    No currencies found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
