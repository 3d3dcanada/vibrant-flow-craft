import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useSubscription, useCreditWallet, usePointWallet, useReferralCode, usePointTransactions } from '@/hooks/useUserData';
import { useUserPrintRequests, useUserQuotes, useUserOrders } from '@/hooks/useCustomerData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { RepositoryDrawer } from '@/components/repositories/RepositoryDrawer';
import {
  Coins, Recycle, Gift, Settings, LogOut,
  Sparkles, Crown, Zap, Star, Package, FileText, Search,
  CreditCard, Lightbulb, Box, Layers, Target, Shield, Copy, Check,
  Loader2, ShoppingBag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCad, CAD_PER_CREDIT } from '@/config/credits';

type PrintRequestSummary = {
  id: string;
  created_at: string;
  status: string;
  specs?: { material?: string | null } | null;
};

type PointActivity = {
  id: string;
  description: string;
  points: number;
};

const CustomerDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [repositoryOpen, setRepositoryOpen] = useState(false);

  const { data: profile } = useProfile();
  const { data: subscription } = useSubscription();
  const { data: creditWallet } = useCreditWallet();
  const { data: pointWallet } = usePointWallet();
  const { data: referralCode } = useReferralCode();
  const { data: recentActivity } = usePointTransactions(5);
  const { data: printRequests, isLoading: requestsLoading } = useUserPrintRequests();
  const { data: quotes, isLoading: quotesLoading } = useUserQuotes(5);
  const { data: orders, isLoading: ordersLoading } = useUserOrders(5);

  const handleSignOut = async () => {
    await signOut();
  };

  const copyReferralCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tierColors = {
    free: 'text-muted-foreground',
    maker: 'text-secondary',
    pro: 'text-primary'
  };

  const tierIcons = {
    free: <Star className="w-5 h-5" />,
    maker: <Zap className="w-5 h-5" />,
    pro: <Crown className="w-5 h-5" />
  };

  const activeRequests = printRequests?.filter(r =>
    ['pending', 'claimed', 'quoted', 'accepted'].includes(r.status)
  )?.length || 0;

  const completedPrints = printRequests?.filter(r => r.status === 'accepted')?.length || 0;

  const beginnerGuides = [
    { icon: Box, title: "Material Choice", tip: "PLA for beginners, PETG for durability, TPU for flex" },
    { icon: Layers, title: "Infill", tip: "20% for decor, 50%+ for functional parts" },
    { icon: Target, title: "Supports", tip: "Overhangs > 45° need supports" },
    { icon: Shield, title: "Tolerance", tip: "Add 0.2-0.4mm for moving parts" },
  ];

  const getOrderStatusLabel = (status: string) => {
    if (status === 'awaiting_payment') return 'Payment needed';
    if (status === 'paid' || status === 'in_production') return 'In production';
    if (status === 'shipped') return 'Shipped (tracking available)';
    if (status === 'delivered') return 'Delivered';
    return status.replace(/_/g, ' ');
  };

  const getOrderStatusStyles = (status: string) => {
    if (status === 'awaiting_payment' || status === 'pending_payment') {
      return 'bg-warning/20 text-warning';
    }
    if (status === 'paid' || status === 'in_production' || status === 'shipped') {
      return 'bg-secondary/20 text-secondary';
    }
    if (status === 'delivered') {
      return 'bg-success/20 text-success';
    }
    if (status === 'cancelled') {
      return 'bg-destructive/20 text-destructive';
    }
    return 'bg-muted/20 text-muted-foreground';
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

            <div className="flex items-center gap-4">
              <Link to="/dashboard/settings">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-tech font-bold text-foreground">
                  Welcome back, {profile?.full_name || 'there'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your 3D printing dashboard
                </p>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${subscription?.tier === 'pro' ? 'border-primary bg-primary/10' : subscription?.tier === 'maker' ? 'border-secondary bg-secondary/10' : 'border-muted bg-muted/10'}`}>
                {tierIcons[subscription?.tier || 'free']}
                <span className={`font-semibold capitalize ${tierColors[subscription?.tier || 'free']}`}>
                  {subscription?.tier || 'Free'} Plan
                </span>
              </div>
            </div>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <GlowCard className="p-5" variant="teal">
                <div className="flex items-center justify-between mb-2">
                  <Coins className="w-6 h-6 text-secondary" />
                  <span className="text-[10px] text-muted-foreground">{formatCad(CAD_PER_CREDIT)}/cr</span>
                </div>
                <div className="text-2xl font-tech font-bold text-foreground">{creditWallet?.balance?.toLocaleString() || 0}</div>
                <div className="text-xs text-muted-foreground">Credits Balance</div>
              </GlowCard>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <GlowCard className="p-5" variant="magenta">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-tech font-bold text-foreground">{pointWallet?.balance?.toLocaleString() || 0}</div>
                <div className="text-xs text-muted-foreground">Reward Points</div>
              </GlowCard>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <GlowCard className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-6 h-6 text-warning" />
                </div>
                <div className="text-2xl font-tech font-bold text-foreground">{activeRequests}</div>
                <div className="text-xs text-muted-foreground">Active Requests</div>
              </GlowCard>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <GlowCard className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-tech font-bold text-foreground">{completedPrints}</div>
                <div className="text-xs text-muted-foreground">Completed Prints</div>
              </GlowCard>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-lg font-tech font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link to="/#quote">
                <GlowCard className="p-4 hover:border-secondary/50 transition-colors cursor-pointer h-full">
                  <FileText className="w-8 h-8 text-secondary mb-2" />
                  <div className="font-medium text-foreground">Get a Quote</div>
                  <div className="text-xs text-muted-foreground">Upload & price your model</div>
                </GlowCard>
              </Link>

              <GlowCard
                className="p-4 hover:border-secondary/50 transition-colors cursor-pointer h-full"
                onClick={() => setRepositoryOpen(true)}
              >
                <Search className="w-8 h-8 text-primary mb-2" />
                <div className="font-medium text-foreground">Find a Model</div>
                <div className="text-xs text-muted-foreground">Browse repositories</div>
              </GlowCard>

              <Link to="/dashboard/credits">
                <GlowCard className="p-4 hover:border-secondary/50 transition-colors cursor-pointer h-full">
                  <CreditCard className="w-8 h-8 text-secondary mb-2" />
                  <div className="font-medium text-foreground">Buy Credits</div>
                  <div className="text-xs text-muted-foreground">Top up your balance</div>
                </GlowCard>
              </Link>

              <Link to="/dashboard/gift-cards">
                <GlowCard className="p-4 hover:border-secondary/50 transition-colors cursor-pointer h-full">
                  <Gift className="w-8 h-8 text-purple-500 mb-2" />
                  <div className="font-medium text-foreground">Redeem Code</div>
                  <div className="text-xs text-muted-foreground">Gift cards & coupons</div>
                </GlowCard>
              </Link>
              <Link to="/dashboard/customer#my-orders">
                <GlowCard className="p-4 hover:border-secondary/50 transition-colors cursor-pointer h-full">
                  <Package className="w-8 h-8 text-secondary mb-2" />
                  <div className="font-medium text-foreground">My Orders</div>
                  <div className="text-xs text-muted-foreground">Track fulfillment and shipping.</div>
                </GlowCard>
              </Link>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* My Requests */}
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <GlowCard className="p-6 h-full">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  My Print Requests
                </h3>

                {requestsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                  </div>
                ) : printRequests && printRequests.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {printRequests.slice(0, 5).map((request: PrintRequestSummary) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {request.specs?.material || 'Print Request'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString('en-CA')}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${request.status === 'pending' ? 'bg-warning/20 text-warning' :
                          request.status === 'claimed' ? 'bg-secondary/20 text-secondary' :
                            request.status === 'accepted' ? 'bg-success/20 text-success' :
                              'bg-muted/20 text-muted-foreground'
                          }`}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No requests yet</p>
                    <Link to="/#quote" className="text-secondary text-sm hover:underline">
                      Submit your first quote
                    </Link>
                  </div>
                )}
              </GlowCard>
            </div>

            {/* Rewards & Recycling */}
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <GlowCard className="p-6 h-full">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-green-500" />
                  Rewards & Recycling
                </h3>

                <div className="space-y-4">
                  {/* Referral Code */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">Your Referral Code</span>
                      <span className="text-[10px] text-muted-foreground">500 pts per referral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-secondary text-lg bg-background/50 px-3 py-2 rounded">
                        {referralCode?.code || 'LOADING...'}
                      </code>
                      <button
                        onClick={copyReferralCode}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  {/* Recycling CTA */}
                  <Link to="/dashboard/recycling">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Recycle className="w-6 h-6 text-green-500" />
                        <div>
                          <div className="font-medium text-foreground">Recycle Prints</div>
                          <div className="text-xs text-muted-foreground">1 point per gram recycled</div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Recent Points Activity */}
                  {recentActivity && recentActivity.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</div>
                      <div className="space-y-1">
                        {recentActivity.slice(0, 3).map((activity: PointActivity) => (
                          <div key={activity.id} className="flex justify-between text-xs">
                            <span className="text-muted-foreground truncate">{activity.description}</span>
                            <span className={activity.points > 0 ? 'text-green-500' : 'text-red-500'}>
                              {activity.points > 0 ? '+' : ''}{activity.points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlowCard>
            </div>
          </div>

          {/* My Quotes Section */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '550ms' }}>
            <GlowCard className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                My Saved Quotes
              </h3>

              {quotesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                </div>
              ) : quotes && quotes.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {quotes.map((quote) => {
                    const isExpired = new Date(quote.expires_at) < new Date();
                    return (
                      <Link
                        key={quote.id}
                        to={`/quote`}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-secondary/30 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {quote.material.replace('_', ' ')} × {quote.quantity}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${quote.total_cad.toFixed(2)} CAD • {new Date(quote.created_at).toLocaleDateString('en-CA')}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isExpired ? 'bg-destructive/20 text-destructive' :
                          quote.status === 'active' ? 'bg-success/20 text-success' :
                            quote.status === 'ordered' ? 'bg-secondary/20 text-secondary' :
                              'bg-muted/20 text-muted-foreground'
                          }`}>
                          {isExpired ? 'Expired' : quote.status}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No quotes yet</p>
                  <Link to="/quote" className="text-secondary text-sm hover:underline">
                    Get your first quote
                  </Link>
                </div>
              )}
            </GlowCard>
          </div>

          {/* My Orders Section */}
          <div id="my-orders" className="mb-8 animate-fade-in" style={{ animationDelay: '575ms' }}>
            <GlowCard className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                My Orders
              </h3>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-background/50 border border-primary/10"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate font-mono">
                          {order.order_number}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${order.total_cad.toFixed(2)} CAD • {new Date(order.created_at).toLocaleDateString('en-CA')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getOrderStatusStyles(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                        <Link to={`/order/${order.id}`}>
                          <NeonButton size="sm" variant="secondary">
                            Track
                          </NeonButton>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                  <div className="mt-4 flex justify-center">
                    <Link to="/quote">
                      <NeonButton variant="primary">Get a Quote</NeonButton>
                    </Link>
                  </div>
                </div>
              )}
            </GlowCard>
          </div>

          {/* Beginner Guidance */}
          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <GlowCard className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                New to 3D Printing?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {beginnerGuides.map((guide, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-secondary/30 transition-colors"
                  >
                    <guide.icon className="w-6 h-6 text-secondary mb-2" />
                    <div className="font-medium text-foreground text-sm mb-1">{guide.title}</div>
                    <div className="text-xs text-muted-foreground">{guide.tip}</div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        </main>
      </div>

      <RepositoryDrawer isOpen={repositoryOpen} onClose={() => setRepositoryOpen(false)} />
    </div>
  );
};

export default CustomerDashboard;
