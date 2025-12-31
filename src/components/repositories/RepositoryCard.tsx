import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ExternalLink, 
  Search, 
  Printer,
  Users,
  Shield,
  FileText,
  Sparkles
} from "lucide-react";
import { Repository } from "@/data/repositories";
import NeonButton from "@/components/ui/NeonButton";

interface RepositoryCardProps {
  repository: Repository;
  onRequestPrint: (repository: Repository) => void;
}

export const RepositoryCard = ({ repository, onRequestPrint }: RepositoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenSite = () => {
    window.open(repository.url, "_blank", "noopener,noreferrer");
  };

  const handleSearch = () => {
    if (repository.searchUrlTemplate) {
      const searchUrl = repository.searchUrlTemplate.replace("{query}", "");
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      className="border border-border rounded-lg overflow-hidden bg-card/50 hover:bg-card/80 transition-all"
      layout
    >
      {/* Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-foreground font-tech text-sm">
                {repository.name}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono">
                {repository.modelCountLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {repository.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground mt-1"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleOpenSite}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background/50 hover:bg-muted text-foreground transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </button>
          {repository.searchUrlTemplate && (
            <button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background/50 hover:bg-muted text-foreground transition-all"
            >
              <Search className="w-3 h-3" />
              Search
            </button>
          )}
          <button
            onClick={() => onRequestPrint(repository)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
          >
            <Printer className="w-3 h-3" />
            Request
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* About */}
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {repository.about}
                </p>
              </div>

              {/* License & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
                    <FileText className="w-3 h-3 text-secondary" />
                    License
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {repository.licenseNotes}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
                    <Shield className="w-3 h-3 text-success" />
                    Content Policy
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {repository.safeContentNotes}
                  </p>
                </div>
              </div>

              {/* Top Designers */}
              <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-3">
                  <Users className="w-3 h-3 text-secondary" />
                  Top Designers
                  {repository.topDesigners.some(d => d.isEditablePick) && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured picks (editable)
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {repository.topDesigners.map((designer) => (
                    <a
                      key={designer.name}
                      href={designer.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border hover:border-secondary/50 transition-all group"
                    >
                      <div>
                        <div className="text-xs font-medium text-foreground group-hover:text-secondary transition-colors">
                          {designer.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {designer.specialty}
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RepositoryCard;
