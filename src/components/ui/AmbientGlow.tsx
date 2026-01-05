export const AmbientGlow = () => {
  return (
    <>
      {/* Top-left magenta glow */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] pointer-events-none z-0 animate-float-subtle"
        style={{
          background: "radial-gradient(circle, hsl(300, 100%, 50%, 0.08) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      {/* Bottom-right teal glow */}
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] pointer-events-none z-0 animate-float"
        style={{
          background: "radial-gradient(circle, hsl(177, 100%, 50%, 0.06) 0%, transparent 60%)",
          filter: "blur(140px)",
          animationDelay: "2s",
        }}
      />

      {/* Center accent glow */}
      <div
        className="fixed top-1/2 left-1/2 w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 animate-breathe"
        style={{
          background: "radial-gradient(circle, hsl(217, 91%, 60%, 0.03) 0%, transparent 50%)",
          filter: "blur(100px)",
        }}
      />
    </>
  );
};

export default AmbientGlow;
