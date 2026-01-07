import { cn } from "@/lib/utils";
import { Star, Sparkles } from "lucide-react";

interface PointsProgressBarProps {
    currentPoints: number;
    nextRewardAt: number;
    rewardName: string;
    className?: string;
}

export function PointsProgressBar({
    currentPoints,
    nextRewardAt,
    rewardName,
    className
}: PointsProgressBarProps) {
    const progress = Math.min((currentPoints / nextRewardAt) * 100, 100);
    const isComplete = currentPoints >= nextRewardAt;

    return (
        <div className={cn("panel-card space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-tech font-semibold text-foreground">Your Points</p>
                        <p className="text-xs text-muted-foreground">Keep earning!</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-tech font-bold text-2xl text-primary">
                        {currentPoints.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="h-3 rounded-full bg-muted overflow-hidden relative">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            isComplete
                                ? "bg-gradient-to-r from-success to-success-glow"
                                : "bg-gradient-to-r from-primary to-secondary"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        {currentPoints.toLocaleString()} / {nextRewardAt.toLocaleString()}
                    </span>
                    {isComplete ? (
                        <span className="flex items-center gap-1 text-success">
                            <Sparkles className="w-3 h-3" />
                            Ready to claim!
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            {(nextRewardAt - currentPoints).toLocaleString()} to go
                        </span>
                    )}
                </div>
            </div>

            {/* Reward Preview */}
            <div className={cn(
                "p-3 rounded-lg border border-dashed text-center",
                isComplete
                    ? "border-success/50 bg-success/5"
                    : "border-border"
            )}>
                <p className="text-xs text-muted-foreground mb-1">Next Reward</p>
                <p className={cn(
                    "font-tech font-semibold",
                    isComplete ? "text-success" : "text-foreground"
                )}>
                    {rewardName}
                </p>
            </div>
        </div>
    );
}
