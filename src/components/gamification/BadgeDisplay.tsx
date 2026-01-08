import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const RARITY_COLORS = {
    common: 'border-muted-foreground/30',
    rare: 'border-secondary',
    epic: 'border-primary',
    legendary: 'border-warning',
};

const RARITY_GLOW = {
    common: '',
    rare: 'shadow-neon-teal',
    epic: 'shadow-neon-magenta',
    legendary: 'shadow-[0_0_20px_hsl(43,100%,50%,0.5)]',
};

interface BadgeDisplayProps {
    badges: Badge[];
    maxVisible?: number;
    className?: string;
}

export function BadgeDisplay({ badges, maxVisible = 6, className }: BadgeDisplayProps) {
    const visibleBadges = badges.slice(0, maxVisible);
    const hiddenCount = Math.max(0, badges.length - maxVisible);

    return (
        <div className={cn("panel-card space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-tech font-semibold text-lg text-foreground">
                    Achievements
                </h3>
                <span className="text-xs text-muted-foreground">
                    {badges.filter(b => b.unlocked).length} / {badges.length} unlocked
                </span>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-3 gap-3">
                {visibleBadges.map((badge) => (
                    <div
                        key={badge.id}
                        className={cn(
                            "relative p-3 rounded-lg border-2 text-center transition-all duration-200",
                            badge.unlocked
                                ? [RARITY_COLORS[badge.rarity], RARITY_GLOW[badge.rarity], "bg-card/50"]
                                : "border-border/30 bg-muted/20 opacity-50"
                        )}
                    >
                        {/* Lock overlay for locked badges */}
                        {!badge.unlocked && (
                            <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-background/50">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )}

                        {/* Badge icon */}
                        <div className="text-2xl mb-1">{badge.icon}</div>

                        {/* Badge name */}
                        <p className={cn(
                            "text-xs font-tech font-semibold",
                            badge.unlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {badge.name}
                        </p>

                        {/* Rarity indicator */}
                        {badge.unlocked && (
                            <span className={cn(
                                "mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-tech",
                                {
                                    'bg-muted-foreground/20 text-muted-foreground': badge.rarity === 'common',
                                    'bg-secondary/20 text-secondary': badge.rarity === 'rare',
                                    'bg-primary/20 text-primary': badge.rarity === 'epic',
                                    'bg-warning/20 text-warning': badge.rarity === 'legendary',
                                }
                            )}>
                                {badge.rarity}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* View more */}
            {hiddenCount > 0 && (
                <button className="w-full text-center text-sm text-secondary hover:text-secondary-glow transition-colors">
                    View {hiddenCount} more achievements →
                </button>
            )}
        </div>
    );
}
