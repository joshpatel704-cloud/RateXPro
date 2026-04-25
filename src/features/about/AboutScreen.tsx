import { Users, Target, Heart, Palette, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface AboutScreenProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function AboutScreen({ theme = 'light', onToggleTheme }: AboutScreenProps) {
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
        <div className="p-6 bg-card-bg border border-border rounded-[28px] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-ink-deep font-bold">Appearance</span>
              <span className="text-xs text-secondary font-medium">Currently using {theme} mode</span>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors duration-300 outline-none",
              theme === 'dark' ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center",
              theme === 'dark' ? "translate-x-6" : "translate-x-0"
            )}>
               {theme === 'dark' ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-amber-500" />}
            </div>
          </button>
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
        <div className="p-8 bg-card-bg border border-border rounded-[32px] relative overflow-hidden group shadow-sm">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Target className="w-48 h-48 rotate-12" />
           </div>
           <p className="text-ink-deep text-lg md:text-xl font-medium leading-relaxed relative z-10">
            Alpha Items is a group dedicated to identifying real-life problems and building 
            <span className="text-primary font-bold"> elegant software solutions</span> to solve them. 
            This currency converter is one of our projects aimed at making financial data 
            accessible, fast, and secure for everyone.
          </p>
        </div>
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
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-6 rounded-[24px] border transition-all duration-300 flex items-center justify-between group",
                  member.role.includes('Founder') 
                    ? "bg-primary/5 border-primary/20 shadow-sm"
                    : "bg-card-bg border-border hover:border-primary/30"
                )}
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="font-black text-ink-deep tracking-tight text-xl truncate">
                    {member.name}
                  </span>
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-widest line-clamp-2 leading-normal",
                    member.role.includes('Founder') ? "text-primary" : "text-secondary"
                  )}>
                    {member.role}
                  </span>
                </div>
                {member.role.includes('Founder') && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-primary text-[11px] font-black tracking-tighter">HQ</span>
                  </div>
                )}
              </motion.div>
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
