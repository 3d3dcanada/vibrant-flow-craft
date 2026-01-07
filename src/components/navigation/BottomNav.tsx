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

interface BottomNavProps {
    onMoreClick?: () => void;
    className?: string;
}

export function BottomNav({ onMoreClick, className }: BottomNavProps) {
    const location = useLocation();

    return (
        <nav
            className={cn(
                "bottom-nav flex md:hidden items-center justify-around px-2",
                className
            )}
        >
            {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const isMore = item.href === "#more";

                return isMore ? (
                    <button
                        key={item.label}
                        onClick={onMoreClick}
                        className={cn(
                            "flex flex-col items-center gap-1 py-2 px-3 min-w-[60px]",
                            "transition-all duration-200",
                            "text-muted-foreground"
                        )}
                    >
                        {item.icon}
                        <span className="text-xs font-tech">{item.label}</span>
                    </button>
                ) : (
                    <Link
                        key={item.label}
                        to={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 py-2 px-3 min-w-[60px]",
                            "transition-all duration-200",
                            isActive
                                ? "text-secondary"
                                : "text-muted-foreground"
                        )}
                    >
                        <div className={cn(
                            "relative",
                            isActive && "after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-secondary after:shadow-glow-sm"
                        )}>
                            {item.icon}
                        </div>
                        <span className="text-xs font-tech">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
