import { motion } from "framer-motion";
import MaterialCard from "../ui/MaterialCard";

const materials = [
  {
    name: "PLA",
    tag: "Standard",
    tagColor: "hsl(177, 100%, 50%)",
    description: "The default. Biodegradable, stiff, and great for detail. Not for hot cars.",
    stats: [
      { label: "Strength", value: 6, color: "hsl(177, 100%, 50%)" },
      { label: "Heat Resistance", value: 3, color: "hsl(0, 84%, 60%)" },
      { label: "Ease of Print", value: 10, color: "hsl(155, 100%, 50%)" },
    ],
    details: "PLA (Polylactic Acid) is derived from corn starch or sugarcane. It's the most eco-friendly option and produces minimal warping. Glass transition temp: 60°C - avoid leaving in hot cars.",
    applications: ["Prototypes", "Figurines", "Display Items", "Educational Models", "Decorative Objects"],
    pricePerGram: "$0.09/g",
  },
  {
    name: "PETG",
    tag: "Durable",
    tagColor: "hsl(300, 100%, 50%)",
    description: "Water bottle plastic. Tough, UV resistant, slightly flexible. Great for outdoors.",
    stats: [
      { label: "Strength", value: 8, color: "hsl(300, 100%, 50%)" },
      { label: "Heat Resistance", value: 7, color: "hsl(300, 100%, 50%)" },
      { label: "Ease of Print", value: 8, color: "hsl(155, 100%, 50%)" },
    ],
    details: "PETG (Polyethylene Terephthalate Glycol) combines the ease of PLA with the strength of ABS. Food-safe when printed correctly. Glass transition temp: 80°C.",
    applications: ["Mechanical Parts", "Outdoor Use", "Food Containers", "Phone Cases", "Water Bottles"],
    pricePerGram: "$0.11/g",
  },
  {
    name: "TPU",
    tag: "Flexible",
    tagColor: "hsl(43, 100%, 50%)",
    description: "Rubber-like. Indestructible impact resistance. Phone cases, gaskets, tires.",
    stats: [
      { label: "Strength", value: 9, color: "hsl(43, 100%, 50%)" },
      { label: "Flexibility", value: 10, color: "hsl(43, 100%, 50%)" },
      { label: "Ease of Print", value: 4, color: "hsl(0, 84%, 60%)" },
    ],
    details: "TPU (Thermoplastic Polyurethane) is a flexible, rubber-like material. Shore hardness varies from 85A to 95A. Requires direct drive extruder and slow print speeds.",
    applications: ["Phone Cases", "Gaskets", "Wheels", "Shoe Soles", "Vibration Dampeners"],
    pricePerGram: "$0.18/g",
  },
  {
    name: "ABS",
    tag: "Industrial",
    tagColor: "hsl(217, 91%, 60%)",
    description: "LEGO material. Durable, heat-resistant. Requires enclosed printer.",
    stats: [
      { label: "Strength", value: 8, color: "hsl(217, 91%, 60%)" },
      { label: "Heat Resistance", value: 8, color: "hsl(217, 91%, 60%)" },
      { label: "Ease of Print", value: 5, color: "hsl(43, 100%, 50%)" },
    ],
    details: "ABS (Acrylonitrile Butadiene Styrene) is the same plastic used in LEGO bricks. Requires an enclosed chamber to prevent warping. Glass transition temp: 105°C. Emits fumes during printing.",
    applications: ["Automotive Parts", "Electronics Housings", "Power Tool Parts", "LEGO-compatible Builds", "High-Temp Applications"],
    pricePerGram: "$0.12/g",
  },
  {
    name: "Nylon",
    tag: "Engineering",
    tagColor: "hsl(280, 100%, 60%)",
    description: "Industrial strength. Self-lubricating. Gears, hinges, mechanical parts.",
    stats: [
      { label: "Strength", value: 9, color: "hsl(280, 100%, 60%)" },
      { label: "Wear Resistance", value: 10, color: "hsl(280, 100%, 60%)" },
      { label: "Ease of Print", value: 3, color: "hsl(0, 84%, 60%)" },
    ],
    details: "Nylon (PA6/PA12) is extremely strong and naturally self-lubricating. Must be dried before printing as it absorbs moisture. Excellent for functional mechanical parts.",
    applications: ["Gears", "Hinges", "Bushings", "Load-Bearing Parts", "Drone Components"],
    pricePerGram: "$0.25/g",
  },
  {
    name: "Carbon Fiber",
    tag: "Extreme",
    tagColor: "hsl(0, 0%, 70%)",
    description: "PLA/PETG infused with carbon fiber. Stiff, lightweight. Premium performance.",
    stats: [
      { label: "Stiffness", value: 10, color: "hsl(0, 0%, 70%)" },
      { label: "Weight Ratio", value: 9, color: "hsl(0, 0%, 70%)" },
      { label: "Ease of Print", value: 6, color: "hsl(43, 100%, 50%)" },
    ],
    details: "Carbon fiber reinforced filaments contain chopped carbon fibers in a PLA, PETG, or Nylon base. Requires hardened steel nozzle. Extremely stiff with low weight.",
    applications: ["Drone Frames", "Racing Parts", "Structural Components", "Robotics", "RC Vehicles"],
    pricePerGram: "$0.35/g",
  },
];

export const MaterialsSection = () => {
  return (
    <section id="materials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hex-pattern opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
            Material Science 101
          </span>
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
            Choose Your Material
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not all plastic is equal. Hover over each material to learn when to use it.
            Every choice has trade-offs—we help you pick the right tool for the job.
          </p>
        </motion.div>

        {/* Materials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {materials.map((material, index) => (
            <motion.div
              key={material.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <MaterialCard {...material} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm mb-4">
            Not sure which material to pick? Our quote engine will recommend the best option based on your use case.
          </p>
          <motion.button
            className="text-secondary hover:text-foreground transition-colors font-tech font-bold animated-underline"
            onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
          >
            Get a Quote Now →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MaterialsSection;
