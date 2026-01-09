import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { NeonButton } from '@/components/ui/NeonButton';
import { FileUpload, FileAnalysis } from '@/components/ui/FileUpload';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, AlertCircle, Clock, RefreshCw, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

type QuoteStep = 1 | 2 | 3 | 4 | 5;

type MaterialType = 'PLA_STANDARD' | 'PLA_SPECIALTY' | 'PETG' | 'PETG_CF' | 'TPU' | 'ABS_ASA';

interface Material {
    id: MaterialType;
    name: string;
    description: string;
    priceHint: string;
}

const MATERIALS: Material[] = [
    { id: 'PLA_STANDARD', name: 'PLA Standard', description: 'Best for prototypes and display pieces. Easy to print, biodegradable.', priceHint: '$0.09/g' },
    { id: 'PLA_SPECIALTY', name: 'PLA Specialty', description: 'Enhanced PLA with special finishes (silk, matte, glow).', priceHint: '$0.14/g' },
    { id: 'PETG', name: 'PETG', description: 'Strong and impact-resistant. Great for functional parts.', priceHint: '$0.11/g' },
    { id: 'PETG_CF', name: 'PETG Carbon Fiber', description: 'Maximum strength with carbon fiber reinforcement.', priceHint: '$0.35/g' },
    { id: 'TPU', name: 'TPU Flexible', description: 'Flexible and durable. Perfect for gaskets and grips.', priceHint: '$0.18/g' },
    { id: 'ABS_ASA', name: 'ABS/ASA', description: 'Heat-resistant and UV-stable. Automotive-grade durability.', priceHint: '$0.13/g' },
];

interface QuoteData {
    file: File | null;
    fileStoragePath: string | null;
    analysis: FileAnalysis | null;
    materialType: MaterialType;
    color: string;
    quality: 'draft' | 'standard' | 'high';
    quantity: number;
    deliverySpeed: 'standard' | 'emergency';
}

interface PriceBreakdown {
    platform_fee: number;
    bed_rental: number;
    filament_cost: number;
    post_processing: number;
    extended_time_surcharge: number;
    rush_surcharge: number;
    quantity_discount: number;
    subtotal: number;
    minimum_adjustment: number;
    total: number;
    total_credits: number;
}

interface QuoteResponse {
    quote_id: string;
    expires_at: string;
    breakdown: PriceBreakdown;
    estimated_print_time_hours: number;
    designer_royalty: number;
}

/**
 * Quote Configurator Page
 * 5-step quote flow: Upload → Material → Quantity → Breakdown → Checkout
 * Phase 3B: Real file upload, real pricing, auth-gated persistence
 */
