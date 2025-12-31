import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  Package, 
  Briefcase, 
  Star, 
  MapPin,
  Percent,
  Calendar,
  Heart,
  Coins
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import NeonButton from "@/components/ui/NeonButton";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { cadToCredits, formatCredits, formatCad } from "@/config/credits";

const subscriptionBenefits = [
  {
    icon: Package,
    title: "25 Custom Items Monthly",
    description: "Receive 25 branded promo items each month from our featured selection.",
  },
  {
    icon: Star,
    title: "Premium Selection",
    description: "Choose from curated monthly featured products, all optimized for quality.",
  },
  {
    icon: Percent,
    title: "Subscriber Discounts",
    description: "Get 15% off all additional promo orders beyond your monthly allocation.",
  },
  {
    icon: Calendar,
    title: "Flexible Monthly",
    description: "Cancel anytime. No long-term commitment required.",
  },
  {
    icon: MapPin,
    title: "Support Local",
    description: "All items manufactured by verified Canadian makers in your region.",
  },
  {
    icon: Heart,
    title: "Community Impact",
    description: "Your subscription helps sustain local manufacturing jobs.",
  },
];

const exampleItems = [
  {
    name: "Custom Keychains",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=300&h=200&fit=crop",
  },
  {
    name: "Business Card Holders",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
  },
  {
    name: "Phone Stands",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
  },
  {
    name: "Desk Organizers",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=300&h=200&fit=crop",
  },
];

const BusinessSubscription = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <AnimatedLogo size="md" />
            <span className="font-tech font-bold text-xl text-foreground">3D3D.ca</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm mb-6">
              <Briefcase className="w-4 h-4" />
              BUSINESS SUBSCRIPTION
            </span>
            <h1 className="text-4xl md:text-6xl font-tech font-bold text-foreground mb-4">
              Subscribe to <span className="gradient-text">Support Local</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Monthly promo products delivered to your business. 
              Equal or better value than one-off ordering, while supporting Canadian manufacturing.
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto mb-16"
          >
            <GlowCard className="p-8 text-center relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-medium mb-4">
                  BEST VALUE
                </span>
                <h2 className="text-3xl font-tech font-bold text-foreground mb-2">
                  Business Support
                </h2>
                <div className="mb-2">
                  <span className="text-5xl font-tech font-bold text-secondary">$149</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-secondary" />
                  <span>= {formatCredits(cadToCredits(149))} value</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">25 custom promo items/month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">Choose from featured monthly selection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">Custom branding on all items</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">15% off additional orders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">Free shipping in Canada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">Cancel anytime</span>
                  </li>
                </ul>

                <NeonButton variant="primary" size="lg" className="w-full">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Join Business Subscription
                </NeonButton>
                
                <p className="text-muted-foreground text-sm mt-4">
                  No commitment. Cancel anytime. Billing starts on signup.
                </p>
              </div>
            </GlowCard>
          </motion.div>

          {/* Value Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-16"
          >
            <GlowCard className="p-8">
              <h2 className="text-2xl font-tech font-bold text-foreground mb-6 text-center">
                Why Subscribe?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-tech font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">1</span>
                    One-Off Ordering
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 25 items @ ~$8 each = ~$200</li>
                    <li>• Setup fees per order</li>
                    <li>• Variable lead times</li>
                    <li>• Standard pricing</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-tech font-bold text-secondary flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm">✓</span>
                    Business Subscription
                  </h3>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      25 items @ $5.96 each = $149
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      No setup fees ever
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      Guaranteed monthly delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      15% off additional orders
                    </li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-tech font-bold text-foreground mb-8 text-center">
              Subscription Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlowCard className="p-6 h-full">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-tech font-bold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Example Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-tech font-bold text-foreground mb-8 text-center">
              Example Monthly Items
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exampleItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlowCard className="overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Items rotate monthly. Browse current selection on the{" "}
              <Link to="/promo-products" className="text-secondary hover:underline">
                Promo Products page
              </Link>
              .
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <GlowCard className="p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-tech font-bold text-foreground mb-4">
                Ready to Support Local Manufacturing?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join businesses across Canada who are choosing local, sustainable promotional products.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NeonButton variant="primary" size="lg">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Join Business Subscription
                </NeonButton>
                <Link to="/promo-products">
                  <NeonButton variant="outline" size="lg">
                    <Package className="w-5 h-5 mr-2" />
                    Browse Products First
                  </NeonButton>
                </Link>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default BusinessSubscription;
