import { FileUp, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import NeonButton from "../ui/NeonButton";
import LiveTicker from "../ui/LiveTicker";

export const HeroSection = () => {
  const [makersAvailable, setMakersAvailable] = useState(17);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const updateMakers = () => {
      const randomNumber = Math.floor(Math.random() * 34) + 1;
      setMakersAvailable(randomNumber);
      const nextInterval = Math.floor(Math.random() * 4000) + 2000;
      setTimeout(updateMakers, nextInterval);
    };
    
    const initialTimeout = setTimeout(updateMakers, 3000);
    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Dynamic Badge */}
        <div
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-md mb-8 shadow-glass transition-all duration-500 hover:border-secondary/50 hover:scale-[1.02] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
          </span>
          <span className="text-xs font-bold tracking-widest text-muted-foreground">
            <span className="text-success transition-all duration-300">
              {makersAvailable}
            </span>
            <span className="text-success"> MAKERS AVAILABLE</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-tech font-extrabold text-foreground tracking-tight mb-8 leading-[1.1] transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          We 3D Print Anything.
          <br />
          <span className="gradient-text-neon">
            You Just Pick It Up.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          Upload a file, get an instant price, and a local maker starts building it immediately.
          <span className="block mt-4 text-sm text-secondary">
            <span className="inline-flex items-center gap-1">
              <span className="w-1 h-1 bg-secondary rounded-full" /> No Shipping Delays.
            </span>
            <span className="inline-flex items-center gap-1 ml-4">
              <span className="w-1 h-1 bg-secondary rounded-full" /> No Hidden Fees.
            </span>
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`mt-12 flex flex-col sm:flex-row justify-center gap-6 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <NeonButton
            variant="hero"
            size="xl"
            icon={<FileUp className="w-5 h-5" />}
            onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
          >
            UPLOAD & QUOTE
          </NeonButton>

          <NeonButton
            variant="outline"
            size="xl"
            glow={false}
            icon={<GraduationCap className="w-5 h-5" />}
            iconPosition="left"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            NEW TO THIS?
          </NeonButton>
        </div>

        {/* Stats Grid */}
        <div
          className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-border/30 pt-10 transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <div className="group hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors">24-48h</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Turnaround</div>
          </div>
          <div className="group hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors">20+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Vetted Makers</div>
          </div>
          <div className="group hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors">$0.25+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Designer Royalties</div>
          </div>
          <div className="group hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors">97.3%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Satisfaction Guarantee</div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="mt-16">
        <LiveTicker />
      </div>
    </section>
  );
};

export default HeroSection;
