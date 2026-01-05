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
    <div
      className={cn(
        "glass-panel p-6 rounded-xl cursor-pointer relative overflow-hidden",
        "transition-all duration-500 hover:-translate-y-1"
      )}
      style={{
        borderColor: isHovered ? tagColor : undefined,
        boxShadow: isHovered ? `0 0 30px ${tagColor}30` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${tagColor}10 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 
          className="text-2xl font-bold font-tech transition-colors duration-300"
          style={{ color: isHovered ? tagColor : undefined }}
        >
          {name}
        </h3>
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
              <div
                className="h-1.5 rounded-full transition-all duration-1000 animate-expand-width"
                style={{ 
                  backgroundColor: stat.color,
                  width: `${stat.value * 10}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expanded content on hover */}
      <div
        className={cn(
          "overflow-hidden relative z-10 transition-all duration-300",
          isHovered ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        )}
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
      </div>
    </div>
  );
};

export default MaterialCard;
