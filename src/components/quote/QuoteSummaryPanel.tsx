import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Truck, Award } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { MATERIALS } from "./MaterialCarousel";

interface QuoteBreakdown {
    platformFee: number;
    bedRental: number;
    materialCost: number;
    postProcessing: number;
    quantityDiscount: number;
    rushSurcharge: number;
    subtotal: number;
    total: number;
    memberTotal: number;
    memberSavings: number;
}

interface QuoteSummaryPanelProps {
    materialId: string;
    grams: number;
    quantity: number;
    deliverySpeed: 'standard' | 'emergency';
    postProcessingEnabled: boolean;
    isMember: boolean;
    onOrderNow: () => void;
    className?: string;
}

// Simple client-side price calculation (matches Agent B pricing spec)
function calculateQuote(
    materialId: string,
    grams: number,
    quantity: number,
    deliverySpeed: 'standard' | 'emergency',
    postProcessingEnabled: boolean
): QuoteBreakdown {
    const PLATFORM_FEE = 5.00;
    const MIN_ORDER = 18.00;
    const MIN_BED_RENTAL = 10.00;
    const RUSH_RATE = 0.15;
    const POST_PROCESSING_RATE = 0.50; // per minute estimate
    const MEMBER_DISCOUNT = 0.03;

    const material = MATERIALS.find(m => m.id === materialId);
    const pricePerGram = material?.pricePerGram || 0.09;

    const materialCost = grams * pricePerGram;
    const bedRental = Math.max(MIN_BED_RENTAL, 10); // Simplified
    const postProcessing = postProcessingEnabled ? 15 * POST_PROCESSING_RATE : 0;

    let subtotal = (PLATFORM_FEE + bedRental + materialCost + postProcessing) * quantity;

    // Quantity discount
    let discountRate = 0;
    if (quantity >= 50) discountRate = 0.20;
    else if (quantity >= 25) discountRate = 0.15;
    else if (quantity >= 10) discountRate = 0.10;
    const quantityDiscount = subtotal * discountRate;
    subtotal -= quantityDiscount;

    // Rush surcharge
    let rushSurcharge = 0;
    if (deliverySpeed === 'emergency') {
        rushSurcharge = subtotal * RUSH_RATE;
        subtotal += rushSurcharge;
    }

    // Minimum order
    const total = Math.max(MIN_ORDER, subtotal);

    // Member discount
    const memberSavings = total * MEMBER_DISCOUNT;
    const memberTotal = Math.max(MIN_ORDER, total - memberSavings);

    return {
        platformFee: PLATFORM_FEE * quantity,
        bedRental: bedRental * quantity,
        materialCost: materialCost * quantity,
        postProcessing: postProcessing * quantity,
        quantityDiscount,
        rushSurcharge,
        subtotal,
        total,
        memberTotal,
        memberSavings,
    };
}

export function QuoteSummaryPanel({
    materialId,
    grams,
    quantity,
    deliverySpeed,
    postProcessingEnabled,
    isMember,
    onOrderNow,
    className,
}: QuoteSummaryPanelProps) {
    const quote = calculateQuote(materialId, grams, quantity, deliverySpeed, postProcessingEnabled);
    const material = MATERIALS.find(m => m.id === materialId);

    const lineItems = [
        { label: 'Platform Fee', amount: quote.platformFee, icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Bed Rental', amount: quote.bedRental, icon: <Truck className="w-4 h-4" /> },
        { label: `${material?.shortName || 'Material'} (${grams}g × ${quantity})`, amount: quote.materialCost },
        ...(postProcessingEnabled ? [{ label: 'Post-Processing', amount: quote.postProcessing }] : []),
        ...(quote.quantityDiscount > 0 ? [{ label: 'Quantity Discount', amount: -quote.quantityDiscount, highlight: true }] : []),
        ...(quote.rushSurcharge > 0 ? [{ label: 'Rush Surcharge', amount: quote.rushSurcharge }] : []),
    ];

    return (
        <div className={cn("panel-card space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-tech font-semibold text-lg text-foreground">
                    Quote Summary
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
                    CAD
                </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
                {lineItems.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center justify-between text-sm",
                            item.highlight && "text-success"
                        )}
                    >
                        <div className="flex items-center gap-2 text-muted-foreground">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        <span className={cn("font-mono", item.highlight ? "text-success" : "text-foreground")}>
                            {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Total */}
            <div className="space-y-2">
                {isMember ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground line-through">Regular Total</span>
                            <span className="text-muted-foreground line-through font-mono">
                                ${quote.total.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-primary" />
                                <span className="font-tech font-bold text-lg text-primary">Member Price</span>
                            </div>
                            <span className="font-tech font-bold text-2xl text-primary">
                                ${quote.memberTotal.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            You save ${quote.memberSavings.toFixed(2)}!
                        </p>
                    </>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className="font-tech font-bold text-lg text-foreground">Total</span>
                        <span className="font-tech font-bold text-2xl text-secondary">
                            ${quote.total.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {/* CTA */}
            <NeonButton
                variant="primary"
                size="lg"
                glow
                onClick={onOrderNow}
                className="w-full"
            >
                Order Now
            </NeonButton>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>🇨🇦 Made in Canada</span>
                <span>•</span>
                <span>✓ Secure checkout</span>
            </div>
        </div>
    );
}
