import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCreditWallet, useCreditTransactions } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Coins, Gift, CreditCard, Wallet, TrendingUp,
  CheckCircle, ArrowRight, Sparkles, Tag, Calendar, ShoppingCart
} from 'lucide-react';

const CreditsStore = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'buy' | 'redeem' | 'history'>('buy');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const { data: creditWallet, isLoading } = useCreditWallet();
  const { data: transactions } = useCreditTransactions(20);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleRedeemGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({ title: "Error", description: "Please enter a gift card code", variant: "destructive" });
      return;
    }
    setRedeeming(true);
    // Simulated - would need edge function for real implementation
    setTimeout(() => {
      toast({ 
        title: "Coming Soon!", 
        description: "Gift card redemption will be available soon. Contact us to redeem manually.",
      });
      setRedeeming(false);
    }, 1000);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <AnimatedLogo size="lg" />
        </div>
      </div>
    );
  }

  const creditPackages = [
    { credits: 20, price: 5, popular: false, bonus: 0 },
    { credits: 50, price: 12, popular: false, bonus: 2 },
    { credits: 100, price: 22, popular: true, bonus: 10 },
    { credits: 250, price: 50, popular: false, bonus: 35 },
    { credits: 500, price: 95, popular: false, bonus: 80 },
    { credits: 1000, price: 175, popular: false, bonus: 200 },
  ];

  const paymentMethods = [
    { id: 'etransfer', name: 'Interac e-Transfer', description: 'Pay via email transfer', icon: Wallet, available: true },
    { id: 'giftcard', name: 'Gift Card Trade', description: 'Trade Amazon, Steam, etc.', icon: Gift, available: true },
    { id: 'crypto', name: 'Cryptocurrency', description: 'BTC, ETH, USDT', icon: Coins, available: false },
  ];

  const transactionTypeLabels: Record<string, { emoji: string; label: string }> = {
    purchase: { emoji: '💳', label: 'Purchase' },
    gift_card: { emoji: '🎁', label: 'Gift Card' },
    print_payment: { emoji: '🖨️', label: 'Print Order' },
    refund: { emoji: '↩️', label: 'Refund' },
    bonus: { emoji: '✨', label: 'Bonus' },
    referral: { emoji: '👥', label: 'Referral Reward' },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </Link>
              <AnimatedLogo size="sm" />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
              <Coins className="w-5 h-5 text-secondary" />
              <span className="font-tech font-bold text-secondary">
                {creditWallet?.balance?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
              Credits Store
            </h1>
            <p className="text-muted-foreground">
              Buy credits for prints • Redeem gift cards • Track your balance
            </p>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlowCard className="p-6" variant="teal">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/20">
                    <Coins className="w-10 h-10 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Your Balance</div>
                    <div className="text-4xl font-tech font-bold text-foreground">
                      {creditWallet?.balance?.toLocaleString() || 0} <span className="text-lg text-muted-foreground">credits</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ≈ ${((creditWallet?.balance || 0) * 0.25).toFixed(2)} CAD value
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                  <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Lifetime Earned</div>
                    <div className="font-tech font-bold text-success">{creditWallet?.lifetime_earned?.toLocaleString() || 0}</div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Lifetime Spent</div>
                    <div className="font-tech font-bold text-primary">{creditWallet?.lifetime_spent?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['buy', 'redeem', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab === 'buy' && 'Buy Credits'}
                {tab === 'redeem' && 'Redeem Code'}
                {tab === 'history' && 'History'}
              </button>
            ))}
          </div>

          {/* Buy Credits */}
          {activeTab === 'buy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Credit Packages */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-secondary" />
                  Credit Packages
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {creditPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.credits}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlowCard 
                        className={`p-5 relative cursor-pointer transition-all hover:border-secondary ${
                          pkg.popular ? 'border-secondary ring-2 ring-secondary/30' : ''
                        }`}
                        variant={pkg.popular ? 'teal' : undefined}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                            BEST VALUE
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-3xl font-tech font-bold text-foreground">
                            {pkg.credits}
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">credits</div>
                          
                          {pkg.bonus > 0 && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium mb-3">
                              <Sparkles className="w-3 h-3" />
                              +{pkg.bonus} bonus
                            </div>
                          )}
                          
                          <div className="text-2xl font-bold text-secondary mb-1">
                            ${pkg.price} <span className="text-sm text-muted-foreground">CAD</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${(pkg.price / (pkg.credits + pkg.bonus)).toFixed(2)}/credit
                          </div>
                        </div>
                        
                        <NeonButton 
                          size="sm" 
                          className="w-full mt-4"
                          variant={pkg.popular ? 'primary' : 'secondary'}
                        >
                          Select
                        </NeonButton>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  Payment Methods
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <GlowCard 
                      key={method.id}
                      className={`p-5 cursor-pointer transition-all ${
                        method.available 
                          ? 'hover:border-secondary' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-secondary/20">
                          <method.icon className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                        {method.available ? (
                          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
                        ) : (
                          <span className="text-xs text-muted-foreground ml-auto">Soon</span>
                        )}
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <GlowCard className="p-5 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Gift Card Trade Program</h4>
                    <p className="text-sm text-muted-foreground">
                      Have unused gift cards? We accept Amazon, Steam, PlayStation, Xbox, and more! 
                      Trade them for print credits at competitive rates. Contact us to start.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Redeem */}
          {activeTab === 'redeem' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlowCard className="p-8 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="p-4 rounded-2xl bg-primary/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Gift className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Redeem Gift Card</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your 3D3D gift card code below
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="giftcard" className="text-foreground">Gift Card Code</Label>
                    <Input
                      id="giftcard"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX-XXXX"
                      className="bg-input border-border text-center font-mono text-lg tracking-wider"
                      maxLength={14}
                    />
                  </div>

                  <NeonButton 
                    onClick={handleRedeemGiftCard}
                    disabled={redeeming || !giftCardCode.trim()}
                    className="w-full"
                  >
                    {redeeming ? 'Redeeming...' : 'Redeem Code'}
                  </NeonButton>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlowCard className="p-6">
                <div className="space-y-3">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {transactionTypeLabels[tx.type]?.emoji || '💫'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tx.description || transactionTypeLabels[tx.type]?.label}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(tx.created_at).toLocaleDateString('en-CA', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-tech font-bold ${tx.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No credit transactions yet</p>
                      <p className="text-sm">Buy some credits to get started!</p>
                    </div>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreditsStore;
