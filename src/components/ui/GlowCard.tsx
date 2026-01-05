import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "teal" | "magenta" | "neutral";
  hover?: "lift" | "glow" | "both" | "none";
  glowIntensity?: "sm" | "md" | "lg";
  className?: string;
}

export const GlowCard = ({
  children,
  variant = "teal",
  hover = "both",
  glowIntensity = "md",
  className,
  ...props
}: GlowCardProps) => {
  const variantStyles = {
    teal: "hover:border-secondary/50 hover:shadow-neon-teal",
    magenta: "hover:border-primary/50 hover:shadow-neon-magenta",
    neutral: "hover:border-foreground/20",
  };

  const hoverTransform = hover === "lift" || hover === "both" 
    ? "hover:-translate-y-1 hover:scale-[1.02]" 
    : "";

  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 transition-all duration-300",
        hoverTransform,
        hover === "glow" || hover === "both" ? variantStyles[variant] : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowCard;
