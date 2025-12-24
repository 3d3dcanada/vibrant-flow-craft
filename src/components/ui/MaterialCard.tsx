import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MaterialStat {
  label: string;
  value: number;
  color: string;
}

interface MaterialCardProps {
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  stats: MaterialStat[];
  details: string;
  applications: string[];
  pricePerGram: string;
}

export const MaterialCard = ({
  name,
  tag,
  tagColor,
  description,
  stats,
  details,
  applications,
  pricePerGram,
}: MaterialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "glass-panel p-6 rounded-xl cursor-pointer relative overflow-hidden",
        "transition-all duration-500"
      )}
      style={{
        borderColor: isHovered ? tagColor : undefined,
        boxShadow: isHovered ? `0 0 30px ${tagColor}30` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${tagColor}10 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <motion.h3 
          className="text-2xl font-bold text-foreground font-tech"
          animate={{ color: isHovered ? tagColor : undefined }}
        >
          {name}
        </motion.h3>
        <span 
          className="text-xs px-2 py-1 rounded"
          style={{ 
            backgroundColor: `${tagColor}20`,
            color: tagColor,
          }}
        >
          {tag}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 min-h-[40px] relative z-10">
        {description}
      </p>

      {/* Stats */}
      <div className="space-y-3 relative z-10">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{stat.label}</span>
              <span>{stat.value}/10</span>
            </div>
            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.value * 10}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expanded content on hover */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden relative z-10"
      >
        <div className="pt-4 mt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-3">{details}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {applications.map((app) => (
              <span 
                key={app}
                className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                {app}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase">Price per gram</span>
            <span className="font-tech font-bold" style={{ color: tagColor }}>{pricePerGram}</span>
          </div>
        </div>
      </motion.div>

      {/* Scan line effect */}
      {isHovered && (
        <motion.div
          className="absolute left-0 right-0 h-[2px] z-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${tagColor}, transparent)`,
            boxShadow: `0 0 10px ${tagColor}`,
          }}
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

export default MaterialCard;
