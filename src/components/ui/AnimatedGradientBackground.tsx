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
    "#111827", // Rich Gray (Midtone)
  ];

  const lightColors = [
    "rgba(240, 249, 255, 1)", // f0f9ff
    "rgba(186, 230, 253, 1)", // bae6fd
    "rgba(251, 207, 232, 1)", // fbcfe8
    "rgba(255, 237, 213, 1)", // ffedd5
  ];

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-[-100%] will-change-transform will-change-background"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${colors[1]} 0%, transparent 60%), 
             radial-gradient(circle at 70% 70%, ${colors[2]} 0%, transparent 60%),
             radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${colors[0]} 100%)`,
            
            `radial-gradient(circle at 70% 30%, ${colors[3]} 0%, transparent 60%), 
             radial-gradient(circle at 30% 70%, ${colors[1]} 0%, transparent 60%),
             radial-gradient(circle at 50% 50%, ${colors[2]} 0%, ${colors[0]} 100%)`,

            `radial-gradient(circle at 50% 20%, ${colors[2]} 0%, transparent 60%), 
             radial-gradient(circle at 50% 80%, ${colors[3]} 0%, transparent 60%),
             radial-gradient(circle at 50% 50%, ${colors[1]} 0%, ${colors[0]} 100%)`,
          ],
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      {/* Overlay noise or extra blur if needed */}
      <div className="absolute inset-0 backdrop-blur-[120px] pointer-events-none" />
    </div>
  );
});
