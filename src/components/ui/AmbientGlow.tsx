import { motion } from "framer-motion";

export const AmbientGlow = () => {
  return (
    <>
      {/* Top-left magenta glow */}
      <motion.div
        className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(300, 100%, 50%, 0.08) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom-right teal glow */}
      <motion.div
        className="fixed bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(177, 100%, 50%, 0.06) 0%, transparent 60%)",
          filter: "blur(140px)",
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center accent glow */}
      <motion.div
        className="fixed top-1/2 left-1/2 w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(217, 91%, 60%, 0.03) 0%, transparent 50%)",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};

export default AmbientGlow;
