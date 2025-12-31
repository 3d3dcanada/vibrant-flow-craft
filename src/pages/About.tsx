import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  ArrowLeft, MapPin, Users, Heart, Leaf, Zap, 
  Globe, Target, Coffee, ArrowRight
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

const About = () => {
  const team = [
    {
      name: "The Makers",
      role: "Distributed Network",
      description: "Dozens of verified makers across Atlantic Canada with 3D printers, skills, and passion for quality.",
      icon: Users,
    },
    {
      name: "The Customers",
      role: "Innovators & Creators",
      description: "Hobbyists, startups, and businesses who need custom parts without minimum orders.",
      icon: Target,
    },
    {
      name: "The Designers",
      role: "Open Source Community",
      description: "Thousands of creators on Thingiverse, Printables, and beyond who share their designs freely.",
      icon: Heart,
    },
  ];

  const values = [
    {
      icon: MapPin,
      title: "Atlantic Roots",
      description: "Started in New Brunswick, serving the Maritimes, with a vision for all of Canada.",
    },
    {
      icon: Leaf,
      title: "Sustainability First",
      description: "Recycling programs, local production, and a commitment to reducing waste.",
    },
    {
      icon: Coffee,
      title: "Community Driven",
      description: "Makers helping makers. Customers supporting local. Everyone building together.",
    },
    {
      icon: Globe,
      title: "Canada-Wide Vision",
      description: "Expanding from Atlantic Canada to create a national distributed manufacturing network.",
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
          <Link to="/mission">
            <NeonButton variant="ghost" size="sm">Our Mission</NeonButton>
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
            About 3D3D Canada
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building a different kind of manufacturing company — one that's distributed, 
            fair, and rooted in Atlantic Canadian communities.
          </p>
        </motion.div>

        {/* Founder Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <GlowCard className="p-8">
            <h2 className="text-2xl font-tech font-bold text-foreground mb-4 flex items-center gap-3">
              <Coffee className="w-6 h-6 text-secondary" />
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                3D3D started with a simple observation: there are hundreds of 3D printers sitting in 
                basements and home offices across Atlantic Canada, and thousands of people who need 
                things made but don't own a printer.
              </p>
              <p>
                Traditional manufacturing requires huge minimums. 3D printing services in big cities 
                charge a premium. And local makers? They're hard to find and pricing is inconsistent.
              </p>
              <p>
                We saw an opportunity to connect these two groups — to create a platform where makers 
                can earn money doing what they love, and customers can get quality prints at fair 
                prices, made locally.
              </p>
              <p className="text-foreground font-medium">
                From Fredericton, NB, we're now active in Moncton, Saint John, Halifax, and 
                Charlottetown — with plans to expand across all of Canada.
              </p>
            </div>
          </GlowCard>
        </motion.div>

        {/* Our People */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-tech font-bold text-foreground mb-6 text-center">
            The People Behind 3D3D
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <GlowCard key={index} className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <member.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-secondary mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-tech font-bold text-foreground mb-6 text-center">
            What We Believe
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <GlowCard key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 shrink-0">
                    <value.icon className="w-6 h-6 text-primary" />
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

        {/* What We Do Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <GlowCard className="p-8 bg-secondary/5 border-secondary/20">
            <h2 className="text-2xl font-tech font-bold text-foreground mb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-secondary" />
              What We Actually Do
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong className="text-foreground">Custom 3D Printing:</strong> Upload your model, get it printed locally.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong className="text-foreground">Maker Network:</strong> Verified local printers earning fair rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong className="text-foreground">Model Repository:</strong> Find and print designs from Thingiverse, Printables, and more.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong className="text-foreground">Recycling Program:</strong> Return failed prints for recycling into new filament.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong className="text-foreground">Designer Royalties:</strong> We pay open-source creators for every print made from their designs.</span>
              </li>
            </ul>
          </GlowCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#quote">
              <NeonButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                Get a Quote
              </NeonButton>
            </Link>
            <Link to="/mission">
              <NeonButton variant="outline" size="lg">
                Read Our Mission
              </NeonButton>
            </Link>
          </div>
        </motion.div>

        {/* Links */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <Link to="/mission" className="hover:text-secondary transition-colors">Mission</Link>
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

export default About;
