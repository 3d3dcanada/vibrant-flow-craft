import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Home, Calculator, Briefcase, Users, MoreHorizontal } from "lucide-react";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
    { icon: <Calculator className="w-5 h-5" />, label: "Quote", href: "/quote" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Workshop", href: "/dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "Makers", href: "/makers" },
    { icon: <MoreHorizontal className="w-5 h-5" />, label: "More", href: "#more" },
];

interface TopNavProps {
    onMoreClick?: () => void;
    className?: string;
}

export function TopNav({ onMoreClick, className }: TopNavProps) {
    const location = useLocation();

    return (
        <nav
            className={cn(
                "hidden md:flex items-center justify-between",
                "sticky top-0 z-40 px-6 py-3",
                "glass-panel border-b-2 border-secondary/20 hover:border-secondary/40",
                "transition-all duration-300",
                className
            )}
        >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="font-tech font-bold text-white text-lg">3D</span>
                </div>
                <span className="font-tech font-bold text-xl gradient-text">3D3D.ca</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    const isMore = item.href === "#more";

                    return isMore ? (
                        <button
                            key={item.label}
                            onClick={onMoreClick}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                "font-tech text-sm font-medium",
                                "transition-all duration-200",
                                "text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ) : (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                "font-tech text-sm font-medium",
                                "transition-all duration-200",
                                isActive
                                    ? "text-secondary bg-secondary/10 shadow-glow-sm"
                                    : "text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="font-tech font-bold text-secondary">0</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </nav>
    );
}
