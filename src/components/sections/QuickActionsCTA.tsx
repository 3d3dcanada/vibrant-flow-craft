import { FileUp, User, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePrimaryRole } from "@/hooks/useUserRoles";
import { useState, useEffect } from "react";

export const QuickActionsCTA = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { primaryRole } = usePrimaryRole();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAccountClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (primaryRole === 'admin') navigate('/dashboard/admin');
    else if (primaryRole === 'maker') navigate('/dashboard/maker');
    else navigate('/dashboard');
  };

  return (
    <section className="py-6 relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div
          className={`grid grid-cols-3 gap-3 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Get a Quote */}
          <button
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all min-h-[100px] hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/quote')}
          >
            <FileUp className="w-7 h-7 text-primary mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Get a Quote</span>
          </button>

          {/* Store */}
          <button
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-all min-h-[100px] hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/store')}
          >
            <Store className="w-7 h-7 text-secondary mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Store</span>
          </button>

          {/* Account */}
          <button
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-muted-foreground/30 transition-all min-h-[100px] hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleAccountClick}
          >
            <User className="w-7 h-7 text-muted-foreground mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              {loading ? '...' : user ? 'Dashboard' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuickActionsCTA;
