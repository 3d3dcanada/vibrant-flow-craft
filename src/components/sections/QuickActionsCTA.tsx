import { motion } from "framer-motion";
import { Database, FileUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePrimaryRole } from "@/hooks/useUserRoles";
import NeonButton from "../ui/NeonButton";
import { useState } from "react";
import RepositoryDrawer from "@/components/repositories/RepositoryDrawer";

export const QuickActionsCTA = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { primaryRole } = usePrimaryRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAccountClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Route based on role from user_roles table
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
          <motion.div
            className="grid grid-cols-3 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* Repositories */}
            <motion.button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all group min-h-[100px] sm:min-h-[120px]"
              onClick={() => setIsDrawerOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Database className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">STL Repositories</span>
            </motion.button>

            {/* Get a Quote */}
            <motion.button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-secondary/20 border border-secondary/30 hover:bg-secondary/30 transition-all group min-h-[100px] sm:min-h-[120px]"
              onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileUp className="w-7 h-7 sm:w-8 sm:h-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">Get a Quote</span>
            </motion.button>

            {/* Account */}
            <motion.button
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-secondary/50 transition-all group min-h-[100px] sm:min-h-[120px]"
              onClick={handleAccountClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground group-hover:text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
                {loading ? '...' : user ? 'Dashboard' : 'Sign In'}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <RepositoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default QuickActionsCTA;
