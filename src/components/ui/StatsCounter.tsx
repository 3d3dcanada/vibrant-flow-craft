import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsCounterProps {
  value: string;
  label: string;
  suffix?: string;
  delay?: number;
}

export const StatsCounter = ({ value, label, suffix = "", delay = 0 }: StatsCounterProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
  const prefix = value.replace(/[\d]+.*/, "");

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const startDelay = delay;

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - startDelay;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * numericValue);
        
        setDisplayValue(current.toString());

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(numericValue.toString());
        }
      };

      requestAnimationFrame(animate);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <motion.div
      className="group hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors"
        animate={{ textShadow: ["0 0 0px transparent", "0 0 10px hsl(177, 100%, 50%)", "0 0 0px transparent"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {prefix}{displayValue}{suffix}
      </motion.div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
};

export default StatsCounter;
