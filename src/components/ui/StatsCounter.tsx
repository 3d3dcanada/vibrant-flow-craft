import { useEffect, useState } from "react";

interface StatsCounterProps {
  value: string;
  label: string;
  suffix?: string;
  delay?: number;
}

export const StatsCounter = ({ value, label, suffix = "", delay = 0 }: StatsCounterProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
  const prefix = value.replace(/[\d]+.*/, "");

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const startDelay = delay;

    const visibilityTimer = setTimeout(() => setIsVisible(true), delay);

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

    return () => {
      clearTimeout(timer);
      clearTimeout(visibilityTimer);
    };
  }, [numericValue, delay]);

  return (
    <div
      className={`group hover:bg-muted/30 p-4 rounded-xl transition-all duration-500 cursor-default hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div className="text-3xl font-tech font-bold text-foreground group-hover:text-secondary transition-colors">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
};

export default StatsCounter;
