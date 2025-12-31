import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { useAdminStats } from '@/hooks/useAdminData';
import { 
  LayoutDashboard, Package, Users, Coins, Wrench, 
  FileText, ShoppingBag, CreditCard, Settings, Loader2 
} from 'lucide-react';

const AdminOverview = () => {
  const { data: stats, isLoading } = useAdminStats();

  const kpiTiles = [
    { label: 'Unassigned Requests', value: stats?.unassignedRequests || 0, icon: Package, color: 'text-warning', href: '/dashboard/admin/ops' },
    { label: 'Assigned Requests', value: stats?.assignedRequests || 0, icon: FileText, color: 'text-secondary', href: '/dashboard/admin/ops' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Wrench, color: 'text-primary', href: '/dashboard/admin/ops' },
    { label: 'Pending Payouts', value: stats?.pendingPayouts || 0, icon: Coins, color: 'text-success', href: '/dashboard/admin/ops' },
    { label: 'Unverified Makers', value: stats?.unverifiedMakers || 0, icon: Users, color: 'text-destructive', href: '/dashboard/admin/makers' },
  ];

  const quickLinks = [
    { label: 'Content & Promos', icon: FileText, href: '/dashboard/admin/content', desc: 'Banner, promo products' },
    { label: 'Store Manager', icon: ShoppingBag, href: '/dashboard/admin/store', desc: 'Designs & items' },
    { label: 'Credit Packages', icon: CreditCard, href: '/dashboard/admin/packages', desc: 'Manage packages' },
    { label: 'Maker Manager', icon: Users, href: '/dashboard/admin/makers', desc: 'Verify makers' },
    { label: 'Operations', icon: Settings, href: '/dashboard/admin/ops', desc: 'Requests & payouts' },
  ];

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-secondary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage site content, makers, and operations</p>
          </motion.div>

          {/* KPI Tiles */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {kpiTiles.map((tile, i) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={tile.href}>
                    <GlowCard className="p-4 hover:border-secondary/50 transition-colors">
                      <tile.icon className={`w-6 h-6 ${tile.color} mb-2`} />
                      <div className="text-2xl font-tech font-bold text-foreground">{tile.value}</div>
                      <div className="text-xs text-muted-foreground">{tile.label}</div>
                    </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <h2 className="text-xl font-tech font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Link to={link.href}>
                  <GlowCard className="p-5 hover:border-secondary/50 transition-colors h-full">
                    <link.icon className="w-8 h-8 text-secondary mb-3" />
                    <div className="font-medium text-foreground">{link.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{link.desc}</div>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default AdminOverview;
