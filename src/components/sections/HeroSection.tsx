import { motion } from "framer-motion";
import { FileUp, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import NeonButton from "../ui/NeonButton";
import StatsCounter from "../ui/StatsCounter";
import LiveTicker from "../ui/LiveTicker";

export const HeroSection = () => {
  const [makersAvailable, setMakersAvailable] = useState(17);

  useEffect(() => {
    const updateMakers = () => {
      const randomNumber = Math.floor(Math.random() * 34) + 1;
      setMakersAvailable(randomNumber);
      // Random interval between 2-6 seconds
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
        <motion.div
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-md mb-8 shadow-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ borderColor: "hsl(var(--secondary) / 0.5)", scale: 1.02 }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
          </span>
          <span className="text-xs font-bold tracking-widest text-muted-foreground">
            <motion.span 
              key={makersAvailable}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-success"
            >
              {makersAvailable}
            </motion.span>
            <span className="text-success"> MAKERS AVAILABLE</span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-tech font-extrabold text-foreground tracking-tight mb-8 leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          We 3D Print Anything.
          <br />
          <motion.span
            className="gradient-text-neon"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundSize: "200% 100%",
              backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)), hsl(var(--secondary)))",
            }}
          >
            You Just Pick It Up.
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-border/30 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <StatsCounter value="24-48h" label="Avg Turnaround" suffix="" delay={0} />
          <StatsCounter value="20+" label="Vetted Makers" delay={200} />
          <StatsCounter value="$0.25+" label="Designer Royalties" delay={400} />
          <StatsCounter value="97.3%" label="Satisfaction Guarantee" delay={600} />
        </motion.div>
      </div>

      {/* Live Ticker */}
      <div className="mt-16">
        <LiveTicker />
      </div>
    </section>
  );
};

export default HeroSection;
