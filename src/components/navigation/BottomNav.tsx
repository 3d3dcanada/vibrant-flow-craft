import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calculator,
  Package,
  Settings,
  MoreHorizontal,
  ClipboardList,
  Printer,
  DollarSign,
  Wrench,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Sparkles,
  Recycle,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const customerItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Home", href: "/dashboard/customer" },
  { icon: <Calculator className="w-5 h-5" />, label: "Quote", href: "/quote" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Rewards", href: "/dashboard/rewards" },
  { icon: <Recycle className="w-5 h-5" />, label: "Recycle", href: "/dashboard/recycling" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/dashboard/settings" },
];

const makerItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Home", href: "/dashboard/maker" },
  { icon: <ClipboardList className="w-5 h-5" />, label: "Requests", href: "/dashboard/maker/requests" },
  { icon: <Package className="w-5 h-5" />, label: "Jobs", href: "/dashboard/maker/jobs" },
  { icon: <Printer className="w-5 h-5" />, label: "Printers", href: "/dashboard/maker/printers" },
  { icon: <DollarSign className="w-5 h-5" />, label: "Earnings", href: "/dashboard/maker/earnings" },
];

const adminItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Home", href: "/dashboard/admin" },
  { icon: <Wrench className="w-5 h-5" />, label: "Ops", href: "/dashboard/admin/ops" },
  { icon: <Users className="w-5 h-5" />, label: "Makers", href: "/dashboard/admin/makers" },
  { icon: <ShoppingBag className="w-5 h-5" />, label: "Store", href: "/dashboard/admin/store" },
  { icon: <Settings className="w-5 h-5" />, label: "More", href: "/dashboard/admin/content" },
];

interface BottomNavProps {
  role?: "customer" | "maker" | "admin" | null;
  className?: string;
}

export function BottomNav({ role = "customer", className }: BottomNavProps) {
  const location = useLocation();

  const items = role === "admin" ? adminItems : role === "maker" ? makerItems : customerItems;

  const isActive = (href: string) => {
    // Exact match for home routes
    if (href === "/dashboard/customer" || href === "/dashboard/maker" || href === "/dashboard/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "bg-card/95 backdrop-blur-xl border-t border-border/50",
        "safe-area-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-[56px] rounded-lg",
                "transition-all duration-200",
                active
                  ? "text-secondary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative p-1 rounded-lg transition-all duration-200",
                  active && "bg-secondary/15"
                )}
              >
                {item.icon}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary shadow-[0_0_6px_hsl(var(--secondary))]" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-tech font-medium",
                active && "text-secondary"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
