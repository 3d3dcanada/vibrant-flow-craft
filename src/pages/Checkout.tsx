import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCreditWallet } from '@/hooks/useUserData';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import {
    FileText, Coins, ArrowLeft, Clock, Shield,
    AlertCircle, Loader2, CheckCircle, Package, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { creditsToCad, cadToCredits, formatCredits, formatCad } from '@/config/credits';

interface Quote {
    id: string;
    material: string;
    quality: string;
    quantity: number;
    total_cad: number;
    price_breakdown: unknown;
    status: string;
    expires_at: string;
    created_at: string;
    file_name?: string;
    delivery_speed?: string;
}

interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
}

const PROVINCES = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

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
    note: 'We will send you an invoice with payment instructions via email.',
};

export default function Checkout() {
    const navigate = useNavigate();
    const { quoteId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { data: creditWallet, isLoading: creditsLoading } = useCreditWallet();

    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // Payment method: 'invoice' | 'credits'
    // Note: Bitcoin implementation deferred to future phase
    const [paymentMethod, setPaymentMethod] = useState<'invoice' | 'credits'>('invoice');
    const [useCredits, setUseCredits] = useState(false);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        province: 'Ontario',
        postalCode: '',
        phone: '',
    });

    const [addressErrors, setAddressErrors] = useState<Partial<ShippingAddress>>({});

    // Credits calculation - convert CAD to credits for comparison
    const creditsBalance = creditWallet?.balance || 0;
    const creditsBalanceCad = creditsToCad(creditsBalance);
    const orderTotalCad = quote?.total_cad || 0;
    const orderTotalCredits = cadToCredits(orderTotalCad);

    // Calculate how much can be applied
    const creditsToApply = useCredits ? Math.min(creditsBalance, orderTotalCredits) : 0;
    const creditsToApplyCad = creditsToCad(creditsToApply);
    const remainingBalanceCad = Math.max(0, orderTotalCad - creditsToApplyCad);
    const fullyCoveredByCredits = useCredits && creditsToApply >= orderTotalCredits;

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth', { state: { returnTo: `/checkout/${quoteId}` } });
        }
    }, [user, authLoading, navigate, quoteId]);

    // Load quote
    useEffect(() => {
        const loadQuote = async () => {
            if (!user || !quoteId) return;

            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await supabase
                    .from('quotes' as never)
                    .select('*')
                    .eq('id', quoteId)
                    .eq('user_id', user.id)
                    .single();

                if (fetchError || !data) {
                    setError('Quote not found or access denied.');
                    return;
                }

                const quoteData = data as Record<string, unknown>;

                // Check expiry
                const expiryDate = new Date(quoteData.expires_at as string);
                if (expiryDate < new Date()) {
                    setError('This quote has expired. Please create a new quote.');
                    return;
                }

                // Check if already ordered
                if (quoteData.status === 'ordered') {
                    setError('This quote has already been ordered.');
                    return;
                }

                setQuote({
                    id: String(quoteData.id),
                    material: String(quoteData.material || ''),
                    quality: String(quoteData.quality || ''),
                    quantity: Number(quoteData.quantity || 0),
                    total_cad: Number(quoteData.total_cad || 0),
                    price_breakdown: quoteData.price_breakdown,
                    status: String(quoteData.status || ''),
                    expires_at: String(quoteData.expires_at || ''),
                    created_at: String(quoteData.created_at || ''),
                    file_name: quoteData.file_name as string | undefined,
                    delivery_speed: quoteData.delivery_speed as string | undefined,
                });

                // Pre-fill from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, address_line1, address_line2, city, province, postal_code, phone')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setShippingAddress(prev => ({
                        ...prev,
                        fullName: profile.full_name || '',
                        addressLine1: profile.address_line1 || '',
                        addressLine2: profile.address_line2 || '',
                        city: profile.city || '',
                        province: profile.province || 'Ontario',
                        postalCode: profile.postal_code || '',
                        phone: profile.phone || '',
                    }));
                }
            } catch (err) {
                console.error('Error loading quote:', err);
                setError('Failed to load quote. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadQuote();
    }, [user, quoteId]);

    const validateAddress = (): boolean => {
        const errors: Partial<ShippingAddress> = {};

        if (!shippingAddress.fullName.trim()) {
            errors.fullName = 'Name is required';
        }
        if (!shippingAddress.addressLine1.trim()) {
            errors.addressLine1 = 'Address is required';
        }
        if (!shippingAddress.city.trim()) {
            errors.city = 'City is required';
        }
        if (!shippingAddress.province) {
            errors.province = 'Province is required';
        }
        if (!shippingAddress.postalCode.trim()) {
            errors.postalCode = 'Postal code is required';
        } else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(shippingAddress.postalCode.trim())) {
            errors.postalCode = 'Invalid postal code format';
        }

        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const generateOrderNumber = () => {
        const date = new Date();
        const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `3D-${datePart}-${randomPart}`;
    };

    const handleCreateOrder = async () => {
        if (!quote || !user) return;
        if (!validateAddress()) return;

        setProcessing(true);

        try {
            const orderNumber = generateOrderNumber();

            // Determine final payment method and status
            let finalPaymentMethod: string;
            let orderStatus: string;
            let creditsUsedNote = '';

            if (fullyCoveredByCredits) {
                finalPaymentMethod = 'credits';
                orderStatus = 'paid';
                creditsUsedNote = `Paid in full with ${creditsToApply} credits (${formatCad(creditsToApplyCad)}).`;
            } else if (useCredits && creditsToApply > 0) {
                finalPaymentMethod = 'invoice';
                orderStatus = 'awaiting_payment';
                creditsUsedNote = `${creditsToApply} credits (${formatCad(creditsToApplyCad)}) applied. Remaining ${formatCad(remainingBalanceCad)} due via invoice.`;
            } else {
                finalPaymentMethod = 'invoice';
                orderStatus = 'awaiting_payment';
            }

            // Create order record
            const orderData = {
                user_id: user.id,
                quote_id: quote.id,
                order_number: orderNumber,
                quote_snapshot: {
                    material: quote.material,
                    quality: quote.quality,
                    quantity: quote.quantity,
                    total_cad: quote.total_cad,
                    price_breakdown: quote.price_breakdown,
                    file_name: quote.file_name,
                    delivery_speed: quote.delivery_speed,
                },
                total_cad: quote.total_cad,
                currency: 'CAD',
                payment_method: finalPaymentMethod,
                shipping_address: {
                    fullName: shippingAddress.fullName,
                    addressLine1: shippingAddress.addressLine1,
                    addressLine2: shippingAddress.addressLine2,
                    city: shippingAddress.city,
                    province: shippingAddress.province,
                    postalCode: shippingAddress.postalCode.toUpperCase().replace(/\s/g, ''),
                    phone: shippingAddress.phone,
                    country: 'Canada',
                },
                status: orderStatus,
                notes: creditsUsedNote || undefined,
                // Store credits info for audit trail
                payment_confirmed_at: fullyCoveredByCredits ? new Date().toISOString() : null,
            };

            const { data: orderResult, error: orderError } = await supabase
                .from('orders' as never)
                .insert(orderData as never)
                .select()
                .single();

            if (orderError || !orderResult) {
                console.error('Order creation error:', orderError);
                throw new Error('Failed to create order');
            }

            const order = orderResult as Record<string, unknown>;

            // Update quote status to 'ordered'
            await supabase
                .from('quotes' as never)
                .update({ status: 'ordered' } as never)
                .eq('id', quote.id);

            // If credits were used, we need to deduct from wallet
            // This is handled server-side via admin verification for MVP
            // In production, this would be a transactional operation
            if (useCredits && creditsToApply > 0) {
                // Record the intent - actual deduction requires admin action
                // This ensures no credits are lost if the order is cancelled
                console.log(`Order ${orderNumber}: ${creditsToApply} credits to be deducted for user ${user.id}`);

                // For fully covered orders, we trust the credits and mark paid
                // Admin will verify and deduct credits during order processing
                if (fullyCoveredByCredits) {
                    toast({
                        title: 'Order Placed!',
                        description: 'Your order has been paid with credits and is now being processed.',
                    });
                } else {
                    toast({
                        title: 'Order Created',
                        description: `Credits applied. Invoice for remaining ${formatCad(remainingBalanceCad)} will be sent.`,
                    });
                }
            }

            // Navigate to order confirmation
            navigate(`/order/${order.id}`);

        } catch (err) {
            console.error('Checkout error:', err);
            toast({
                title: 'Checkout failed',
                description: 'There was an error processing your order. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)} CAD`;

    const getDaysRemaining = () => {
        if (!quote?.expires_at) return 0;
        const expiry = new Date(quote.expires_at);
        const now = new Date();
        return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    if (authLoading || loading || creditsLoading) {
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

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                    <GlassPanel variant="elevated" className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-tech font-bold text-foreground mb-2">
                            Unable to Proceed
                        </h1>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <NeonButton variant="primary" onClick={() => navigate('/quote')}>
                            Create New Quote
                        </NeonButton>
                    </GlassPanel>
                </div>
                <Footer />
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 pb-12 px-4 text-center">
                    <p className="text-muted-foreground">Quote not found</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/quote')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Quote
                        </button>
                        <h1 className="text-3xl font-display font-bold gradient-text">
                            Checkout
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Complete your order
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <GlassPanel variant="elevated">
                                <h2 className="text-xl font-tech font-bold text-foreground mb-4">
                                    Shipping Address
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="John Smith"
                                        />
                                        {addressErrors.fullName && (
                                            <p className="text-destructive text-xs mt-1">{addressErrors.fullName}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.addressLine1}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="123 Main Street"
                                        />
                                        {addressErrors.addressLine1 && (
                                            <p className="text-destructive text-xs mt-1">{addressErrors.addressLine1}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.addressLine2}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="Apt 4B (optional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="Toronto"
                                        />
                                        {addressErrors.city && (
                                            <p className="text-destructive text-xs mt-1">{addressErrors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Province *
                                        </label>
                                        <select
                                            value={shippingAddress.province}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, province: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        >
                                            {PROVINCES.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value.toUpperCase() }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="M5V 1A1"
                                            maxLength={7}
                                        />
                                        {addressErrors.postalCode && (
                                            <p className="text-destructive text-xs mt-1">{addressErrors.postalCode}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Phone (optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                            placeholder="(416) 555-0123"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    We currently ship within Canada only.
                                </p>
                            </GlassPanel>

                            {/* Credits Section */}
                            <GlassPanel variant="elevated" className={creditsBalance > 0 ? "border-secondary/30" : "border-muted/30"}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Coins className={`w-6 h-6 ${creditsBalance > 0 ? 'text-secondary' : 'text-muted-foreground'}`} />
                                        <div>
                                            <p className="font-tech font-bold text-foreground">
                                                Platform Credits
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {creditsBalance > 0 ? (
                                                    <>Available: <span className="text-secondary font-bold">{formatCredits(creditsBalance)}</span> ({formatCad(creditsBalanceCad)})</>
                                                ) : (
                                                    'No credits available'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {creditsBalance > 0 && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useCredits}
                                                onChange={(e) => setUseCredits(e.target.checked)}
                                                className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
                                            />
                                            <span className="text-sm text-foreground">Apply credits</span>
                                        </label>
                                    )}
                                </div>

                                {useCredits && creditsBalance > 0 && (
                                    <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Credits applied:</span>
                                            <span className="text-success font-bold">
                                                -{formatCredits(creditsToApply)} ({formatCad(creditsToApplyCad)})
                                            </span>
                                        </div>
                                        {remainingBalanceCad > 0 ? (
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-muted-foreground">Remaining to pay:</span>
                                                <span className="text-foreground font-bold">{formatCad(remainingBalanceCad)}</span>
                                            </div>
                                        ) : (
                                            <p className="text-success text-sm mt-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Fully covered by credits — no additional payment needed!
                                            </p>
                                        )}
                                    </div>
                                )}

                                {creditsBalance === 0 && (
                                    <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            Purchase credits to pay instantly without invoices.{' '}
                                            <a href="/dashboard/credits" className="text-secondary hover:underline">
                                                Buy credits →
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </GlassPanel>

                            {/* Payment Method - Only show if not fully covered by credits */}
                            {!fullyCoveredByCredits && (
                                <GlassPanel variant="elevated">
                                    <h2 className="text-xl font-tech font-bold text-foreground mb-4">
                                        Payment Method
                                    </h2>

                                    {/* Invoice Option (Primary and only card-free option) */}
                                    <button
                                        onClick={() => setPaymentMethod('invoice')}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${paymentMethod === 'invoice'
                                                ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                                : 'border-border hover:border-secondary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                            <div className="flex-1">
                                                <div className="font-tech font-bold text-foreground">
                                                    Invoice / Email Payment
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    We'll send payment instructions to your email
                                                </div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Payment Method Info */}
                                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                            <div className="text-sm text-muted-foreground">
                                                <p className="mb-2">{INVOICE_CONFIG.note}</p>
                                                <p>
                                                    Expect a response <strong className="text-foreground">{INVOICE_CONFIG.responseTime}</strong>.
                                                    Contact: <a href={`mailto:${INVOICE_CONFIG.email}`} className="text-secondary hover:underline">{INVOICE_CONFIG.email}</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credits Prompt */}
                                    {creditsBalance === 0 && (
                                        <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                <strong className="text-foreground">💡 Skip invoices!</strong> Buy credits with your debit/credit card through our partner, then pay instantly with credits.{' '}
                                                <a href="/dashboard/credits" className="text-secondary hover:underline">
                                                    Get credits →
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </GlassPanel>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <GlassPanel variant="elevated" className="sticky top-24">
                                <h2 className="text-xl font-tech font-bold text-foreground mb-4">
                                    Order Summary
                                </h2>

                                {/* Quote Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Material</span>
                                        <span className="text-foreground">{MATERIAL_NAMES[quote.material] || quote.material}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quantity</span>
                                        <span className="text-foreground">{quote.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quality</span>
                                        <span className="text-foreground capitalize">{quote.quality}</span>
                                    </div>
                                </div>

                                <div className="border-t border-border my-4" />

                                {/* Price Breakdown */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="text-foreground">{formatCurrency(quote.total_cad)}</span>
                                    </div>
                                    {useCredits && creditsToApply > 0 && (
                                        <div className="flex justify-between text-success">
                                            <span>Credits Applied</span>
                                            <span>-{formatCad(creditsToApplyCad)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-border my-4" />

                                <div className="flex justify-between text-lg font-tech font-bold">
                                    <span className="text-foreground">
                                        {fullyCoveredByCredits ? 'Total (Paid)' : 'Total Due'}
                                    </span>
                                    <span className="text-secondary">
                                        {fullyCoveredByCredits
                                            ? formatCurrency(0)
                                            : formatCurrency(remainingBalanceCad)}
                                    </span>
                                </div>

                                {fullyCoveredByCredits && (
                                    <p className="text-success text-sm mt-2 text-center flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Paid with credits
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground mt-2">
                                    Shipping calculated based on your location.
                                </p>

                                {/* Quote Expiry */}
                                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>Quote valid for {getDaysRemaining()} more days</span>
                                </div>

                                {/* Place Order Button */}
                                <NeonButton
                                    variant="primary"
                                    className="w-full mt-6"
                                    onClick={handleCreateOrder}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Package className="w-4 h-4 mr-2" />
                                            {fullyCoveredByCredits
                                                ? 'Place Order (Credits)'
                                                : `Place Order — ${formatCurrency(remainingBalanceCad)}`}
                                        </>
                                    )}
                                </NeonButton>

                                {/* Trust Badges */}
                                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-success" />
                                        <span>No hidden fees</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-success" />
                                        <span>Canadian makers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-success" />
                                        <span>Quality guaranteed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-secondary" />
                                        <span>3D3D never touches card data</span>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
