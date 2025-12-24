import { motion } from "framer-motion";
import logo from "@/assets/3D3D_Canada_Logo.png";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export const AnimatedLogo = ({ size = "md", showText = true, className }: AnimatedLogoProps) => {
  const sizeStyles = {
    sm: { logo: "w-8 h-8", text: "text-lg", sub: "text-[8px]" },
    md: { logo: "w-12 h-12", text: "text-2xl", sub: "text-[10px]" },
    lg: { logo: "w-16 h-16", text: "text-3xl", sub: "text-xs" },
    xl: { logo: "w-24 h-24", text: "text-5xl", sub: "text-sm" },
  };

  return (
    <motion.div 
      className={`flex items-center gap-3 cursor-pointer group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated Logo Container */}
      <motion.div 
        className={`relative ${sizeStyles[size].logo} flex items-center justify-center`}
        animate={{ 
          filter: ["drop-shadow(0 0 8px hsl(177, 100%, 50%))", "drop-shadow(0 0 20px hsl(300, 100%, 50%))", "drop-shadow(0 0 8px hsl(177, 100%, 50%))"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Rotating glow ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-lg opacity-60"
          style={{
            background: "conic-gradient(from 0deg, hsl(177, 100%, 50%), hsl(300, 100%, 50%), hsl(177, 100%, 50%))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner glow */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Logo image */}
        <img 
          src={logo} 
          alt="3D3D.ca Logo" 
          className={`relative z-10 ${sizeStyles[size].logo} object-contain`}
        />
      </motion.div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <motion.span 
            className={`font-tech font-bold ${sizeStyles[size].text} tracking-wide text-foreground group-hover:text-secondary transition-colors`}
          >
            3D3D<span className="text-secondary">.ca</span>
          </motion.span>
          <motion.span 
            className={`${sizeStyles[size].sub} text-muted-foreground uppercase tracking-[0.2em] group-hover:text-primary transition-colors`}
          >
            Distributed Mfg.
          </motion.span>
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedLogo;
