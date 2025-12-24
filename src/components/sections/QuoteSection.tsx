import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Upload, Link as LinkIcon, Check, Leaf, Heart, CloudUpload, Trash2 } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";
import NeonButton from "../ui/NeonButton";

type Mode = "upload" | "url";
type Material = "PLA" | "PETG" | "TPU" | "CARBON";

const PRICES: Record<Material, number> = {
  PLA: 0.09,
  PETG: 0.11,
  TPU: 0.18,
  CARBON: 0.35,
};

const materials: { key: Material; name: string; tag: string; level: number }[] = [
  { key: "PLA", name: "PLA", tag: "Standard", level: 33 },
  { key: "PETG", name: "PETG", tag: "Durable", level: 66 },
  { key: "TPU", name: "TPU", tag: "Flexible", level: 100 },
  { key: "CARBON", name: "CARBON", tag: "Extreme", level: 100 },
];

export const QuoteSection = () => {
  const [mode, setMode] = useState<Mode>("upload");
  const [material, setMaterial] = useState<Material>("PLA");
  const [weight, setWeight] = useState(100);
  const [qty, setQty] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const calculatePrice = () => {
    const baseFee = 15.0;
    const royalty = 0.25;
    const matCost = weight * PRICES[material];
    let total = (baseFee + matCost + royalty) * qty;
    if (qty >= 10) total = total * 0.9;
    return total.toFixed(2);
  };

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
                        className={`relative w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ${
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
                            {/* Scan line */}
                            <motion.div
                              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent"
                              style={{ boxShadow: "0 0 10px hsl(var(--secondary))" }}
                              initial={{ top: 0 }}
                              animate={{ top: "100%" }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        ) : file ? (
                          <div className="text-center">
                            <div className="text-success text-4xl mb-2">✓</div>
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
                            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground text-2xl mb-4 group-hover:text-secondary group-hover:shadow-glow-sm transition-all mx-auto">
                              <Upload />
                            </div>
                            <p className="text-base text-foreground font-bold font-tech">
                              DROP STL FILE HERE
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports .STL, .OBJ, .3MF (Max 50MB)
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
                          className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-secondary focus:shadow-glow-sm outline-none font-mono transition-all"
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
                      {isScanning && (
                        <motion.div
                          className="mt-3 text-xs text-primary font-mono flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            ⟳
                          </motion.span>
                          Establishing neural link to repository...
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Material Selection */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-foreground font-tech uppercase tracking-wider">
                      Material Selection
                    </label>
                    <button
                      onClick={() =>
                        document.getElementById("materials")?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-xs text-secondary hover:text-foreground transition-colors bg-secondary/10 px-2 py-1 rounded border border-secondary/20"
                    >
                      📖 Read Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {materials.map((mat) => (
                      <motion.button
                        key={mat.key}
                        onClick={() => setMaterial(mat.key)}
                        className={`relative overflow-hidden p-3 rounded-xl text-left transition-all ${
                          material === mat.key
                            ? "bg-secondary/10 border border-secondary text-secondary shadow-glow-sm"
                            : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-xs font-bold font-tech mb-1">{mat.name}</div>
                        <div className="text-[10px] opacity-70">{mat.tag}</div>
                        <div className="w-full h-1 bg-muted/30 mt-2 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              material === mat.key ? "bg-secondary" : "bg-current"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${mat.level}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-6 mb-8 bg-background/30 p-4 rounded-xl border border-border/30">
                  <div>
                    <label className="flex justify-between text-xs font-bold text-muted-foreground mb-2 uppercase">
                      Scale / Weight{" "}
                      <span className="text-secondary">{weight}g</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-bold text-muted-foreground mb-2 uppercase">
                      Quantity <span className="text-secondary">{qty}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value))}
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pricing Display */}
                <div className="border-t border-border/30 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Estimated Total (CAD)
                      </p>
                      <p className="text-[10px] text-success mt-1">
                        ✓ Includes 25¢ Designer Royalty
                      </p>
                    </div>
                    <motion.div
                      className="text-5xl font-tech font-bold text-foreground"
                      key={calculatePrice()}
                      initial={{ scale: 1.1, color: "hsl(var(--secondary))" }}
                      animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                      transition={{ duration: 0.3 }}
                    >
                      ${calculatePrice()}
                    </motion.div>
                  </div>

                  <NeonButton
                    variant="secondary"
                    size="xl"
                    className="w-full bg-gradient-to-r from-secondary to-primary"
                    icon={<span>→</span>}
                    iconPosition="right"
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
