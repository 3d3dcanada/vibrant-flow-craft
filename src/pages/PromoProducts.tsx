import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ShoppingCart, Star, Briefcase } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import NeonButton from "@/components/ui/NeonButton";
import AnimatedLogo from "@/components/ui/AnimatedLogo";

const MONTH_1_PRODUCTS = [
  // Office Items
  {
    id: "keychain-custom",
    category: "Office",
    name: "Custom Logo Keychain",
    description: "Durable keychain with your company logo. Perfect for trade shows and client gifts.",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "business-card-holder",
    category: "Office",
    name: "Business Card Holder",
    description: "Elegant desktop card holder. Showcase your brand on every desk.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "pen-holder",
    category: "Office",
    name: "Branded Pen Holder",
    description: "Sleek pen organizer with custom branding. Keep desks tidy and branded.",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "phone-stand",
    category: "Office",
    name: "Phone Stand",
    description: "Adjustable phone stand for desks. Your logo visible all day.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "cable-organizer",
    category: "Office",
    name: "Cable Organizer",
    description: "Desktop cable management clip. Practical daily-use item.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  // Utility Items
  {
    id: "bottle-opener",
    category: "Utility",
    name: "Bottle Opener",
    description: "Custom branded bottle opener keychain. Great for events.",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "shopping-cart-token",
    category: "Utility",
    name: "Shopping Cart Token",
    description: "Reusable cart coin with your logo. Daily brand exposure.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "luggage-tag",
    category: "Utility",
    name: "Luggage Tag",
    description: "Durable travel luggage tag. Perfect for corporate travel kits.",
    image: "https://images.unsplash.com/photo-1553531384-411a247ccd73?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "coaster",
    category: "Utility",
    name: "Branded Coaster",
    description: "Custom coasters for offices and events. Protects surfaces, promotes brands.",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
  {
    id: "chip-clip",
    category: "Utility",
    name: "Chip Clip",
    description: "Useful snack bag clip with branding. Kitchen staple with your logo.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
  },
];

const PromoProducts = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedMoq, setSelectedMoq] = useState<number>(25);

  const handleGetQuote = (productId: string, moq: number) => {
    // Navigate to quote section with preset parameters
    navigate(`/#quote?product=${productId}&qty=${moq}&type=promo`);
  };

  const officeProducts = MONTH_1_PRODUCTS.filter(p => p.category === "Office");
  const utilityProducts = MONTH_1_PRODUCTS.filter(p => p.category === "Utility");

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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-secondary font-medium text-sm mb-6">
              <Star className="w-4 h-4" />
              MONTH 1 FEATURED PRODUCTS
            </span>
            <h1 className="text-4xl md:text-6xl font-tech font-bold text-foreground mb-4">
              Promo <span className="gradient-text">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Monthly featured promotional items. Locally manufactured by Canadian makers.
              Custom branding available on all products.
            </p>
            <Link to="/business-subscription">
              <NeonButton variant="outline" size="lg">
                <Briefcase className="w-5 h-5 mr-2" />
                Get 25 items/month with Business Subscription
              </NeonButton>
            </Link>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <GlowCard className="p-8">
              <h2 className="text-2xl font-tech font-bold text-foreground mb-4">
                Monthly Featured Promo Concept
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
                    <span className="font-tech font-bold text-secondary">1</span>
                  </div>
                  <div>
                    <h3 className="font-tech font-bold text-foreground mb-1">Curated Selection</h3>
                    <p className="text-muted-foreground text-sm">
                      Each month we feature 10 proven promo items optimized for 3D printing quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
                    <span className="font-tech font-bold text-secondary">2</span>
                  </div>
                  <div>
                    <h3 className="font-tech font-bold text-foreground mb-1">Bulk Pricing</h3>
                    <p className="text-muted-foreground text-sm">
                      Order 25, 50, or 100 units. Volume discounts available on larger orders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
                    <span className="font-tech font-bold text-secondary">3</span>
                  </div>
                  <div>
                    <h3 className="font-tech font-bold text-foreground mb-1">Local Makers</h3>
                    <p className="text-muted-foreground text-sm">
                      Items produced by verified Canadian makers. Support local manufacturing.
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Office Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-secondary" />
              Office Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officeProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlowCard className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-tech font-bold text-foreground text-lg mb-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">MOQ:</span>
                          <div className="flex gap-2">
                            {product.moqs.map((moq) => (
                              <button
                                key={moq}
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setSelectedMoq(moq);
                                }}
                                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                  selectedProduct === product.id && selectedMoq === moq
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {moq}
                              </button>
                            ))}
                          </div>
                        </div>
                        <NeonButton
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleGetQuote(product.id, selectedProduct === product.id ? selectedMoq : 25)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Get a Quote
                        </NeonButton>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Utility Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-tech font-bold text-foreground mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              Utility Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {utilityProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlowCard className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-tech font-bold text-foreground text-lg mb-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">MOQ:</span>
                          <div className="flex gap-2">
                            {product.moqs.map((moq) => (
                              <button
                                key={moq}
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setSelectedMoq(moq);
                                }}
                                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                  selectedProduct === product.id && selectedMoq === moq
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {moq}
                              </button>
                            ))}
                          </div>
                        </div>
                        <NeonButton
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleGetQuote(product.id, selectedProduct === product.id ? selectedMoq : 25)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Get a Quote
                        </NeonButton>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PromoProducts;
