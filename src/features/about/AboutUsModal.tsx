import { X, Users, Target, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const teamMembers = [
    { name: 'Maharshi', role: 'Founder & Creator' },
    { name: 'Josh', role: 'Backend Developer' },
    { name: 'Utsav', role: 'Frontend Developer' },
    { name: 'Diken', role: 'Database Engineer' },
    { name: 'Lakshit', role: 'Testing & Debugging Lead' },
    { name: 'Tushal', role: 'Deployment & Documentation Manager' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 cursor-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-card-bg rounded-[32px] border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between sticky top-0 bg-card-bg/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-ink-deep leading-tight tracking-tight uppercase">
                  About Alpha Items
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-background border border-transparent hover:border-border rounded-xl transition-all group"
              >
                <X className="w-5 h-5 text-secondary group-hover:text-ink-deep transition-colors" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 md:p-10 flex flex-col gap-12">
              {/* Centered Logo */}
              <div className="flex justify-center -mb-4">
                <img 
                  src="/logo.png" 
                  alt="RateX Pro Logo" 
                  className="h-20 w-auto object-contain"
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
                <div className="p-8 bg-background border border-border rounded-[32px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <Target className="w-32 h-32 rotate-12" />
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
                          "p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group",
                          member.role.includes('Founder') 
                            ? "bg-primary/5 border-primary/20 shadow-sm"
                            : "bg-background border-border hover:border-primary/30"
                        )}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="font-black text-ink-deep tracking-tight text-lg truncate">
                            {member.name}
                          </span>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest line-clamp-2",
                            member.role.includes('Founder') ? "text-primary" : "text-secondary"
                          )}>
                            {member.role}
                          </span>
                        </div>
                        {member.role.includes('Founder') && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-[10px] font-black">HQ</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="pt-8 border-t border-border mt-4">
                <p className="text-center text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                  Built with passion by Alpha Items • 2026
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
