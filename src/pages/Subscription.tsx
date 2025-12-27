import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  Crown, Zap, Star, Check, ArrowLeft, Sparkles, 
  Percent, Gift, Recycle, Package
} from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Star,
    color: 'muted',
    description: 'Perfect for trying out 3D printing',
    features: [
      'Access to all materials',
      'Standard pricing',
      'Community support',
      'Recycling rewards',
      'Referral program',
      'Basic achievements'
    ],
    creditsIncluded: 0,
    adminDiscount: 0,
    bedDiscount: 0
  },
  {
    id: 'maker',
    name: 'Maker',
    price: 9.99,
    icon: Zap,
    color: 'secondary',
    description: 'Save up to 15% on every print',
    popular: true,
    features: [
      'Everything in Free',
      '20 credits/month included',
      '10% off all prints',
      'Priority queue',
      'Extended support',
      'Exclusive materials'
    ],
    creditsIncluded: 20,
    adminDiscount: 10,
    bedDiscount: 10,
    savings: 'Save ~$5/print'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 24.99,
    icon: Crown,
    color: 'primary',
    description: 'Maximum savings for serious makers',
    features: [
      'Everything in Maker',
      '50 credits/month included',
      '25% off all prints',
      '50% off admin fees',
      '50% off bed rental',
      'Model hosting (earn $0.25+/print)',
      'Priority support 24/7'
    ],
    creditsIncluded: 50,
    adminDiscount: 50,
    bedDiscount: 50,
    savings: 'Save ~$12/print'
  }
];

const Subscription = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: subscription } = useSubscription();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const colorClasses = {
    muted: 'border-muted-foreground/30 bg-muted/5',
    secondary: 'border-secondary bg-secondary/10',
    primary: 'border-primary bg-primary/10'
  };

  const iconColorClasses = {
    muted: 'text-muted-foreground bg-muted/20',
    secondary: 'text-secondary bg-secondary/20',
    primary: 'text-primary bg-primary/20'
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/">
              <AnimatedLogo size="sm" />
            </Link>
            
            <Link to="/dashboard">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
              Choose Your <span className="text-gradient">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Subscribe and save up to 25% on every print. All prices in CAD.
            </p>
          </motion.div>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium text-foreground">Up to 25% Off</div>
              <div className="text-xs text-muted-foreground">Every print order</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <Gift className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-sm font-medium text-foreground">Free Credits</div>
              <div className="text-xs text-muted-foreground">Included monthly</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <Recycle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-foreground">Eco Rewards</div>
              <div className="text-xs text-muted-foreground">Recycle & earn</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <Package className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-foreground">Model Hosting</div>
              <div className="text-xs text-muted-foreground">Earn per print</div>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isCurrentPlan = subscription?.tier === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold z-10">
                      Most Popular
                    </div>
                  )}
                  
                  <GlowCard 
                    className={`p-6 h-full ${colorClasses[plan.color as keyof typeof colorClasses]} ${plan.popular ? 'ring-2 ring-secondary' : ''}`}
                    variant={plan.color === 'secondary' ? 'teal' : plan.color === 'primary' ? 'magenta' : 'neutral'}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${iconColorClasses[plan.color as keyof typeof iconColorClasses]} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-tech font-bold text-foreground">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {plan.savings && (
                        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                          {plan.savings}
                        </div>
                      )}
                    </div>

                    {/* Credits Included */}
                    {plan.creditsIncluded > 0 && (
                      <div className="mb-6 p-3 rounded-xl bg-background/50 border border-primary/20 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-foreground">
                            {plan.creditsIncluded} credits/month
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Worth ${(plan.creditsIncluded * 0.25).toFixed(2)} CAD
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto">
                      {isCurrentPlan ? (
                        <button 
                          disabled
                          className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-semibold"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <NeonButton 
                          className="w-full"
                          variant={plan.popular ? 'primary' : 'secondary'}
                        >
                          {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                        </NeonButton>
                      )}
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>

          {/* Creator Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <GlowCard className="p-8 text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Become a Creator
              </h3>
              <p className="text-muted-foreground mb-4">
                Pro members can host their 3D models on our platform. Earn a minimum of 
                <span className="text-secondary font-semibold"> $0.25 CAD</span> every time someone prints your design.
                With our <span className="text-secondary font-semibold">80/20 revenue split</span>, you keep the majority of earnings.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                  <span className="text-secondary font-semibold">80%</span> to Creator
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-primary font-semibold">$0.25+</span> per print
                </div>
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 font-semibold">Free</span> hosting
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Legal */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>All prices in Canadian Dollars (CAD). Subscriptions auto-renew monthly.</p>
            <p className="mt-1">Subject to Canadian tax regulations. Cancel anytime.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription;
