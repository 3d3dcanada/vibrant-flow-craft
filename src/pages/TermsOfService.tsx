import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArrowLeft, Scale, FileText, Shield, AlertTriangle, DollarSign, Users, Mail } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      icon: Users,
      title: "1. Acceptance of Terms",
      content: `By accessing or using 3D3D.ca ("the Service"), operated by 3D3D Canada Inc., you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.

The Service is available to residents of Canada who are at least 13 years of age. Users between 13-18 must have parental or guardian consent.`
    },
    {
      icon: FileText,
      title: "2. Description of Services",
      content: `3D3D.ca provides:
• Custom 3D printing services using our distributed network of printers
• A credits-based payment system for ordering prints
• Community programs including recycling initiatives and cleanup rewards
• A marketplace for community-submitted 3D models
• Gift card purchasing and redemption

All services are provided on an "as is" basis and availability may vary by location within Canada.`
    },
    {
      icon: DollarSign,
      title: "3. Credits, Payments & Refunds",
      content: `Credits:
• 1 Credit = $0.25 CAD equivalent for print services
• Credits are non-refundable once purchased
• Credits do not expire but may be subject to account inactivity policies
• Credits cannot be transferred between accounts or redeemed for cash

Payment Methods:
• We accept Interac e-Transfer to payments@3d3d.ca
• Gift card trades (Amazon, Steam, etc.) at posted exchange rates
• 3D3D gift cards purchased through authorized channels

Refunds:
• Print orders may be refunded if quality does not meet specifications
• Claims must be submitted within 7 days of delivery
• Refunds are issued as credits unless otherwise agreed`
    },
    {
      icon: Shield,
      title: "4. User Accounts & Responsibilities",
      content: `You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Ensuring your submitted 3D models comply with applicable laws
• Providing accurate contact and shipping information

Prohibited Activities:
• Uploading copyrighted content without authorization
• Submitting models for weapons, prohibited items, or illegal purposes
• Attempting to manipulate the rewards or referral systems
• Creating multiple accounts to abuse promotions
• Harassment of other users or staff`
    },
    {
      icon: Scale,
      title: "5. Intellectual Property",
      content: `Your Content:
• You retain ownership of models you upload
• By uploading to the Community Models section, you grant us a license to display and produce prints of your designs
• Creators receive 80% revenue share on community model purchases

Our Content:
• The 3D3D.ca brand, website design, and proprietary software remain our property
• You may not copy, reproduce, or create derivative works without permission`
    },
    {
      icon: AlertTriangle,
      title: "6. Limitations & Disclaimers",
      content: `Print Quality:
• Results may vary based on design complexity, material, and equipment
• We make reasonable efforts but cannot guarantee exact color matching or dimensional precision beyond stated tolerances

Liability:
• We are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount you paid for the specific service in question
• We are not responsible for delays due to shipping carriers or circumstances beyond our control

Third-Party Services:
• Gift card values and trade rates are subject to verification and market conditions
• We are not affiliated with Amazon, Steam, or other gift card providers`
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
            <Scale className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl font-tech font-bold text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlowCard className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to 3D3D.ca! These Terms of Service ("Terms") govern your use of our 3D printing 
              platform, community programs, and related services. Please read these terms carefully 
              before using our services. By using 3D3D.ca, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms.
            </p>
          </GlowCard>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlowCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20 shrink-0">
                    <section.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <GlowCard className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Questions?</h3>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-foreground">Email: legal@3d3d.ca</p>
                  <p className="text-foreground">Address: Calgary, Alberta, Canada</p>
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="hover:text-secondary transition-colors">Return Home</Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
