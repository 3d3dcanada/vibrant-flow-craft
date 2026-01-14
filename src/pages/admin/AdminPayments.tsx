/**
 * 🔒 LAUNCH-FROZEN (Phase 3H)
 * Admin payments UI is frozen for launch readiness.
 * Any changes require a new phase review and explicit approval.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DollarSign, Package, Clock, CheckCircle, XCircle, Loader2,
    AlertTriangle, FileText, Truck, Eye, ChevronDown, ChevronUp,
    Search, Filter, RefreshCw, UserCheck
} from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    user_id: string;
    quote_id?: string;
    quote_snapshot: any;
    total_cad: number;
    payment_method: string;
    status: string;
    notes?: string;
    admin_notes?: string;
    shipping_address: any;
    created_at: string;
    updated_at: string;
    payment_confirmed_at?: string;
    profiles?: { email?: string; full_name?: string };
}

const ORDER_STATUSES = [
    { value: 'awaiting_payment', label: 'Awaiting Payment', color: 'text-blue-400', icon: Clock },
    { value: 'paid', label: 'Paid', color: 'text-success', icon: CheckCircle },
    { value: 'in_production', label: 'In Production', color: 'text-warning', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'text-primary', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'text-success', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'text-destructive', icon: XCircle },
    { value: 'refunded', label: 'Refunded', color: 'text-muted-foreground', icon: XCircle },
];

const AdminPayments = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState<string>('awaiting_payment');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Modal states
    const [confirmModal, setConfirmModal] = useState<{
        type: 'payment' | 'status' | null;
        orderId: string;
        orderNumber: string;
        currentStatus?: string;
    } | null>(null);
    const [confirmReason, setConfirmReason] = useState('');
    const [confirmReference, setConfirmReference] = useState('');
    const [confirmNewStatus, setConfirmNewStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Maker assignment modal states (Phase 3F)
    const [assignModal, setAssignModal] = useState<{
        orderId: string;
        orderNumber: string;
    } | null>(null);
    const [selectedMakerId, setSelectedMakerId] = useState('');
    const [assignReason, setAssignReason] = useState('');
    const [assignNotes, setAssignNotes] = useState('');

    // Fetch orders with user info
    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ['admin_orders', statusFilter],
        queryFn: async () => {
            let query = (supabase as any)
                .from('orders')
                .select(`
                    *,
                    profiles:user_id (email, full_name)
                `)
                .order('created_at', { ascending: false });

            if (statusFilter && statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Order[];
        }
    });

    // Payment confirmation mutation
    const confirmPayment = useMutation({
        mutationFn: async ({ orderId, reference, reason }: { orderId: string; reference: string; reason: string }) => {
            // Note: Type assertion used because RPC types need regeneration after migration
            const { data, error } = await (supabase.rpc as any)('admin_confirm_payment', {
                p_order_id: orderId,
                p_payment_reference: reference || null,
                p_reason: reason || null
            });
            if (error) throw error;
            const result = data as { success: boolean; error?: string };
            if (!result.success) throw new Error(result.error || 'Failed to confirm payment');
            return result;
        },
        onSuccess: () => {
            toast({ title: 'Payment Confirmed', description: 'Order status updated to paid.' });
            queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
            setConfirmModal(null);
            setConfirmReason('');
            setConfirmReference('');
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    // Fetch active makers (Phase 3F)
    const { data: makers = [] } = useQuery({
        queryKey: ['active_makers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('maker_profiles')
                .select('maker_id, display_name, location, active')
                .eq('active', true);

            if (error) throw error;
            return data || [];
        }
    });

    // Check if order has existing assignment (Phase 3F - CORRECTED)
    const { data: assignments = [] } = useQuery({
        queryKey: ['maker_orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('maker_orders')
                .select('order_id, maker_id, status');

            if (error) throw error;
            return data || [];
        }
    });

    const getOrderAssignment = (orderId: string) => {
        return assignments.find((a: any) => a.order_id === orderId);
    };

    // Assign order to maker mutation (Phase 3F)
    const assignMaker = useMutation({
        mutationFn: async ({ orderId, makerId, reason, notes }: {
            orderId: string;
            makerId: string;
            reason: string;
            notes: string;
        }) => {
            const { data, error } = await (supabase.rpc as any)('admin_assign_order_to_maker', {
                p_order_id: orderId,
                p_maker_id: makerId,
                p_reason: reason,
                p_admin_notes: notes || null
            });
            if (error) throw error;
            const result = data as { success: boolean; error?: string };
            if (!result.success) throw new Error(result.error || 'Failed to assign maker');
            return result;
        },
        onSuccess: () => {
            toast({ title: 'Maker Assigned', description: 'Order has been assigned to the selected maker.' });
            queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
            queryClient.invalidateQueries({ queryKey: ['maker_orders'] });
            setAssignModal(null);
            setSelectedMakerId('');
            setAssignReason('');
            setAssignNotes('');
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const handleAssignMaker = async () => {
        if (!assignModal) return;
        if (!selectedMakerId) {
            toast({ title: 'Maker Required', description: 'Please select a maker.', variant: 'destructive' });
            return;
        }
        if (!assignReason.trim()) {
            toast({ title: 'Reason Required', description: 'Please provide a reason for the assignment.', variant: 'destructive' });
            return;
        }
        setIsProcessing(true);
        try {
            await assignMaker.mutateAsync({
                orderId: assignModal.orderId,
                makerId: selectedMakerId,
                reason: assignReason,
                notes: assignNotes
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Status update mutation
    const updateStatus = useMutation({
        mutationFn: async ({ orderId, newStatus, reason }: { orderId: string; newStatus: string; reason: string }) => {
            // Note: Type assertion used because RPC types need regeneration after migration
            const { data, error } = await (supabase.rpc as any)('admin_update_order_status', {
                p_order_id: orderId,
                p_new_status: newStatus,
                p_reason: reason || null,
                p_admin_notes: null
            });
            if (error) throw error;
            const result = data as { success: boolean; error?: string };
            if (!result.success) throw new Error(result.error || 'Failed to update status');
            return result;
        },
        onSuccess: () => {
            toast({ title: 'Status Updated', description: 'Order status has been changed.' });
            queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
            setConfirmModal(null);
            setConfirmReason('');
            setConfirmNewStatus('');
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const handleConfirmPayment = async () => {
        if (!confirmModal || confirmModal.type !== 'payment') return;
        if (!confirmReason.trim()) {
            toast({ title: 'Reason Required', description: 'Please provide a reason for the payment confirmation.', variant: 'destructive' });
            return;
        }
        setIsProcessing(true);
        try {
            await confirmPayment.mutateAsync({
                orderId: confirmModal.orderId,
                reference: confirmReference,
                reason: confirmReason
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!confirmModal || confirmModal.type !== 'status') return;
        if (!confirmReason.trim()) {
            toast({ title: 'Reason Required', description: 'Please provide a reason for the status change.', variant: 'destructive' });
            return;
        }
        if (!confirmNewStatus) {
            toast({ title: 'Status Required', description: 'Please select a new status.', variant: 'destructive' });
            return;
        }
        setIsProcessing(true);
        try {
            await updateStatus.mutateAsync({
                orderId: confirmModal.orderId,
                newStatus: confirmNewStatus,
                reason: confirmReason
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredOrders = orders?.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.order_number.toLowerCase().includes(query) ||
            order.profiles?.email?.toLowerCase().includes(query) ||
            order.profiles?.full_name?.toLowerCase().includes(query)
        );
    });

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)} CAD`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const getStatusConfig = (status: string) => ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
    const statusDescriptions: Record<string, string> = {
        awaiting_payment: 'Waiting on invoice verification.',
        paid: 'Payment confirmed. Assign a maker to begin.',
        in_production: 'Maker is printing. Awaiting shipment.',
        shipped: 'Shipped. Ready for delivery confirmation.',
        delivered: 'Delivery confirmed.',
        cancelled: 'Order cancelled.',
        refunded: 'Refund completed.',
    };

    const blockedByShipment = orders?.filter((order) => order.status === 'in_production').length || 0;
    const readyForDelivery = orders?.filter((order) => order.status === 'shipped').length || 0;

    return (
        <DashboardLayout>
            <AdminGuard>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-secondary" />
                            Payments & Orders
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Verify payments, manage order lifecycle, and control fulfillment
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">This system is launch-locked under Phase 3H.</p>
                    </motion.div>

                    <GlowCard className="p-5 mb-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-tech font-bold text-foreground">Fulfillment attention</h2>
                                <p className="text-sm text-muted-foreground">
                                    Quickly spot orders waiting on shipment details or delivery confirmation.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2">
                                    <div className="text-xs text-muted-foreground">Blocked by missing shipment</div>
                                    <div className="text-lg font-semibold text-warning">{blockedByShipment}</div>
                                </div>
                                <div className="rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-2">
                                    <div className="text-xs text-muted-foreground">Ready for delivery confirmation</div>
                                    <div className="text-lg font-semibold text-secondary">{readyForDelivery}</div>
                                </div>
                            </div>
                        </div>
                    </GlowCard>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                            >
                                <option value="all">All Statuses</option>
                                {ORDER_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order #, email, or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                        <NeonButton variant="secondary" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </NeonButton>
                    </div>

                    {/* Orders List */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : filteredOrders?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders?.map((order) => {
                                const statusConfig = getStatusConfig(order.status);
                                const StatusIcon = statusConfig.icon;
                                const isExpanded = expandedOrder === order.id;

                                return (
                                    <GlowCard key={order.id} className="p-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-background border ${statusConfig.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{statusConfig.label}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {statusDescriptions[order.status] || 'Status update in progress.'}
                                        </div>

                                        {/* Order Info */}
                                        <div className="flex-1 min-w-[200px]">
                                                <div className="font-mono font-bold text-foreground">{order.order_number}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {order.profiles?.full_name || order.profiles?.email || 'Unknown'}
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="text-right">
                                                <div className="font-bold text-secondary">{formatCurrency(order.total_cad)}</div>
                                                <div className="text-xs text-muted-foreground capitalize">{order.payment_method}</div>
                                            </div>

                                            {/* Date */}
                                            <div className="text-right text-sm text-muted-foreground min-w-[140px]">
                                                {formatDate(order.created_at)}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {order.status === 'awaiting_payment' && (
                                                    <NeonButton
                                                        size="sm"
                                                        onClick={() => setConfirmModal({
                                                            type: 'payment',
                                                            orderId: order.id,
                                                            orderNumber: order.order_number
                                                        })}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Confirm Payment
                                                    </NeonButton>
                                                )}
                                                {/* Phase 3F: Assign Maker button for paid orders */}
                                                {order.status === 'paid' && (
                                                    <TooltipProvider delayDuration={150}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <NeonButton
                                                                    size="sm"
                                                                    variant={getOrderAssignment(order.id) ? 'secondary' : 'default'}
                                                                    onClick={() => setAssignModal({
                                                                        orderId: order.id,
                                                                        orderNumber: order.order_number
                                                                    })}
                                                                    disabled={makers.length === 0}
                                                                >
                                                                    <UserCheck className="w-4 h-4 mr-1" />
                                                                    {getOrderAssignment(order.id) ? 'Reassign Maker' : 'Assign Maker'}
                                                                </NeonButton>
                                                            </TooltipTrigger>
                                                            {makers.length === 0 && (
                                                                <TooltipContent side="top">
                                                                    No active makers available to assign.
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                                <NeonButton
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setConfirmModal({
                                                        type: 'status',
                                                        orderId: order.id,
                                                        orderNumber: order.order_number,
                                                        currentStatus: order.status
                                                    })}
                                                >
                                                    Update Status
                                                </NeonButton>
                                                <button
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t border-border"
                                            >
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    {/* Quote Details */}
                                                    <div>
                                                        <h4 className="font-bold text-foreground mb-2">Quote Details</h4>
                                                        <div className="text-sm space-y-1 text-muted-foreground">
                                                            <p>Material: {order.quote_snapshot?.material}</p>
                                                            <p>Quantity: {order.quote_snapshot?.quantity}</p>
                                                            <p>Quality: {order.quote_snapshot?.quality}</p>
                                                            {order.quote_snapshot?.file_name && (
                                                                <p>File: {order.quote_snapshot.file_name}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Shipping */}
                                                    <div>
                                                        <h4 className="font-bold text-foreground mb-2">Shipping Address</h4>
                                                        <div className="text-sm text-muted-foreground">
                                                            <p>{order.shipping_address?.fullName}</p>
                                                            <p>{order.shipping_address?.addressLine1}</p>
                                                            {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                                                            <p>{order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postalCode}</p>
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    <div>
                                                        <h4 className="font-bold text-foreground mb-2">Notes</h4>
                                                        {order.notes && (
                                                            <div className="text-sm text-muted-foreground mb-2">
                                                                <strong>Customer:</strong> {order.notes}
                                                            </div>
                                                        )}
                                                        {order.admin_notes && (
                                                            <div className="text-sm text-warning">
                                                                <strong>Admin:</strong> {order.admin_notes}
                                                            </div>
                                                        )}
                                                        {order.payment_confirmed_at && (
                                                            <div className="text-xs text-success mt-2">
                                                                Payment confirmed: {formatDate(order.payment_confirmed_at)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* IDs for reference */}
                                                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                    <span>Order ID: {order.id}</span>
                                                    <span>User ID: {order.user_id}</span>
                                                    {order.quote_id && <span>Quote ID: {order.quote_id}</span>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </GlowCard>
                                );
                            })}
                        </div>
                    )}

                    {/* Confirmation Modal */}
                    {confirmModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-warning" />
                                    {confirmModal.type === 'payment' ? 'Confirm Payment' : 'Update Order Status'}
                                </h3>

                                <p className="text-muted-foreground mb-4">
                                    Order: <strong className="text-foreground">{confirmModal.orderNumber}</strong>
                                </p>

                                {confirmModal.type === 'payment' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="reference">Payment Reference (optional)</Label>
                                            <Input
                                                id="reference"
                                                placeholder="e.g., e-Transfer confirmation #, cheque #"
                                                value={confirmReference}
                                                onChange={(e) => setConfirmReference(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="reason">Reason (required)</Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Why is this payment being confirmed?"
                                                value={confirmReason}
                                                onChange={(e) => setConfirmReason(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="newStatus">New Status</Label>
                                            <select
                                                id="newStatus"
                                                value={confirmNewStatus}
                                                onChange={(e) => setConfirmNewStatus(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            >
                                                <option value="">Select status...</option>
                                                {ORDER_STATUSES.filter(s => s.value !== confirmModal.currentStatus).map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="reason">Reason (required)</Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Why is the status being changed?"
                                                value={confirmReason}
                                                onChange={(e) => setConfirmReason(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
                                    ⚠️ This action will be logged in the audit trail and cannot be undone.
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <NeonButton
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => {
                                            setConfirmModal(null);
                                            setConfirmReason('');
                                            setConfirmReference('');
                                            setConfirmNewStatus('');
                                        }}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </NeonButton>
                                    <NeonButton
                                        variant="primary"
                                        className="flex-1"
                                        onClick={confirmModal.type === 'payment' ? handleConfirmPayment : handleUpdateStatus}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Confirm'
                                        )}
                                    </NeonButton>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Assign Maker Modal (Phase 3F) */}
                    {assignModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-secondary" />
                                    Assign Maker
                                </h3>

                                <p className="text-muted-foreground mb-4">
                                    Order: <strong className="text-foreground">{assignModal.orderNumber}</strong>
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="maker">Select Maker *</Label>
                                        <select
                                            id="maker"
                                            value={selectedMakerId}
                                            onChange={(e) => setSelectedMakerId(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        >
                                            <option value="">Select a maker...</option>
                                            {makers.map((maker: any) => (
                                                <option key={maker.maker_id} value={maker.maker_id}>
                                                    {maker.display_name} ({maker.location || 'Location not provided'})
                                                </option>
                                            ))}
                                        </select>
                                        {makers.length === 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">No active makers found</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="assignReason">Reason (required)</Label>
                                        <Textarea
                                            id="assignReason"
                                            placeholder="Why is this maker being assigned?"
                                            value={assignReason}
                                            onChange={(e) => setAssignReason(e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="assignNotes">Admin Notes (optional)</Label>
                                        <Textarea
                                            id="assignNotes"
                                            placeholder="Any special instructions for this maker?"
                                            value={assignNotes}
                                            onChange={(e) => setAssignNotes(e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
                                    ⚠️ The maker will be notified and must accept the assignment before downloading files.
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <NeonButton
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => {
                                            setAssignModal(null);
                                            setSelectedMakerId('');
                                            setAssignReason('');
                                            setAssignNotes('');
                                        }}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </NeonButton>
                                    <NeonButton
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleAssignMaker}
                                        disabled={isProcessing || makers.length === 0}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Assigning...
                                            </>
                                        ) : (
                                            'Assign'
                                        )}
                                    </NeonButton>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </AdminGuard>
        </DashboardLayout>
    );
};

export default AdminPayments;
