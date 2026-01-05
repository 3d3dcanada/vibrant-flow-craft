import { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-border shadow-lg" 
            : "bg-background/80 backdrop-blur-md border-transparent"
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
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

              <button
                className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group py-2 px-4 rounded-lg border border-border hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Database className="w-4 h-4 text-primary group-hover:animate-bounce" />
                Find a Model
              </button>

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
            <button
              className="md:hidden text-foreground text-2xl hover:text-secondary transition-colors active:scale-90"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl md:hidden animate-fade-in"
        >
          <div className="p-8 flex flex-col h-full justify-center space-y-8 text-center relative">
            <button
              className="absolute top-6 right-6 text-muted-foreground text-3xl hover:text-foreground transition-all hover:rotate-90 active:scale-90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X />
            </button>

            <div className="text-secondary text-sm tracking-widest uppercase font-bold mb-4 border-b border-border pb-4">
              Main Menu
            </div>

            {navLinks.map((link, index) => (
              link.isRoute ? (
                <div
                  key={link.label}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    to={link.href}
                    className="text-2xl font-tech font-bold text-foreground hover:text-secondary transition-colors flex items-center justify-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-tech font-bold text-foreground hover:text-secondary transition-colors flex items-center justify-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}

            {/* STL Repositories - Mobile */}
            <button
              className="text-2xl font-tech font-bold text-primary hover:text-secondary transition-colors flex items-center justify-center gap-3 animate-fade-in"
              style={{ animationDelay: `${navLinks.length * 100}ms` }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
            >
              <Database className="w-6 h-6" />
              STL Repositories
            </button>

            <div
              className="pt-8 space-y-4 animate-fade-in"
              style={{ animationDelay: '400ms' }}
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
            </div>
          </div>
        </div>
      )}

      {/* Repository Drawer */}
      <RepositoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
