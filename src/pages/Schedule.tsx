import { motion } from "framer-motion";
import { Calendar, Mail, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { Button } from "@/components/ui/button";
import GlowCard from "@/components/ui/GlowCard";

const Schedule = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <AnimatedLogo size="sm" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calendar className="w-10 h-10 text-secondary" />
              <h1 className="text-4xl md:text-5xl font-tech font-bold">
                Schedule a Call
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book a quick call with 3D3D about prints, business promos, or maker onboarding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlowCard className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-tech font-bold mb-3">Booking Coming Soon</h2>
                  <p className="text-muted-foreground">
                    Our online scheduling system is being set up. In the meantime, 
                    reach out directly and we'll arrange a time that works for you.
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Contact us directly:</p>
                  <Button asChild variant="outline" className="gap-2">
                    <a href="mailto:info@3d3d.ca">
                      <Mail className="w-4 h-4" />
                      info@3d3d.ca
                    </a>
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-left">
                  <h3 className="font-semibold mb-2">What we can discuss:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Custom print quotes and project planning</li>
                    <li>• Business and promotional product inquiries</li>
                    <li>• Becoming a maker in our network</li>
                    <li>• Partnership opportunities</li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Links */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-secondary transition-colors">
              ← Back to Home
            </Link>
            <span className="text-border">|</span>
            <Link to="/about" className="text-muted-foreground hover:text-secondary transition-colors">
              About Us
            </Link>
            <span className="text-border">|</span>
            <Link to="/mission" className="text-muted-foreground hover:text-secondary transition-colors">
              Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schedule;
