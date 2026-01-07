import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPresenceProps {
    children: ReactNode;
    show: boolean;
    className?: string;
}

/**
 * CSS-based AnimatePresence replacement
 * Uses CSS transitions instead of framer-motion
 */
export function AnimatedPresence({ children, show, className }: AnimatedPresenceProps) {
    const [shouldRender, setShouldRender] = useState(show);

    useEffect(() => {
        if (show) setShouldRender(true);
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) setShouldRender(false);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={cn(
                'transition-all duration-300',
                show ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0',
                className
            )}
            onTransitionEnd={onAnimationEnd}
        >
            {children}
        </div>
    );
}
