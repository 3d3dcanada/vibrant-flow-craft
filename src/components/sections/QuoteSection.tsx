import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { 
  Upload, Link as LinkIcon, Check, Leaf, Heart, CloudUpload, Trash2, Tag, X, Zap, 
  AlertCircle, Clock, Wrench, Package
} from "lucide-react";
import { GlowCard } from "../ui/GlowCard";
import NeonButton from "../ui/NeonButton";
import PricingBreakdown from "../ui/PricingBreakdown";
import { useAuth } from "@/contexts/AuthContext";
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

import { PrintRequestFormData, ModelSource } from "@/types/modelSource";

type Mode = "upload" | "url";
type InputMode = "weight" | "time" | "both";

interface PromoQuoteState {
  productId: string;
  productName: string;
  quantity: number;
  material: MaterialType;
  gramsPerUnit: number;
  minutesPerUnit: number;
  logoTextMaxChars: number;
}

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
  const location = useLocation();
  
  // File/URL mode
  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  // Quote inputs
  const [jobSize, setJobSize] = useState<JobSize>("small");
  const [materialType, setMaterialType] = useState<MaterialType>("PLA_STANDARD");
  const [color, setColor] = useState<ColorOption>("black");
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(() => getMinimumGrams("PLA_STANDARD"));
  const [hours, setHours] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("weight");
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>("standard");
  
  // Compute minimum grams for current material
  const minGrams = useMemo(() => getMinimumGrams(materialType), [materialType]);
  
  // Auto-bump weight when material changes and current weight is below new minimum
  useEffect(() => {
    if (weight < minGrams) {
      setWeight(minGrams);
    }
  }, [materialType, minGrams, weight]);
  
  // Post-processing
  const [postProcessingEnabled, setPostProcessingEnabled] = useState(false);
  const [postProcessingTier, setPostProcessingTier] = useState<PostProcessingTier>("standard");
  const [postProcessingMinutes, setPostProcessingMinutes] = useState(15);
  
  // Hardware (display only for now)
  const [hardwareEnabled, setHardwareEnabled] = useState(false);
  const [hardwareNotes, setHardwareNotes] = useState("");
  
  // Promo quote state
  const [promoQuote, setPromoQuote] = useState<PromoQuoteState | null>(null);
  
  // Model print request state (from repository drawer)
  const [modelRequest, setModelRequest] = useState<PrintRequestFormData | null>(null);

  // Check for promo quote or model request state from navigation
  useEffect(() => {
    const state = location.state as { promoQuote?: PromoQuoteState; modelPrintRequest?: PrintRequestFormData } | null;
    
    // Handle model print request from repository drawer
    if (state?.modelPrintRequest) {
      const req = state.modelPrintRequest;
      setModelRequest(req);
      setMaterialType(req.materialType as MaterialType);
      setQty(req.quantity);
      setJobSize(req.jobSize);
      setUrl(req.modelUrl);
      setMode("url");
      window.history.replaceState({}, document.title);
      return;
    }
    
    if (state?.promoQuote) {
      const pq = state.promoQuote;
      setPromoQuote(pq);
      // Map old material types to new ones
      const materialMap: Record<string, MaterialType> = {
        'PLA': 'PLA_STANDARD',
        'PETG': 'PETG',
        'TPU': 'TPU',
        'CARBON': 'PETG_CF',
      };
      const mappedMaterial = materialMap[pq.material] || 'PLA_STANDARD';
      setMaterialType(mappedMaterial);
      setQty(pq.quantity);
      
      // Ensure weight respects minimum for the material
      const promoWeight = pq.gramsPerUnit * pq.quantity;
      const promoMinGrams = getMinimumGrams(mappedMaterial);
      setWeight(Math.max(promoWeight, promoMinGrams));
      
      setHours((pq.minutesPerUnit * pq.quantity) / 60);
      setInputMode("both");
      setFile({ name: `${pq.productName}.stl` } as File);
      
      // Set appropriate job size based on quantity
      if (pq.quantity >= 50) setJobSize('large');
      else if (pq.quantity >= 10) setJobSize('medium');
      else setJobSize('small');
      
      setTimeout(() => {
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const clearPromoQuote = () => {
    setPromoQuote(null);
    setModelRequest(null);
    setFile(null);
    setUrl("");
    setWeight(getMinimumGrams("PLA_STANDARD"));
    setHours(null);
    setQty(1);
    setMaterialType("PLA_STANDARD");
    setInputMode("weight");
    setMode("upload");
  };

  const getReturnToQuoteUrl = useCallback(() => {
    if (promoQuote) {
      return `/#quote?promo=${promoQuote.productId}`;
    }
    return '/#quote';
  }, [promoQuote]);

  // Determine effective print hours for pricing
  const effectiveHours = useMemo(() => {
    if (inputMode === "time" || inputMode === "both") {
      return hours ?? JOB_SIZE_DEFAULTS[jobSize].defaultHours;
    }
    // Estimate from weight
    return estimatePrintTimeFromWeight(weight);
  }, [inputMode, hours, weight, jobSize]);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    if (qty < 1) errors.push("Quantity must be at least 1");
    if (weight <= 0 && (inputMode === "weight" || inputMode === "both")) {
      errors.push("Weight needed to price material");
    }
    return { isValid: errors.length === 0, errors };
  }, [qty, weight, inputMode]);

  // Calculate quote breakdown using pricing config
  const quoteBreakdown = useMemo(() => {
    return calculateQuoteBreakdown({
      materialType,
      grams: weight,
      qty,
      hours: effectiveHours,
      jobSize,
      deliverySpeed,
      rushRate: RUSH_RATES.emergency,
      postProcessingEnabled,
      postProcessingTier,
      postProcessingMinutes,
      isMember,
      color,
    });
  }, [materialType, weight, qty, effectiveHours, jobSize, deliverySpeed, postProcessingEnabled, postProcessingTier, postProcessingMinutes, isMember, color]);

  // Quote summary for PricingBreakdown
  const quoteSummary = useMemo(() => ({
    jobSize: JOB_SIZE_DEFAULTS[jobSize].label,
    material: MATERIAL_RATES[materialType].name,
    color: COLOR_OPTIONS.find(c => c.value === color)?.label || color,
    quantity: qty,
    deliverySpeed: deliverySpeed === 'emergency' ? 'Emergency (<24h)' : 'Standard',
  }), [jobSize, materialType, color, qty, deliverySpeed]);

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

  const handleUrlScan = () => {
    if (!url) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setWeight(85);
      setFile({ name: "imported_model.stl" } as File);
      setMode("upload");
    }, 2500);
  };

  return (
    <section id="quote" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
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

            {/* Features */}
            <div className="space-y-6">
              {[
                {
                  icon: Check,
                  color: "secondary",
                  title: "Transparent Pricing",
                  desc: "Makers keep $10 + markup. We take $5. You see everything.",
                },
                {
                  icon: Heart,
                  color: "primary",
                  title: "Designer Royalties",
                  desc: "We automatically identify and pay the original designer 25¢ per print.",
                },
                {
                  icon: Leaf,
                  color: "success",
                  title: "Circular Economy",
                  desc: "Failed print? Bring it back for local recycling.",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all cursor-default"
                  whileHover={{ x: 4 }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border`}
                    style={{
                      backgroundColor:
                        feature.color === "secondary"
                          ? "hsl(var(--secondary) / 0.1)"
                          : feature.color === "primary"
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--success) / 0.1)",
                      borderColor:
                        feature.color === "secondary"
                          ? "hsl(var(--secondary) / 0.2)"
                          : feature.color === "primary"
                          ? "hsl(var(--primary) / 0.2)"
                          : "hsl(var(--success) / 0.2)",
                      color:
                        feature.color === "secondary"
                          ? "hsl(var(--secondary))"
                          : feature.color === "primary"
                          ? "hsl(var(--primary))"
                          : "hsl(var(--success))",
                    }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground font-tech text-lg">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard
              variant="teal"
              hover="none"
              className="border-t-2 border-t-secondary/30 shadow-hud relative overflow-hidden"
            >
              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 bg-background/60 px-4 py-2 flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/30 font-mono">
                <span className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-success rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  SYSTEM READY
                </span>
                <span>NODE: ATLANTIC_01</span>
              </div>

              <div className="pt-8">
                {/* Promo Quote Banner */}
                {promoQuote && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm font-bold text-foreground font-tech">
                          Promo Product Quote: {promoQuote.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MOQ: {promoQuote.quantity} units • Customize: logo text (max {promoQuote.logoTextMaxChars} chars)
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={clearPromoQuote}
                      className="p-1 rounded hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Model Link Attached Banner */}
                {modelRequest && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground font-tech">Model Link Attached</span>
                      </div>
                      <button 
                        onClick={clearPromoQuote}
                        className="p-1 rounded hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <a 
                      href={modelRequest.modelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all block mb-1"
                    >
                      {modelRequest.modelUrl}
                    </a>
                    {modelRequest.repositoryName && (
                      <p className="text-[10px] text-muted-foreground">
                        From: {modelRequest.repositoryName}
                      </p>
                    )}
                    {modelRequest.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{modelRequest.notes}"
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-border/50">
                  <button
                    onClick={() => setMode("upload")}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      mode === "upload"
                        ? "border-secondary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CloudUpload className="w-4 h-4" />
                    Upload File
                  </button>
                  <button
                    onClick={() => setMode("url")}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      mode === "url"
                        ? "border-secondary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    Paste URL
                  </button>
                </div>

                {/* Upload Mode */}
                <AnimatePresence mode="wait">
                  {mode === "upload" && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6"
                    >
                      <div
                        className={`relative w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ${
                          file
                            ? "border-success/50 bg-success/5"
                            : "border-border hover:border-secondary hover:bg-secondary/5"
                        }`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                      >
                        <input
                          type="file"
                          id="fileInput"
                          className="hidden"
                          accept=".stl,.obj,.3mf"
                          onChange={handleFileChange}
                        />

                        {isScanning ? (
                          <div className="text-center">
                            <motion.div
                              className="text-secondary text-4xl mb-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⟳
                            </motion.div>
                            <p className="text-sm text-secondary font-mono">Analyzing geometry...</p>
                          </div>
                        ) : file ? (
                          <div className="text-center">
                            <div className="text-success text-3xl mb-2">✓</div>
                            <p className="text-sm font-mono text-foreground truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                              }}
                              className="mt-2 text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 mx-auto"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        ) : (
                          <div className="text-center group-hover:scale-105 transition-transform">
                            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground text-xl mb-3 group-hover:text-secondary transition-all mx-auto">
                              <Upload />
                            </div>
                            <p className="text-sm text-foreground font-bold font-tech">
                              DROP STL FILE HERE
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              .STL, .OBJ, .3MF (Max 50MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {mode === "url" && (
                    <motion.div
                      key="url"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6"
                    >
                      <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                        Thingiverse / Printables Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://www.thingiverse.com/thing:123456"
                          className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-secondary outline-none font-mono transition-all"
                        />
                        <NeonButton
                          variant="primary"
                          size="md"
                          onClick={handleUrlScan}
                          disabled={isScanning}
                        >
                          {isScanning ? "..." : "SCAN"}
                        </NeonButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Job Size Selection */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Package className="w-3 h-3" />
                    Job Size
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(Object.entries(JOB_SIZE_DEFAULTS) as [JobSize, typeof JOB_SIZE_DEFAULTS.small][]).map(([size, config]) => (
                      <motion.button
                        key={size}
                        onClick={() => setJobSize(size)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          jobSize === size
                            ? "bg-secondary/10 border border-secondary text-secondary"
                            : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-xs font-bold font-tech">{config.label}</div>
                        <div className="text-[10px] opacity-70">~{config.defaultHours}h</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Material Selection */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Material
                    </label>
                    <button
                      onClick={() =>
                        document.getElementById("materials")?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-[10px] text-secondary hover:text-foreground transition-colors"
                    >
                      📖 Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {materials.map((mat) => (
                      <motion.button
                        key={mat.key}
                        onClick={() => setMaterialType(mat.key)}
                        className={`relative overflow-hidden p-2 rounded-lg text-left transition-all ${
                          materialType === mat.key
                            ? "bg-secondary/10 border border-secondary text-secondary"
                            : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-xs font-bold font-tech">{mat.name}</div>
                        <div className="text-[10px] opacity-70">{mat.tag}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all ${
                          color === c.value
                            ? "bg-secondary/10 border border-secondary text-secondary"
                            : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {c.hex && (
                          <span 
                            className="w-3 h-3 rounded-full border border-border/50" 
                            style={{ backgroundColor: c.hex }}
                          />
                        )}
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity with Quick Buttons */}
                <div className="mb-4">
                  <label className="flex justify-between text-xs font-bold text-muted-foreground mb-2 uppercase">
                    Quantity <span className="text-secondary">{qty}</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {QUANTITY_QUICK_OPTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQty(q)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          qty === q
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background/30 border border-border text-muted-foreground hover:border-secondary"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-secondary outline-none font-mono"
                    placeholder="Custom quantity"
                  />
                </div>

                {/* Weight + Time Inputs */}
                <div className="mb-4 p-3 rounded-lg bg-background/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Estimate Method
                    </label>
                    <div className="flex gap-1 ml-auto">
                      {(['weight', 'time', 'both'] as InputMode[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setInputMode(m)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            inputMode === m
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {m === 'weight' ? 'Weight' : m === 'time' ? 'Time' : 'Both'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {(inputMode === 'weight' || inputMode === 'both') && (
                      <div>
                        <label className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          Weight (g) <span className="text-secondary">{weight}g (min {minGrams}g)</span>
                        </label>
                        <input
                          type="number"
                          min={minGrams}
                          value={weight}
                          onChange={(e) => setWeight(Math.max(minGrams, parseInt(e.target.value) || minGrams))}
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-secondary outline-none font-mono"
                        />
                      </div>
                    )}
                    {(inputMode === 'time' || inputMode === 'both') && (
                      <div>
                        <label className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          Print Time (h) 
                          <span className="text-secondary">
                            {hours !== null ? `${hours}h` : `~${effectiveHours.toFixed(1)}h (est.)`}
                          </span>
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={hours ?? ''}
                          onChange={(e) => setHours(e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder={`Default: ${JOB_SIZE_DEFAULTS[jobSize].defaultHours}h`}
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-secondary outline-none font-mono"
                        />
                      </div>
                    )}
                  </div>
                  
                  {inputMode === 'time' && (
                    <p className="text-[10px] text-warning flex items-center gap-1 mt-2">
                      <AlertCircle className="w-3 h-3" />
                      Weight needed for material pricing
                    </p>
                  )}
                </div>

                {/* Delivery Speed Selection */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Delivery Speed
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => setDeliverySpeed("standard")}
                      className={`p-2 rounded-lg text-left transition-all ${
                        deliverySpeed === "standard"
                          ? "bg-secondary/10 border border-secondary text-secondary"
                          : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xs font-bold font-tech mb-0.5">Standard</div>
                      <div className="text-[10px] opacity-70">24-48h / 4-8 days (large)</div>
                    </motion.button>
                    <motion.button
                      onClick={() => setDeliverySpeed("emergency")}
                      className={`p-2 rounded-lg text-left transition-all ${
                        deliverySpeed === "emergency"
                          ? "bg-primary/10 border border-primary text-primary"
                          : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xs font-bold font-tech mb-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Emergency
                      </div>
                      <div className="text-[10px] opacity-70">&lt;24h (+15%)</div>
                    </motion.button>
                  </div>
                </div>

                {/* Optional Add-ons */}
                <div className="mb-4 p-3 rounded-lg bg-background/30 border border-border/30">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 block">
                    Optional Add-ons
                  </label>
                  
                  {/* Post-processing */}
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postProcessingEnabled}
                        onChange={(e) => setPostProcessingEnabled(e.target.checked)}
                        className="rounded border-border accent-secondary"
                      />
                      <span className="text-sm text-foreground flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Post-processing / cleanup
                      </span>
                    </label>
                    
                    {postProcessingEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 ml-5 space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.entries(POST_PROCESSING_RATES) as [PostProcessingTier, typeof POST_PROCESSING_RATES.standard][]).map(([tier, config]) => (
                            <button
                              key={tier}
                              onClick={() => setPostProcessingTier(tier)}
                              className={`px-2 py-1 rounded text-xs transition-all ${
                                postProcessingTier === tier
                                  ? "bg-secondary/10 border border-secondary text-secondary"
                                  : "bg-muted/30 border border-border text-muted-foreground"
                              }`}
                            >
                              {config.label}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Time (minutes)</label>
                          <div className="flex gap-1 mt-1">
                            {[15, 30, 45, 60].map((m) => (
                              <button
                                key={m}
                                onClick={() => setPostProcessingMinutes(m)}
                                className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                                  postProcessingMinutes === m
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {m}m
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Hardware */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hardwareEnabled}
                        onChange={(e) => setHardwareEnabled(e.target.checked)}
                        className="rounded border-border accent-secondary"
                      />
                      <span className="text-sm text-foreground">
                        Hardware / inserts needed
                      </span>
                    </label>
                    
                    {hardwareEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 ml-5"
                      >
                        <input
                          type="text"
                          value={hardwareNotes}
                          onChange={(e) => setHardwareNotes(e.target.value)}
                          placeholder="List parts (e.g., M3 screws x4, brass inserts x2)"
                          className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-secondary outline-none"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Parts priced separately. Labor via post-processing.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Validation Errors */}
                {!validation.isValid && (
                  <div className="mb-4 p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                    {validation.errors.map((err, i) => (
                      <p key={i} className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {err}
                      </p>
                    ))}
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div className="border-t border-border/30 pt-4">
                  <PricingBreakdown 
                    breakdown={quoteBreakdown} 
                    qty={qty} 
                    isMember={isMember}
                    returnToQuote={getReturnToQuoteUrl}
                    deliverySpeed={deliverySpeed}
                    summary={quoteSummary}
                  />
                  
                  <NeonButton
                    variant="secondary"
                    size="xl"
                    className="w-full bg-gradient-to-r from-secondary to-primary mt-4"
                    icon={<span>→</span>}
                    iconPosition="right"
                    disabled={!validation.isValid}
                  >
                    PROCEED TO ORDER
                  </NeonButton>

                  <p className="text-center text-[10px] text-muted-foreground mt-3">
                    Valid for 48 hours. Subject to manual geometry review.
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
