/**
 * CSS Animation Utilities
 * Replacements for framer-motion patterns
 */

// Fade in with slide up (replaces motion initial/animate)
export const fadeInUp = 'animate-fade-in';

// Scale in (replaces motion scale)
export const scaleIn = 'animate-scale-in';

// Slide up (replaces motion y animation)
export const slideUp = 'animate-slide-up';

// Conditional animation classes
export function conditionalAnimate(condition: boolean, animation: string) {
    return condition ? animation : '';
}

// Stagger children (CSS alternative to framer-motion stagger)
export function staggerChildren(index: number, baseDelay: number = 100) {
    return {
        animationDelay: `${index * baseDelay}ms`,
    };
}

// Height animation (replaces AnimatePresence height)
export const expandHeight = 'transition-all duration-300 ease-out overflow-hidden';

// Opacity transition
export const fadeTransition = 'transition-opacity duration-300';
