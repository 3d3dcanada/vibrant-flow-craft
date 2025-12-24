import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
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

  const glowStyles = {
    sm: "hover:shadow-glow-sm",
    md: variant === "teal" ? "hover:shadow-neon-teal" : "hover:shadow-neon-magenta",
    lg: variant === "teal" ? "hover:shadow-neon-teal-lg" : "hover:shadow-neon-magenta-lg",
  };

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-xl p-6",
        hover === "lift" || hover === "both" ? "hover-lift" : "",
        hover === "glow" || hover === "both" ? glowStyles[glowIntensity] : "",
        variantStyles[variant],
        className
      )}
      whileHover={hover !== "none" ? { scale: hover === "lift" || hover === "both" ? 1.02 : 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlowCard;
