import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  ArrowLeft, Zap, Users, DollarSign, Leaf, MapPin, Heart, 
  Lightbulb, ArrowRight, CheckCircle, Truck, Package
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

const Mission = () => {
  const howItWorks = [
    {
      step: 1,
      title: "Get a Quote",
      description: "Upload your 3D model or paste a link from Thingiverse, Printables, or any repository. Our engine calculates instant pricing.",
      icon: Package,
    },
    {
      step: 2,
      title: "Submit Request",
      description: "Review your quote and submit. Your request enters our maker network queue.",
      icon: Zap,
    },
    {
      step: 3,
      title: "Maker Matched",
      description: "A verified local maker claims your job. You'll be notified when printing begins.",
      icon: Users,
    },
    {
      step: 4,
      title: "Print & Quality Check",
      description: "Your item is printed with care. Each maker follows quality guidelines before shipping.",
      icon: CheckCircle,
    },
    {
      step: 5,
      title: "Delivery",
      description: "Receive your print. Failed prints? Return for local recycling and we'll reprint.",
      icon: Truck,
    },
  ];

  const values = [
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "Makers keep $10/hr + markup. We take $5. Designers get royalties. Everyone wins.",
    },
    {
      icon: Leaf,
      title: "Circular Economy",
      description: "Failed prints don't go to landfill. Our recycling program turns waste into filament.",
    },
    {
      icon: MapPin,
      title: "Local First",
      description: "Prints made in your province. Shorter shipping, faster delivery, lower carbon.",
    },
    {
      icon: Heart,
      title: "Designer Attribution",
      description: "We track model origins and pay creators 25¢ per print. Fair compensation, automatic.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </Link>
            <AnimatedLogo size="sm" />
          </div>
          <Link to="/about">
            <NeonButton variant="ghost" size="sm">About Us</NeonButton>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
            <Lightbulb className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
            Making 3D Printing Practical and Local Across Canada
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building Canada's first distributed manufacturing network — connecting 
            local makers, fair pricing, and sustainable practices to bring your ideas to life.
          </p>
        </motion.div>

        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <GlowCard className="p-8">
            <h2 className="text-2xl font-tech font-bold text-foreground mb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-secondary" />
              What 3D3D Does
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              3D3D.ca is a cooperative infrastructure project that connects everyday Canadians who own 
              3D printers with customers who need things made. Instead of one factory, we're building 
              a network of hundreds of home-based makers across Atlantic Canada and beyond.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              You submit a print request. A verified maker in your region picks it up. Your item is 
              printed locally, quality-checked, and shipped. It's <strong className="text-foreground">faster</strong> because 
              it's local. <strong className="text-foreground">Fairer</strong> because makers keep most of the money. 
              And <strong className="text-foreground">cleaner</strong> because we recycle failed prints into new filament.
            </p>
          </GlowCard>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-tech font-bold text-foreground mb-6 text-center">
            Why We're Different
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <GlowCard key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20 shrink-0">
                    <value.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-tech font-bold text-foreground mb-8 text-center">
            How It Works
          </h2>
          <div className="space-y-4">
            {howItWorks.map((step, index) => (
              <GlowCard key={index} className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary/30">
                    <span className="text-secondary font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <step.icon className="w-6 h-6 text-muted-foreground/50 shrink-0 hidden sm:block" />
                </div>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* Attribution Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <GlowCard className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-tech font-bold text-foreground mb-4 flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              Our Attribution Goodwill Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you order a print from a public repository like Thingiverse or Printables, we 
              automatically track the original designer. For every print sold, we set aside 25¢ 
              for the creator — no action needed from you or the designer.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This isn't a legal requirement — it's a goodwill gesture to support the open-source 
              design community. Designers can claim their earnings or choose to donate them to 
              recycling programs. We believe creators deserve recognition and compensation.
            </p>
          </GlowCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link to="/#quote">
            <NeonButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Get Your First Quote
            </NeonButton>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No account required. See instant pricing.
          </p>
        </motion.div>

        {/* Links */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-secondary transition-colors">About Us</Link>
          <span className="mx-2">•</span>
          <Link to="/terms" className="hover:text-secondary transition-colors">Terms</Link>
          <span className="mx-2">•</span>
          <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        </div>
      </main>
    </div>
  );
};

export default Mission;
