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
    <div 
      className={`flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Clean Logo Container */}
      <div className={`relative ${sizeStyles[size].logo} flex items-center justify-center`}>
        <img 
          src={logo} 
          alt="3D3D.ca Logo" 
          className={`${sizeStyles[size].logo} object-contain`}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={`font-tech font-bold ${sizeStyles[size].text} tracking-wide text-foreground group-hover:text-secondary transition-colors`}
          >
            3D3D<span className="text-secondary">.ca</span>
          </span>
          <span 
            className={`${sizeStyles[size].sub} text-muted-foreground uppercase tracking-[0.2em] group-hover:text-primary transition-colors`}
          >
            Distributed Mfg.
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
