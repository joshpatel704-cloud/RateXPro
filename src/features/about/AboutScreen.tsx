import React from 'react';
import { Users, Target, Heart, Palette, Moon, Sun, Info, Star, List, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { HoverLiftWrapper } from '../../components/animations/HoverLiftWrapper';

interface AboutScreenProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  isGlassModeEnabled?: boolean;
  onToggleGlassMode?: () => void;
}

function ToggleSwitch({ 
  enabled, 
  onToggle, 
  iconLeft, 
  iconRight, 
  activeColorClass = "bg-primary" 
}: { 
  enabled: boolean, 
  onToggle?: () => void, 
  iconLeft: React.ReactNode, 
  iconRight: React.ReactNode,
  activeColorClass?: string
}) {
  return (
    <div 
      onClick={onToggle}
      className={cn(
        "relative w-20 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 cursor-pointer select-none transition-colors duration-300 group",
      )}
      role="button"
    >
      {/* Sliding Thumb */}
      <motion.div
        initial={false}
        animate={{ 
          x: enabled ? 40 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          mass: 1
        }}
        className={cn("w-8 h-8 rounded-full shadow-lg z-0", activeColorClass)}
      />
      
      {/* Icons Row */}
      <div className="absolute inset-0 flex items-center z-10 px-1">
        <div className="flex-1 flex items-center justify-center">
          <div className={cn(
            "transition-all duration-300", 
            !enabled ? "text-white" : "text-slate-400 group-hover:text-slate-500"
          )}>
            {iconLeft}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={cn(
            "transition-all duration-300", 
            enabled ? "text-white" : "text-slate-400 group-hover:text-slate-500"
          )}>
            {iconRight}
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ 
  title, 
  icon, 
  children, 
  isGlass 
}: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  isGlass: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <HoverLiftWrapper liftAmount={-3} className="w-full">
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isGlass ? "glass-card" : "sleek-card"
      )}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
        >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <span className="font-bold text-ink-deep">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-secondary"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      </motion.div>
    </div>
    </HoverLiftWrapper>
  );
}

