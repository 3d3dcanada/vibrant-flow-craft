import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, User, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="3D3D" className="h-8" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2">
              {!loading && (
                user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => navigate('/auth')}
                    className="gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
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
          <div className="flex items-center justify-between px-4 h-14 border-b border-border">
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
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          {/* Auth action */}
          <div className="px-4 pt-4 border-t border-border mx-4">
            {!loading && (
              user ? (
                <Button
                  className="w-full h-12 gap-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  <User className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  className="w-full h-12 gap-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
