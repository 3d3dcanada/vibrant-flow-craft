import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  ArrowLeft, Users, ShieldCheck, AlertTriangle, FileX, 
  Scale, Heart, Mail
} from 'lucide-react';

const CommunityPolicy = () => {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      icon: Heart,
      title: "1. Community Values",
      content: `3D3D is built on a foundation of mutual respect and shared passion for making. We expect all community members — customers, makers, and designers — to:

• Treat each other with courtesy and respect
• Communicate clearly and honestly about orders and expectations
• Honor commitments made through the platform
• Support the open-source design community
• Participate in good faith in our programs`
    },
    {
      icon: AlertTriangle,
      title: "2. Prohibited Items",
      content: `The following items may NOT be printed or requested through 3D3D:

Weapons & Weapon Components:
• Firearms, firearm parts, or firearm accessories
• Knives designed primarily as weapons
• Brass knuckles, batons, or similar items
• Any item designed to cause harm to people or animals

Illegal Items:
• Drug paraphernalia
• Items that violate Canadian law
• Counterfeit goods or trademark violations
• Lock picks or security bypass tools (unless for legitimate locksmith use)

Harmful Content:
• Items promoting hate speech or discrimination
• Sexually explicit content without appropriate age verification
• Items designed to harass, threaten, or intimidate

Makers have the right to refuse any job they're uncomfortable with.`
    },
    {
      icon: Scale,
      title: "3. Intellectual Property & Licensing",
      content: `Respect for Creators:
• When using designs from repositories like Thingiverse or Printables, respect the original license
• Commercial licenses may be required for selling items commercially
• When in doubt, contact the original designer

Your Uploads:
• You warrant that you have the right to print any files you upload
• Don't upload copyrighted designs without permission
• Designs uploaded to Community Models grant us a license to produce prints

Our Commitment:
• We track model origins and pay designer royalties (25¢ per print)
• We respect Creative Commons and open-source licenses
• We'll work with rights holders on takedown requests`
    },
    {
      icon: FileX,
      title: "4. Takedown Process",
      content: `If You're a Rights Holder:
If you believe your intellectual property is being used without permission:

1. Email legal@3d3d.ca with:
   • Your name and contact information
   • Description of the copyrighted work
   • URL or order number of the infringing item
   • Statement of good faith belief
   • Your signature (electronic is fine)

2. We will:
   • Review your claim within 48 hours
   • Remove or disable access to the material if valid
   • Notify the uploader of the takedown
   • Provide counter-notification process if disputed

Repeat Infringers:
• Users who repeatedly violate IP rights will be suspended
• Makers who print known infringing items may lose verified status`
    },
    {
      icon: ShieldCheck,
      title: "5. Safe Content Rules",
      content: `For Everyone's Safety:
• All prints must be safe for their intended use
• Functional parts (like brackets or hinges) should be designed with appropriate safety margins
• Makers should refuse jobs if safety is a concern
• Customers should not misrepresent the intended use of items

Children's Items:
• Items for children must be safe and appropriate
• Small parts warnings apply where relevant
• Non-toxic materials should be specified when needed

Food Contact:
• Food-safe printing requires specific materials and processes
• Not all printers are suitable for food-contact items
• Customers should verify food safety requirements with makers`
    },
    {
      icon: Users,
      title: "6. Community Conduct",
      content: `We're All in This Together:
• Be patient — makers are often working from home alongside other responsibilities
• Provide clear specifications and respond promptly to questions
• Leave honest, constructive reviews
• Report genuine issues; don't abuse the dispute system

Maker Expectations:
• Respond to jobs within 24 hours
• Communicate delays promptly
• Maintain quality standards
• Be honest about capabilities and limitations

Consequences:
• Policy violations may result in warnings, suspensions, or permanent bans
• Severe violations (weapons, illegal items) result in immediate ban
• We cooperate with law enforcement when required by law`
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-tech font-bold text-foreground mb-3">
            Community Policy
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
              3D3D is a community of makers, designers, and customers working together. This policy 
              outlines expectations for everyone in our community — what's allowed, what's not, and 
              how we handle issues. By using 3D3D, you agree to follow these guidelines.
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
          <GlowCard className="p-6 bg-secondary/5 border-secondary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/20">
                <Mail className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Questions or Reports?</h3>
                <p className="text-muted-foreground">
                  To report policy violations or ask questions:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-foreground">General: support@3d3d.ca</p>
                  <p className="text-foreground">IP/Legal: legal@3d3d.ca</p>
                  <p className="text-muted-foreground">We take all reports seriously.</p>
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
          <span className="mx-2">•</span>
          <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
          <span className="mx-2">•</span>
          <Link to="/refunds" className="hover:text-secondary transition-colors">Refunds</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="hover:text-secondary transition-colors">Return Home</Link>
        </div>
      </main>
    </div>
  );
};

export default CommunityPolicy;
