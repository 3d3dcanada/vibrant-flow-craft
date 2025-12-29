import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Gift, Send, Users, Check, Copy, Sparkles,
  CreditCard, Mail, Calendar
} from 'lucide-react';

const GiftCards = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user's purchased gift cards
  const { data: myGiftCards, isLoading } = useQuery({
    queryKey: ['my_gift_cards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .or(`purchased_by.eq.${user.id},redeemed_by.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handlePurchase = async () => {
    if (!selectedAmount) {
      toast({ title: "Error", description: "Please select an amount", variant: "destructive" });
      return;
    }

    setPurchasing(true);
    // Simulated - would integrate with payment system
    setTimeout(() => {
      toast({ 
        title: "Coming Soon!", 
        description: "Gift card purchases will be available soon. Contact us to order now!",
      });
      setPurchasing(false);
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

  const giftCardOptions = [
    { price: 25, credits: 100, bonus: 0 },
    { price: 50, credits: 200, bonus: 10 },
    { price: 100, credits: 400, bonus: 40 },
    { price: 200, credits: 800, bonus: 100 },
  ];

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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 mb-4">
              <Gift className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
              Gift Cards
            </h1>
            <p className="text-muted-foreground">
              Give the gift of 3D printing! Perfect for makers, creators, and hobbyists.
            </p>
          </motion.div>

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                Purchase a Gift Card
              </h3>

              {/* Amount Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {giftCardOptions.map((option) => (
                  <button
                    key={option.price}
                    onClick={() => setSelectedAmount(option.price)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAmount === option.price
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-secondary/50'
                    }`}
                  >
                    <div className="text-2xl font-tech font-bold text-foreground">
                      ${option.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{option.credits} credits</div>
                    {option.bonus > 0 && (
                      <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        +{option.bonus} bonus
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Recipient */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Recipient Email (optional)
                  </label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to receive the gift card yourself
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Personal Message (optional)
                  </label>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy Birthday! Enjoy printing!"
                    className="bg-input border-border"
                    maxLength={100}
                  />
                </div>
              </div>

              <NeonButton 
                onClick={handlePurchase}
                disabled={!selectedAmount || purchasing}
                className="w-full"
              >
                {purchasing ? 'Processing...' : selectedAmount ? `Purchase $${selectedAmount} Gift Card` : 'Select an Amount'}
              </NeonButton>
            </GlowCard>
          </motion.div>

          {/* My Gift Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-secondary" />
              Your Gift Cards
            </h3>

            {myGiftCards && myGiftCards.length > 0 ? (
              <div className="space-y-4">
                {myGiftCards.map((card: any) => (
                  <GlowCard key={card.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${card.is_redeemed ? 'bg-muted' : 'bg-purple-500/20'}`}>
                          <Gift className={`w-6 h-6 ${card.is_redeemed ? 'text-muted-foreground' : 'text-purple-500'}`} />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {card.credits_value} Credits • ${card.price_cad} CAD
                          </div>
                          <div className="text-sm font-mono text-secondary">
                            {card.code}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(card.created_at).toLocaleDateString('en-CA')}
                            {card.redeemed_by === user?.id && ' • Received'}
                            {card.purchased_by === user?.id && card.redeemed_by !== user?.id && ' • Purchased'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {card.is_redeemed ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                            <Check className="w-4 h-4" />
                            Redeemed
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(card.code);
                              toast({ title: "Copied!", description: "Gift card code copied to clipboard" });
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm hover:bg-secondary/30 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </button>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            ) : (
              <GlowCard className="p-8 text-center">
                <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No gift cards yet</p>
                <p className="text-sm text-muted-foreground">Purchase one above or redeem a code you received!</p>
              </GlowCard>
            )}
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <GlowCard className="p-5 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Perfect for Groups & Events</h4>
                  <p className="text-sm text-muted-foreground">
                    Ordering 5+ gift cards? Contact us for bulk discounts! Great for makerspaces, 
                    schools, birthday parties, and corporate gifts.
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default GiftCards;
