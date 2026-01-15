/**
 * 🔒 LAUNCH-FROZEN (Phase 3H)
 * Order confirmation UI is frozen for launch readiness.
 * Any changes require a new phase review and explicit approval.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import FulfillmentTimeline from '@/components/orders/FulfillmentTimeline';
import {
    CheckCircle, Clock, Package, FileText, Coins,
    AlertCircle, Loader2, ArrowRight, Mail, Info
} from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    user_id: string;
    quote_id: string;
    quote_snapshot: Record<string, unknown>;
    total_cad: number;
    currency: string;
    payment_method: 'invoice' | 'credits';
    payment_confirmed_at?: string;
    shipping_address: Record<string, unknown>;
    status: string;
    status_history?: unknown;
    created_at: string;
    notes?: string;
}

interface FulfillmentData {
    order_id: string;
    order_status: string;
    payment_confirmed_at?: string | null;
    status_history?: unknown;
    maker_stage?: string | null;
    tracking_info?: Record<string, unknown> | null;
}

interface FulfillmentResponse {
    success: boolean;
    data?: FulfillmentData;
    error?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    'pending_payment': { label: 'Pending Payment', color: 'text-warning', icon: Clock },
    'awaiting_payment': { label: 'Awaiting Payment', color: 'text-blue-400', icon: Clock },
    'paid': { label: 'Paid', color: 'text-success', icon: CheckCircle },
    'in_production': { label: 'In Production', color: 'text-secondary', icon: Package },
    'shipped': { label: 'Shipped', color: 'text-primary', icon: Package },
    'delivered': { label: 'Delivered', color: 'text-success', icon: CheckCircle },
    'cancelled': { label: 'Cancelled', color: 'text-destructive', icon: AlertCircle },
    'refunded': { label: 'Refunded', color: 'text-muted-foreground', icon: AlertCircle },
};

const MATERIAL_NAMES: Record<string, string> = {
    'PLA_STANDARD': 'PLA Standard',
    'PLA_SPECIALTY': 'PLA Specialty',
    'PETG': 'PETG',
    'PETG_CF': 'PETG Carbon Fiber',
    'TPU': 'TPU Flexible',
    'ABS_ASA': 'ABS/ASA',
};

// Invoice configuration
const INVOICE_CONFIG = {
    email: 'orders@3d3d.ca',
    responseTime: 'within 24 business hours',
};

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user, loading: authLoading } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fulfillment, setFulfillment] = useState<FulfillmentData | null>(null);
    const [fulfillmentLoading, setFulfillmentLoading] = useState(false);
    const [fulfillmentError, setFulfillmentError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth', { state: { returnTo: `/order/${orderId}` } });
        }
    }, [user, authLoading, navigate, orderId]);

    // Load order
    useEffect(() => {
        const loadOrder = async () => {
            if (!user || !orderId) return;

            setLoading(true);
            setError(null);
            setFulfillment(null);
            setFulfillmentError(null);

            try {
                const { data, error: fetchError } = await supabase
                    .from('orders' as never)
                    .select('*')
                    .eq('id', orderId)
                    .eq('user_id', user.id)
                    .single();

                if (fetchError) {
                    console.error('Order fetch error:', fetchError);
                    setError('Order not found or access denied.');
                    return;
                }

                setOrder(data);

                setFulfillmentLoading(true);
                const { data: fulfillmentData, error: fulfillmentFetchError } = await supabase.rpc(
                    'customer_get_order_fulfillment' as never,
                    { p_order_id: orderId }
                );
                if (fulfillmentFetchError) {
                    console.error('Fulfillment fetch error:', fulfillmentFetchError);
                    setFulfillmentError('Fulfillment updates are temporarily unavailable.');
                } else {
                    const result = fulfillmentData as FulfillmentResponse;
                    if (!result.success) {
                        setFulfillmentError(result.error || 'Fulfillment updates are temporarily unavailable.');
                    } else {
                        setFulfillment(result.data || null);
                    }
                }
            } catch (err) {
                console.error('Error loading order:', err);
                setError('Failed to load order. Please try again.');
            } finally {
                setFulfillmentLoading(false);
                setLoading(false);
            }
        };

        loadOrder();
    }, [user, orderId]);

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)} CAD`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                    <GlassPanel variant="elevated" className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-tech font-bold text-foreground mb-2">
                            Order Not Found
                        </h1>
                        <p className="text-muted-foreground mb-6">{error || 'This order could not be found.'}</p>
                        <NeonButton variant="primary" onClick={() => navigate('/dashboard/customer')}>
                            Go to Dashboard
                        </NeonButton>
                    </GlassPanel>
                </div>
                <Footer />
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending_payment'];
    const StatusIcon = statusConfig.icon;
    const isPaid = order.status === 'paid';
    const fulfillmentSnapshot = fulfillment || {
        order_status: order.status,
        payment_confirmed_at: order.payment_confirmed_at,
        status_history: order.status_history,
        maker_stage: null,
        tracking_info: null,
        order_id: order.id,
    };
    const makerOrderSnapshot = fulfillment
        ? {
            status: fulfillment.maker_stage ?? null,
            tracking_info: fulfillment.tracking_info ?? null,
        }
        : null;
    const trackingInfo =
        fulfillmentSnapshot.tracking_info &&
            typeof fulfillmentSnapshot.tracking_info === 'object' &&
            Object.keys(fulfillmentSnapshot.tracking_info).length > 0
            ? fulfillmentSnapshot.tracking_info
            : null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        {isPaid ? (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-10 h-10 text-success" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    {order.payment_method === 'credits' ? 'Order Confirmed!' : 'Payment Confirmed!'}
                                </h1>
                                <p className="text-muted-foreground">
                                    Your order is now being processed.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                    <FileText className="w-10 h-10 text-blue-400" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    Order Created
                                </h1>
                                <p className="text-muted-foreground">
                                    We will send payment instructions to your email.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Order Number */}
                    <GlassPanel variant="elevated" className="mb-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                        <p className="text-2xl font-mono font-bold text-secondary">
                            {order.order_number}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                            <span className={`text-sm font-medium ${statusConfig.color}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </GlassPanel>

                    {/* Invoice Payment Instructions */}
                    {order.payment_method === 'invoice' && order.status === 'awaiting_payment' && (
                        <GlassPanel variant="elevated" className="mb-6 border-blue-500/30">
                            <div className="flex items-start gap-3 mb-4">
                                <FileText className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-lg font-tech font-bold text-foreground">
                                        Invoice Payment
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        We will send payment instructions to your email
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-background/50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Amount Due</span>
                                    <span className="font-mono text-lg font-bold text-secondary">
                                        {formatCurrency(order.total_cad)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Expected Response</span>
                                    <span className="text-foreground">{INVOICE_CONFIG.responseTime}</span>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    Questions? Contact us at{' '}
                                    <a href={`mailto:${INVOICE_CONFIG.email}`} className="text-secondary hover:underline">
                                        {INVOICE_CONFIG.email}
                                    </a>
                                </p>
                            </div>
                        </GlassPanel>
                    )}

                    {/* Credits Payment Confirmation */}
                    {order.payment_method === 'credits' && isPaid && (
                        <GlassPanel variant="elevated" className="mb-6 border-success/30">
                            <div className="flex items-start gap-3">
                                <Coins className="w-6 h-6 text-success shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-lg font-tech font-bold text-foreground">
                                        Paid with Credits
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Your platform credits have been applied to this order.
                                    </p>
                                    {order.notes && (
                                        <p className="text-sm text-muted-foreground mt-2 p-2 bg-success/10 rounded">
                                            {order.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </GlassPanel>
                    )}

                    {/* Email Notice */}
                    <GlassPanel variant="elevated" className="mb-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-foreground font-medium mb-1">Email Confirmations</p>
                                <p className="text-muted-foreground">
                                    Email confirmations are not yet automated. Your order is saved and visible in your dashboard.
                                    We're working on adding email notifications soon.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Fulfillment Timeline */}
                    <GlassPanel variant="elevated" className="mb-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-tech font-bold text-foreground">Fulfillment Status</h2>
                                <p className="text-sm text-muted-foreground">
                                    Fulfillment is handled manually by our maker network. Maker identity is kept private.
                                </p>
                            </div>
                            {fulfillmentLoading && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating
                                </div>
                            )}
                        </div>
                        {fulfillmentError && (
                            <p className="mt-3 text-sm text-destructive">{fulfillmentError}</p>
                        )}
                        <div className="mt-4">
                            <FulfillmentTimeline
                                orderStatus={fulfillmentSnapshot.order_status}
                                paymentConfirmedAt={fulfillmentSnapshot.payment_confirmed_at}
                                statusHistory={fulfillmentSnapshot.status_history}
                                makerOrder={makerOrderSnapshot}
                            />
                        </div>
                    </GlassPanel>

                    {/* Tracking */}
                    <GlassPanel variant="elevated" className="mb-6">
                        <h3 className="font-tech font-bold text-foreground mb-3">Tracking</h3>
                        {trackingInfo ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Carrier</span>
                                    <span className="text-foreground">{trackingInfo.carrier || '—'}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Tracking Number</span>
                                    <span className="text-foreground font-mono">{trackingInfo.tracking_number || '—'}</span>
                                </div>
                                {trackingInfo.shipped_at && (
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">Shipped</span>
                                        <span className="text-foreground">{formatDate(trackingInfo.shipped_at)}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tracking details will appear once your order ships.
                            </p>
                        )}
                    </GlassPanel>

                    {/* Order Details */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Order Summary */}
                        <GlassPanel variant="elevated">
                            <h3 className="font-tech font-bold text-foreground mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Material</span>
                                    <span className="text-foreground">
                                        {MATERIAL_NAMES[order.quote_snapshot?.material] || order.quote_snapshot?.material}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity</span>
                                    <span className="text-foreground">{order.quote_snapshot?.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quality</span>
                                    <span className="text-foreground capitalize">{order.quote_snapshot?.quality}</span>
                                </div>
                                <div className="border-t border-border my-2" />
                                <div className="flex justify-between font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-secondary">{formatCurrency(order.total_cad)}</span>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Shipping Address */}
                        <GlassPanel variant="elevated">
                            <h3 className="font-tech font-bold text-foreground mb-4">Shipping To</h3>
                            <div className="text-sm text-foreground space-y-1">
                                <p className="font-medium">{order.shipping_address?.fullName}</p>
                                <p>{order.shipping_address?.addressLine1}</p>
                                {order.shipping_address?.addressLine2 && (
                                    <p>{order.shipping_address.addressLine2}</p>
                                )}
                                <p>
                                    {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postalCode}
                                </p>
                                <p>Canada</p>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Order Info */}
                    <GlassPanel variant="elevated" className="mb-6">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Order Placed</p>
                                <p className="text-foreground">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="text-foreground capitalize flex items-center gap-2">
                                    {order.payment_method === 'invoice' && <FileText className="w-4 h-4 text-blue-400" />}
                                    {order.payment_method === 'credits' && <Coins className="w-4 h-4 text-secondary" />}
                                    {order.payment_method === 'invoice' ? 'Invoice' : 'Platform Credits'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Quote Reference</p>
                                <p className="text-foreground font-mono">{order.quote_id?.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <NeonButton
                            variant="primary"
                            onClick={() => navigate('/dashboard/customer')}
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </NeonButton>
                        <NeonButton
                            variant="secondary"
                            onClick={() => navigate('/quote')}
                        >
                            Create Another Order
                        </NeonButton>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