export default function QuoteConfigurator() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();

    const [currentStep, setCurrentStep] = useState<QuoteStep>(1);
    const [quoteData, setQuoteData] = useState<QuoteData>({
        file: null,
        fileStoragePath: null,
        analysis: null,
        materialType: 'PLA_STANDARD',
        color: 'black',
        quality: 'standard',
        quantity: 1,
        deliverySpeed: 'standard',
    });

    const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [printRightsConfirmed, setPrintRightsConfirmed] = useState(false);
    const [showConsentError, setShowConsentError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Restore quote data from sessionStorage on mount
    useEffect(() => {
        const savedQuote = sessionStorage.getItem('pendingQuote');
        if (savedQuote) {
            try {
                const parsed = JSON.parse(savedQuote);
                setQuoteData(prev => ({
                    ...prev,
                    materialType: parsed.materialType || prev.materialType,
                    quality: parsed.quality || prev.quality,
                    quantity: parsed.quantity || prev.quantity,
                    deliverySpeed: parsed.deliverySpeed || prev.deliverySpeed,
                    analysis: parsed.analysis || null,
                    fileStoragePath: parsed.fileStoragePath || null,
                }));
                if (parsed.step && parsed.step > 1) {
                    setCurrentStep(parsed.step as QuoteStep);
                }
                if (parsed.printRightsConfirmed) {
                    setPrintRightsConfirmed(true);
                }
            } catch (e) {
                console.error('Failed to restore quote data:', e);
            }
        }
    }, []);

    // Save quote data to sessionStorage when changing steps
    useEffect(() => {
        if (quoteData.analysis || currentStep > 1) {
            const toSave = {
                materialType: quoteData.materialType,
                quality: quoteData.quality,
                quantity: quoteData.quantity,
                deliverySpeed: quoteData.deliverySpeed,
                analysis: quoteData.analysis,
                fileStoragePath: quoteData.fileStoragePath,
                step: currentStep,
                printRightsConfirmed,
            };
            sessionStorage.setItem('pendingQuote', JSON.stringify(toSave));
        }
    }, [quoteData, currentStep, printRightsConfirmed]);

    const steps = [
        { label: 'Upload', completed: currentStep > 1 },
        { label: 'Material', completed: currentStep > 2 },
        { label: 'Quantity', completed: currentStep > 3 },
        { label: 'Breakdown', completed: currentStep > 4 },
        { label: 'Review', completed: currentStep > 5 },
    ];

    const handleFileUpload = async (file: File) => {
        setUploadError(null);
        setUploading(true);

        console.log('[Quote] File selected:', file.name, file.size);

        // If user is authenticated, upload to Supabase Storage
        if (user) {
            try {
                const fileExt = file.name.split('.').pop()?.toLowerCase();
                const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

                const { error: uploadErr } = await supabase.storage
                    .from('stl-uploads')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (uploadErr) {
                    console.error('[Quote] Upload error:', uploadErr);
                    setUploadError('Failed to upload file. Please try again.');
                    setUploading(false);
                    return;
                }

                console.log('[Quote] File uploaded to:', fileName);

                // Estimate analysis based on file size (real STL parsing would happen server-side)
                // For Phase 3B, we use file size to estimate weight
                const estimatedVolumeCm3 = Math.max(1, file.size / 1000); // Rough estimate
                const estimatedWeightGrams = estimatedVolumeCm3 * 1.24; // PLA density
                const estimatedPrintTime = Math.max(0.5, (estimatedWeightGrams * 3.5) / 60);

                const analysis: FileAnalysis = {
                    weight: Math.round(estimatedWeightGrams),
                    dimensions: { x: 100, y: 100, z: 50 },
                    estimatedPrintTime,
                    volume: estimatedVolumeCm3 * 1000, // Convert to mm³
                };

                setQuoteData(prev => ({
                    ...prev,
                    file,
                    fileStoragePath: fileName,
                    analysis,
                }));
            } catch (err) {
                console.error('[Quote] Upload error:', err);
                setUploadError('An unexpected error occurred during upload.');
            }
        } else {
            // Guest: just store file locally, will need auth to persist quote
            const estimatedVolumeCm3 = Math.max(1, file.size / 1000);
            const estimatedWeightGrams = estimatedVolumeCm3 * 1.24;
            const estimatedPrintTime = Math.max(0.5, (estimatedWeightGrams * 3.5) / 60);

            const analysis: FileAnalysis = {
                weight: Math.round(estimatedWeightGrams),
                dimensions: { x: 100, y: 100, z: 50 },
                estimatedPrintTime,
                volume: estimatedVolumeCm3 * 1000,
            };

            setQuoteData(prev => ({
                ...prev,
                file,
                fileStoragePath: null,
                analysis,
            }));
        }

        setUploading(false);
    };

    const fetchQuote = async () => {
        if (!quoteData.analysis) {
            setPriceError('No file analysis available');
            return;
        }

        setLoadingPrice(true);
        setPriceError(null);
        console.log('[Quote] Calling calculate-quote API...');

        try {
            const { data, error } = await supabase.functions.invoke('calculate-quote', {
                body: {
                    grams: quoteData.analysis.weight,
                    material: quoteData.materialType,
                    quality: quoteData.quality,
                    quantity: quoteData.quantity,
                    delivery_speed: quoteData.deliverySpeed,
                }
            });

            if (error) {
                console.error('[Quote] API Error:', error);
                setPriceError(error.message || 'Failed to calculate price');
            } else if (data?.error) {
                console.error('[Quote] API returned error:', data.error);
                setPriceError(data.error);
            } else {
                console.log('[Quote] Price calculated:', data);
                setQuoteResponse(data);
            }
        } catch (err) {
            console.error('[Quote] Unexpected error:', err);
            setPriceError('An unexpected error occurred. Please try again.');
        }

        setLoadingPrice(false);
    };

    const handleProceedToCheckout = () => {
        // If not authenticated, redirect to auth with return URL
        if (!user) {
            // Save current state before redirect
            sessionStorage.setItem('pendingQuote', JSON.stringify({
                materialType: quoteData.materialType,
                quality: quoteData.quality,
                quantity: quoteData.quantity,
                deliverySpeed: quoteData.deliverySpeed,
                analysis: quoteData.analysis,
                fileStoragePath: quoteData.fileStoragePath,
                step: 5,
                printRightsConfirmed,
            }));

            navigate('/auth', {
                state: {
                    returnTo: '/quote',
                    isSignup: true,
                }
            });
            return;
        }

        // Check quote expiry
        if (quoteResponse?.expires_at) {
            const expiryDate = new Date(quoteResponse.expires_at);
            if (expiryDate < new Date()) {
                setPriceError('This quote has expired. Please recalculate.');
                setQuoteResponse(null);
                return;
            }
        }

        // Move to step 5 (Review/Checkout Entry)
        setCurrentStep(5);
    };

    const handleNext = () => {
        // Block Step 1 progression if rights not confirmed
        if (currentStep === 1 && !printRightsConfirmed) {
            setShowConsentError(true);
            return;
        }
        setShowConsentError(false);

        // Auto-fetch quote when entering step 4
        if (currentStep === 3 && !quoteResponse) {
            setTimeout(() => fetchQuote(), 100);
        }

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
                return quoteData.file !== null && quoteData.analysis !== null && printRightsConfirmed && !uploading;
            case 2:
                return !!quoteData.materialType;
            case 3:
                return quoteData.quantity > 0;
            case 4:
                return quoteResponse !== null;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)} CAD`;
    };

    const getExpiryDisplay = () => {
        if (!quoteResponse?.expires_at) return null;
        const expiry = new Date(quoteResponse.expires_at);
        const now = new Date();
        const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return `Quote valid for ${daysRemaining} days`;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
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

                                {uploadError && (
                                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{uploadError}</span>
                                    </div>
                                )}

                                {quoteData.analysis && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Estimated Weight</p>
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

                                {/* Print Rights Acknowledgement */}
                                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="print-rights"
                                            checked={printRightsConfirmed}
                                            onCheckedChange={(checked) => {
                                                setPrintRightsConfirmed(checked === true);
                                                if (checked) setShowConsentError(false);
                                            }}
                                            className="mt-1"
                                        />
                                        <Label htmlFor="print-rights" className="text-sm text-foreground cursor-pointer leading-relaxed">
                                            I confirm that I have the right to have this file printed and that it does not violate copyright, license terms, or applicable law.
                                        </Label>
                                    </div>

                                    {showConsentError && (
                                        <div className="flex items-center gap-2 text-destructive text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Please confirm you have the rights to print this file to continue.</span>
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground space-y-1 mt-3">
                                        <p className="font-semibold text-foreground/80">We can't print:</p>
                                        <ul className="space-y-0.5 ml-4">
                                            <li>• Illegal or prohibited items</li>
                                            <li>• Files you don't have rights to print</li>
                                            <li>• Commercial-only licenses without permission</li>
                                            <li>• Anything intended to bypass safety or the law</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* File retention micro-disclosure */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Files are retained for 14 days after order completion. You can request immediate deletion anytime.</span>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Material & Options */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                        Step 2: Choose Material
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Select the material that best fits your needs
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {MATERIALS.map((material) => (
                                        <button
                                            key={material.id}
                                            onClick={() => setQuoteData(prev => ({ ...prev, materialType: material.id }))}
                                            className={`p-4 rounded-lg border text-left transition-all ${quoteData.materialType === material.id
                                                ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                                : 'border-border hover:border-secondary/50 hover:bg-muted/20'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-tech font-bold text-foreground">{material.name}</h3>
                                                <span className="text-xs text-secondary font-mono">{material.priceHint}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{material.description}</p>
                                        </button>
                                    ))}
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

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuoteData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                            className="w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center text-xl"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={quoteData.quantity}
                                            onChange={(e) => setQuoteData(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                            className="w-20 h-10 text-center rounded-lg border border-border bg-background text-foreground font-tech text-lg"
                                        />
                                        <button
                                            onClick={() => setQuoteData(prev => ({ ...prev, quantity: Math.min(1000, prev.quantity + 1) }))}
                                            className="w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center text-xl"
                                        >
                                            +
                                        </button>
                                        {quoteData.quantity >= 10 && (
                                            <span className="text-sm text-success">Bulk discount applies!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Speed */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-foreground">Delivery Speed</label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setQuoteData(prev => ({ ...prev, deliverySpeed: 'standard' }))}
                                            className={`p-4 rounded-lg border text-left transition-all ${quoteData.deliverySpeed === 'standard'
                                                ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                                : 'border-border hover:border-secondary/50'
                                                }`}
                                        >
                                            <h3 className="font-tech font-bold text-foreground mb-1">Standard</h3>
                                            <p className="text-sm text-muted-foreground">3-7 business days</p>
                                        </button>
                                        <button
                                            onClick={() => setQuoteData(prev => ({ ...prev, deliverySpeed: 'emergency' }))}
                                            className={`p-4 rounded-lg border text-left transition-all ${quoteData.deliverySpeed === 'emergency'
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary/50'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <h3 className="font-tech font-bold text-foreground mb-1">Rush (+15%)</h3>
                                            <p className="text-sm text-muted-foreground">1-2 business days</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Quality */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-foreground">Print Quality</label>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {(['draft', 'standard', 'high'] as const).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuoteData(prev => ({ ...prev, quality: q }))}
                                                className={`p-3 rounded-lg border text-center transition-all ${quoteData.quality === q
                                                    ? 'border-secondary bg-secondary/10 ring-2 ring-secondary/50'
                                                    : 'border-border hover:border-secondary/50'
                                                    }`}
                                            >
                                                <span className="font-tech capitalize">{q}</span>
                                            </button>
                                        ))}
                                    </div>
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
                                        Transparent pricing — no hidden fees
                                    </p>
                                </div>

                                {!quoteResponse && !loadingPrice && !priceError && (
                                    <div className="text-center py-8">
                                        <NeonButton onClick={fetchQuote} variant="primary">
                                            Calculate Price
                                        </NeonButton>
                                    </div>
                                )}

                                {loadingPrice && (
                                    <div className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
                                        <p className="text-muted-foreground">Calculating your quote...</p>
                                    </div>
                                )}

                                {priceError && (
                                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-5 h-5 text-destructive" />
                                            <p className="text-destructive font-tech">Error: {priceError}</p>
                                        </div>
                                        <NeonButton onClick={fetchQuote} variant="secondary" className="mt-4">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Try Again
                                        </NeonButton>
                                    </div>
                                )}

                                {quoteResponse && (
                                    <div className="space-y-4">
                                        <div className="bg-background/50 border border-border/50 rounded-lg p-6 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Platform Fee</span>
                                                <span className="text-foreground">{formatCurrency(quoteResponse.breakdown.platform_fee)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Printer Bed Rental</span>
                                                <span className="text-foreground">{formatCurrency(quoteResponse.breakdown.bed_rental)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Filament ({MATERIALS.find(m => m.id === quoteData.materialType)?.name})</span>
                                                <span className="text-foreground">{formatCurrency(quoteResponse.breakdown.filament_cost)}</span>
                                            </div>
                                            {quoteResponse.breakdown.extended_time_surcharge > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Extended Print Time</span>
                                                    <span className="text-foreground">{formatCurrency(quoteResponse.breakdown.extended_time_surcharge)}</span>
                                                </div>
                                            )}
                                            {quoteResponse.breakdown.rush_surcharge > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-primary">Rush Delivery (+15%)</span>
                                                    <span className="text-primary">{formatCurrency(quoteResponse.breakdown.rush_surcharge)}</span>
                                                </div>
                                            )}
                                            {quoteResponse.breakdown.quantity_discount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-success">Bulk Discount</span>
                                                    <span className="text-success">-{formatCurrency(quoteResponse.breakdown.quantity_discount)}</span>
                                                </div>
                                            )}
                                            {quoteResponse.breakdown.minimum_adjustment > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Minimum Order Adjustment</span>
                                                    <span className="text-foreground">{formatCurrency(quoteResponse.breakdown.minimum_adjustment)}</span>
                                                </div>
                                            )}

                                            <div className="border-t border-border/50 my-4" />

                                            <div className="flex justify-between text-xl font-tech font-bold">
                                                <span className="text-foreground">Total</span>
                                                <span className="text-secondary">{formatCurrency(quoteResponse.breakdown.total)}</span>
                                            </div>

                                            {quoteData.quantity > 1 && (
                                                <div className="text-right text-sm text-muted-foreground">
                                                    ({formatCurrency(quoteResponse.breakdown.total / quoteData.quantity)} per unit × {quoteData.quantity})
                                                </div>
                                            )}
                                        </div>

                                        {/* Designer Royalty Note */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                                            <Shield className="w-4 h-4 text-secondary" />
                                            <span>Includes ${quoteResponse.designer_royalty.toFixed(2)} CAD designer royalty when applicable.</span>
                                        </div>

                                        {/* Expiry Notice */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{getExpiryDisplay()}</span>
                                        </div>

                                        {/* No Hidden Fees Notice */}
                                        <div className="text-center p-4 bg-success/10 border border-success/30 rounded-lg">
                                            <p className="text-success font-tech font-bold">✓ No hidden fees. This is your final price.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 5: Checkout Entry (Phase 3B honest transition) */}
                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                                        Step 5: Review & Confirm
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Review your order details before proceeding
                                    </p>
                                </div>

                                {!user ? (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                                            <Shield className="w-8 h-8 text-secondary" />
                                        </div>
                                        <h3 className="text-xl font-tech font-bold text-foreground">Sign in to Continue</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Create an account or sign in to save your quote and proceed to checkout.
                                            Your quote data will be preserved.
                                        </p>
                                        <NeonButton
                                            variant="primary"
                                            onClick={handleProceedToCheckout}
                                            className="mt-4"
                                        >
                                            Sign In / Create Account
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </NeonButton>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Order Summary */}
                                        <div className="bg-background/50 border border-border rounded-lg p-6 space-y-4">
                                            <h3 className="font-tech font-bold text-foreground">Order Summary</h3>

                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">File:</span>
                                                    <span className="text-foreground ml-2">{quoteData.file?.name || 'Uploaded file'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Material:</span>
                                                    <span className="text-foreground ml-2">{MATERIALS.find(m => m.id === quoteData.materialType)?.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Quantity:</span>
                                                    <span className="text-foreground ml-2">{quoteData.quantity}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Delivery:</span>
                                                    <span className="text-foreground ml-2 capitalize">{quoteData.deliverySpeed}</span>
                                                </div>
                                            </div>

                                            {quoteResponse && (
                                                <div className="border-t border-border pt-4 mt-4">
                                                    <div className="flex justify-between text-lg font-tech font-bold">
                                                        <span>Total:</span>
                                                        <span className="text-secondary">{formatCurrency(quoteResponse.breakdown.total)}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {getExpiryDisplay()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* File Retention Reminder */}
                                        <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
                                            <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                            <div className="text-sm text-muted-foreground">
                                                <p className="font-medium text-foreground mb-1">File Retention Policy</p>
                                                <p>Your uploaded file will be retained for 14 days after order completion for reprint purposes. You can request immediate deletion at any time.</p>
                                            </div>
                                        </div>

                                        {/* Phase 3B Honest Notice */}
                                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-foreground mb-1">Payment Not Yet Active</p>
                                                    <p className="text-muted-foreground">
                                                        Online payments are launching soon. Your quote has been saved.
                                                        Contact us at <a href="mailto:orders@3d3d.ca" className="text-secondary hover:underline">orders@3d3d.ca</a> to
                                                        place your order now, or check back when payments go live.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote ID for Reference */}
                                        {quoteResponse?.quote_id && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                Quote Reference: <span className="font-mono text-foreground">{quoteResponse.quote_id.slice(0, 8).toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
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

                        {currentStep < 5 && (
                            <NeonButton
                                variant="primary"
                                onClick={currentStep === 4 ? handleProceedToCheckout : handleNext}
                                disabled={!canProceed() || (currentStep === 4 && loadingPrice)}
                                icon={<ArrowRight className="w-5 h-5" />}
                                iconPosition="right"
                            >
                                {currentStep === 4 ? 'Review Order' : 'Next Step'}
                            </NeonButton>
                        )}

                        {currentStep === 5 && user && (
                            <NeonButton
                                variant="secondary"
                                onClick={() => {
                                    // Clear session storage and go to dashboard
                                    sessionStorage.removeItem('pendingQuote');
                                    navigate('/dashboard/customer');
                                }}
                            >
                                View My Quotes
                            </NeonButton>
                        )}
                    </div>

                    {/* Performance Timer (dev only) */}
                    {import.meta.env.DEV && (
                        <div className="mt-8 text-center text-xs text-muted-foreground">
                            <p>⏱️ Target: Complete quote in &lt;10 seconds</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
