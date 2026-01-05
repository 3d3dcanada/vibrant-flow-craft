import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "hero";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export const NeonButton = ({
  children,
  variant = "primary",
  size = "md",
  glow = true,
  icon,
  iconPosition = "left",
  className,
  ...props
}: NeonButtonProps) => {
  const baseStyles = "relative overflow-hidden font-tech font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]";

  const variantStyles = {
    primary: cn(
      "bg-secondary text-secondary-foreground",
      glow && "hover:shadow-neon-teal"
    ),
    secondary: cn(
      "bg-primary text-primary-foreground",
      glow && "hover:shadow-neon-magenta"
    ),
    outline: cn(
      "bg-transparent border-2 border-secondary text-secondary",
      glow && "hover:shadow-neon-teal hover:bg-secondary/10"
    ),
    ghost: cn(
      "bg-transparent text-foreground hover:bg-muted"
    ),
    hero: cn(
      "bg-foreground text-background",
      glow && "hover:shadow-neon-teal"
    ),
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-xl",
    xl: "px-10 py-5 text-xl rounded-xl",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shimmer" />
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </span>
    </button>
  );
};

export default NeonButton;
