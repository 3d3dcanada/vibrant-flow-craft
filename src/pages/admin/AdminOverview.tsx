import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { useAdminStats } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Package,
  Users,
  Coins,
  Wrench,
  FileText,
  ShoppingBag,
  CreditCard,
  Settings,
  Loader2,
  ClipboardCheck,
  Truck,
} from 'lucide-react';

const AdminOverview = () => {
  const { data: stats, isLoading } = useAdminStats();
  const { data: fulfillmentSignals, isLoading: fulfillmentLoading } = useQuery({
    queryKey: ['admin_fulfillment_signals'],
    queryFn: async () => {
      const [blockedShipments, readyForDelivery] = await Promise.all([
        supabase.from('maker_orders').select('id', { count: 'exact', head: true }).eq('status', 'in_production'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'shipped')
      ]);

      return {
        blockedByShipment: blockedShipments.count || 0,
        readyForDelivery: readyForDelivery.count || 0,
      };
    }
  });

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
    { label: 'Buyback Requests', icon: Package, href: '/dashboard/admin/buyback', desc: 'Printer & filament quotes' },
  ];

  const launchPreviewLinks = [
    {
      label: 'Payments & Orders',
      icon: Truck,
      href: '/dashboard/admin/payments',
      desc: 'Confirm payments, assign makers, update status.',
    },
    {
      label: 'Makers',
      icon: Users,
      href: '/dashboard/admin/makers',
      desc: 'Review and verify maker profiles.',
    },
    {
      label: 'Fulfillment Audit',
      icon: ClipboardCheck,
      href: '/dashboard/admin/fulfillment-audit',
      desc: 'Run live launch-readiness checks.',
    },
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
            <p className="text-xs text-muted-foreground mt-2">This system is launch-locked under Phase 3H.</p>
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

          <GlowCard className="p-5 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-tech font-bold text-foreground">Fulfillment attention</h2>
                <p className="text-sm text-muted-foreground">
                  Track orders waiting on shipment details and those ready for delivery confirmation.
                </p>
              </div>
              {fulfillmentLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              ) : (
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2">
                    <div className="text-xs text-muted-foreground">Blocked by missing shipment</div>
                    <div className="text-lg font-semibold text-warning">
                      {fulfillmentSignals?.blockedByShipment ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-2">
                    <div className="text-xs text-muted-foreground">Ready for delivery confirmation</div>
                    <div className="text-lg font-semibold text-secondary">
                      {fulfillmentSignals?.readyForDelivery ?? 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlowCard>

          {/* Launch Preview */}
          <h2 className="text-xl font-tech font-bold text-foreground mb-4">Launch Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {launchPreviewLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
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
