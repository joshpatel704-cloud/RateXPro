import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface HoverLiftWrapperProps {
  children: ReactNode;
  className?: string;
  liftAmount?: number;
  scaleAmount?: number;
  strongShadow?: boolean;
  key?: string | number;
}

export function HoverLiftWrapper({
  children,
  className,
  liftAmount = -5,
  scaleAmount = 1.02,
  strongShadow = false,
}: HoverLiftWrapperProps) {
  return (
    <motion.div
      className={cn("relative transition-shadow duration-200", className)}
      whileHover={{ 
        y: liftAmount, 
        scale: scaleAmount,
        zIndex: 10,
        boxShadow: strongShadow ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : undefined
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
}
