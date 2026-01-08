import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { ShoppingBag, Box, Laptop, ArrowRight, Info } from 'lucide-react';

/**
 * Store Landing Page - Section 2.1
 * 
 * Clearly distinguishes between:
 * 1. Digital Products (STL files we own/license) - /store/models
 * 2. Physical Products (items we manufacture) - /store/printed
 * 
 * Critical for legal clarity: STL Commerce vs Print-as-Service distinction
 */
export default function Store() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-tech text-sm">Shop</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold gradient-text mb-6">
                        3D3D Store
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Digital files to download, or ready-made products shipped to your door.
                    </p>
                </div>

                {/* Store Categories */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Digital Models */}
                    <GlassPanel className="p-8 hover:border-primary/50 transition-colors">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                                <Laptop className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-tech font-bold text-foreground mb-3">
                                Digital Models
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                STL files you can download and print yourself or have us print.
                                All files include commercial printing rights.
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground mb-6 text-left">
                                <p className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>3D3D-designed or licensed models</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Commercial use rights included</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Print and sell the physical output</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Designer royalties paid fairly</span>
                                </p>
                            </div>
                            <Link to="/store/models">
                                <NeonButton variant="secondary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                                    Browse Models
                                </NeonButton>
                            </Link>
                        </div>
                    </GlassPanel>

                    {/* Physical Products */}
                    <GlassPanel className="p-8 hover:border-secondary/50 transition-colors">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-6">
                                <Box className="w-8 h-8 text-secondary" />
                            </div>
                            <h2 className="text-2xl font-tech font-bold text-foreground mb-3">
                                Printed Goods
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Ready-to-ship physical products manufactured by our network of local makers.
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground mb-6 text-left">
                                <p className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>Pre-made, quality-checked items</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>Ships from Atlantic Canada</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>Home décor, organizers, tools</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>No file or printer needed</span>
                                </p>
                            </div>
                            <Link to="/store/printed">
                                <NeonButton variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                                    Shop Printed Goods
                                </NeonButton>
                            </Link>
                        </div>
                    </GlassPanel>
                </div>

                {/* Distinction Notice */}
                <GlassPanel className="p-6 bg-muted/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p className="font-semibold text-foreground mb-2">
                                This is different from our Print Service
                            </p>
                            <p className="leading-relaxed">
                                The store sells products we own or have licensed. If you have your own design
                                and want us to print it for you, use our{' '}
                                <Link to="/quote" className="text-primary hover:underline">
                                    Print Service (Get a Quote)
                                </Link>
                                {' '}instead.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Platform Disclosure */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Note: E-commerce checkout is not yet active. Contact us to order.
                    </p>
                </div>
            </div>
        </div>
    );
}
