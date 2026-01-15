/**
 * 🔒 LAUNCH-FROZEN (Phase 3H)
 * Maker jobs UI is frozen for launch readiness.
 * Any changes require a new phase review and explicit approval.
 */
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
  Package, Clock, Download, Loader2, ArrowRight, Truck, AlertTriangle, Info
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
  const [updateError, setUpdateError] = useState<string | null>(null);

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
            created_at
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
      setUpdateError(null);
      setStatusDialogOpen(false);
      setSelectedMakerOrder(null);
      setStatusNotes('');
      setTrackingNumber('');
      setShippingCarrier('');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setUpdateError(error.message || 'Status update failed. Please try again.');
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
    setUpdateError(null);
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

  const getActionBadge = (makerOrder: MakerOrder) => {
    const trackingInfo = makerOrder.tracking_info as Record<string, any> | undefined;
    const hasTracking = Boolean(trackingInfo?.tracking_number && trackingInfo?.carrier);

    if (makerOrder.status === 'assigned') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 text-warning border border-warning/40 px-2 py-0.5 text-xs font-semibold">
          <Clock className="h-3 w-3" />
          Awaiting action
        </span>
      );
    }

    if (makerOrder.status === 'in_production') {
      return hasTracking ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 text-secondary border border-secondary/40 px-2 py-0.5 text-xs font-semibold">
          <Truck className="h-3 w-3" />
          Ready to ship
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive border border-destructive/40 px-2 py-0.5 text-xs font-semibold">
          <AlertTriangle className="h-3 w-3" />
          Blocked (missing tracking)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success border border-success/40 px-2 py-0.5 text-xs font-semibold">
        <Truck className="h-3 w-3" />
        In transit
      </span>
    );
  };

  const getNextStepCopy = (status: MakerOrder['status']) => {
    if (status === 'assigned') {
      return 'Next step: start production when you begin printing. Files are ready to download.';
    }
    if (status === 'in_production') {
      return 'Next step: add tracking to mark shipped. Customers see tracking once you submit it.';
    }
    return 'Delivery confirmation is handled by the admin team once the carrier confirms drop-off.';
  };

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
                {getActionBadge(makerOrder)}
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

          <div className="rounded-lg border border-primary/10 bg-background/40 px-4 py-3 mb-4">
            <div className="flex items-start gap-2 text-sm text-foreground">
              <Info className="h-4 w-4 text-secondary mt-0.5" />
              <div>
                <p className="font-medium">What happens next</p>
                <p className="text-muted-foreground">{getNextStepCopy(status)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <NeonButton onClick={() => handleDownloadFile(makerOrder)} disabled={downloadingFile}>
              {downloadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
              Download File
            </NeonButton>

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

          {updateError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {updateError}
            </div>
          )}

          {makerOrders.length === 0 ? (
            <GlowCard className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No active jobs</h3>
              <p className="text-sm text-muted-foreground">Assignments will appear here when admins assign orders to you</p>
            </GlowCard>
          ) : (
            <div className="grid gap-4">
              {makerOrders.map((makerOrder) => (
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
                  {selectedMakerOrder?.status === 'assigned' && 'Move this order into production once printing begins.'}
                  {selectedMakerOrder?.status === 'in_production' && 'Add tracking to mark shipped so customers can follow delivery.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMakerOrder?.status === 'in_production' && (
                  <>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="tracking">
                          {selectedMakerOrder?.status === 'in_production'
                            ? 'Tracking Number (required to mark as shipped)'
                            : 'Tracking Number (optional)'}
                        </Label>
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-muted-foreground">
                                <Info className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Tracking is required so customers can verify shipment and delivery.
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
                      <Label htmlFor="carrier">
                        {selectedMakerOrder?.status === 'in_production'
                          ? 'Shipping Carrier (required to mark as shipped)'
                          : 'Shipping Carrier (optional)'}
                      </Label>
                      <Input
                        id="carrier"
                        value={shippingCarrier}
                        onChange={(e) => setShippingCarrier(e.target.value)}
                        placeholder="e.g., Canada Post, UPS, etc."
                      />
                      <p className="text-xs text-muted-foreground mt-1">Helps customers locate their package quickly.</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required before shipment to display tracking to the customer.
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
                  {selectedMakerOrder?.status === 'in_production' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-secondary">
                              <Info className="h-4 w-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Delivered status is admin-only to protect customer experience and earnings accuracy.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      Delivered confirmation is admin-only after carrier validation.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setStatusDialogOpen(false)}>Cancel</NeonButton>
                <NeonButton
                  onClick={confirmStatusUpdate}
                  disabled={
                    updateStatusMutation.isPending ||
                    (selectedMakerOrder?.status === 'in_production' &&
                      (!trackingNumber.trim() || !shippingCarrier.trim()))
                  }
                >
                  {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
                </NeonButton>
              </DialogFooter>
              {updateStatusMutation.isPending && (
                <p className="text-xs text-muted-foreground">Updating status…</p>
              )}
              {selectedMakerOrder?.status === 'in_production' &&
                !updateStatusMutation.isPending &&
                (!trackingNumber.trim() || !shippingCarrier.trim()) && (
                  <p className="text-xs text-muted-foreground">
                    Tracking number and carrier are required before marking as shipped.
                  </p>
                )}
            </DialogContent>
          </Dialog>
        </div>
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerJobs;
