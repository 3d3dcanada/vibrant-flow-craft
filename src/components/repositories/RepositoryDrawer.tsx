import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Search, 
  Database, 
  ChevronRight,
  Sparkles,
  Building2,
  Globe,
  Wrench,
  Landmark,
  Microscope,
  Factory,
  Gem
} from "lucide-react";
import { 
  REPOSITORY_CATEGORIES, 
  Repository, 
  searchRepositories 
} from "@/data/repositories";
import { PrintRequestFormData } from "@/types/modelSource";
import RepositoryCard from "./RepositoryCard";
import RequestPrintForm from "./RequestPrintForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface RepositoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  featured: <Sparkles className="w-4 h-4" />,
  mainstream: <Globe className="w-4 h-4" />,
  aggregators: <Search className="w-4 h-4" />,
  engineering: <Wrench className="w-4 h-4" />,
  museums: <Landmark className="w-4 h-4" />,
  scientific: <Microscope className="w-4 h-4" />,
  manufacturers: <Factory className="w-4 h-4" />,
  "hidden-gems": <Gem className="w-4 h-4" />,
};

export const RepositoryDrawer = ({ isOpen, onClose }: RepositoryDrawerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["featured"])
  );
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showRequestForm) {
          setShowRequestForm(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, showRequestForm, onClose]);

  // Search results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchRepositories(searchQuery);
  }, [searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleRequestPrint = (repository: Repository) => {
    setSelectedRepo(repository);
    setShowRequestForm(true);
  };

  const handleRequestPrintSubmit = (data: PrintRequestFormData) => {
    // Navigate to quote with prefilled data
    navigate("/", { 
      state: { 
        modelPrintRequest: data 
      } 
    });
    
    setShowRequestForm(false);
    onClose();
    
    // Scroll to quote section after navigation
    setTimeout(() => {
      document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isMobile ? 0 : "100%", y: isMobile ? "100%" : 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: isMobile ? 0 : "100%", y: isMobile ? "100%" : 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-50 bg-card border-l border-border shadow-2xl flex flex-col ${
              isMobile 
                ? "inset-0" 
                : "top-0 right-0 h-full w-full max-w-lg"
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground font-tech text-lg">Find a Model</h2>
                  <p className="text-xs text-muted-foreground">
                    {REPOSITORY_CATEGORIES.reduce((sum, cat) => sum + cat.repositories.length, 0)}+ safe, legal sources
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-border shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {filteredResults ? (
                // Search Results
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-3">
                    {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} for "{searchQuery}"
                  </p>
                  <div className="space-y-3">
                    {filteredResults.map((repo) => (
                      <RepositoryCard
                        key={repo.id}
                        repository={repo}
                        onRequestPrint={handleRequestPrint}
                      />
                    ))}
                  </div>
                  {filteredResults.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No repositories found</p>
                    </div>
                  )}
                </div>
              ) : (
                // Category Accordions
                <div className="p-5 space-y-3">
                  {REPOSITORY_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-primary">
                            {CATEGORY_ICONS[category.id] || <Database className="w-4 h-4" />}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-foreground text-sm font-tech">
                              {category.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {category.repositories.length} source{category.repositories.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCategories.has(category.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-muted-foreground"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </button>

                      {/* Category Content */}
                      <AnimatePresence>
                        {expandedCategories.has(category.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 bg-background/30">
                              {category.repositories.map((repo) => (
                                <RepositoryCard
                                  key={repo.id}
                                  repository={repo}
                                  onRequestPrint={handleRequestPrint}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-muted/20 text-center shrink-0">
              <p className="text-[10px] text-muted-foreground">
                All sources vetted for legal, safe content. No weapons or illicit materials.
              </p>
            </div>
          </motion.div>

          {/* Request Print Form Modal */}
          <AnimatePresence>
            {showRequestForm && (
              <RequestPrintForm
                repository={selectedRepo || undefined}
                onClose={() => setShowRequestForm(false)}
                onSubmit={handleRequestPrintSubmit}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default RepositoryDrawer;
