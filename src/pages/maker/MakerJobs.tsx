import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package, Clock, Download, Loader2, ArrowRight, Truck, Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';
import FulfillmentTimeline from '@/components/fulfillment/FulfillmentTimeline';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MakerOrder {
  id: string;
  order_id: string;
  status: 'assigned' | 'in_production' | 'shipped' | 'completed';
  assigned_at: string;
  tracking_info?: any;
  notes?: string;
  orders: {
    order_number: string;
    status: string;
    total_cad: number;
    quote_snapshot: any;
    shipping_address: any;
    created_at: string;
    status_history?: any;
    payment_confirmed_at?: string;
  };
}

const MakerJobs = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedMakerOrder, setSelectedMakerOrder] = useState<MakerOrder | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [downloadingFile, setDownloadingFile] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'in_production' | 'shipped'>('all');

  // Fetch maker orders (CORRECTED: uses maker_orders, no accept/decline)
  const { data: makerOrders = [], isLoading } = useQuery({
    queryKey: ['maker-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maker_orders')
        .select(`
          id,
          order_id,
          status,
          assigned_at,
          tracking_info,
          notes,
          orders!inner (
            order_number,
            status,
            total_cad,
            quote_snapshot,
            shipping_address,
            created_at,
            status_history,
            payment_confirmed_at
          )
        `)
        .eq('maker_id', user?.id)
        .in('status', ['assigned', 'in_production', 'shipped'])
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as MakerOrder[];
    },
    enabled: !!user,
  });

  // Update order status (AUDIT-SAFE: passes explicit tracking params)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus, notes, trackingNumber, carrier }: {
      orderId: string;
      newStatus: string;
      notes: string;
      trackingNumber?: string;
      carrier?: string;
    }) => {
      const { data, error } = await (supabase.rpc as any)('maker_update_order_status', {
        p_order_id: orderId,
        p_new_status: newStatus,
        p_notes: notes,
        p_tracking_number: trackingNumber || null,
        p_carrier: carrier || null
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker-orders'] });
      toast({ title: 'Status updated', description: 'Order status has been updated successfully' });
      setStatusDialogOpen(false);
      setSelectedMakerOrder(null);
      setStatusNotes('');
      setTrackingNumber('');
      setShippingCarrier('');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Download file
  const handleDownloadFile = async (makerOrder: MakerOrder) => {
    setDownloadingFile(true);
    try {
      const { data, error } = await supabase.functions.invoke('maker-get-file-url', {
        body: { order_id: makerOrder.order_id },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to get file URL');

      // Open signed URL in new tab to download
      window.open(data.signed_url, '_blank');
      toast({ title: 'Download started', description: `Downloading ${data.file_name}` });
    } catch (error: any) {
      toast({ title: 'Download failed', description: error.message, variant: 'destructive' });
    } finally {
      setDownloadingFile(false);
    }
  };

  const handleUpdateStatus = (makerOrder: MakerOrder) => {
    setSelectedMakerOrder(makerOrder);
    setStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedMakerOrder) return;

    const currentStatus = selectedMakerOrder.status;
    let targetStatus = '';

    // Status flow: assigned → in_production → shipped
    if (currentStatus === 'assigned') {
      targetStatus = 'in_production';
    } else if (currentStatus === 'in_production') {
      targetStatus = 'shipped';
    }

    if (!targetStatus) {
      toast({ title: 'Error', description: 'Invalid status transition', variant: 'destructive' });
      return;
    }

    // AUDIT-SAFE: Client-side validation for shipping
    if (targetStatus === 'shipped') {
      if (!trackingNumber || !trackingNumber.trim()) {
        toast({ title: 'Tracking Required', description: 'Please enter a tracking number', variant: 'destructive' });
        return;
      }
      if (!shippingCarrier || !shippingCarrier.trim()) {
        toast({ title: 'Carrier Required', description: 'Please enter a shipping carrier', variant: 'destructive' });
        return;
      }
    }

    // AUDIT-SAFE: Pass structured params, no text concatenation
    updateStatusMutation.mutate({
      orderId: selectedMakerOrder.order_id,
      newStatus: targetStatus,
      notes: statusNotes || `Status updated to ${targetStatus}`,
      trackingNumber: targetStatus === 'shipped' ? trackingNumber : undefined,
      carrier: targetStatus === 'shipped' ? shippingCarrier : undefined
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const trackingRequired = selectedMakerOrder?.status === 'in_production';
  const trackingReady = trackingNumber.trim().length > 0 && shippingCarrier.trim().length > 0;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; variant: any; icon: any }> = {
      assigned: { label: 'Assigned', variant: 'default', icon: Clock },
      in_production: { label: 'In Production', variant: 'secondary', icon: Package },
      shipped: { label: 'Shipped', variant: 'default', icon: Truck },
    };
    const config = badges[status] || { label: status, variant: 'secondary', icon: Package };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" /> {config.label}
      </Badge>
    );
  };

  const getNextAction = (status: MakerOrder['status']) => {
    if (status === 'assigned') {
      return 'Next action: start production when you are ready to begin printing.';
    }
    if (status === 'in_production') {
      return 'Next action: add tracking and mark shipped once the package is handed to the carrier.';
    }
    if (status === 'shipped') {
      return 'Next action: wait for the admin to confirm delivery.';
    }
    return 'Next action: no further steps required.';
  };

  const filteredMakerOrders = makerOrders.filter((makerOrder) => {
    if (statusFilter === 'all') return true;
    return makerOrder.status === statusFilter;
  });

  const MakerOrderCard = ({ makerOrder }: { makerOrder: MakerOrder }) => {
    const { orders, status } = makerOrder;
    const quoteData = orders.quote_snapshot;

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlowCard className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-tech font-bold text-lg">{orders.order_number}</h3>
                {getStatusBadge(status)}
              </div>
              <p className="text-sm text-muted-foreground">
                Assigned {new Date(makerOrder.assigned_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">{formatCurrency(orders.total_cad)}</p>
              <p className="text-xs text-muted-foreground">Order Total</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/20 rounded">
            <div>
              <p className="text-xs text-muted-foreground">Material</p>
              <p className="font-semibold">{quoteData?.material || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quality</p>
              <p className="font-semibold">{quoteData?.quality || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="font-semibold">{quoteData?.quantity || 0} part(s)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery Location</p>
              <p className="font-semibold">
                {orders.shipping_address?.city}, {orders.shipping_address?.province}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            {getNextAction(status)}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Fulfillment Timeline</h4>
            <FulfillmentTimeline
              orderStatus={orders.status}
              statusHistory={orders.status_history}
              paymentConfirmedAt={orders.payment_confirmed_at}
              makerOrder={makerOrder}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <NeonButton onClick={() => handleDownloadFile(makerOrder)} disabled={downloadingFile}>
                {downloadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
                Download File
              </NeonButton>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center text-muted-foreground">
                      <Info className="w-4 h-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Signed URL expires in 10 minutes.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {status === 'assigned' && (
              <NeonButton onClick={() => handleUpdateStatus(makerOrder)} disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-1" />}
                Start Production
              </NeonButton>
            )}

            {status === 'in_production' && (
              <NeonButton onClick={() => handleUpdateStatus(makerOrder)} disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4 mr-1" />}
                Mark Shipped
              </NeonButton>
            )}
          </div>
        </GlowCard>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <MakerGuard>
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        </MakerGuard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-tech font-bold text-foreground">Assigned Jobs</h1>
            <p className="text-muted-foreground">Manage your assigned print jobs</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'assigned', 'in_production', 'shipped'] as const).map((filter) => (
              <NeonButton
                key={filter}
                size="sm"
                variant={statusFilter === filter ? 'primary' : 'secondary'}
                onClick={() => setStatusFilter(filter)}
              >
                {filter === 'all' ? 'All' : filter.replace(/_/g, ' ')}
              </NeonButton>
            ))}
          </div>

          {filteredMakerOrders.length === 0 ? (
            <GlowCard className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No active jobs</h3>
              <p className="text-sm text-muted-foreground">Assignments will appear here when admins assign orders to you</p>
            </GlowCard>
          ) : (
            <div className="grid gap-4">
              {filteredMakerOrders.map((makerOrder) => (
                <MakerOrderCard key={makerOrder.id} makerOrder={makerOrder} />
              ))}
            </div>
          )}

          {/* Status Update Dialog */}
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  {selectedMakerOrder?.status === 'assigned' && 'Mark this order as in production'}
                  {selectedMakerOrder?.status === 'in_production' && 'Mark this order as shipped and add tracking information'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMakerOrder?.status === 'in_production' && (
                  <>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="tracking">Tracking Number *</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center text-muted-foreground">
                                <Info className="w-3.5 h-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              Tracking required to ship.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g., 123456789"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="carrier">Shipping Carrier *</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center text-muted-foreground">
                                <Info className="w-3.5 h-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              Tracking required to ship.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="carrier"
                        value={shippingCarrier}
                        onChange={(e) => setShippingCarrier(e.target.value)}
                        placeholder="e.g., Canada Post, UPS, etc."
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tracking details are required before marking a job shipped.
                    </p>
                  </>
                )}
                <div>
                  <Label htmlFor="status-notes">Notes (optional)</Label>
                  <Textarea
                    id="status-notes"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    placeholder="Add any relevant notes about this status change"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setStatusDialogOpen(false)}>Cancel</NeonButton>
                <NeonButton
                  onClick={confirmStatusUpdate}
                  disabled={updateStatusMutation.isPending || (trackingRequired && !trackingReady)}
                >
                  {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
                </NeonButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerJobs;
