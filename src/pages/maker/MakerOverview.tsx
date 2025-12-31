import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { usePendingRequests, useMakerRequests, useMakerJobs, useMakerPrinters, useMakerFilament, useMakerPayouts } from '@/hooks/useMakerData';
import { useProfile } from '@/hooks/useUserData';
import { 
  ClipboardList, Printer, Package, DollarSign, AlertTriangle, 
  CheckCircle, Clock, Wifi, WifiOff, Droplets, TrendingUp, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';

const MakerOverview = () => {
  const { data: profile } = useProfile();
  const { data: pendingRequests = [] } = usePendingRequests();
  const { data: makerRequests = [] } = useMakerRequests();
  const { data: jobs = [] } = useMakerJobs();
  const { data: printers = [] } = useMakerPrinters();
  const { data: filament = [] } = useMakerFilament();
  const { data: payouts = [] } = useMakerPayouts();

  const activeJobs = jobs.filter(j => !['complete', 'cancelled'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'complete');
  const onlinePrinters = printers.filter(p => p.status !== 'offline');
  const needsDrying = filament.filter(f => f.dry_status === 'needs_drying');
  const lowFilament = filament.filter(f => f.grams_remaining < 100);

  // Calculate on-time percentage (mock for now)
  const onTimePercent = completedJobs.length > 0 ? 95 : 0;

  // Calculate earnings (mock - would need actual payment data)
  const weekEarnings = completedJobs.length * 25; // Placeholder
  const monthEarnings = weekEarnings * 4;

  // Alerts
  const alerts = [];
  if (!profile?.dry_box_required_ack) {
    alerts.push({ type: 'warning', message: 'Dry box acknowledgement required', link: '/dashboard/maker/profile' });
  }
  if (needsDrying.length > 0) {
    alerts.push({ type: 'warning', message: `${needsDrying.length} spool(s) need drying`, link: '/dashboard/maker/filament' });
  }
  if (lowFilament.length > 0) {
    alerts.push({ type: 'info', message: `${lowFilament.length} spool(s) low on filament`, link: '/dashboard/maker/filament' });
  }
  if (printers.length > 0 && onlinePrinters.length === 0) {
    alerts.push({ type: 'error', message: 'All printers offline', link: '/dashboard/maker/printers' });
  }
  const overdueJobs = activeJobs.filter(j => j.sla_target_at && new Date(j.sla_target_at) < new Date());
  if (overdueJobs.length > 0) {
    alerts.push({ type: 'error', message: `${overdueJobs.length} job(s) overdue`, link: '/dashboard/maker/jobs' });
  }

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-tech font-bold text-foreground">Creator Studio</h1>
          <p className="text-muted-foreground">Your maker dashboard overview</p>
        </div>
        <Badge variant="outline" className="border-secondary text-secondary">
          <Zap className="w-3 h-3 mr-1" /> Maker
        </Badge>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <Link key={i} to={alert.link}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                  alert.type === 'error' ? 'border-destructive/50 bg-destructive/10' :
                  alert.type === 'warning' ? 'border-warning/50 bg-warning/10' :
                  'border-secondary/50 bg-secondary/10'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'error' ? 'text-destructive' :
                  alert.type === 'warning' ? 'text-warning' :
                  'text-secondary'
                }`} />
                <span className="text-sm">{alert.message}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Pending Requests</span>
          </div>
          <div className="text-2xl font-tech font-bold">{pendingRequests.length}</div>
        </GlowCard>

        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Active Jobs</span>
          </div>
          <div className="text-2xl font-tech font-bold">{activeJobs.length}</div>
        </GlowCard>

        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">On-Time %</span>
          </div>
          <div className="text-2xl font-tech font-bold">{onTimePercent}%</div>
        </GlowCard>

        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Week / Month</span>
          </div>
          <div className="text-xl font-tech font-bold">${weekEarnings} / ${monthEarnings}</div>
        </GlowCard>

        <GlowCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Printer className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Printers Online</span>
          </div>
          <div className="text-2xl font-tech font-bold flex items-center gap-2">
            {onlinePrinters.length}/{printers.length}
            {onlinePrinters.length > 0 ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
          </div>
        </GlowCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to="/dashboard/maker/requests">
          <NeonButton variant="secondary" className="w-full">
            <ClipboardList className="w-4 h-4 mr-2" /> View Queue
          </NeonButton>
        </Link>
        <Link to="/dashboard/maker/printers">
          <NeonButton variant="secondary" className="w-full">
            <Printer className="w-4 h-4 mr-2" /> Add Printer
          </NeonButton>
        </Link>
        <Link to="/dashboard/maker/filament">
          <NeonButton variant="secondary" className="w-full">
            <Droplets className="w-4 h-4 mr-2" /> Add Filament
          </NeonButton>
        </Link>
        <Link to="/dashboard/maker/profile">
          <NeonButton variant="secondary" className="w-full">
            <Clock className="w-4 h-4 mr-2" /> Availability
          </NeonButton>
        </Link>
        <Link to="/dashboard/maker/earnings">
          <NeonButton className="w-full">
            <TrendingUp className="w-4 h-4 mr-2" /> Request Payout
          </NeonButton>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-secondary" />
            Recent Requests
          </h3>
          <div className="space-y-3">
            {[...pendingRequests, ...makerRequests].slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm font-medium">
                    {req.specs?.material || 'PLA'} - {req.specs?.quantity || 1} pcs
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={req.status === 'pending' ? 'secondary' : 'outline'}>
                  {req.status}
                </Badge>
              </div>
            ))}
            {pendingRequests.length === 0 && makerRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No requests yet</p>
            )}
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Active Jobs
          </h3>
          <div className="space-y-3">
            {activeJobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm font-medium capitalize">{job.status.replace('_', ' ')}</div>
                  <div className="text-xs text-muted-foreground">
                    SLA: {job.sla_target_at ? new Date(job.sla_target_at).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
                <Badge variant={
                  job.sla_target_at && new Date(job.sla_target_at) < new Date() 
                    ? 'destructive' 
                    : 'outline'
                }>
                  {job.status}
                </Badge>
              </div>
            ))}
            {activeJobs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No active jobs</p>
            )}
          </div>
        </GlowCard>
      </div>
        </div>
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerOverview;
