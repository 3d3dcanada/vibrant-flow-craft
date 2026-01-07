import { cn } from "@/lib/utils";
import { Trophy, Printer, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    stats: {
        printsCompleted?: number;
        pointsEarned?: number;
        averageRating?: number;
    };
    isCurrentUser: boolean;
}

type LeaderboardType = 'makers' | 'customers' | 'weekly';

interface LeaderboardProps {
    makers?: LeaderboardEntry[];
    customers?: LeaderboardEntry[];
    weekly?: LeaderboardEntry[];
    className?: string;
}

const MOCK_MAKERS: LeaderboardEntry[] = [
    { rank: 1, userId: '1', displayName: 'PrintMaster_CA', stats: { printsCompleted: 1247, averageRating: 4.9 }, isCurrentUser: false },
    { rank: 2, userId: '2', displayName: 'TorontoTech3D', stats: { printsCompleted: 1089, averageRating: 4.8 }, isCurrentUser: false },
    { rank: 3, userId: '3', displayName: 'VancouverMakes', stats: { printsCompleted: 956, averageRating: 4.95 }, isCurrentUser: false },
    { rank: 4, userId: '4', displayName: 'MontrealPrints', stats: { printsCompleted: 842, averageRating: 4.7 }, isCurrentUser: false },
    { rank: 5, userId: '5', displayName: 'CalgaryCreate', stats: { printsCompleted: 789, averageRating: 4.85 }, isCurrentUser: true },
];

const MOCK_CUSTOMERS: LeaderboardEntry[] = [
    { rank: 1, userId: '1', displayName: 'ProtoKing', stats: { pointsEarned: 25420 }, isCurrentUser: false },
    { rank: 2, userId: '2', displayName: 'DesignDiva', stats: { pointsEarned: 22150 }, isCurrentUser: false },
    { rank: 3, userId: '3', displayName: 'MakerFan99', stats: { pointsEarned: 18900 }, isCurrentUser: true },
    { rank: 4, userId: '4', displayName: 'PrintAddic', stats: { pointsEarned: 15600 }, isCurrentUser: false },
    { rank: 5, userId: '5', displayName: 'ModelMaven', stats: { pointsEarned: 12340 }, isCurrentUser: false },
];

export function Leaderboard({
    makers = MOCK_MAKERS,
    customers = MOCK_CUSTOMERS,
    weekly = MOCK_CUSTOMERS.slice(0, 3),
    className
}: LeaderboardProps) {
    const [activeTab, setActiveTab] = useState<LeaderboardType>('makers');

    const tabs: { type: LeaderboardType; label: string; icon: React.ReactNode }[] = [
        { type: 'makers', label: 'Top Makers', icon: <Printer className="w-4 h-4" /> },
        { type: 'customers', label: 'Top Customers', icon: <Star className="w-4 h-4" /> },
        { type: 'weekly', label: 'This Week', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    const entries = activeTab === 'makers' ? makers : activeTab === 'customers' ? customers : weekly;

    return (
        <div className={cn("panel-card space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                <h3 className="font-tech font-semibold text-lg text-foreground">
                    Leaderboard
                </h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab.type)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-tech transition-all duration-200",
                            activeTab === tab.type
                                ? "bg-card text-secondary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2">
                {entries.map((entry) => (
                    <div
                        key={entry.userId}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                            entry.isCurrentUser
                                ? "bg-secondary/10 border border-secondary/30"
                                : "bg-muted/30 hover:bg-muted/50"
                        )}
                    >
                        {/* Rank */}
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-tech font-bold text-sm",
                            entry.rank === 1 && "bg-warning/20 text-warning",
                            entry.rank === 2 && "bg-muted-foreground/20 text-muted-foreground",
                            entry.rank === 3 && "bg-orange-500/20 text-orange-500",
                            entry.rank > 3 && "bg-muted text-muted-foreground"
                        )}>
                            {entry.rank}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold">
                            {entry.displayName[0]}
                        </div>

                        {/* Name & Stats */}
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "font-tech text-sm truncate",
                                entry.isCurrentUser ? "text-secondary font-semibold" : "text-foreground"
                            )}>
                                {entry.displayName}
                                {entry.isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {entry.stats.printsCompleted && `${entry.stats.printsCompleted.toLocaleString()} prints`}
                                {entry.stats.pointsEarned && `${entry.stats.pointsEarned.toLocaleString()} pts`}
                                {entry.stats.averageRating && ` • ⭐ ${entry.stats.averageRating}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
