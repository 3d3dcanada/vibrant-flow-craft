import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import {
    CheckCircle, Clock, Package, CreditCard, Building2,
    AlertCircle, Loader2, Copy, Check, ArrowRight, Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
    id: string;
    order_number: string;
    user_id: string;
    quote_id: string;
    quote_snapshot: any;
    total_cad: number;
    currency: string;
    payment_method: 'stripe' | 'etransfer' | 'credits';
    stripe_checkout_session_id?: string;
    payment_confirmed_at?: string;
    shipping_address: any;
    status: string;
    created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    'pending_payment': { label: 'Pending Payment', color: 'text-warning', icon: Clock },
    'awaiting_payment': { label: 'Awaiting e-Transfer', color: 'text-blue-400', icon: Building2 },
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

// e-Transfer configuration
const ETRANSFER_CONFIG = {
    recipient: 'payments@3d3d.ca',
    securityQuestion: 'What service is this payment for?',
    securityAnswer: '3dprint',
};

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth', { state: { returnTo: `/order/${orderId}` } });
        }
    }, [user, authLoading, navigate, orderId]);

    // Load order and verify Stripe payment if returning from checkout
    useEffect(() => {
        const loadOrder = async () => {
            if (!user || !orderId) return;

            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await (supabase as any)
                    .from('orders')
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

                // Check if returning from Stripe checkout
                const stripeSuccess = searchParams.get('stripe_success');
                const sessionId = searchParams.get('session_id');

                if (stripeSuccess === '1' && sessionId && data.status === 'pending_payment') {
                    // Verify the payment
                    setVerifyingPayment(true);

                    const { data: verifyResult, error: verifyError } = await supabase.functions.invoke(
                        'verify-checkout-session',
                        { body: { session_id: sessionId, order_id: orderId } }
                    );

                    if (verifyError) {
                        console.error('Verification error:', verifyError);
                        toast({
                            title: 'Payment verification pending',
                            description: 'We are confirming your payment. Please refresh in a moment.',
                        });
                    } else if (verifyResult?.verified && verifyResult?.status === 'paid') {
                        // Payment confirmed - update local order state
                        setOrder(prev => prev ? { ...prev, status: 'paid', payment_confirmed_at: new Date().toISOString() } : null);
                        toast({
                            title: 'Payment confirmed!',
                            description: 'Your order is now being processed.',
                        });
                    } else if (verifyResult?.status === 'unpaid') {
                        toast({
                            title: 'Payment incomplete',
                            description: 'Your payment was not completed. Please try again.',
                            variant: 'destructive',
                        });
                    }

                    setVerifyingPayment(false);

                    // Clean up URL params
                    window.history.replaceState({}, '', `/order/${orderId}`);
                }
            } catch (err) {
                console.error('Error loading order:', err);
                setError('Failed to load order. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [user, orderId, searchParams, toast]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        toast({ title: 'Copied!', description: `${field} copied to clipboard` });
        setTimeout(() => setCopied(null), 2000);
    };

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        {verifyingPayment ? (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                    <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    Verifying Payment...
                                </h1>
                                <p className="text-muted-foreground">
                                    Please wait while we confirm your payment.
                                </p>
                            </>
                        ) : order.status === 'paid' ? (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-10 h-10 text-success" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    Payment Confirmed!
                                </h1>
                                <p className="text-muted-foreground">
                                    Thank you! Your order is now being processed.
                                </p>
                            </>
                        ) : order.status === 'pending_payment' ? (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-warning/10 flex items-center justify-center mb-4">
                                    <Clock className="w-10 h-10 text-warning" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    Payment Pending
                                </h1>
                                <p className="text-muted-foreground">
                                    Your order is awaiting payment confirmation.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-10 h-10 text-success" />
                                </div>
                                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                                    Order Placed!
                                </h1>
                                <p className="text-muted-foreground">
                                    Thank you for your order. Here are your order details.
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

                    {/* e-Transfer Instructions (if applicable) */}
                    {order.payment_method === 'etransfer' && order.status === 'awaiting_payment' && (
                        <GlassPanel variant="elevated" className="mb-6 border-blue-500/30">
                            <div className="flex items-start gap-3 mb-4">
                                <Building2 className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-lg font-tech font-bold text-foreground">
                                        e-Transfer Instructions
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Please complete your payment via Interac e-Transfer
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-background/50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Send to</p>
                                        <p className="font-mono text-foreground">{ETRANSFER_CONFIG.recipient}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(ETRANSFER_CONFIG.recipient, 'Email')}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        {copied === 'Email' ? (
                                            <Check className="w-4 h-4 text-success" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="font-mono text-lg font-bold text-secondary">
                                            {formatCurrency(order.total_cad)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(order.total_cad.toFixed(2), 'Amount')}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        {copied === 'Amount' ? (
                                            <Check className="w-4 h-4 text-success" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Message / Memo</p>
                                        <p className="font-mono text-foreground">3D3D Order {order.order_number}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(`3D3D Order ${order.order_number}`, 'Memo')}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        {copied === 'Memo' ? (
                                            <Check className="w-4 h-4 text-success" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <p className="text-xs text-muted-foreground mb-1">Security Question</p>
                                    <p className="font-mono text-foreground">{ETRANSFER_CONFIG.securityQuestion}</p>
                                    <p className="text-xs text-muted-foreground mt-2 mb-1">Answer</p>
                                    <p className="font-mono text-secondary">{ETRANSFER_CONFIG.securityAnswer}</p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                                <p className="text-sm text-warning">
                                    <strong>Important:</strong> Your order will begin production once payment is confirmed,
                                    typically within 1 business day of receiving your e-Transfer.
                                </p>
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
                                    Email confirmations are not yet enabled. Your order is saved and visible in your dashboard.
                                    We're working on adding email notifications soon.
                                </p>
                            </div>
                        </div>
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
                                    {order.payment_method === 'stripe' && <CreditCard className="w-4 h-4" />}
                                    {order.payment_method === 'etransfer' && <Building2 className="w-4 h-4" />}
                                    {order.payment_method === 'stripe' ? 'Credit Card' : 'e-Transfer'}
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
