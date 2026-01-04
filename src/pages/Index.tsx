import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import QuickActionsCTA from "@/components/sections/QuickActionsCTA";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import AboutSection from "@/components/sections/AboutSection";
import MaterialsSection from "@/components/sections/MaterialsSection";
import QuoteSection from "@/components/sections/QuoteSection";
import BuybackPromoSection from "@/components/sections/BuybackPromoSection";
import BusinessPromoSection from "@/components/sections/BusinessPromoSection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24">
          <HeroSection />
        </div>
        <div className="space-y-16 sm:space-y-24">
          <div className="glass-card p-8 sm:p-12">
            <QuickActionsCTA />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <HowItWorksSection />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <AboutSection />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <MaterialsSection />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <QuoteSection />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <BuybackPromoSection />
          </div>
          <div className="glass-card p-8 sm:p-12">
            <BusinessPromoSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
