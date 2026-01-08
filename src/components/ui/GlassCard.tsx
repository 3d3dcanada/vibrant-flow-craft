import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    variant?: 'default' | 'elevated' | 'interactive';
    neonBorder?: 'none' | 'teal' | 'magenta';
    children: ReactNode;
    className?: string;
}

export function GlassCard({
    variant = 'default',
    neonBorder = 'none',
    children,
    className
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-panel rounded-lg",
                {
                    // Variant styles
                    'z-panel': variant === 'default',
                    'z-10 shadow-glow-lg': variant === 'elevated',
                    'hover-lift hover-glow cursor-pointer': variant === 'interactive',

                    // Neon border styles
                    'border-2 border-secondary/30 hover:border-secondary/60': neonBorder === 'teal',
                    'border-2 border-primary/30 hover:border-primary/60': neonBorder === 'magenta',
                },
                className
            )}
        >
            {children}
        </div>
    );
}
