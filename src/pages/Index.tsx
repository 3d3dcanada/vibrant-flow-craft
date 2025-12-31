import Navbar from "@/components/ui/Navbar";
import ParticleBackground from "@/components/ui/ParticleBackground";
import AmbientGlow from "@/components/ui/AmbientGlow";
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
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background Effects */}
      <ParticleBackground />
      <AmbientGlow />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <HeroSection />
        <QuickActionsCTA />
        <HowItWorksSection />
        <AboutSection />
        <MaterialsSection />
        <QuoteSection />
        <BuybackPromoSection />
        <BusinessPromoSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
