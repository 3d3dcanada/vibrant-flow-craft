import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Laptop, ArrowLeft, ShoppingBag, CheckCircle, Info } from 'lucide-react';

/**
 * Store Models Page - Section 2.1/2.2
 * 
 * STL files we own or license for sale.
 * Clearly states commercial printing rights.
 * Mentions voluntary royalty system.
 */
export default function StoreModels() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/store" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Store</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <Laptop className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-foreground">
                                Digital Models
                            </h1>
                            <p className="text-muted-foreground">
                                STL files with commercial printing rights
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commercial Rights Banner */}
                <GlassPanel className="p-5 mb-8 border-primary/30 bg-primary/5">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-1">
                                Commercial Printing Rights Included
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                When you purchase an STL file from 3D3D, you receive commercial rights to print
                                and sell the physical output. These files are designed by 3D3D or licensed from
                                designers who've granted commercial distribution rights.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Placeholder Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <GlassPanel key={i} className="p-6">
                            <div className="aspect-square bg-muted/20 rounded-lg mb-4 flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
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

                {/* Royalty Info */}
                <GlassPanel className="p-6 bg-muted/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-secondary/10">
                            <Info className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="text-sm">
                            <h4 className="font-semibold text-foreground mb-2">
                                About Designer Compensation
                            </h4>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                For community-contributed designs, we offer a voluntary royalty system.
                                Designers are asked (not required) to accept a suggested $0.25 CAD contribution
                                per sale. This supports the creator ecosystem while keeping files accessible.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Designers can opt out of the royalty system entirely. Unclaimed royalties after
                                12 months are split: 50% to Canadian maker education charities, 50% to community workshops.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Status Notice */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Store inventory is being populated. Check back soon or{' '}
                        <Link to="/quote" className="text-primary hover:underline">
                            get a quote for your own design
                        </Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
