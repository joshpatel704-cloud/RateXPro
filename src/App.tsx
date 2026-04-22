/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConverterWidget } from './features/converter/ConverterWidget';
import { HistoricalChart } from './features/charts/HistoricalChart';
import { LiveRates } from './features/rates/LiveRates';
import { AboutUsModal } from './features/about/AboutUsModal';
import { 
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [selectedFrom, setSelectedFrom] = useState(() => localStorage.getItem('conv_from') || 'USD');
  const [selectedTo, setSelectedTo] = useState(() => localStorage.getItem('conv_to') || 'EUR');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('conv_from', selectedFrom);
    localStorage.setItem('base_currency', selectedFrom);
  }, [selectedFrom]);

  useEffect(() => {
    localStorage.setItem('conv_to', selectedTo);
  }, [selectedTo]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">
        <nav className="bg-card-bg border-b border-border h-[72px] flex items-center sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 w-full flex justify-between items-center text-ink-deep">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="RateX Pro Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  // Fallback if logo.png is missing
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent && !parent.querySelector('.fallback-logo')) {
                    const div = document.createElement('div');
                    div.className = 'w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg fallback-logo';
                    div.innerText = 'R';
                    parent.insertBefore(div, parent.firstChild);
                  }
                }}
              />
              <span className="text-2xl font-black tracking-tight">RateX Pro</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 bg-background border border-border rounded-xl text-ink hover:bg-primary/5 transition-all outline-none"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-ink-deep">
              Live Currency Converter
            </h1>
            <p className="text-secondary text-lg font-medium max-w-2xl leading-relaxed">
              Check real-time foreign exchange rates instantly. Trusted by millions of users worldwide for accurate and fast conversions.
            </p>
          </div>

          <div className="w-full">
            <ConverterWidget 
              onFromChange={setSelectedFrom} 
              onToChange={setSelectedTo} 
            />
          </div>

          <div className="w-full">
            <HistoricalChart from={selectedFrom} to={selectedTo} />
          </div>

          <div className="w-full">
            <LiveRates base={selectedFrom} />
          </div>
        </main>

        <footer className="bg-card-bg border-t border-border pt-16 pb-12 px-6 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-8 mb-12 text-sm font-bold text-primary uppercase tracking-widest justify-center md:justify-start">
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="hover:underline cursor-pointer"
              >
                About Us
              </button>
              <a href="#" className="hover:underline">API Docs</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
            
            <div className="flex flex-col gap-4 text-secondary text-[13px] leading-relaxed">
              <p className="font-bold text-ink">© Alpha Items Group</p>
              <p>
                Alpha is authorised by the Financial Conduct Authority under the Electronic Money Regulations 2011, Firm Reference 900507, for the issuing of electronic money. Wise works with a local bank partner to offer the service in India with the approval of the Reserve Bank of India.
              </p>
            </div>
          </div>
        </footer>

        <AboutUsModal 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
        />
      </div>
    </QueryClientProvider>
  );
}
