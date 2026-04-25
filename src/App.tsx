/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './features/home/HomeScreen';
import { GraphScreen } from './features/graph/GraphScreen';
import { AboutScreen } from './features/about/AboutScreen';
import { 
  Sun,
  Moon,
  Home,
  BarChart2,
  Info,
  Globe
} from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Tab = 'home' | 'graph' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedFrom, setSelectedFrom] = useState(() => localStorage.getItem('conv_from') || 'USD');
  const [selectedTo, setSelectedTo] = useState(() => localStorage.getItem('conv_to') || 'EUR');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // Hide on scroll logic
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 72) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            setSelectedFrom={setSelectedFrom}
            setSelectedTo={setSelectedTo}
          />
        );
      case 'graph':
        return <GraphScreen />;
      case 'about':
        return <AboutScreen theme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <HomeScreen 
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          setSelectedFrom={setSelectedFrom}
          setSelectedTo={setSelectedTo}
        />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300 pb-24">
        {/* Header (SliverAppBar equivalent with Glassmorphism) */}
        <nav className={cn(
          "bg-background/65 backdrop-blur-[15px] border-b border-border/30 h-[72px] flex items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}>
          <div className="max-w-4xl mx-auto px-6 w-full flex justify-end items-center">
            {/* Note: Ensure assets/logo.png is correctly defined in your asset directory (public/logo.png) */}
            <div className="flex items-center pr-5 py-2">
              <img 
                src="/logo.png" 
                alt="RateX Pro Logo" 
                className="h-[40px] w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent && !parent.querySelector('.fallback-logo')) {
                    const fallback = document.createElement('div');
                    fallback.className = "w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 fallback-logo";
                    fallback.innerText = 'R';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        </nav>

        {/* Main Content Area - pt-[112px] allows background to extend behind fixed glass header while starting content below it. Added pb-32 to clear the floating bottom bar. */}
        <main className="flex-grow max-w-4xl mx-auto w-full px-6 pt-[112px] pb-32">
          {renderContent()}
        </main>

        {/* Bottom Navigation Bar with Glassmorphism (macOS Dock style) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
          <div className="max-w-md mx-auto bg-white/30 dark:bg-black/20 backdrop-blur-[20px] border border-white/20 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-2 flex items-center justify-between pointer-events-auto overflow-hidden">
            <NavButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
              icon={<Home className="w-5 h-5" />} 
              label="Home"
            />
            <NavButton 
              active={activeTab === 'graph'} 
              onClick={() => setActiveTab('graph')} 
              icon={<BarChart2 className="w-5 h-5" />} 
              label="Graph"
            />
            <NavButton 
              active={activeTab === 'about'} 
              onClick={() => setActiveTab('about')} 
              icon={<Info className="w-5 h-5" />} 
              label="About"
            />
          </div>
        </div>

        {/* Footer info only shown on home tab bottom or just consistently? 
            Request says migrate About Us info to About tab, so I'll minimize the footer elsewhere. */}
      </div>
    </QueryClientProvider>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 py-2.5 rounded-2xl transition-all duration-300",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/30" 
          : "text-secondary hover:bg-primary/5 hover:text-primary"
      )}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
        {label}
      </span>
    </button>
  );
}
