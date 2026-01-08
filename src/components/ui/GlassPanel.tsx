import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'interactive';
    glowColor?: 'teal' | 'magenta' | 'none';
    className?: string;
}

/**
 * GlassPanel Component
 * Glassmorphism card with optional glow effects
 * Follows cyberpunk design system
 */
export function GlassPanel({
    children,
    variant = 'default',
    glowColor = 'none',
    className,
    ...props
}: GlassPanelProps) {
    const variantStyles = {
        default: '',
        elevated: 'shadow-lg z-10',
        interactive: 'cursor-pointer hover:bg-card/90 hover:border-secondary/40 hover:shadow-glow-sm hover:-translate-y-1 hover:scale-[1.01]',
    };

    const glowStyles = {
        teal: 'border-secondary/30 shadow-neon-teal',
        magenta: 'border-primary/30 shadow-neon-magenta',
        none: '',
    };

    return (
        <div
            className={cn(
                'glass-panel rounded-xl p-6',
                'bg-card/75 backdrop-blur-xl',
                'border border-border/50',
                'shadow-glass',
                'transition-all duration-400 ease-out',
                variantStyles[variant],
                glowColor !== 'none' && glowStyles[glowColor],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default GlassPanel;
