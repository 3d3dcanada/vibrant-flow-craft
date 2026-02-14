import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, User, ChevronRight, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NeonButton } from "@/components/ui/NeonButton";
import { RepositoryDrawer } from "@/components/repositories/RepositoryDrawer";
import logo from "@/assets/3D3D_Canada_Logo.png";

const navLinks = [
  { label: "Quote", href: "/quote" },
  { label: "Store", href: "/store" },
  { label: "Mission", href: "/mission" },
  { label: "About", href: "/about" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/60 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="3D3D" className="h-8" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-2 text-sm font-tech font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 animated-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Find a Model button */}
              <NeonButton
                variant="outline"
                size="sm"
                icon={<Database className="w-4 h-4" />}
                onClick={() => setIsDrawerOpen(true)}
              >
                Find a Model
              </NeonButton>

              {!loading && (
                user ? (
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    icon={<User className="w-4 h-4" />}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </NeonButton>
                ) : (
                  <NeonButton
                    size="sm"
                    icon={<LogIn className="w-4 h-4" />}
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </NeonButton>
                )
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-background md:hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="3D3D" className="h-8" />
            </Link>
            <button
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-tech font-semibold text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}

            {/* Find a Model in mobile */}
            <button
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-tech font-semibold text-secondary hover:bg-muted/50 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Find a Model
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Auth action */}
          <div className="px-4 pt-4 border-t border-border mx-4">
            {!loading && (
              user ? (
                <NeonButton
                  className="w-full"
                  icon={<User className="w-4 h-4" />}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  Go to Dashboard
                </NeonButton>
              ) : (
                <NeonButton
                  className="w-full"
                  icon={<LogIn className="w-4 h-4" />}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  Sign In
                </NeonButton>
              )
            )}
          </div>
        </div>
      )}

      {/* Repository Drawer */}
      <RepositoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
