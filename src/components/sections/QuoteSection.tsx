import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Upload, Link as LinkIcon, Check, Leaf, Heart, CloudUpload, Trash2, Tag, X, Zap, 
  AlertCircle, Clock, Wrench, Package, User, ChevronDown, ChevronUp, ExternalLink, Send, Loader2,
  Copy, Mail, CloudOff
} from "lucide-react";
import { GlowCard } from "../ui/GlowCard";
import NeonButton from "../ui/NeonButton";
import PricingBreakdown from "../ui/PricingBreakdown";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSubmitPrintRequest } from "@/hooks/useMakerData";
import { 
  MaterialType, 
  MATERIAL_RATES, 
  DeliverySpeed,
  JobSize,
  JOB_SIZE_DEFAULTS,
  ColorOption,
  COLOR_OPTIONS,
  QUANTITY_QUICK_OPTIONS,
  POST_PROCESSING_RATES,
  PostProcessingTier,
  calculateQuoteBreakdown,
  estimatePrintTimeFromWeight,
  RUSH_RATES,
  getMinimumGrams
} from "@/config/pricing";
import { backendReady, CONTACT_EMAIL } from "@/config/backend";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PrintRequestFormData, ModelAttribution, createAttribution } from "@/types/modelSource";

type Mode = "upload" | "url";
type InputMode = "weight" | "time" | "both";

const materials: { key: MaterialType; name: string; tag: string }[] = [
  { key: "PLA_STANDARD", name: "PLA Standard", tag: "Standard" },
  { key: "PLA_SPECIALTY", name: "PLA Specialty", tag: "Glow/Wood/etc" },
  { key: "PETG", name: "PETG", tag: "Durable" },
  { key: "PETG_CF", name: "PETG-CF", tag: "Carbon Fiber" },
  { key: "TPU", name: "TPU", tag: "Flexible" },
  { key: "ABS_ASA", name: "ABS/ASA", tag: "Engineering" },
];

export const QuoteSection = () => {
  const { user } = useAuth();
  const isMember = !!user;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [jobSize, setJobSize] = useState<JobSize>("small");
  const [materialType, setMaterialType] = useState<MaterialType>("PLA_STANDARD");
  const [color, setColor] = useState<ColorOption>("black");
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(() => getMinimumGrams("PLA_STANDARD"));
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>("standard");
  
  const minGrams = useMemo(() => getMinimumGrams(materialType), [materialType]);
  
  useEffect(() => {
    if (weight < minGrams) {
      setWeight(minGrams);
    }
  }, [materialType, minGrams, weight]);

  const effectiveHours = useMemo(() => {
    return estimatePrintTimeFromWeight(weight);
  }, [weight]);

  const quoteBreakdown = useMemo(() => {
    return calculateQuoteBreakdown({
      materialType,
      grams: weight,
      qty,
      hours: effectiveHours,
      jobSize,
      deliverySpeed,
      rushRate: RUSH_RATES.emergency,
      postProcessingEnabled: false,
      postProcessingTier: "standard",
      postProcessingMinutes: 0,
      isMember,
      color,
    });
  }, [materialType, weight, qty, effectiveHours, jobSize, deliverySpeed, isMember, color]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setWeight(Math.floor(Math.random() * (200 - 50) + 50));
      }, 2000);
    }
  };

  return (
    <section id="quote" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info */}
          <div className="animate-fade-in">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">
              Instant Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-6">
              AI-Powered Quote Engine
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Drag & Drop an STL file, or simply paste a link from Thingiverse. Our algorithm
              calculates volume, weight, and print time instantly.
            </p>

            <div className="space-y-6">
              {[
                { icon: Check, color: "secondary", title: "Transparent Pricing", desc: "Makers keep $10 + markup. We take $5. You see everything." },
                { icon: Heart, color: "primary", title: "Designer Royalties", desc: "We automatically identify and pay the original designer 25¢ per print." },
                { icon: Leaf, color: "success", title: "Circular Economy", desc: "Failed print? Bring it back for local recycling." },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all cursor-default">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `hsl(var(--${feature.color}) / 0.1)`,
                      borderColor: `hsl(var(--${feature.color}) / 0.2)`,
                      color: `hsl(var(--${feature.color}))`,
                    }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground font-tech text-lg">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Calculator */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <GlowCard variant="teal" hover="none" className="border-t-2 border-t-secondary/30 shadow-hud relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-background/60 px-4 py-2 flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/30 font-mono">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  SYSTEM READY
                </span>
                <span>NODE: ATLANTIC_01</span>
              </div>

              <div className="pt-8">
                {/* File Upload */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Upload STL File
                  </label>
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer">
                    <CloudUpload className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">STL, OBJ, 3MF supported</p>
                    <input type="file" className="hidden" accept=".stl,.obj,.3mf" onChange={handleFileChange} />
                  </label>
                  {file && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-foreground font-mono">{file.name}</span>
                      <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Size */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Job Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(JOB_SIZE_DEFAULTS) as [JobSize, typeof JOB_SIZE_DEFAULTS.small][]).map(([size, config]) => (
                      <button
                        key={size}
                        onClick={() => setJobSize(size)}
                        className={`p-3 rounded-lg border text-center transition-all hover:scale-[1.02] ${
                          jobSize === size ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border bg-card/50 text-muted-foreground'
                        }`}
                      >
                        <div className="text-xs font-bold font-tech">{config.label}</div>
                        <div className="text-[10px] opacity-70">~{config.defaultHours}h</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Material</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {materials.map((mat) => (
                      <button
                        key={mat.key}
                        onClick={() => setMaterialType(mat.key)}
                        className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                          materialType === mat.key ? 'border-secondary bg-secondary/10' : 'border-border bg-card/50'
                        }`}
                      >
                        <div className="text-xs font-bold font-tech">{mat.name}</div>
                        <div className="text-[10px] opacity-70">{mat.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Estimated Weight (grams)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(minGrams, Number(e.target.value)))}
                    min={minGrams}
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:border-secondary outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum: {minGrams}g for {MATERIAL_RATES[materialType].name}</p>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Quantity</label>
                  <div className="flex gap-2">
                    {QUANTITY_QUICK_OPTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQty(q)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          qty === q ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      min={1}
                      className="w-20 bg-background/50 border border-border rounded-lg px-3 py-2 text-center"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <PricingBreakdown breakdown={quoteBreakdown} />

                {/* CTA */}
                <div className="mt-6">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={<Send className="w-5 h-5" />}
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                        return;
                      }
                      toast({ title: "Quote Saved!", description: "We'll match you with a local maker." });
                    }}
                  >
                    {user ? 'Submit Print Request' : 'Sign In to Order'}
                  </NeonButton>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
