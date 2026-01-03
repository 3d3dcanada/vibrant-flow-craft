import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useSubscription, useCreditWallet, usePointWallet } from '@/hooks/useUserData';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { 
  LayoutDashboard, Coins, Sparkles, Recycle, Gift, Settings, 
  LogOut, ChevronLeft, ChevronRight, Crown, Zap, Star, Package,
  TreePine, Scale, Trophy, CreditCard, Menu, X, Wrench, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  makerOnly?: boolean;
}

// Customer-only navigation (NOT shown to makers)
const customerNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Credits Store', icon: CreditCard, href: '/dashboard/credits' },
  { label: 'Rewards Center', icon: Sparkles, href: '/dashboard/rewards' },
  { label: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
  { label: 'Gift Cards', icon: Gift, href: '/dashboard/gift-cards' },
];

// Community nav - shown to customers only (recycling rewards are customer perks)
const communityNav: NavItem[] = [
  { label: 'Recycling', icon: Recycle, href: '/dashboard/recycling' },
  { label: 'Community Cleanup', icon: TreePine, href: '/dashboard/community-cleanup' },
  { label: 'Community Models', icon: Package, href: '/dashboard/community' },
];

const makerNav: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard/maker', makerOnly: true },
  { label: 'Requests', icon: Package, href: '/dashboard/maker/requests', makerOnly: true },
  { label: 'Jobs Queue', icon: Zap, href: '/dashboard/maker/jobs', makerOnly: true },
  { label: 'Printers', icon: Wrench, href: '/dashboard/maker/printers', makerOnly: true },
  { label: 'Filament', icon: Recycle, href: '/dashboard/maker/filament', makerOnly: true },
  { label: 'Earnings', icon: Coins, href: '/dashboard/maker/earnings', makerOnly: true },
  { label: 'Profile', icon: Settings, href: '/dashboard/maker/profile', makerOnly: true },
];

const adminNav: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard/admin' },
  { label: 'Operations', icon: Scale, href: '/dashboard/admin/ops' },
  { label: 'Maker Manager', icon: Wrench, href: '/dashboard/admin/makers' },
  { label: 'Buyback Requests', icon: Recycle, href: '/dashboard/admin/buyback' },
  { label: 'Content & Promos', icon: Star, href: '/dashboard/admin/content' },
  { label: 'Store Manager', icon: Package, href: '/dashboard/admin/store' },
  { label: 'Credit Packages', icon: CreditCard, href: '/dashboard/admin/packages' },
];

type UserRole = 'customer' | 'maker' | 'admin' | null;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: subscription } = useSubscription();
  const { data: creditWallet } = useCreditWallet();
  const { data: pointWallet } = usePointWallet();

  const userRole: UserRole = (profile?.role as UserRole) || 'customer';
  const isMaker = userRole === 'maker';
  const isAdmin = userRole === 'admin';

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (profile && profile.onboarding_completed === false) {
      navigate('/onboarding');
    }
  }, [profile, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const tierIcons = {
    free: <Star className="w-4 h-4" />,
    maker: <Zap className="w-4 h-4" />,
    pro: <Crown className="w-4 h-4" />
  };

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-6">
      {!collapsed && (
        <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
      )}
      <nav className="space-y-1 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive(item.href)
                ? "bg-secondary/20 text-secondary border border-secondary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              isActive(item.href) ? "text-secondary" : "group-hover:text-secondary"
            )} />
            {!collapsed && (
              <span className="font-medium truncate">{item.label}</span>
            )}
            {item.badge && !collapsed && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3">
          <AnimatedLogo size="sm" />
          {!collapsed && (
            <span className="font-tech font-bold text-lg text-foreground">3D3D.ca</span>
          )}
        </Link>
      </div>

      {/* User Info */}
      <div className={cn(
        "p-4 border-b border-border/50",
        collapsed ? "text-center" : ""
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold shrink-0">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-medium text-foreground truncate">
                {profile?.full_name || 'User'}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {tierIcons[subscription?.tier || 'free']}
                <span className="capitalize">{subscription?.tier || 'Free'}</span>
              </div>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-secondary/10 text-center">
              <div className="font-bold text-secondary">{creditWallet?.balance || 0}</div>
              <div className="text-muted-foreground">Credits</div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-center">
              <div className="font-bold text-primary">{pointWallet?.balance || 0}</div>
              <div className="text-muted-foreground">Points</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Role-based navigation */}
        {isAdmin ? (
          <NavSection title="Admin Panel" items={adminNav} />
        ) : isMaker ? (
          <NavSection title="Creator Studio" items={makerNav} />
        ) : (
          <>
            <NavSection title="Main" items={customerNav} />
            <NavSection title="Community" items={communityNav} />
            
            {/* Become a Maker CTA for customers */}
            <div className="mb-6 px-4">
              {!collapsed && (
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Creator Studio
                </div>
              )}
              <Link
                to="/onboarding"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                <Wrench className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <div>
                    <span className="font-medium text-sm">Become a Maker</span>
                    <span className="block text-[10px] opacity-70">Earn money printing</span>
                  </div>
                )}
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/50 space-y-1">
        <Link
          to="/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
            isActive('/dashboard/settings')
              ? "bg-secondary/20 text-secondary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle - Desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-secondary transition-all"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <ParticleBackground />
      
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 280 }}
        className="hidden lg:block relative z-30 border-r border-border/50 bg-card/80 backdrop-blur-xl shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card/90 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <AnimatedLogo size="sm" />
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-secondary">{creditWallet?.balance || 0} credits</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-card border-r border-border/50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative z-10 lg:pt-0 pt-16 min-w-0">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
