import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCreditWallet, useCreditTransactions } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Coins, Gift, Wallet, Shield, ExternalLink,
  CheckCircle, ArrowRight, Sparkles, Calendar, Info,
  AlertTriangle, HelpCircle, Clock, FileText
} from 'lucide-react';
import { creditsToCad, formatCredits, formatCad, CAD_PER_CREDIT } from '@/config/credits';

type CreditTransaction = {
  id: string;
  type: string;
  amount: number;
  description?: string | null;
  created_at: string;
  balance_after?: number | null;
};

/**
 * Anycard Integration Configuration
 * 
 * Anycard (anycard.ca) is a Canadian gift card platform offering:
 * - White-label gift card issuance
 * - Rewards API for automated delivery
 * - Multi-brand gift card catalog
 * - Enterprise-grade redemption infrastructure
 * 
 * Integration Model (Phase 3D):
 * - 3D3D purchases gift cards FROM Anycard (as B2B client)
 * - Users buy 3D3D gift cards via Anycard's hosted storefront
 * - Users redeem codes on 3D3D platform → credits added
 * - 3D3D never handles card data directly
 */
const ANYCARD_CONFIG = {
  // Where users purchase 3D3D gift cards
  purchaseUrl: 'https://anycard.ca/brands/3d3d', // Placeholder - would be real partner URL
  supportEmail: 'credits@3d3d.ca',
  // Code format: XXXX-XXXX-XXXX (standard gift card format)
  codePattern: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  codeFormatHint: 'XXXX-XXXX-XXXX',
};

/**
 * Credits Economy Terms (Industry Standard)
 * Modeled after: Steam Wallet, Apple Gift Cards, Amazon Balance
 */
const CREDITS_TERMS = {
  nonRefundable: true,
  noCashValue: true,
  nonTransferable: true,
  noExpiry: true, // Credits never expire
  denomination: '1 credit = $0.10 CAD',
  minimumRedemption: 50, // $5 minimum
};

const CreditsStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'buy' | 'redeem' | 'history' | 'terms'>('buy');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const { data: creditWallet, isLoading, refetch: refetchWallet } = useCreditWallet();
  const { data: transactions, refetch: refetchTransactions } = useCreditTransactions(50);

  // Check for success/error params from external flows
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({
        title: "Purchase Complete!",
        description: "Your gift card has been issued. Enter the code below to add credits."
      });
    } else if (status === 'cancelled') {
      toast({
        title: "Purchase Cancelled",
        description: "Your gift card purchase was cancelled.",
        variant: "destructive"
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Format code as user types (XXXX-XXXX-XXXX)
  const handleCodeChange = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Add dashes every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
    // Limit to 14 characters (XXXX-XXXX-XXXX)
    setGiftCardCode(formatted.slice(0, 14));
    setRedeemError(null);
  };

  const handleRedeemGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setRedeemError("Please enter a gift card code");
      return;
    }

    // Validate format
    if (!ANYCARD_CONFIG.codePattern.test(giftCardCode)) {
      setRedeemError(`Invalid format. Expected: ${ANYCARD_CONFIG.codeFormatHint}`);
      return;
    }

    setRedeeming(true);
    setRedeemError(null);

    try {
      const { data, error } = await supabase.rpc('redeem_gift_card', {
        p_code: giftCardCode.trim()
      });

      if (error) throw error;

      const result = data as {
        success: boolean;
        error?: string;
        credits_value?: number;
        new_balance?: number;
        message?: string;
      };

      if (!result.success) {
        // Map error codes to user-friendly messages
        let errorMessage = result.error || "Unable to redeem gift card";
        if (result.error?.includes('not found')) {
          errorMessage = "This code is not valid. Please check and try again.";
        } else if (result.error?.includes('already been redeemed')) {
          errorMessage = "This gift card has already been used.";
        } else if (result.error?.includes('expired')) {
          errorMessage = "This gift card has expired.";
        }
        setRedeemError(errorMessage);
      } else {
        toast({
          title: "Credits Added!",
          description: `+${result.credits_value?.toLocaleString()} credits added to your balance.`,
        });
        setGiftCardCode('');
        // Refresh wallet and transaction data
        refetchWallet();
        refetchTransactions();
      }
    } catch (error: unknown) {
      console.error('Redemption error:', error);
      setRedeemError("Service temporarily unavailable. Please try again later.");
    } finally {
      setRedeeming(false);
    }
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

  // Transaction type labels for history display
  const transactionTypeLabels: Record<string, { emoji: string; label: string; color: string }> = {
    purchase: { emoji: '💳', label: 'Purchase', color: 'text-success' },
    gift_card: { emoji: '🎁', label: 'Gift Card', color: 'text-success' },
    print_payment: { emoji: '🖨️', label: 'Print Order', color: 'text-destructive' },
    spend: { emoji: '📦', label: 'Order Payment', color: 'text-destructive' },
    refund: { emoji: '↩️', label: 'Refund', color: 'text-success' },
    bonus: { emoji: '✨', label: 'Bonus', color: 'text-success' },
    referral: { emoji: '👥', label: 'Referral Reward', color: 'text-success' },
    subscription_credit: { emoji: '⭐', label: 'Subscription', color: 'text-success' },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/customer">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </Link>
              <AnimatedLogo size="sm" />
              <span className="text-lg font-tech font-bold text-foreground hidden sm:inline">
                Credits
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
              <Coins className="w-5 h-5 text-secondary" />
              <span className="font-tech font-bold text-secondary">
                {creditWallet?.balance?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">credits</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
              Platform Credits
            </h1>
            <p className="text-muted-foreground">
              Your stored value for 3D printing orders
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
                      {formatCredits(creditWallet?.balance || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ≈ {formatCad(creditsToCad(creditWallet?.balance || 0))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                  <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Lifetime Earned</div>
                    <div className="font-tech font-bold text-success">
                      +{creditWallet?.lifetime_earned?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Lifetime Spent</div>
                    <div className="font-tech font-bold text-primary">
                      -{creditWallet?.lifetime_spent?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['buy', 'redeem', 'history', 'terms'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {tab === 'buy' && '🛒 Buy Credits'}
                {tab === 'redeem' && '🎁 Redeem Code'}
                {tab === 'history' && '📜 History'}
                {tab === 'terms' && '📋 Terms'}
              </button>
            ))}
          </div>

          {/* Buy Credits Tab */}
          {activeTab === 'buy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* How It Works */}
              <GlassPanel variant="elevated" className="border-secondary/30">
                <h3 className="font-tech font-bold text-foreground mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-secondary" />
                  How to Buy Credits
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-3xl mb-2">1️⃣</div>
                    <p className="font-medium text-foreground mb-1">Purchase Gift Card</p>
                    <p className="text-sm text-muted-foreground">
                      Buy a 3D3D gift card from our partner Anycard using your debit or credit card
                    </p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-3xl mb-2">2️⃣</div>
                    <p className="font-medium text-foreground mb-1">Receive Code</p>
                    <p className="text-sm text-muted-foreground">
                      Get your unique gift card code instantly via email
                    </p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-3xl mb-2">3️⃣</div>
                    <p className="font-medium text-foreground mb-1">Redeem Here</p>
                    <p className="text-sm text-muted-foreground">
                      Enter the code in the Redeem tab to add credits to your account
                    </p>
                  </div>
                </div>
              </GlassPanel>

              {/* Purchase Button */}
              <GlowCard className="p-6" variant="teal">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-tech font-bold text-xl text-foreground mb-2">
                      Buy 3D3D Gift Cards
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Purchase gift cards from our official partner. Pay with any debit or credit card through their secure checkout.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Available denominations: $5, $10, $25, $50, $100, $250 CAD
                    </p>
                  </div>
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => window.open(ANYCARD_CONFIG.purchaseUrl, '_blank')}
                    className="whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy Gift Card
                  </NeonButton>
                </div>
              </GlowCard>

              {/* Alternative Methods */}
              <GlassPanel variant="elevated">
                <h3 className="font-tech font-bold text-foreground mb-4">
                  Other Ways to Get Credits
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="w-6 h-6 text-primary" />
                      <span className="font-medium text-foreground">Gift Card Trade</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Have unused gift cards from other retailers? Contact us to trade them for 3D3D credits at competitive rates.
                    </p>
                    <a
                      href={`mailto:${ANYCARD_CONFIG.supportEmail}?subject=Gift Card Trade Inquiry`}
                      className="text-sm text-secondary hover:underline mt-2 inline-block"
                    >
                      Contact: {ANYCARD_CONFIG.supportEmail}
                    </a>
                  </div>
                  <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-6 h-6 text-warning" />
                      <span className="font-medium text-foreground">Earn Credits</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Refer friends, complete achievements, and participate in promotions to earn bonus credits.
                    </p>
                    <Link
                      to="/dashboard/customer"
                      className="text-sm text-secondary hover:underline mt-2 inline-block"
                    >
                      View your dashboard →
                    </Link>
                  </div>
                </div>
              </GlassPanel>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>3D3D never handles your card data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Credits never expire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>Instant redemption</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Redeem Tab */}
          {activeTab === 'redeem' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-lg mx-auto"
            >
              <GlowCard className="p-8">
                <div className="text-center mb-6">
                  <div className="p-4 rounded-2xl bg-primary/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Gift className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Redeem Gift Card</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your 3D3D gift card code to add credits
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="giftcard" className="text-foreground">Gift Card Code</Label>
                    <Input
                      id="giftcard"
                      value={giftCardCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className={`bg-input border-border text-center font-mono text-lg tracking-wider ${redeemError ? 'border-destructive' : ''
                        }`}
                      maxLength={14}
                      disabled={redeeming}
                    />
                    {redeemError && (
                      <p className="text-destructive text-sm mt-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {redeemError}
                      </p>
                    )}
                  </div>

                  <NeonButton
                    onClick={handleRedeemGiftCard}
                    disabled={redeeming || giftCardCode.length < 14}
                    className="w-full"
                  >
                    {redeeming ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Redeem Code
                      </>
                    )}
                  </NeonButton>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Need help?</p>
                      <p>
                        If your code isn't working, please ensure you're entering it exactly as shown on your gift card or email.
                        For further assistance, contact{' '}
                        <a href={`mailto:${ANYCARD_CONFIG.supportEmail}`} className="text-secondary hover:underline">
                          {ANYCARD_CONFIG.supportEmail}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlowCard className="p-6">
                <h3 className="font-tech font-bold text-foreground mb-4">
                  Credit Transaction History
                </h3>
                <div className="space-y-3">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx: CreditTransaction) => {
                      const typeInfo = transactionTypeLabels[tx.type] || {
                        emoji: '💫',
                        label: tx.type,
                        color: tx.amount > 0 ? 'text-success' : 'text-destructive'
                      };
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{typeInfo.emoji}</div>
                            <div>
                              <div className="font-medium text-foreground">
                                {tx.description || typeInfo.label}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(tx.created_at).toLocaleDateString('en-CA', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-tech font-bold ${typeInfo.color}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Balance: {tx.balance_after?.toLocaleString() || '-'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No credit transactions yet</p>
                      <p className="text-sm">Buy or redeem credits to get started!</p>
                    </div>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Terms Tab */}
          {activeTab === 'terms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassPanel variant="elevated">
                <h3 className="font-tech font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Credits Terms & Conditions
                </h3>

                <div className="space-y-6 text-sm">
                  <div>
                    <h4 className="font-bold text-foreground mb-2">1. What Are Credits?</h4>
                    <p className="text-muted-foreground">
                      3D3D Credits are a stored-value balance on your 3D3D.ca account. Credits can be used to pay for 3D printing orders,
                      model purchases, and other platform services. <strong>1 credit = $0.10 CAD</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">2. How Credits Are Obtained</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Purchasing 3D3D gift cards from authorized retailers (Anycard)</li>
                      <li>Redeeming gift card codes on this platform</li>
                      <li>Earning through referrals, promotions, or achievements</li>
                      <li>Receiving refunds for cancelled orders (credited, not cash)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">3. Non-Refundable</h4>
                    <p className="text-muted-foreground">
                      Credits are <strong>non-refundable</strong> and cannot be exchanged for cash, except where required by applicable law
                      (e.g., Quebec consumer protection regulations). Unused credits remain on your account indefinitely.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">4. Non-Transferable</h4>
                    <p className="text-muted-foreground">
                      Credits are tied to your account and <strong>cannot be transferred</strong> to another user. Gift cards (unredeemed)
                      may be given to others, but once redeemed, credits belong to the redeeming account.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">5. No Expiration</h4>
                    <p className="text-muted-foreground">
                      Credits on your 3D3D account <strong>never expire</strong>. Your balance will remain until used for purchases.
                      Note: Unredeemed gift card codes may have separate expiration terms set by the issuer.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">6. Lost or Stolen Codes</h4>
                    <p className="text-muted-foreground">
                      3D3D is not responsible for lost, stolen, or unauthorized use of gift card codes. Treat your codes like cash.
                      Once redeemed by any account, the balance is final.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">7. Fraud Prevention</h4>
                    <p className="text-muted-foreground">
                      We reserve the right to suspend accounts, void credits, or require additional verification if we suspect fraud,
                      chargebacks, or violation of these terms. Credits obtained through fraudulent means will be forfeited.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">8. Card Payments</h4>
                    <p className="text-muted-foreground">
                      3D3D does not directly process debit or credit card payments. All card transactions occur through our authorized
                      gift card partner (Anycard). 3D3D never sees, stores, or handles your card information.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Last updated: January 2026. Terms may be updated without prior notice. Continued use constitutes acceptance.
                    </p>
                  </div>
                </div>
              </GlassPanel>

              {/* Industry Comparison Note */}
              <GlassPanel variant="elevated" className="mt-6 border-secondary/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Industry-Standard Terms</p>
                    <p>
                      These terms follow the same model used by Steam Wallet, Apple Gift Cards, and Amazon Balance —
                      stored value that's non-refundable, non-transferable, and doesn't expire. This protects both you and the platform
                      from fraud and abuse.
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreditsStore;
