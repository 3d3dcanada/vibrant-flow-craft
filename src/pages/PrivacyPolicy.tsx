import { Link } from 'react-router-dom';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArrowLeft, Shield, Eye, Database, Globe, Lock, UserCheck, Mail, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: `Personal Information:
• Name and contact information (email, phone, address)
• Shipping addresses for print deliveries
• Payment information processed through secure third-party providers
• Account credentials and profile data
• CASL consent records (timestamp and confirmation)

Usage Information:
• Device information and browser type
• IP address and approximate location
• Pages visited and features used
• Print orders and transaction history

Uploaded Files:
• 3D model files (STL) you submit for printing
• File metadata (name, size, upload date)
• Note: Files are NOT retained permanently — see Section 7

Community Data:
• Recycling drop submissions and locations
• Community cleanup activity
• Referral program participation`
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: `We use your information to:
• Process and fulfill your 3D print orders
• Manage your account and credits balance
• Verify recycling and cleanup submissions for reward programs
• Communicate order updates and service changes
• Send marketing emails (only with your explicit consent)
• Improve our services and user experience
• Prevent fraud and ensure platform security
• Comply with legal obligations
• Respond to designer opt-out and takedown requests

We do NOT:
• Sell your personal information to third parties
• Share your data for advertising purposes without consent
• Store payment card details on our servers
• Retain your uploaded files permanently
• Use your uploaded files for any purpose other than fulfilling your order`
    },
    {
      icon: Globe,
      title: "3. Information Sharing",
      content: `We may share your information with:

Service Providers:
• Shipping carriers (Canada Post, UPS, etc.) for delivery
• Payment processors for transaction handling
• Cloud hosting providers for data storage (Supabase, Canada region)
• Email service providers for communications

Legal Requirements:
• When required by Canadian law or court order
• To protect our rights, privacy, safety, or property
• In connection with a merger, acquisition, or sale of assets
• To respond to valid copyright infringement claims

With Your Consent:
• When you explicitly agree to share information
• For community features you choose to participate in`
    },
    {
      icon: Lock,
      title: "4. Data Security",
      content: `We implement industry-standard security measures:
• SSL/TLS encryption for all data transmission
• Secure password hashing and storage
• Row-level security (RLS) on all database tables
• Regular security audits and updates
• Limited employee access to personal data
• Secure backup and disaster recovery procedures

While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but will notify you promptly of any data breach affecting your personal information.`
    },
    {
      icon: UserCheck,
      title: "5. Your Rights (PIPEDA Compliance)",
      content: `Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:

Access: Request a copy of your personal information we hold
Correction: Update or correct inaccurate information
Deletion: Request deletion of your data (subject to legal requirements)
Portability: Receive your data in a portable format
Withdrawal: Withdraw consent for optional data processing
Complaint: File a complaint with the Privacy Commissioner of Canada

To exercise these rights, contact us at privacy@3d3d.ca

We will respond to requests within 30 days as required by Canadian law.`
    },
    {
      icon: Mail,
      title: "6. Email Marketing (CASL Compliance)",
      content: `Canada's Anti-Spam Legislation (CASL) requires your explicit consent before we send marketing emails.

When you sign up:
• You choose whether to receive marketing emails (checkbox, unchecked by default)
• We record the timestamp and IP address of your consent
• You can unsubscribe at any time via link in any email

We will NEVER:
• Pre-check the consent checkbox
• Send marketing emails without explicit consent
• Make consent a condition of using our core services
• Share your email with third parties for marketing

Transactional emails (order confirmations, password resets) are exempt from CASL and will always be sent.`
    },
    {
      icon: Shield,
      title: "7. File Retention & Deletion",
      content: `CRITICAL: Your uploaded 3D files are temporary.

Uploaded Files (STL):
• Maximum retention: 14 days after order completion
• Purpose: Reprints, defect correction, quality assurance only
• Immediate deletion: Available on request at any time
• Contact: privacy@3d3d.ca or use delete option in order history

What We Keep:
• Order metadata (what was printed, when, specifications)
• Thumbnail previews (for order history display)

What We Delete:
• The actual STL file
• Any intermediate processing files

We NEVER:
• Sell or share your uploaded files
• Add your files to our store without explicit permission
• Use your files for any purpose other than fulfilling your order`
    },
    {
      icon: MapPin,
      title: "8. Data Retention & Location",
      content: `Retention Periods:
• Account data: Retained while account is active, plus 3 years after closure
• Transaction records: 7 years as required by Canadian tax law
• Usage logs: 12 months for security and analytics
• CASL consent records: Permanent (legal requirement)
• Uploaded files: Maximum 14 days (see Section 7)

Location:
• Your data is stored on servers located in Canada (Supabase Canada Central)
• Data transfers outside Canada comply with PIPEDA requirements
• We use service providers that maintain equivalent privacy standards`
    },
    {
      icon: Shield,
      title: "9. Designer Opt-Out Records",
      content: `If you are a designer who has requested your work not be printed through our service:

What We Store:
• Your contact information (for communication)
• Design identifiers or hashes you provide
• Date of opt-out request
• Status of your request

Why We Store It:
• To honor your opt-out request
• To prevent future uploads of your designs
• To respond to inquiries about your work

Your Rights:
• Update your opt-out at any time
• Request removal of your opt-out record
• Contact: designers@3d3d.ca`
    },
    {
      icon: Eye,
      title: "10. Cookies & Tracking",
      content: `We use cookies and similar technologies for:
• Essential site functionality (login sessions, shopping cart)
• Analytics to understand site usage (anonymized)
• Remembering your preferences

You can control cookies through your browser settings. Disabling essential cookies may affect site functionality.

We do not use cookies for:
• Cross-site advertising tracking
• Selling to third-party advertisers`
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
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-tech font-bold text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <GlowCard className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              3D3D Canada Inc. ("we", "us", "our") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our website 3D3D.ca and related services. We comply with Canada's
              Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable
              provincial privacy legislation.
            </p>
          </GlowCard>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <GlowCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 shrink-0">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>

        {/* Updates Notice */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <GlowCard className="p-6 bg-secondary/5 border-secondary/20">
            <h3 className="text-lg font-semibold text-foreground mb-2">Policy Updates</h3>
            <p className="text-muted-foreground text-sm">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
              For significant changes, we will provide additional notice via email or through the Service.
            </p>
          </GlowCard>
        </div>

        {/* Contact */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '550ms' }}>
          <GlowCard className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Contact Our Privacy Officer</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  For privacy-related questions, concerns, or to exercise your rights:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground">Email: privacy@3d3d.ca</p>
                  <p className="text-foreground">Address: Calgary, Alberta, Canada</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  If you are not satisfied with our response, you may contact the
                  Office of the Privacy Commissioner of Canada at www.priv.gc.ca
                </p>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="hover:text-secondary transition-colors">Return Home</Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
