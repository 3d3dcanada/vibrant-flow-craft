import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import {
    CreditCard, Building2, ArrowLeft, Clock, Shield,
    AlertCircle, Loader2, CheckCircle, Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quote {
    id: string;
    material: string;
    quality: string;
    quantity: number;
    total_cad: number;
    price_breakdown: any;
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

export default function Checkout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { quoteId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'etransfer'>('stripe');
    const [stripeAvailable, setStripeAvailable] = useState(false);

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

    // Check if Stripe is configured
    useEffect(() => {
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        setStripeAvailable(!!stripeKey);
        if (!stripeKey) {
            setPaymentMethod('etransfer');
        }
    }, []);

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
                const { data, error: fetchError } = await (supabase as any)
                    .from('quotes')
                    .select('*')
                    .eq('id', quoteId)
                    .eq('user_id', user.id)
                    .single();

                if (fetchError) {
                    setError('Quote not found or access denied.');
                    return;
                }

                // Check expiry
                const expiryDate = new Date(data.expires_at);
                if (expiryDate < new Date()) {
                    setError('This quote has expired. Please create a new quote.');
                    return;
                }

                // Check if already ordered
                if (data.status === 'ordered') {
                    setError('This quote has already been ordered.');
                    return;
                }

                setQuote(data);

                // Pre-fill name from profile
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
                payment_method: paymentMethod,
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
                status: paymentMethod === 'stripe' ? 'pending_payment' : 'awaiting_payment',
            };

            const { data: order, error: orderError } = await (supabase as any)
                .from('orders')
                .insert(orderData)
                .select()
                .single();

            if (orderError) {
                console.error('Order creation error:', orderError);
                throw new Error('Failed to create order');
            }

            // Update quote status to 'ordered'
            await (supabase as any)
                .from('quotes')
                .update({ status: 'ordered' })
                .eq('id', quote.id);

            // Handle payment method
            if (paymentMethod === 'stripe') {
                // Call edge function to create Stripe checkout session
                const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
                    'create-checkout-session',
                    { body: { order_id: order.id } }
                );

                if (sessionError || !sessionData?.checkout_url) {
                    // Stripe not configured or error - show message and go to order page
                    const errorCode = sessionData?.code || sessionError?.message;
                    if (errorCode === 'STRIPE_NOT_CONFIGURED') {
                        toast({
                            title: 'Card payments unavailable',
                            description: 'Online card payments are not yet configured. Your order has been saved. Please use e-Transfer or contact us.',
                            variant: 'destructive',
                        });
                    } else {
                        toast({
                            title: 'Payment error',
                            description: 'Could not connect to payment processor. Your order has been saved.',
                            variant: 'destructive',
                        });
                    }
                    navigate(`/order/${order.id}`);
                    return;
                }

                // Redirect to Stripe Checkout
                window.location.href = sessionData.checkout_url;
            } else {
                // e-Transfer - go to order page with instructions
                navigate(`/order/${order.id}`);
            }

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

                            {/* Payment Method */}
                            <GlassPanel variant="elevated">
                                <h2 className="text-xl font-tech font-bold text-foreground mb-4">
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {/* Stripe Option */}
                                    <button
                                        onClick={() => stripeAvailable && setPaymentMethod('stripe')}
                                        disabled={!stripeAvailable}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${paymentMethod === 'stripe' && stripeAvailable
                                            ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                            : stripeAvailable
                                                ? 'border-border hover:border-secondary/50'
                                                : 'border-border opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-secondary" />
                                            <div className="flex-1">
                                                <div className="font-tech font-bold text-foreground">
                                                    Credit / Debit Card
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {stripeAvailable
                                                        ? 'Secure payment via Stripe'
                                                        : 'Coming soon — not yet configured'}
                                                </div>
                                            </div>
                                            {stripeAvailable && (
                                                <Shield className="w-5 h-5 text-success" />
                                            )}
                                        </div>
                                    </button>

                                    {/* e-Transfer Option */}
                                    <button
                                        onClick={() => setPaymentMethod('etransfer')}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${paymentMethod === 'etransfer'
                                            ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                            : 'border-border hover:border-secondary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-6 h-6 text-blue-400" />
                                            <div className="flex-1">
                                                <div className="font-tech font-bold text-foreground">
                                                    Interac e-Transfer
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Pay via your bank — instructions provided after order
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {paymentMethod === 'etransfer' && (
                                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            After placing your order, you'll receive e-Transfer instructions.
                                            Your order will begin production once payment is confirmed (typically within 1 business day).
                                        </p>
                                    </div>
                                )}
                            </GlassPanel>
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
                                {quote.price_breakdown && (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Platform Fee</span>
                                            <span className="text-foreground">{formatCurrency(quote.price_breakdown.platform_fee || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bed Rental</span>
                                            <span className="text-foreground">{formatCurrency(quote.price_breakdown.bed_rental || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Filament</span>
                                            <span className="text-foreground">{formatCurrency(quote.price_breakdown.filament_cost || 0)}</span>
                                        </div>
                                        {quote.price_breakdown.rush_surcharge > 0 && (
                                            <div className="flex justify-between text-primary">
                                                <span>Rush Delivery</span>
                                                <span>{formatCurrency(quote.price_breakdown.rush_surcharge)}</span>
                                            </div>
                                        )}
                                        {quote.price_breakdown.quantity_discount > 0 && (
                                            <div className="flex justify-between text-success">
                                                <span>Bulk Discount</span>
                                                <span>-{formatCurrency(quote.price_breakdown.quantity_discount)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="border-t border-border my-4" />

                                <div className="flex justify-between text-lg font-tech font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-secondary">{formatCurrency(quote.total_cad)}</span>
                                </div>

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
                                            Place Order — {formatCurrency(quote.total_cad)}
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
