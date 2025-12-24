import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  icon?: ReactNode;
  preview?: string;
  children: ReactNode;
  variant?: "teal" | "magenta" | "white" | "success";
  className?: string;
  defaultExpanded?: boolean;
}

export const ExpandableCard = ({
  title,
  icon,
  preview,
  children,
  variant = "teal",
  className,
  defaultExpanded = false,
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const variantStyles = {
    teal: {
      border: "border-secondary/30 hover:border-secondary/60",
      glow: "group-hover:shadow-neon-teal",
      icon: "text-secondary",
      number: "border-secondary text-secondary",
    },
    magenta: {
      border: "border-primary/30 hover:border-primary/60",
      glow: "group-hover:shadow-neon-magenta",
      icon: "text-primary",
      number: "border-primary text-primary",
    },
    white: {
      border: "border-foreground/20 hover:border-foreground/40",
      glow: "",
      icon: "text-foreground",
      number: "border-foreground text-foreground",
    },
    success: {
      border: "border-success/30 hover:border-success/60",
      glow: "group-hover:shadow-[0_0_20px_hsl(155,100%,50%,0.3)]",
      icon: "text-success",
      number: "border-success text-success",
    },
  };

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-xl overflow-hidden cursor-pointer group transition-all duration-300",
        variantStyles[variant].border,
        variantStyles[variant].glow,
        isExpanded && "ring-1 ring-inset ring-secondary/20",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      layout
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <motion.div
              className={cn(
                "w-12 h-12 rounded-lg bg-card flex items-center justify-center text-2xl transition-all duration-300",
                variantStyles[variant].icon
              )}
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground font-tech">{title}</h3>
            {preview && !isExpanded && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{preview}</p>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border/50 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableCard;
