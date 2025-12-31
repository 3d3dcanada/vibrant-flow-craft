import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogo from "../ui/AnimatedLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useUserData";

// Social icons as simple SVGs for reliability
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const socialLinks = [
  { 
    icon: YouTubeIcon, 
    href: "https://www.youtube.com/@3D3Dcanada/shorts",
    label: "YouTube"
  },
  { 
    icon: FacebookIcon, 
    href: "https://www.facebook.com/profile.php?id=61575548079847",
    label: "Facebook"
  },
  { 
    icon: InstagramIcon, 
    href: "https://www.instagram.com/3d3dca/",
    label: "Instagram"
  },
  { 
    icon: TikTokIcon, 
    href: "https://www.tiktok.com/@3d3dcanada",
    label: "TikTok"
  },
];

const footerLinks = {
  platform: [
    { label: "How It Works", href: "/#how-it-works", isRoute: false },
    { label: "Get a Quote", href: "/#quote", isRoute: false },
    { label: "Promo Products", href: "/promo-products", isRoute: true },
    { label: "Business Subscription", href: "/business-subscription", isRoute: true },
  ],
  company: [
    { label: "Home", href: "/", isRoute: true },
    { label: "Mission", href: "/mission", isRoute: true },
    { label: "About Us", href: "/about", isRoute: true },
    { label: "Schedule a Call", href: "/schedule", isRoute: true },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms", isRoute: true },
    { label: "Privacy Policy", href: "/privacy", isRoute: true },
    { label: "Refunds & Cancellations", href: "/refunds", isRoute: true },
    { label: "Community Policy", href: "/community-policy", isRoute: true },
  ],
};

const locations = [
  "Fredericton, NB",
  "Moncton, NB",
  "Saint John, NB",
  "Halifax, NS",
  "Charlottetown, PEI",
];

export const Footer = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  
  const userRole = profile?.role;
  const isMakerOrAdmin = userRole === 'maker' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <AnimatedLogo size="lg" />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-sm">
              Atlantic Canada's distributed manufacturing network. We connect local makers to bring
              your ideas to life — faster, fairer, and cleaner.
            </p>

            {/* Locations */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="uppercase tracking-wider font-bold">Active Nodes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="text-xs px-2 py-1 rounded bg-muted/30 text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors cursor-default"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Email */}
            <div className="mt-6">
              <a 
                href="mailto:info@3d3d.ca" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@3d3d.ca
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-bold">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-foreground font-tech font-bold uppercase tracking-wider text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-secondary transition-colors animated-underline"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-secondary transition-colors animated-underline"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              
              {/* Role-aware dashboard links - only in company section */}
              {category === 'company' && user && (
                <ul className="space-y-3 mt-3 pt-3 border-t border-border/30">
                  {isMakerOrAdmin && (
                    <li>
                      <Link
                        to="/dashboard/maker"
                        className="text-sm text-muted-foreground hover:text-secondary transition-colors animated-underline"
                      >
                        Maker Dashboard
                      </Link>
                    </li>
                  )}
                  {isAdmin && (
                    <li>
                      <Link
                        to="/dashboard/admin"
                        className="text-sm text-muted-foreground hover:text-secondary transition-colors animated-underline"
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 3D3D.ca. All rights reserved. Built with ❤️ in New Brunswick.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <motion.span
              className="flex items-center gap-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-success" />
              All systems operational
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
