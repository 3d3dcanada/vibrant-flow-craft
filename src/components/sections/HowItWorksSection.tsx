import { motion } from "framer-motion";
import { Box, Layers, Printer, HandHeart } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";

const steps = [
  {
    number: 1,
    title: "Get an .STL File",
    description: "3D printers speak \".STL\". It's like a PDF but for 3D objects. You cannot print a picture (.JPG).",
    tip: "Use our Repository Hub to search millions of free designs.",
    icon: Box,
    variant: "teal" as const,
    details: [
      "STL (Stereolithography) files contain 3D surface geometry",
      "Most CAD software can export to STL format",
      "Free designs available on Thingiverse, Printables, and 20+ sources",
      "We also accept OBJ and 3MF formats",
    ],
  },
  {
    number: 2,
    title: "We \"Slice\" It",
    description: "Our software cuts your digital model into thousands of thin layers. This tells the printer exactly where to move.",
    tip: "You choose: Material (Plastic type) and Infill (How solid the inside is).",
    icon: Layers,
    variant: "magenta" as const,
    details: [
      "Slicing software converts 3D models to printer instructions (G-code)",
      "Layer height affects quality: 0.1mm for detail, 0.3mm for speed",
      "Infill percentage: 15% for decorative, 50%+ for functional parts",
      "Supports are auto-generated for overhangs",
    ],
  },
  {
    number: 3,
    title: "Local Manufacturing",
    description: "A vetted maker in Fredericton, Moncton, or Halifax receives your file. Their machine melts plastic at 210°C to build your object.",
    tip: "Small items take ~4 hours. Large helmets take ~2 days.",
    icon: Printer,
    variant: "neutral" as const,
    details: [
      "FDM printers extrude melted filament layer by layer",
      "Print speed: 50-100mm/s depending on detail requirements",
      "Temperature varies by material: PLA 200°C, PETG 240°C, ABS 250°C",
      "Makers are vetted for equipment quality and reliability",
    ],
  },
  {
    number: 4,
    title: "Pickup or Delivery",
    description: "Once cooled and cleaned, you get a notification. Drive over and grab it, or we ship it via Canada Post.",
    tip: "If the print fails or isn't right, we reprint it for free.",
    icon: HandHeart,
    variant: "success" as const,
    details: [
      "Local pickup available at maker locations across Atlantic Canada",
      "Shipping via Canada Post for remote areas",
      "Quality inspection before handoff",
      "100% satisfaction guarantee with free reprints",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">
            Beginner's Guide
          </span>
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
            How 3D Printing Actually Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No jargon. No assumptions. This is your 5-minute crash course from zero to print-ready.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-secondary via-primary to-success" />

          {/* Steps */}
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
                variants={itemVariants}
              >
                {/* Content */}
                <div className={`${index % 2 === 1 ? "lg:order-2 lg:text-right" : ""} mb-8 lg:mb-0`}>
                  <GlowCard 
                    variant={step.variant === "neutral" ? "teal" : step.variant === "success" ? "teal" : step.variant}
                    hover="both"
                    className="relative"
                  >
                    {/* Step number badge */}
                    <motion.div
                      className={`absolute -top-4 ${index % 2 === 1 ? "lg:right-6 right-6" : "left-6"} w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg bg-background z-10`}
                      style={{
                        borderColor: step.variant === "teal" ? "hsl(var(--secondary))" 
                          : step.variant === "magenta" ? "hsl(var(--primary))"
                          : step.variant === "success" ? "hsl(var(--success))"
                          : "hsl(var(--foreground))",
                        color: step.variant === "teal" ? "hsl(var(--secondary))" 
                          : step.variant === "magenta" ? "hsl(var(--primary))"
                          : step.variant === "success" ? "hsl(var(--success))"
                          : "hsl(var(--foreground))",
                        boxShadow: `0 0 20px ${
                          step.variant === "teal" ? "hsl(177, 100%, 50%, 0.3)" 
                          : step.variant === "magenta" ? "hsl(300, 100%, 50%, 0.3)"
                          : step.variant === "success" ? "hsl(155, 100%, 50%, 0.3)"
                          : "transparent"
                        }`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <div className="flex items-start gap-4 mt-4">
                      <motion.div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0`}
                        style={{
                          backgroundColor: step.variant === "teal" ? "hsl(var(--secondary) / 0.1)" 
                            : step.variant === "magenta" ? "hsl(var(--primary) / 0.1)"
                            : step.variant === "success" ? "hsl(var(--success) / 0.1)"
                            : "hsl(var(--muted))",
                          color: step.variant === "teal" ? "hsl(var(--secondary))" 
                            : step.variant === "magenta" ? "hsl(var(--primary))"
                            : step.variant === "success" ? "hsl(var(--success))"
                            : "hsl(var(--foreground))",
                        }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <step.icon className="w-8 h-8" />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                        
                        <div 
                          className="bg-background/50 p-3 rounded text-xs text-foreground border-l-2"
                          style={{
                            borderColor: step.variant === "teal" ? "hsl(var(--secondary))" 
                              : step.variant === "magenta" ? "hsl(var(--primary))"
                              : step.variant === "success" ? "hsl(var(--success))"
                              : "hsl(var(--foreground))",
                          }}
                        >
                          <strong>Tip:</strong> {step.tip}
                        </div>
                      </div>
                    </div>

                    {/* Expandable details */}
                    <motion.div
                      className="mt-4 pt-4 border-t border-border/30"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {step.details.map((detail, i) => (
                          <motion.li 
                            key={i}
                            className="flex items-start gap-2"
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span 
                              className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                              style={{
                                backgroundColor: step.variant === "teal" ? "hsl(var(--secondary))" 
                                  : step.variant === "magenta" ? "hsl(var(--primary))"
                                  : step.variant === "success" ? "hsl(var(--success))"
                                  : "hsl(var(--foreground))",
                              }}
                            />
                            {detail}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </GlowCard>
                </div>

                {/* Visual placeholder for other side */}
                <div className={`hidden lg:block ${index % 2 === 1 ? "lg:order-1" : ""}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
