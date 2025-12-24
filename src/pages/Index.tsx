import Navbar from "@/components/ui/Navbar";
import ParticleBackground from "@/components/ui/ParticleBackground";
import AmbientGlow from "@/components/ui/AmbientGlow";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import AboutSection from "@/components/sections/AboutSection";
import MaterialsSection from "@/components/sections/MaterialsSection";
import QuoteSection from "@/components/sections/QuoteSection";
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
        <HowItWorksSection />
        <AboutSection />
        <MaterialsSection />
        <QuoteSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
