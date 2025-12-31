import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlowCard } from "../ui/GlowCard";
import NeonButton from "../ui/NeonButton";
import { Package, Briefcase, Award, Building2 } from "lucide-react";

const promoItems = [
  {
    name: "Custom Keychains",
    description: "Logo-branded keychains for trade shows",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=300&fit=crop",
  },
  {
    name: "Desk Organizers",
    description: "Branded desktop accessories",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=400&h=300&fit=crop",
  },
  {
    name: "Phone Stands",
    description: "Custom phone holders with logo",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
  },
  {
    name: "Cable Clips",
    description: "Practical branded cable management",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

export const BusinessPromoSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm mb-6">
            <Building2 className="w-4 h-4" />
            FOR BUSINESSES
          </span>
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
            Business <span className="gradient-text">Promo Products</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Custom 3D printed promotional items manufactured locally. 
            Support Canadian makers while building your brand.
          </p>
        </motion.div>

        {/* Promo Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {promoItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard className="overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-tech font-bold text-foreground mb-1">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Package, title: "Bulk Pricing", desc: "MOQs from 25 units" },
            { icon: Award, title: "Quality Assured", desc: "Local maker network" },
            { icon: Briefcase, title: "Brand Ready", desc: "Custom colors & logos" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-tech font-bold text-foreground">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/promo-products">
            <NeonButton variant="primary" size="lg">
              <Package className="w-5 h-5 mr-2" />
              Order Promo Products
            </NeonButton>
          </Link>
          <Link to="/business-subscription">
            <NeonButton variant="outline" size="lg">
              <Briefcase className="w-5 h-5 mr-2" />
              Business Subscription
            </NeonButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessPromoSection;
