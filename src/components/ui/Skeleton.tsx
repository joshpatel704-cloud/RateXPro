import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle';
  isGlass?: boolean;
}

export function Skeleton({ 
  className, 
  variant = 'rect',
  isGlass = true 
}: SkeletonProps) {
  return (
    <div className={cn(
      "shimmer-wrapper bg-slate-200 dark:bg-white/5",
      variant === 'circle' ? "rounded-full" : "rounded-xl",
      isGlass && "bg-white/5 backdrop-blur-sm",
      className
    )}>
      <div className="shimmer-effect" />
    </div>
  );
}
