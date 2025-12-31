import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Database, Zap, User, LogIn } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";
import NeonButton from "./NeonButton";
import { useAuth } from "@/contexts/AuthContext";
import RepositoryDrawer from "@/components/repositories/RepositoryDrawer";

const navLinks = [
  { label: "Mission", href: "/mission", isRoute: true },
  { label: "About", href: "/about", isRoute: true },
  { label: "How It Works", href: "#how-it-works", isRoute: false },
  { label: "Materials", href: "#materials", isRoute: false },
  { label: "Recycle & Buyback", href: "/recycle-buyback", isRoute: true },
  { label: "Schedule", href: "/schedule", isRoute: true },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <>
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-border shadow-lg" 
            : "bg-background/80 backdrop-blur-md border-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/">
              <AnimatedLogo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-sm font-medium text-foreground hover:text-secondary transition-colors relative group py-2 animated-underline"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground hover:text-secondary transition-colors relative group py-2 animated-underline"
                  >
                    {link.label}
                  </a>
                )
              ))}

              <motion.button
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 group py-2 px-4 rounded-lg border border-border hover:bg-muted/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <Database className="w-4 h-4 text-primary group-hover:animate-bounce" />
                Find a Model
              </motion.button>

              <NeonButton
                variant="primary"
                size="md"
                icon={<Zap className="w-4 h-4" />}
                onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
              >
                GET PRICE
              </NeonButton>

              {/* Auth Button */}
              {!loading && (
                user ? (
                  <NeonButton
                    variant="outline"
                    size="md"
                    icon={<User className="w-4 h-4" />}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </NeonButton>
                ) : (
                  <NeonButton
                    variant="secondary"
                    size="md"
                    icon={<LogIn className="w-4 h-4" />}
                    onClick={() => navigate('/auth')}
                  >
                    Login
                  </NeonButton>
                )
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden text-foreground text-2xl hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
            >
              <Menu />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-8 flex flex-col h-full justify-center space-y-8 text-center relative">
              <motion.button
                className="absolute top-6 right-6 text-muted-foreground text-3xl hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </motion.button>

              <div className="text-secondary text-sm tracking-widest uppercase font-bold mb-4 border-b border-border pb-4">
                Main Menu
              </div>

              {navLinks.map((link, index) => (
                link.isRoute ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="text-2xl font-tech font-bold text-foreground hover:text-secondary transition-colors flex items-center justify-center gap-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="text-2xl font-tech font-bold text-foreground hover:text-secondary transition-colors flex items-center justify-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.label}
                  </motion.a>
                )
              ))}

              {/* STL Repositories - Mobile */}
              <motion.button
                className="text-2xl font-tech font-bold text-primary hover:text-secondary transition-colors flex items-center justify-center gap-3"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Database className="w-6 h-6" />
                STL Repositories
              </motion.button>

              <motion.div
                className="pt-8 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NeonButton
                  variant="secondary"
                  size="xl"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  START PRINTING
                </NeonButton>

                {!loading && (
                  user ? (
                    <NeonButton
                      variant="outline"
                      size="lg"
                      className="w-full"
                      icon={<User className="w-5 h-5" />}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      Dashboard
                    </NeonButton>
                  ) : (
                    <NeonButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                      icon={<LogIn className="w-5 h-5" />}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/auth');
                      }}
                    >
                      Login / Sign Up
                    </NeonButton>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repository Drawer */}
      <RepositoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
