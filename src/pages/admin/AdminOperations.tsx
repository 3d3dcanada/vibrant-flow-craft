import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import { 
  useAdminPayoutRequests, useUpdatePayoutStatus
} from '@/hooks/useAdminData';
import { useAllUnassignedRequests, useAllMakers, useAssignRequestToMaker } from '@/hooks/useMakerData';
import { Settings, Package, Coins, Loader2, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminOperations = () => {
  const { toast } = useToast();
  
  // Requests
  const { data: unassignedRequests, isLoading: requestsLoading } = useAllUnassignedRequests();
  const { data: makers } = useAllMakers();
  const assignRequest = useAssignRequestToMaker();
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedMakerId, setSelectedMakerId] = useState<string>('');

  // Payouts
  const { data: payouts, isLoading: payoutsLoading } = useAdminPayoutRequests();
  const updatePayoutStatus = useUpdatePayoutStatus();

  const handleAssign = async (requestId: string) => {
    if (!selectedMakerId) {
      toast({ title: 'Select a maker', variant: 'destructive' });
      return;
    }
    await assignRequest.mutateAsync({ requestId, makerId: selectedMakerId });
    toast({ title: 'Request assigned' });
    setAssigningId(null);
    setSelectedMakerId('');
  };

  const handlePayoutStatus = async (id: string, status: 'processing' | 'completed' | 'rejected') => {
    await updatePayoutStatus.mutateAsync({ id, status });
    toast({ title: `Payout ${status}` });
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 text-warning" />,
    processing: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-success" />,
    rejected: <XCircle className="w-4 h-4 text-destructive" />
  };

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <Settings className="w-8 h-8 text-secondary" />
              Operations
            </h1>
          </motion.div>

          <Tabs defaultValue="requests">
            <TabsList className="mb-6">
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Requests Routing
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Payout Queue
              </TabsTrigger>
            </TabsList>

            {/* Requests Routing */}
            <TabsContent value="requests">
              <h2 className="text-lg font-bold text-foreground mb-4">Unassigned Requests</h2>
              {requestsLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              ) : unassignedRequests?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No unassigned requests</div>
              ) : (
                <div className="space-y-4">
                  {unassignedRequests?.map((request) => (
                    <GlowCard key={request.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Request #{request.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            Status: {request.status} • Created: {new Date(request.created_at).toLocaleDateString()}
                          </div>
                          {request.specs && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {typeof request.specs === 'object' && 'materialType' in request.specs && `Material: ${request.specs.materialType}`}
                              {typeof request.specs === 'object' && 'quantity' in request.specs && ` • Qty: ${request.specs.quantity}`}
                            </div>
                          )}
                        </div>
                        {assigningId === request.id ? (
                          <div className="flex items-center gap-2">
                            <Select value={selectedMakerId} onValueChange={setSelectedMakerId}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select maker" />
                              </SelectTrigger>
                              <SelectContent>
                                {makers?.map(maker => (
                                  <SelectItem key={maker.id} value={maker.id}>
                                    {maker.display_name || maker.full_name || 'Maker'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <NeonButton size="sm" onClick={() => handleAssign(request.id)} disabled={assignRequest.isPending}>
                              Assign
                            </NeonButton>
                            <NeonButton size="sm" variant="secondary" onClick={() => setAssigningId(null)}>
                              Cancel
                            </NeonButton>
                          </div>
                        ) : (
                          <NeonButton size="sm" onClick={() => setAssigningId(request.id)}>
                            <User className="w-4 h-4 mr-2" />
                            Assign
                          </NeonButton>
                        )}
                      </div>
                    </GlowCard>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Payouts Queue */}
            <TabsContent value="payouts">
              <h2 className="text-lg font-bold text-foreground mb-4">Payout Requests</h2>
              {payoutsLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              ) : payouts?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No payout requests</div>
              ) : (
                <div className="space-y-4">
                  {payouts?.map((payout) => (
                    <GlowCard key={payout.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {statusIcons[payout.status]}
                          <span className="capitalize text-sm font-medium">{payout.status}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            ${Number(payout.amount_estimate).toFixed(2)} CAD
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Maker: {payout.maker_id.slice(0, 8)}... • {new Date(payout.created_at).toLocaleDateString()}
                          </div>
                          {payout.notes && (
                            <div className="text-xs text-muted-foreground">{payout.notes}</div>
                          )}
                        </div>
                        {payout.status === 'pending' && (
                          <div className="flex gap-2">
                            <NeonButton size="sm" onClick={() => handlePayoutStatus(payout.id, 'processing')}>
                              Process
                            </NeonButton>
                            <NeonButton size="sm" variant="secondary" onClick={() => handlePayoutStatus(payout.id, 'rejected')}>
                              Reject
                            </NeonButton>
                          </div>
                        )}
                        {payout.status === 'processing' && (
                          <NeonButton size="sm" onClick={() => handlePayoutStatus(payout.id, 'completed')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Paid
                          </NeonButton>
                        )}
                      </div>
                    </GlowCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default AdminOperations;
