import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { useMakerJobs, useUpdateJobStatus, PrintJob } from '@/hooks/useMakerData';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, Clock, AlertTriangle, CheckCircle, 
  ArrowRight, Loader2, Camera, Flag, Wrench
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const statusOrder: PrintJob['status'][] = ['new', 'printing', 'post_processing', 'ready', 'shipped', 'complete'];
const statusLabels: Record<PrintJob['status'], string> = {
  new: 'New',
  printing: 'Printing',
  post_processing: 'Post-Processing',
  ready: 'Ready',
  shipped: 'Shipped',
  complete: 'Complete',
  cancelled: 'Cancelled'
};

const slaLabels = {
  emergency: 'Emergency (<24h)',
  standard: 'Standard (24-48h)',
  large: 'Large (4-8 days)'
};

const MakerJobs = () => {
  const { toast } = useToast();
  const { data: jobs = [], isLoading } = useMakerJobs();
  const updateStatusMutation = useUpdateJobStatus();
  
  const [qualityDialogOpen, setQualityDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [qualityChecks, setQualityChecks] = useState({
    filament_dried: false,
    calibration_check: false,
    photo_before_ship: false
  });

  const activeJobs = jobs.filter(j => !['complete', 'cancelled'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'complete');

  const getNextStatus = (current: PrintJob['status']): PrintJob['status'] | null => {
    const idx = statusOrder.indexOf(current);
    if (idx === -1 || idx >= statusOrder.length - 1) return null;
    return statusOrder[idx + 1];
  };

  const handleAdvanceStatus = async (job: PrintJob) => {
    const nextStatus = getNextStatus(job.status);
    if (!nextStatus) return;

    // Show quality dialog before shipping
    if (nextStatus === 'shipped') {
      setSelectedJob(job);
      setQualityChecks(job.quality_checks as any || {
        filament_dried: false,
        calibration_check: false,
        photo_before_ship: false
      });
      setQualityDialogOpen(true);
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ jobId: job.id, status: nextStatus });
      toast({ title: 'Status updated', description: `Job moved to ${statusLabels[nextStatus]}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleShipWithQuality = async () => {
    if (!selectedJob) return;
    try {
      await updateStatusMutation.mutateAsync({ jobId: selectedJob.id, status: 'shipped' });
      toast({ title: 'Job shipped', description: 'Quality checks recorded' });
      setQualityDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getStatusProgress = (status: PrintJob['status']) => {
    const idx = statusOrder.indexOf(status);
    return idx >= 0 ? ((idx + 1) / statusOrder.length) * 100 : 0;
  };

  const isOverdue = (job: PrintJob) => {
    return job.sla_target_at && new Date(job.sla_target_at) < new Date();
  };

  const JobCard = ({ job }: { job: PrintJob }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlowCard className={`p-4 ${isOverdue(job) ? 'border-destructive/50' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={isOverdue(job) ? 'destructive' : 'secondary'}>
              {statusLabels[job.status]}
            </Badge>
            {isOverdue(job) && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <Progress value={getStatusProgress(job.status)} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            {statusOrder.slice(0, 5).map(s => (
              <span key={s} className={job.status === s ? 'text-secondary font-medium' : ''}>
                {statusLabels[s]}
              </span>
            ))}
          </div>
        </div>

        {/* SLA Target */}
        {job.sla_target_at && (
          <div className={`flex items-center gap-2 mb-4 p-2 rounded ${
            isOverdue(job) ? 'bg-destructive/20' : 'bg-muted/30'
          }`}>
            <Clock className={`w-4 h-4 ${isOverdue(job) ? 'text-destructive' : 'text-secondary'}`} />
            <span className="text-sm">
              SLA: {new Date(job.sla_target_at).toLocaleString()}
            </span>
          </div>
        )}

        {/* Notes */}
        {job.notes && (
          <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/20 rounded">
            {job.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {job.status !== 'complete' && job.status !== 'cancelled' && (
            <NeonButton 
              size="sm"
              onClick={() => handleAdvanceStatus(job)}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-1" />
                  {getNextStatus(job.status) ? `Move to ${statusLabels[getNextStatus(job.status)!]}` : 'Complete'}
                </>
              )}
            </NeonButton>
          )}
          <NeonButton size="sm" variant="secondary">
            <Camera className="w-4 h-4 mr-1" /> Add Photo
          </NeonButton>
          <NeonButton size="sm" variant="secondary">
            <Flag className="w-4 h-4 mr-1" /> Flag Reprint
          </NeonButton>
        </div>
      </GlowCard>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-tech font-bold text-foreground">Jobs Queue</h1>
        <p className="text-muted-foreground">Track and manage your print jobs</p>
      </div>

      {/* SLA Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded">
          <Clock className="w-3 h-3" />
          <span>Standard: 24-48h</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded">
          <Wrench className="w-3 h-3" />
          <span>Large: 4-8 days</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-destructive/20 rounded text-destructive">
          <AlertTriangle className="w-3 h-3" />
          <span>Emergency: &lt;24h (+15-25%)</span>
        </div>
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Active Jobs ({activeJobs.length})
        </h2>
        {activeJobs.length === 0 ? (
          <GlowCard className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No active jobs</h3>
            <p className="text-sm text-muted-foreground">Convert requests to jobs to get started</p>
          </GlowCard>
        ) : (
          <div className="grid gap-4">
            {activeJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed ({completedJobs.length})
          </h2>
          <div className="grid gap-4">
            {completedJobs.slice(0, 5).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Quality Dialog */}
      <Dialog open={qualityDialogOpen} onOpenChange={setQualityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quality Checklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filament_dried"
                checked={qualityChecks.filament_dried}
                onCheckedChange={(c) => setQualityChecks(prev => ({ ...prev, filament_dried: !!c }))}
              />
              <Label htmlFor="filament_dried">Filament properly dried before print</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="calibration_check"
                checked={qualityChecks.calibration_check}
                onCheckedChange={(c) => setQualityChecks(prev => ({ ...prev, calibration_check: !!c }))}
              />
              <Label htmlFor="calibration_check">Calibration check completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="photo_before_ship"
                checked={qualityChecks.photo_before_ship}
                onCheckedChange={(c) => setQualityChecks(prev => ({ ...prev, photo_before_ship: !!c }))}
              />
              <Label htmlFor="photo_before_ship">Photo taken before shipping</Label>
            </div>
          </div>
          <DialogFooter>
            <NeonButton variant="secondary" onClick={() => setQualityDialogOpen(false)}>
              Cancel
            </NeonButton>
            <NeonButton onClick={handleShipWithQuality}>
              Confirm & Ship
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MakerJobs;
