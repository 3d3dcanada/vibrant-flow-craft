import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { useMakerPayouts, useMakerJobs, useCreatePayout } from '@/hooks/useMakerData';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, TrendingUp, Clock, CheckCircle, 
  Loader2, Calendar, AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';

const MakerEarnings = () => {
  const { toast } = useToast();
  const { data: payouts = [], isLoading: loadingPayouts } = useMakerPayouts();
  const { data: jobs = [] } = useMakerJobs();
  const createPayoutMutation = useCreatePayout();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const completedJobs = jobs.filter(j => j.status === 'complete');
  
  // Mock earnings calculations (would be real in production)
  const weekJobs = completedJobs.filter(j => {
    const d = new Date(j.created_at);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  });
  const monthJobs = completedJobs.filter(j => {
    const d = new Date(j.created_at);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
  });

  const avgJobValue = 25; // Mock
  const weekEarnings = weekJobs.length * avgJobValue;
  const monthEarnings = monthJobs.length * avgJobValue;
  const lifetimeEarnings = completedJobs.length * avgJobValue;

  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const completedPayouts = payouts.filter(p => p.status === 'completed');

  const handleRequestPayout = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      return;
    }
    
    try {
      await createPayoutMutation.mutateAsync(amountNum);
      toast({ title: 'Payout requested', description: 'We will process your request within 5 business days.' });
      setDialogOpen(false);
      setAmount('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to request payout', variant: 'destructive' });
    }
  };

  if (loadingPayouts) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-tech font-bold text-foreground">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your maker income</p>
        </div>
        <NeonButton onClick={() => setDialogOpen(true)}>
          <DollarSign className="w-4 h-4 mr-2" /> Request Payout
        </NeonButton>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlowCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-secondary/20">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-muted-foreground">This Week</span>
          </div>
          <div className="text-3xl font-tech font-bold">${weekEarnings.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{weekJobs.length} completed jobs</div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-muted-foreground">This Month</span>
          </div>
          <div className="text-3xl font-tech font-bold">${monthEarnings.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{monthJobs.length} completed jobs</div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-green-500/20">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-muted-foreground">Lifetime</span>
          </div>
          <div className="text-3xl font-tech font-bold">${lifetimeEarnings.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{completedJobs.length} total jobs</div>
        </GlowCard>
      </div>

      {/* Payout Info */}
      <GlowCard className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Payout Information</p>
            <p className="text-muted-foreground">
              Payouts are processed weekly via e-Transfer. As a subcontractor, you are responsible 
              for reporting income. Minimum payout: $25 CAD. Processing time: 3-5 business days.
            </p>
          </div>
        </div>
      </GlowCard>

      {/* Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Payouts ({pendingPayouts.length})
          </h2>
          {pendingPayouts.length === 0 ? (
            <GlowCard className="p-8 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No pending payouts</p>
            </GlowCard>
          ) : (
            <div className="space-y-3">
              {pendingPayouts.map(payout => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlowCard className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">${payout.amount_estimate.toFixed(2)} CAD</div>
                        <div className="text-xs text-muted-foreground">
                          Requested: {new Date(payout.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="secondary">{payout.status}</Badge>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed Payouts ({completedPayouts.length})
          </h2>
          {completedPayouts.length === 0 ? (
            <GlowCard className="p-8 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No completed payouts yet</p>
            </GlowCard>
          ) : (
            <div className="space-y-3">
              {completedPayouts.slice(0, 10).map(payout => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlowCard className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">${payout.amount_estimate.toFixed(2)} CAD</div>
                        <div className="text-xs text-muted-foreground">
                          Processed: {payout.processed_at 
                            ? new Date(payout.processed_at).toLocaleDateString()
                            : new Date(payout.created_at).toLocaleDateString()
                          }
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-500 border-green-500">Completed</Badge>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Payout Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Enter the amount you'd like to withdraw. Minimum: $25 CAD.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (CAD)</Label>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
                min="25"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Payouts are sent via e-Transfer to the email associated with your account. 
              Processing takes 3-5 business days.
            </p>
          </div>
          <DialogFooter>
            <NeonButton variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </NeonButton>
            <NeonButton 
              onClick={handleRequestPayout}
              disabled={createPayoutMutation.isPending || parseFloat(amount) < 25}
            >
              {createPayoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Request Payout'
              )}
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerEarnings;
