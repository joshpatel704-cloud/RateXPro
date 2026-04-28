import { memo } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface AnimatedGradientBackgroundProps {
  theme: 'light' | 'dark';
}

export const AnimatedGradientBackground = memo(function AnimatedGradientBackground({ theme }: AnimatedGradientBackgroundProps) {
  // Define color palettes
  const darkColors = [
    "#020617", // Almost Black (Base)
    "#1E1B4B", // Very Dark Indigo (Deep Glow)
    "#0F172A", // Deep Slate (Subtle Shift)
  ];

  const lightColors = [
    "#F0F9FF", // sky-50
    "#BAE6FD", // sky-200
    "#FBCFE8", // pink-200
  ];

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#020617] dark:bg-[#020617]">
      <div 
        className="absolute inset-0"
        style={{
          background: theme === "dark" 
            ? `radial-gradient(circle at 30% 30%, ${colors[1]} 0%, transparent 60%), 
               radial-gradient(circle at 70% 70%, ${colors[2]} 0%, transparent 60%),
               ${colors[0]}`
            : `radial-gradient(circle at 30% 30%, ${colors[1]} 0%, transparent 60%), 
               radial-gradient(circle at 70% 70%, ${colors[2]} 0%, transparent 60%),
               ${colors[0]}`
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[120px] pointer-events-none" />
    </div>
  );
});
