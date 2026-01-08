interface PaymentDisclosureProps {
    variant?: 'banner' | 'inline' | 'subtle';
    className?: string;
}

/**
 * Payment Disclosure Component
 * Required disclosure that payments are not yet live.
 * Must be visible on landing, quote, and checkout-adjacent pages.
 */
export function PaymentDisclosure({ variant = 'banner', className = '' }: PaymentDisclosureProps) {
    if (variant === 'banner') {
        return (
            <div className={`bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-lg">i</span>
                    <p className="text-sm font-medium text-foreground">
                        Platform in development. Payments not yet live.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                    You can explore, get quotes, and connect with makers. Checkout launching soon.
                </p>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className={`bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 ${className}`}>
                <p className="text-sm text-center">
                    Note: This is a price estimate. Payments are not yet active.
                    We will notify you when ordering goes live.
                </p>
            </div>
        );
    }

    // subtle variant
    return (
        <p className={`text-xs text-muted-foreground ${className}`}>
            Payments not yet live. All prices are estimates.
        </p>
    );
}

export default PaymentDisclosure;
