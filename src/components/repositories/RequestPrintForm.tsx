import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as LinkIcon, Package, Layers, Hash, FileText, Send, X } from "lucide-react";
import { Repository } from "@/data/repositories";
import { MaterialType, MATERIAL_RATES } from "@/config/pricing";
import { ModelSource, PrintRequestFormData } from "@/types/modelSource";
import NeonButton from "@/components/ui/NeonButton";
import { useAuth } from "@/contexts/AuthContext";

interface RequestPrintFormProps {
  repository?: Repository;
  onClose: () => void;
  onSubmit: (data: PrintRequestFormData) => void;
}

const JOB_SIZES = [
  { value: "small", label: "Small", desc: "~4h print" },
  { value: "medium", label: "Medium", desc: "~12h print" },
  { value: "large", label: "Large", desc: "~24h+ print" },
] as const;

const materials: { key: MaterialType; name: string }[] = [
  { key: "PLA_STANDARD", name: "PLA Standard" },
  { key: "PLA_SPECIALTY", name: "PLA Specialty" },
  { key: "PETG", name: "PETG" },
  { key: "PETG_CF", name: "PETG-CF" },
  { key: "TPU", name: "TPU" },
  { key: "ABS_ASA", name: "ABS/ASA" },
];

export const RequestPrintForm = ({ repository, onClose, onSubmit }: RequestPrintFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [modelUrl, setModelUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [jobSize, setJobSize] = useState<"small" | "medium" | "large">("small");
  const [materialType, setMaterialType] = useState<MaterialType>("PLA_STANDARD");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelUrl.trim()) return;

    setIsSubmitting(true);

    const modelSource: ModelSource = {
      platform: repository?.name,
      modelUrl: modelUrl.trim(),
      licenseNote: repository?.licenseNotes,
      notes: notes.trim() || undefined,
    };

    const formData: PrintRequestFormData = {
      modelUrl: modelUrl.trim(),
      repositoryId: repository?.id,
      repositoryName: repository?.name,
      notes: notes.trim(),
      jobSize,
      materialType,
      quantity,
      modelSource,
    };

    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground font-tech">Request a Print</h3>
            {repository && (
              <p className="text-xs text-muted-foreground mt-0.5">
                From {repository.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Model URL */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
              <LinkIcon className="w-3 h-3" />
              Model URL *
            </label>
            <input
              type="url"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="https://www.printables.com/model/..."
              required
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none font-mono transition-all"
            />
          </div>

          {/* Job Size */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
              <Package className="w-3 h-3" />
              Estimated Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {JOB_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setJobSize(size.value)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    jobSize === size.value
                      ? "bg-primary/10 border border-primary text-primary"
                      : "bg-background/30 border border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <div className="text-xs font-bold">{size.label}</div>
                  <div className="text-[10px] opacity-70">{size.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Material Preference
            </label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value as MaterialType)}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-all"
            >
              {materials.map((mat) => (
                <option key={mat.key} value={mat.key}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
              <Hash className="w-3 h-3" />
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none font-mono transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements, color preferences, etc."
              rows={2}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none resize-none transition-all"
            />
          </div>

          {/* Not logged in notice */}
          {!user && (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-xs text-muted-foreground">
              <span className="font-medium text-secondary">Join free</span> to track your print requests and earn rewards.
            </div>
          )}

          {/* Submit */}
          <NeonButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            icon={<Send className="w-4 h-4" />}
            disabled={!modelUrl.trim() || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send to Quote"}
          </NeonButton>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RequestPrintForm;
