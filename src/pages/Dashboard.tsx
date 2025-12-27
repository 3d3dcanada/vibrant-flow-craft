import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useSubscription, useCreditWallet, usePointWallet, useReferralCode, useUserAchievements, usePointTransactions } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, Trophy, Recycle, Share2, Gift, Users, Settings, LogOut, 
  Sparkles, TrendingUp, Crown, Flame, Copy, Check, ExternalLink,
  CreditCard, Star, Zap, Package
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: subscription } = useSubscription();
  const { data: creditWallet } = useCreditWallet();
  const { data: pointWallet } = usePointWallet();
  const { data: referralCode } = useReferralCode();
  const { data: userAchievements } = useUserAchievements();
  const { data: recentActivity } = usePointTransactions(5);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const copyReferralCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <AnimatedLogo size="lg" />
        </div>
      </div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-tech font-bold text-foreground">
                  Welcome back, {profile?.full_name || 'Maker'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your 3D printing journey continues
                </p>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${subscription?.tier === 'pro' ? 'border-primary bg-primary/10' : subscription?.tier === 'maker' ? 'border-secondary bg-secondary/10' : 'border-muted bg-muted/10'}`}>
                {tierIcons[subscription?.tier || 'free']}
                <span className={`font-semibold capitalize ${tierColors[subscription?.tier || 'free']}`}>
                  {subscription?.tier || 'Free'} Plan
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Credits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlowCard className="p-6 h-full" variant="teal">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <Coins className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground">$0.25 CAD each</span>
                </div>
                <div className="text-3xl font-tech font-bold text-foreground">
                  {creditWallet?.balance?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Print Credits</div>
                <Link to="/dashboard/credits">
                  <NeonButton size="sm" className="w-full mt-4">
                    Buy Credits
                  </NeonButton>
                </Link>
              </GlowCard>
            </motion.div>

            {/* Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlowCard className="p-6 h-full" variant="magenta">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-semibold">{pointWallet?.current_streak_days || 0} day streak</span>
                  </div>
                </div>
                <div className="text-3xl font-tech font-bold text-foreground">
                  {pointWallet?.balance?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Reward Points</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Lifetime: {pointWallet?.lifetime_earned?.toLocaleString() || 0} earned
                </div>
              </GlowCard>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlowCard className="p-6 h-full" variant="magenta">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="text-3xl font-tech font-bold text-foreground">
                  {userAchievements?.length || 0}/11
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
                <Link to="/dashboard/achievements">
                  <button className="mt-4 text-sm text-secondary hover:underline flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                  </button>
                </Link>
              </GlowCard>
            </motion.div>

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlowCard className="p-6 h-full" variant="teal">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="text-3xl font-tech font-bold text-foreground">
                  {profile?.profile_completion_percent || 0}%
                </div>
                <div className="text-sm text-muted-foreground mb-3">Profile Complete</div>
                <Progress value={profile?.profile_completion_percent || 0} className="h-2" />
                {(profile?.profile_completion_percent || 0) < 100 && (
                  <p className="mt-2 text-xs text-secondary">Complete for bonus points!</p>
                )}
              </GlowCard>
            </motion.div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Referral Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlowCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Refer Friends</h3>
                    <p className="text-xs text-muted-foreground">Earn 500 points per referral</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-primary/20">
                  <code className="flex-1 font-mono text-secondary text-lg">
                    {referralCode?.code || 'LOADING...'}
                  </code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 p-2 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors">
                    <Share2 className="w-4 h-4 text-[#1DA1F2] mx-auto" />
                  </button>
                  <button className="flex-1 p-2 rounded-lg bg-[#4267B2]/20 hover:bg-[#4267B2]/30 transition-colors">
                    <Share2 className="w-4 h-4 text-[#4267B2] mx-auto" />
                  </button>
                  <button className="flex-1 p-2 rounded-lg bg-[#E4405F]/20 hover:bg-[#E4405F]/30 transition-colors">
                    <Share2 className="w-4 h-4 text-[#E4405F] mx-auto" />
                  </button>
                </div>
              </GlowCard>
            </motion.div>

            {/* Recycling Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlowCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Recycle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Recycle Prints</h3>
                    <p className="text-xs text-muted-foreground">1 point per gram recycled</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Drop off old prints at any partner location. We recycle and reward you!
                </p>
                
                <Link to="/dashboard/recycling">
                  <NeonButton variant="secondary" className="w-full">
                    Log Recycling Drop
                  </NeonButton>
                </Link>
              </GlowCard>
            </motion.div>

            {/* Gift Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlowCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Gift className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Gift Cards</h3>
                    <p className="text-xs text-muted-foreground">Give the gift of 3D printing</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-background/50 border border-primary/20 text-center">
                    <div className="text-sm font-bold text-foreground">$25</div>
                    <div className="text-xs text-muted-foreground">100 credits</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50 border border-secondary/20 text-center">
                    <div className="text-sm font-bold text-foreground">$50</div>
                    <div className="text-xs text-muted-foreground">210 credits</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50 border border-primary/20 text-center">
                    <div className="text-sm font-bold text-foreground">$100</div>
                    <div className="text-xs text-muted-foreground">440 credits</div>
                  </div>
                </div>
                
                <Link to="/dashboard/gift-cards">
                  <NeonButton variant="secondary" className="w-full">
                    Purchase Gift Card
                  </NeonButton>
                </Link>
              </GlowCard>
            </motion.div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GlowCard className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Recent Points Activity
                </h3>
                
                <div className="space-y-3">
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((activity: any, index: number) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/10">
                        <div>
                          <div className="text-sm font-medium text-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString('en-CA')}
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${activity.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {activity.points > 0 ? '+' : ''}{activity.points}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Start earning points today!</p>
                    </div>
                  )}
                </div>
              </GlowCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <GlowCard className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/" className="block">
                    <button className="w-full p-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all group">
                      <Package className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-medium text-foreground">Get Quote</div>
                    </button>
                  </Link>
                  
                  <Link to="/dashboard/orders" className="block">
                    <button className="w-full p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 transition-all group">
                      <Package className="w-6 h-6 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-medium text-foreground">My Orders</div>
                    </button>
                  </Link>
                  
                  <Link to="/dashboard/subscription" className="block">
                    <button className="w-full p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all group">
                      <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-medium text-foreground">Upgrade Plan</div>
                    </button>
                  </Link>
                  
                  <Link to="/dashboard/models" className="block">
                    <button className="w-full p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all group">
                      <Star className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-medium text-foreground">Submit Model</div>
                    </button>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          </div>

          {/* Subscription Upgrade Banner */}
          {subscription?.tier === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border border-primary/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Crown className="w-6 h-6 text-primary" />
                      Upgrade to Save Up to 25%
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Maker plan includes credits per print. Pro plan waives half admin & bed rental fees.
                    </p>
                  </div>
                  <Link to="/dashboard/subscription">
                    <NeonButton className="whitespace-nowrap">
                      View Plans
                    </NeonButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
