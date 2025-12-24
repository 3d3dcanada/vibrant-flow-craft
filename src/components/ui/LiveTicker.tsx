import { motion } from "framer-motion";

const tickerItems = [
  { text: "ORDER #8922 COMPLETED IN MONCTON", status: "success" },
  { text: "NEW MAKER JOINED: HALIFAX_NODE_42", status: "info" },
  { text: "ORDER #8918 PRINTING IN FREDERICTON", status: "active" },
  { text: "MATERIAL RESTOCK: PETG BLACK", status: "warning" },
  { text: "QUALITY CHECK PASSED: ORDER #8915", status: "success" },
  { text: "NEW DESIGN UPLOADED: BENCHY_V2.STL", status: "info" },
  { text: "ORDER #8920 SHIPPED VIA CANADA POST", status: "success" },
  { text: "MAKER RATING: 4.9★ AVERAGE THIS WEEK", status: "info" },
];

const statusColors = {
  success: "text-success",
  info: "text-secondary",
  active: "text-primary",
  warning: "text-warning",
};

const statusDots = {
  success: "bg-success",
  info: "bg-secondary",
  active: "bg-primary animate-pulse",
  warning: "bg-warning",
};

export const LiveTicker = () => {
  return (
    <div className="w-full bg-background/50 border-y border-border overflow-hidden py-3 backdrop-blur-sm">
      <motion.div
        className="flex whitespace-nowrap gap-12 text-xs font-mono text-muted-foreground"
        animate={{ x: [0, -2000] }}
        transition={{
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusDots[item.status as keyof typeof statusDots]}`} />
            <span className={statusColors[item.status as keyof typeof statusColors]}>{item.text}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveTicker;
