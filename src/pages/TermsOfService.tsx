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

The Service is available to residents of Canada who are at least 13 years of age. Users between 13-18 must have parental or guardian consent.

These Terms are governed by the laws of the Province of New Brunswick and the federal laws of Canada applicable therein.`
    },
    {
      icon: FileText,
      title: "2. Digital Products & Manufacturing Services",
      content: `3D3D operates two distinct types of services:

STL FILE SALES (Digital Products):
• We sell digital files (STL) that we own, have designed, or have licensed from creators
• When you purchase an STL file from our store, you receive commercial printing rights
• You may print, sell, or use these files commercially as permitted by the license
• Designers receive fair compensation through our royalty system
• These transactions are digital product sales under Canadian consumer law

PRINT-AS-SERVICE (Manufacturing Services):
• When you upload your own file, we provide manufacturing services only
• We rent you access to printing equipment, supply materials, and provide labor
• We do not claim ownership of files you upload
• We do not license, resell, or redistribute your files
• You are fully responsible for ensuring you have the legal right to print the file
• This is comparable to using a print shop or a friend's printer — we manufacture, you own the design

These are legally distinct activities. Our role as a print service provider does not make us liable for the content of files you upload.`
    },
    {
      icon: DollarSign,
      title: "3. Credits, Payments & Refunds",
      content: `Credits:
• 1 Credit = $0.25 CAD equivalent for services
• Credits are non-refundable once purchased
• Credits do not expire but may be subject to account inactivity policies
• Credits cannot be transferred between accounts or redeemed for cash

Payment Methods:
• We accept Interac e-Transfer to payments@3d3d.ca
• Gift card trades (Amazon, Steam, etc.) at posted exchange rates
• 3D3D gift cards purchased through authorized channels
• Note: Full payment processing is launching soon

Refunds:
• Print orders may be refunded if quality does not meet specifications
• Claims must be submitted within 7 days of delivery
• Refunds are issued as credits unless otherwise agreed
• STL file purchases are final once downloaded`
    },
    {
      icon: Shield,
      title: "4. User Accounts & Responsibilities",
      content: `You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Ensuring your submitted 3D models comply with applicable laws
• Providing accurate contact and shipping information
• Confirming you have the right to print any file you upload

Prohibited Activities:
• Uploading copyrighted content without authorization
• Submitting models for weapons, prohibited items, or illegal purposes
• Uploading content known to be pirated or stolen
• Attempting to manipulate the rewards or referral systems
• Creating multiple accounts to abuse promotions
• Harassment of other users or staff

By uploading a file for printing, you warrant that you have the legal right to have it manufactured.`
    },
    {
      icon: Scale,
      title: "5. Intellectual Property",
      content: `Your Content:
• You retain full ownership of files you upload for printing
• We do not acquire any license to your uploaded files beyond fulfilling your order
• Files are retained for a maximum of 14 days and can be deleted immediately on request

STL Store Content:
• Files sold in our store are owned by or licensed to 3D3D
• Purchases grant you commercial printing rights as specified
• Redistribution of purchased STL files is prohibited

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

Liability for Print Services:
• To the maximum extent permitted by applicable law, we are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount you paid for the specific service in question
• To the maximum extent permitted by applicable law, we are not responsible for delays due to shipping carriers or circumstances beyond our control
• To the maximum extent permitted by applicable law, we are not liable for infringement claims arising from files you upload — that responsibility is yours

Liability for STL Sales:
• We warrant that files sold in our store are properly licensed
• If a design is found to infringe, we will remove it and refund affected purchases

Third-Party Services:
• Gift card values and trade rates are subject to verification and market conditions
• We are not affiliated with Amazon, Steam, or other gift card providers`
    },
    {
      icon: Scale,
      title: "7. Governing Law & Jurisdiction",
      content: `These Terms are governed by and construed in accordance with the laws of the Province of New Brunswick and the federal laws of Canada applicable therein.

Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of New Brunswick, Canada.

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`
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
