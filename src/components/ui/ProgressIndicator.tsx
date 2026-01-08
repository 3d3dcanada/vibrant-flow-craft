import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ProgressIndicatorProps {
    type: 'linear' | 'circular' | 'stepped';
    value?: number; // 0-100 for linear/circular
    steps?: Array<{ label: string; completed: boolean }>; // for stepped
    color?: 'primary' | 'secondary' | 'accent';
    showPercentage?: boolean;
    className?: string;
}

/**
 * ProgressIndicator Component
 * Supports linear, circular, and stepped progress displays
 */
export function ProgressIndicator({
    type,
    value = 0,
    steps = [],
    color = 'secondary',
    showPercentage = false,
    className,
}: ProgressIndicatorProps) {
    const colorStyles = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        accent: 'bg-accent',
    };

    if (type === 'linear') {
        return (
            <div className={cn('w-full', className)}>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500 ease-out',
                            'bg-gradient-to-r from-secondary to-secondary-glow',
                            'shadow-glow-sm'
                        )}
                        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                </div>
                {showPercentage && (
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                        {Math.round(value)}%
                    </p>
                )}
            </div>
        );
    }

    if (type === 'circular') {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;

        return (
            <div className={cn('relative inline-flex items-center justify-center', className)}>
                <svg className="w-24 h-24 -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={cn('text-secondary transition-all duration-500', 'drop-shadow-glow-sm')}
                        strokeLinecap="round"
                    />
                </svg>
                {showPercentage && (
                    <span className="absolute text-lg font-tech font-bold text-foreground">
                        {Math.round(value)}%
                    </span>
                )}
            </div>
        );
    }

    if (type === 'stepped') {
        return (
            <div className={cn('flex items-center justify-between', className)}>
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                        {/* Step circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center',
                                    'border-2 transition-all duration-300',
                                    step.completed
                                        ? 'bg-secondary border-secondary text-secondary-foreground shadow-neon-teal'
                                        : 'bg-background border-border text-muted-foreground'
                                )}
                            >
                                {step.completed ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-tech font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground mt-2 text-center max-w-[80px]">
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 bg-border relative">
                                <div
                                    className={cn(
                                        'absolute inset-0 bg-secondary transition-all duration-500',
                                        step.completed ? 'w-full' : 'w-0'
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return null;
}

export default ProgressIndicator;
