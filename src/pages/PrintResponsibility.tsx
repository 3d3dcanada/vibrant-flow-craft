import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Shield, FileCheck, Printer, AlertTriangle, Clock, UserX, HelpCircle } from 'lucide-react';

/**
 * Print Responsibility & IP Policy Page
 * 
 * Critical legal page explaining:
 * 1. Difference between buying STL files vs printing your own
 * 2. User responsibility for rights
 * 3. Prohibited prints
 * 4. Designer opt-out
 * 5. File retention limits
 */
export default function PrintResponsibility() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <Shield className="w-5 h-5" />
                        <span className="font-tech text-sm">Legal</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold gradient-text mb-6">
                        Print Responsibility & IP Policy
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        How we handle files, protect creators, and keep printing fair for everyone.
                    </p>
                </div>

                {/* Two Types of Service */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-primary" />
                        Two Ways to Use 3D3D
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* STL Store */}
                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                            <h3 className="text-lg font-tech font-bold text-foreground mb-3">
                                1. Buy STL Files from Our Store
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                We sell digital files (STL) that we've designed, licensed, or curated
                                from creators who've given explicit permission.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>You receive commercial printing rights</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>You can print, sell, or use commercially</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Designers receive fair compensation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>We handle licensing, you just print</span>
                                </li>
                            </ul>
                        </div>

                        {/* Print Service */}
                        <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-lg">
                            <h3 className="text-lg font-tech font-bold text-foreground mb-3">
                                2. Print Your Own Files
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                You upload a file you own or have rights to, and we print it for you.
                                Think of it like using a friend's printer or visiting a local print shop.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>You provide the file, we provide the printing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>We rent you printer access + materials + labor</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>We don't claim ownership of your files</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary">✓</span>
                                    <span>You're responsible for having the right to print</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                        <p className="text-sm text-muted-foreground text-center">
                            <strong>The distinction matters:</strong> When you buy from our store,
                            we've handled the rights. When you upload your own file, you confirm
                            you have the right to print it.
                        </p>
                    </div>
                </GlassPanel>

                {/* Your Responsibility */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <Printer className="w-6 h-6 text-primary" />
                        Your Responsibility When Uploading
                    </h2>

                    <p className="text-muted-foreground mb-6">
                        When you upload a file for printing, you're confirming that:
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                You have the right to print this file
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Either you designed it, you purchased it with printing rights,
                                it's released under a permissive license (like CC BY), or you
                                have explicit permission from the creator.
                            </p>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                It doesn't violate copyright or licenses
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Many files online are "personal use only" or "non-commercial."
                                Using our service to print and sell these would violate the license.
                                Check your source.
                            </p>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                It's not prohibited content
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                We do not print weapons, weapon components, items intended for
                                illegal purposes, or content that infringes on trademarks or patents.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* What We Don't Do */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                        Prohibited Prints
                    </h2>

                    <p className="text-muted-foreground mb-6">
                        We actively discourage piracy and will refuse orders we believe to be:
                    </p>

                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-destructive font-bold">✕</span>
                            <span>Pirated or ripped from paid sources without permission</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive font-bold">✕</span>
                            <span>Commercial-only designs used without a license</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive font-bold">✕</span>
                            <span>Trademarks, logos, or branded items without authorization</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive font-bold">✕</span>
                            <span>Weapons, weapon parts, or items for illegal purposes</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-destructive font-bold">✕</span>
                            <span>Content flagged by designers via our opt-out system</span>
                        </li>
                    </ul>

                    <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="text-sm text-foreground">
                            <strong>We do not enable piracy.</strong> We provide access to printing
                            — responsibly. If we believe an order violates these principles,
                            we reserve the right to refuse it. We do not inspect or verify the licensing status of every file, but we act promptly and in good faith when concerns are raised.
                        </p>
                    </div>
                </GlassPanel>

                {/* File Retention */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary" />
                        How Long We Keep Your Files
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground text-xl mb-2">
                                Maximum: 14 Days
                            </h4>
                            <p className="text-muted-foreground">
                                We retain uploaded files for a maximum of 14 days after your order
                                is completed. This allows for reprints if there's a defect, or
                                quality issues that need correction.
                            </p>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                Immediate Deletion Available
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                You can request immediate deletion of your files at any time.
                                Contact us at privacy@3d3d.ca or use the delete option in your
                                order history.
                            </p>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                We Never Resell Your Files
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Your uploaded files are never sold, shared, added to our store,
                                or used for anything other than fulfilling your order.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Designer Opt-Out */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <UserX className="w-6 h-6 text-primary" />
                        For Designers: Opt-Out Program
                    </h2>

                    <p className="text-muted-foreground mb-6">
                        We respect creators. If you're a designer and want to prevent your work
                        from being printed through our service:
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                Submit an Opt-Out Request
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Email designers@3d3d.ca with:
                            </p>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                                <li>• Your name and proof of design ownership</li>
                                <li>• Links to your original designs</li>
                                <li>• File hashes or identifiers if available</li>
                            </ul>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                What Happens Next
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                We'll add your designs to our internal blocklist. While we can't
                                guarantee 100% detection (file modifications can evade matching),
                                we make a good-faith effort to honor your wishes.
                            </p>
                        </div>

                        <div className="p-4 border border-border/50 rounded-lg">
                            <h4 className="font-tech font-bold text-foreground mb-2">
                                Takedown Requests
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                If you believe an active order uses your copyrighted work without
                                permission, contact legal@3d3d.ca. We'll investigate and respond
                                within 48 hours.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Plain Language Summary */}
                <GlassPanel className="p-8 mb-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
                        <HelpCircle className="w-6 h-6 text-primary" />
                        The Plain Version
                    </h2>

                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            <strong className="text-foreground">If you buy from our store:</strong> We've
                            done the work. The files are ours to sell, and you get rights to print them.
                        </p>
                        <p>
                            <strong className="text-foreground">If you upload your own file:</strong> You're
                            responsible for having the right to print it. We're just the printer. Think
                            of us like a copy shop — if you bring a copyrighted book, that's on you.
                        </p>
                        <p>
                            <strong className="text-foreground">We don't want piracy:</strong> We won't
                            knowingly print stolen or pirated files. We give designers a way to opt out.
                            We're not perfect, but we try.
                        </p>
                        <p>
                            <strong className="text-foreground">Your files are temporary:</strong> We keep
                            them for 14 days max, only to handle issues. You can delete them anytime.
                            We never sell or share them.
                        </p>
                    </div>
                </GlassPanel>

                {/* Contact */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                        Questions about this policy? Reach out.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="mailto:legal@3d3d.ca">
                            <NeonButton variant="secondary">
                                legal@3d3d.ca
                            </NeonButton>
                        </a>
                        <a href="mailto:designers@3d3d.ca">
                            <NeonButton variant="ghost">
                                designers@3d3d.ca
                            </NeonButton>
                        </a>
                    </div>

                    <p className="text-sm text-muted-foreground mt-8">
                        Last updated: January 2026 | Jurisdiction: New Brunswick, Canada
                    </p>
                </div>
            </div>
        </div>
    );
}
