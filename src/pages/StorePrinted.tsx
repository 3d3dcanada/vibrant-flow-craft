import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Box, ArrowLeft, Package, MapPin, Info } from 'lucide-react';

/**
 * Store Printed Goods Page - Section 2.1
 * 
 * Physical products we manufacture and sell.
 * Distinct from print-as-service (user files).
 * Clear that these are 3D3D products, not marketplace items.
 */
export default function StorePrinted() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/store" className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Store</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-secondary/10">
                            <Box className="w-8 h-8 text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-foreground">
                                Printed Goods
                            </h1>
                            <p className="text-muted-foreground">
                                Ready-made products shipped to your door
                            </p>
                        </div>
                    </div>
                </div>

                {/* Made in Canada Banner */}
                <GlassPanel className="p-5 mb-8 border-secondary/30 bg-secondary/5">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-1">
                                Made in Atlantic Canada
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Every product is designed and manufactured by our network of local makers in
                                New Brunswick, Nova Scotia, and PEI. Quality-checked before shipping.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Placeholder Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <GlassPanel key={i} className="p-6">
                            <div className="aspect-square bg-muted/20 rounded-lg mb-4 flex items-center justify-center">
                                <Package className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                            <div className="h-4 bg-muted/20 rounded mb-2" />
                            <div className="h-3 bg-muted/10 rounded w-2/3 mb-4" />
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-tech font-bold text-muted-foreground/50">$--</span>
                                <span className="text-xs bg-muted/20 px-2 py-1 rounded text-muted-foreground/50">Coming Soon</span>
                            </div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Clarification */}
                <GlassPanel className="p-6 bg-muted/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-sm">
                            <h4 className="font-semibold text-foreground mb-2">
                                These are 3D3D Products
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                                This is not a marketplace. These products are designed, manufactured, and sold
                                by 3D3D. We handle everything: design, printing, quality control, and shipping.
                                If you want to sell your own designs, check out our{' '}
                                <Link to="/dashboard/maker" className="text-secondary hover:underline">
                                    Maker Program
                                </Link>.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Status Notice */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Product catalog is being populated. Check back soon or{' '}
                        <a href="mailto:info@3d3d.ca" className="text-secondary hover:underline">
                            contact us for custom orders
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
