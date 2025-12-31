import { motion } from "framer-motion";
import { Github, Twitter, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogo from "../ui/AnimatedLogo";

const footerLinks = {
  platform: [
    { label: "How It Works", href: "#how-it-works", isRoute: false },
    { label: "Materials Wiki", href: "#materials", isRoute: false },
    { label: "Get a Quote", href: "#quote", isRoute: false },
    { label: "Repository Hub", href: "#", isRoute: false },
  ],
  company: [
    { label: "About Us", href: "#about", isRoute: false },
    { label: "Become a Maker", href: "#", isRoute: false },
    { label: "Designer Royalties", href: "#", isRoute: false },
    { label: "Press Kit", href: "#", isRoute: false },
  ],
  support: [
    { label: "FAQ", href: "#", isRoute: false },
    { label: "Contact", href: "mailto:hello@3d3d.ca", isRoute: false },
    { label: "Privacy Policy", href: "/privacy", isRoute: true },
    { label: "Terms of Service", href: "/terms", isRoute: true },
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

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "mailto:hello@3d3d.ca" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
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
