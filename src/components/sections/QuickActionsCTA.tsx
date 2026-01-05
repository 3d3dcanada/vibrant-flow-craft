import { Database, FileUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePrimaryRole } from "@/hooks/useUserRoles";
import NeonButton from "../ui/NeonButton";
import { useState, useEffect } from "react";
import RepositoryDrawer from "@/components/repositories/RepositoryDrawer";

export const QuickActionsCTA = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { primaryRole } = usePrimaryRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAccountClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (primaryRole === 'admin') {
      navigate('/dashboard/admin');
    } else if (primaryRole === 'maker') {
      navigate('/dashboard/maker');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <section className="py-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className={`grid grid-cols-3 gap-3 sm:gap-4 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            {/* Repositories */}
            <button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all group min-h-[100px] sm:min-h-[120px] hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Database className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">STL Repositories</span>
            </button>

            {/* Get a Quote */}
            <button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-secondary/20 border border-secondary/30 hover:bg-secondary/30 transition-all group min-h-[100px] sm:min-h-[120px] hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
            >
              <FileUp className="w-7 h-7 sm:w-8 sm:h-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Get a Quote</span>
            </button>

            {/* Account */}
            <button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-secondary/50 transition-all group min-h-[100px] sm:min-h-[120px] hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleAccountClick}
            >
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground group-hover:text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
                {loading ? '...' : user ? 'Dashboard' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </section>

      <RepositoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default QuickActionsCTA;
