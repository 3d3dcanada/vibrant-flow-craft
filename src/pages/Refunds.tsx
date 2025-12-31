import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  ArrowLeft, RefreshCw, Clock, AlertTriangle, CheckCircle, 
  XCircle, Package, Mail
} from 'lucide-react';

const Refunds = () => {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      icon: Clock,
      title: "1. Request Stage Cancellations",
      content: `Before Your Request is Accepted:
• You may cancel at any time with a full credit refund
• Simply contact us or use the cancel button in your dashboard
• No questions asked, no fees

After a Maker Accepts Your Request:
• Cancellation may incur a small fee (typically $2-5) to compensate the maker for time spent
• If the maker hasn't started printing, we'll try to waive the fee
• Contact us within 1 hour of acceptance for best results`
    },
    {
      icon: Package,
      title: "2. In-Progress Job Cancellations",
      content: `Once Printing Has Begun:
• Cancellation is more limited due to custom manufacturing
• Material costs and print time already incurred are non-refundable
• We'll work with you on a case-by-case basis
• Emergency situations will be handled compassionately

What You Can Expect:
• We'll pause the job if possible
• Partial refund based on work completed
• Failed material may be recycled through our program`
    },
    {
      icon: AlertTriangle,
      title: "3. Custom Manufacturing Limitations",
      content: `Please Understand:
• 3D printing is custom manufacturing — each item is made specifically for you
• We cannot resell custom prints made to your specifications
• Color matching, exact dimensions, and surface finish may have tolerances
• Design flaws in your uploaded model are not covered

Standard Tolerances:
• Dimensional accuracy: ±0.3mm for FDM printing
• Color matching: Approximate to sample images
• Layer lines and surface texture are inherent to 3D printing`
    },
    {
      icon: CheckCircle,
      title: "4. Quality Issues & Defects",
      content: `We Stand Behind Our Work:
• If your print has defects due to maker error, we'll reprint at no cost
• Quality issues must be reported within 7 days of delivery
• Please include photos of the issue
• Original print should be returned or recycled through our program

Covered Quality Issues:
• Significant warping or layer separation
• Missing features or incomplete prints
• Wrong material or color used
• Dimensional errors beyond tolerance

Not Covered:
• Design issues in your original model
• Minor surface imperfections normal to 3D printing
• Damage during handling after delivery`
    },
    {
      icon: RefreshCw,
      title: "5. Refund Process",
      content: `How Refunds Work:
• Refunds are issued as 3D3D credits by default
• Credits never expire and can be used for future orders
• Cash refunds to original payment method available upon request for purchases over $25
• Processing time: 3-5 business days for credits, 5-10 for cash

To Request a Refund:
1. Email us at support@3d3d.ca with your order details
2. Include photos if it's a quality issue
3. We'll respond within 24 hours
4. Approved refunds processed immediately`
    },
    {
      icon: XCircle,
      title: "6. Non-Refundable Items",
      content: `The Following Are Not Refundable:
• Credits purchased (can only be used, not refunded)
• Gift cards (can be transferred to another account)
• Subscription fees for the current billing period
• Prints already shipped where the issue is cosmetic preference

Exceptions:
• We review each case individually
• Documented shipping damage is covered
• If we made a mistake, we make it right`
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
            <RefreshCw className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl font-tech font-bold text-foreground mb-3">
            Refunds & Cancellations
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
              We want you to be happy with every print. This policy explains when and how you can 
              cancel orders or request refunds. Because 3D printing is custom manufacturing, some 
              limitations apply — but we always try to be fair and work with you to find solutions.
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
                <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-muted-foreground">
                  If you have questions about refunds or need to request one:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-foreground">Email: support@3d3d.ca</p>
                  <p className="text-muted-foreground">Response time: Within 24 hours</p>
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
          <Link to="/community-policy" className="hover:text-secondary transition-colors">Community Policy</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="hover:text-secondary transition-colors">Return Home</Link>
        </div>
      </main>
    </div>
  );
};

export default Refunds;
