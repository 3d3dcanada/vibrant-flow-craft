import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { NeonButton } from '@/components/ui/NeonButton';
import { FileUpload, FileAnalysis } from '@/components/ui/FileUpload';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type QuoteStep = 1 | 2 | 3 | 4 | 5;

interface QuoteData {
    file: File | null;
    analysis: FileAnalysis | null;
    materialType: string;
    color: string;
    postProcessing: boolean;
    quantity: number;
    deliverySpeed: 'standard' | 'emergency';
}

/**
 * Quote Configurator Page
 * 5-step quote flow: Upload → Material → Quantity → Breakdown → Checkout
 * Target: <10 seconds end-to-end
 */
export default function QuoteConfigurator() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<QuoteStep>(1);
    const [quoteData, setQuoteData] = useState<QuoteData>({
        file: null,
        analysis: null,
        materialType: 'PLA_STANDARD',
        color: 'black',
        postProcessing: false,
        quantity: 1,
        deliverySpeed: 'standard',
    });
    const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);

    const steps = [
        { label: 'Upload', completed: currentStep > 1 },
        { label: 'Material', completed: currentStep > 2 },
        { label: 'Quantity', completed: currentStep > 3 },
        { label: 'Breakdown', completed: currentStep > 4 },
        { label: 'Checkout', completed: currentStep > 5 },
    ];

    const handleFileUpload = async (file: File) => {
        // DEV NOTE: Real file upload to Supabase Storage + STL parsing not yet wired
        // This uses demo data to show UI flow. Backend Edge Function is deployed.
        console.log('[Quote] File selected:', file.name);

        // Demo delay to simulate analysis
        await new Promise(resolve => setTimeout(resolve, 800));

        // Demo analysis data - real parsing will replace this
        const demoAnalysis: FileAnalysis = {
            weight: 50,
            dimensions: { x: 100, y: 100, z: 50 },
            estimatedPrintTime: 3.5,
            volume: 500000,
        };

        setQuoteData(prev => ({
            ...prev,
            file,
            analysis: demoAnalysis,
        }));
    };

    const fetchQuote = async () => {
        if (!quoteData.analysis) {
            setPriceError('No file analysis available');
            return;
        }

        setLoadingPrice(true);
        setPriceError(null);
        console.log('[Quote] Calling calculate-quote API...');

        const { data, error } = await supabase.functions.invoke('calculate-quote', {
            body: {
                grams: quoteData.analysis.weight,
                material: quoteData.materialType,
                quality: 'standard',
                quantity: quoteData.quantity,
                delivery_speed: quoteData.deliverySpeed,
            }
        });

        if (error) {
            console.error('[Quote] API Error:', error);
            setPriceError(error.message || 'Failed to calculate price');
        } else {
            console.log('[Quote] Price calculated:', data);
            setPriceBreakdown(data);
        }

        setLoadingPrice(false);
    };

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => (prev + 1) as QuoteStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as QuoteStep);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return quoteData.file !== null && quoteData.analysis !== null;
            case 2:
                return quoteData.materialType !== '';
            case 3:
                return quoteData.quantity > 0;
            case 4:
                return true;
            case 5:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                        Get Your Instant Quote
                    </h1>
                    <p className="text-muted-foreground">
                        Upload your file and configure your print in under 60 seconds
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-12">
                    <ProgressIndicator
                        type="stepped"
                        steps={steps}
                        color="secondary"
                    />
                </div>

                {/* Step Content */}
                <GlassPanel variant="elevated" className="mb-8">
                    {/* Step 1: File Upload */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                    Step 1: Upload Your File
                                </h2>
                                <p className="text-muted-foreground">
                                    Upload your STL or 3MF file to get started
                                </p>
                            </div>

                            <FileUpload
                                accept=".stl,.3mf"
                                maxSize={50 * 1024 * 1024} // 50MB
                                onUpload={handleFileUpload}
                                onAnalysis={(analysis) => {
                                    setQuoteData(prev => ({ ...prev, analysis }));
                                }}
                            />

                            {quoteData.analysis && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Weight</p>
                                        <p className="text-lg font-tech font-bold text-foreground">
                                            {quoteData.analysis.weight}g
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Print Time</p>
                                        <p className="text-lg font-tech font-bold text-foreground">
                                            {quoteData.analysis.estimatedPrintTime.toFixed(1)}h
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Dimensions</p>
                                        <p className="text-lg font-tech font-bold text-foreground">
                                            {quoteData.analysis.dimensions.x} × {quoteData.analysis.dimensions.y} × {quoteData.analysis.dimensions.z}mm
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Volume</p>
                                        <p className="text-lg font-tech font-bold text-foreground">
                                            {(quoteData.analysis.volume / 1000).toFixed(1)}cm³
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Material & Options */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                    Step 2: Choose Material & Options
                                </h2>
                                <p className="text-muted-foreground">
                                    Select your preferred material and color
                                </p>
                            </div>

                            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-lg">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <p className="text-lg font-tech text-foreground mb-2">Step 2: In Development</p>
                                <p className="text-sm text-muted-foreground">Material selection is being built. Check back soon.</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Quantity & Delivery */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                    Step 3: Quantity & Delivery
                                </h2>
                                <p className="text-muted-foreground">
                                    How many do you need and when?
                                </p>
                            </div>

                            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-lg">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <p className="text-lg font-tech text-foreground mb-2">Step 3: In Development</p>
                                <p className="text-sm text-muted-foreground">Quantity options are being built. Check back soon.</p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Price Breakdown */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                    Step 4: Price Breakdown
                                </h2>
                                <p className="text-muted-foreground">
                                    Transparent pricing, no hidden fees
                                </p>
                            </div>

                            {!priceBreakdown && !loadingPrice && !priceError && (
                                <div className="text-center py-8">
                                    <NeonButton onClick={fetchQuote} variant="primary">
                                        Calculate Price
                                    </NeonButton>
                                </div>
                            )}

                            {loadingPrice && (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">Calculating price...</p>
                                </div>
                            )}

                            {priceError && (
                                <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                                    <p className="text-destructive font-tech">Error: {priceError}</p>
                                    <NeonButton onClick={fetchQuote} variant="secondary" className="mt-4">
                                        Try Again
                                    </NeonButton>
                                </div>
                            )}

                            {priceBreakdown && (
                                <div className="space-y-4">
                                    <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                                        <div className="flex justify-between text-lg font-tech mb-2">
                                            <span>Material Cost:</span>
                                            <span>${priceBreakdown.material_cost?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-tech mb-2">
                                            <span>Labor:</span>
                                            <span>${priceBreakdown.labor_cost?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-tech mb-2">
                                            <span>Platform Fee:</span>
                                            <span>${priceBreakdown.platform_fee?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="border-t border-border/50 my-4"></div>
                                        <div className="flex justify-between text-2xl font-tech font-bold text-primary">
                                            <span>Total:</span>
                                            <span>${priceBreakdown.total_price?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                                        <p className="text-sm text-center">
                                            Note: This is a price estimate. Payments are not yet active.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Checkout */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                    Step 5: Checkout
                                </h2>
                                <p className="text-muted-foreground">
                                    Submit your request or save for later
                                </p>
                            </div>

                            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-lg">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <p className="text-lg font-tech text-foreground mb-2">Step 5: In Development</p>
                                <p className="text-sm text-muted-foreground">Checkout flow is being built. Payments not yet live.</p>
                            </div>
                        </div>
                    )}
                </GlassPanel>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <NeonButton
                        variant="ghost"
                        onClick={currentStep === 1 ? () => navigate('/') : handleBack}
                        icon={<ArrowLeft className="w-5 h-5" />}
                        iconPosition="left"
                    >
                        {currentStep === 1 ? 'Cancel' : 'Back'}
                    </NeonButton>

                    <NeonButton
                        variant="primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                        icon={<ArrowRight className="w-5 h-5" />}
                        iconPosition="right"
                    >
                        {currentStep === 5 ? 'Submit Quote' : 'Next Step'}
                    </NeonButton>
                </div>

                {/* Performance Timer (dev only) */}
                {import.meta.env.DEV && (
                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        <p>⏱️ Target: Complete quote in &lt;10 seconds</p>
                    </div>
                )}
            </div>
        </div>
    );
}