export function AboutScreen({ 
  theme = 'light', 
  onToggleTheme, 
  isGlassModeEnabled = false, 
  onToggleGlassMode 
}: AboutScreenProps) {
  const teamMembers = [
    { name: 'Maharshi', role: 'Founder & Creator' },
    { name: 'Josh', role: 'Backend Developer' },
    { name: 'Utsav', role: 'Frontend Developer' },
    { name: 'Diken', role: 'Database Engineer' },
    { name: 'Manav', role: 'Testing & Debugging Lead' },
    { name: 'Dhruv', role: 'Deployment & Documentation Manager' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12 pb-12"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-ink-deep">
          About Alpha Items
        </h1>
        <p className="text-secondary text-lg font-medium max-w-2xl leading-relaxed">
          The story behind RateX Pro and the collective dedicated to solving real-world challenges.
        </p>
      </div>

      {/* Appearance Settings Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Settings</h4>
        </div>
        <div className="flex flex-col gap-4">
          <HoverLiftWrapper liftAmount={-2} className="w-full">
            <div className={cn(
              "p-6 flex items-center justify-between transition-all duration-300",
              isGlassModeEnabled ? "glass-card" : "sleek-card"
            )}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-white/20">
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-ink-deep font-bold">Appearance</span>
                  <span className="text-xs text-secondary font-medium dark:text-white/60">Currently using {theme} mode</span>
                </div>
              </div>
              <ToggleSwitch 
                enabled={theme === 'dark'} 
                onToggle={onToggleTheme} 
                iconLeft={<Sun className="w-5 h-5" />} 
                iconRight={<Moon className="w-5 h-5" />} 
              />
            </div>
          </HoverLiftWrapper>

          <HoverLiftWrapper liftAmount={-2} className="w-full">
            <div className={cn(
              "p-6 flex items-center justify-between transition-all duration-300",
              isGlassModeEnabled ? "glass-card" : "sleek-card"
            )}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-500/20 backdrop-blur-md flex items-center justify-center text-slate-500 border border-white/20">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-ink-deep font-bold">Glass Cards</span>
                  <span className="text-xs text-secondary font-medium dark:text-white/60">Toggle frosted glass effect</span>
                </div>
              </div>
              <ToggleSwitch 
                enabled={isGlassModeEnabled} 
                onToggle={onToggleGlassMode} 
                iconLeft={<div className="text-[10px] font-black uppercase">Off</div>} 
                iconRight={<div className="text-[10px] font-black uppercase">On</div>}
                activeColorClass="bg-indigo-500"
              />
            </div>
          </HoverLiftWrapper>
        </div>
      </section>

      {/* Discover RateX Pro / App Guide Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Discover RateX Pro</h4>
        </div>
        <div className="flex flex-col gap-4">
          <Accordion 
            title="How RateX Pro Works" 
            icon={<Info className="w-4 h-4" />} 
            isGlass={isGlassModeEnabled}
          >
            <p className="text-secondary font-medium leading-relaxed">
              RateX Pro connects to a live global financial API to fetch real-time mid-market exchange rates, ensuring highly accurate conversions for over 100+ global currencies.
            </p>
          </Accordion>

          <Accordion 
            title="Why Use RateX Pro?" 
            icon={<Star className="w-4 h-4" />} 
            isGlass={isGlassModeEnabled}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-secondary font-medium">Real-time Accuracy (No delayed rates)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-secondary font-medium">Seamless Multi-Currency Comparison</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-secondary font-medium">Premium Ad-Free Experience</span>
              </div>
            </div>
          </Accordion>

          <Accordion 
            title="How to Convert" 
            icon={<List className="w-4 h-4" />} 
            isGlass={isGlassModeEnabled}
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black shrink-0">1</div>
                <p className="text-secondary font-medium">Select your Base Currency from the dropdown.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black shrink-0">2</div>
                <p className="text-secondary font-medium">Enter the amount you want to convert in the input field.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black shrink-0">3</div>
                <p className="text-secondary font-medium">Select the Target Currency to view the instant conversion.</p>
              </div>
            </div>
          </Accordion>
        </div>
      </section>

      {/* Centered Logo */}
      <div className="flex justify-center -mb-4">
        <img 
          src="/logo.png" 
          alt="RateX Pro Logo" 
          className="h-24 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Mission Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Our Mission</h4>
        </div>
        <HoverLiftWrapper liftAmount={-3} strongShadow={isGlassModeEnabled}>
          <div className={cn(
            "p-8 relative overflow-hidden group transition-all duration-300",
            isGlassModeEnabled ? "glass-card" : "sleek-card"
          )}>
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                <Target className="w-48 h-48 rotate-12" />
             </div>
             <p className="text-ink-deep text-lg md:text-xl font-medium leading-relaxed relative z-10">
              Alpha Items is a group dedicated to identifying real-life problems and building 
              <span className="text-primary font-bold"> elegant software solutions</span> to solve them. 
              This currency converter is one of our projects aimed at making financial data 
              accessible, fast, and secure for everyone.
            </p>
          </div>
        </HoverLiftWrapper>
      </section>

      {/* Team Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">The Team</h4>
        </div>
        
        <div className="flex flex-col gap-6">
          <p className="text-secondary font-medium leading-relaxed max-w-xl">
            We are a group of <span className="text-ink-deep font-bold">6 college friends</span> who share a passion for technology and craft. What started as small coding sessions evolved into Alpha Items.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((member, idx) => (
              <HoverLiftWrapper key={member.name} liftAmount={-5} scaleAmount={1.03}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-6 flex items-center justify-between group cursor-default transition-all duration-300 h-full",
                    isGlassModeEnabled ? "glass-card" : "sleek-card",
                    member.role.includes('Founder') && "ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="font-black text-ink-deep tracking-tight text-xl truncate">
                      {member.name}
                    </span>
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest line-clamp-2 leading-normal",
                      member.role.includes('Founder') ? "text-primary" : "text-secondary dark:text-white/60"
                    )}>
                      {member.role}
                    </span>
                  </div>
                  {member.role.includes('Founder') && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <span className="text-primary text-[11px] font-black tracking-tighter">HQ</span>
                    </div>
                  )}
                </motion.div>
              </HoverLiftWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="pt-12 border-t border-border mt-8">
        <p className="text-center text-[11px] font-bold text-secondary uppercase tracking-[0.25em]">
          Built with passion by Alpha Items • 2026
        </p>
      </div>
    </motion.div>
  );
}
