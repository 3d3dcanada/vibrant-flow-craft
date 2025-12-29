import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePointWallet, usePointTransactions, useReferralCode, useReferrals, useUserAchievements } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Sparkles, Flame, Users, Trophy, Gift, Recycle,
  Copy, Check, Share2, TrendingUp, Star, Zap, Target, Award,
  ExternalLink, ChevronRight, Calendar
} from 'lucide-react';

const RewardsCenter = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'earn' | 'history'>('earn');

  const { data: pointWallet, isLoading } = usePointWallet();
  const { data: referralCode } = useReferralCode();
  const { data: referrals } = useReferrals();
  const { data: transactions } = usePointTransactions(20);
  const { data: userAchievements } = useUserAchievements();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const copyReferralCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
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

  const earnOpportunities = [
    { 
      icon: Users, 
      title: 'Refer a Friend', 
      points: 500, 
      description: 'Share your code, earn when they sign up',
      action: () => copyReferralCode(),
      color: 'text-primary',
      bgColor: 'bg-primary/20'
    },
    { 
      icon: Recycle, 
      title: 'Recycle Prints', 
      points: '1/gram', 
      description: 'Drop off old prints at partner locations',
      link: '/dashboard/recycling',
      color: 'text-success',
      bgColor: 'bg-success/20'
    },
    { 
      icon: Star, 
      title: 'Complete Profile', 
      points: 250, 
      description: 'Fill in all your profile details',
      link: '/dashboard/settings',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20'
    },
    { 
      icon: Award, 
      title: 'Upload a Model', 
      points: 100, 
      description: 'Share your 3D designs with the community',
      link: '/dashboard/community',
      color: 'text-accent',
      bgColor: 'bg-accent/20'
    },
    { 
      icon: Target, 
      title: 'Daily Check-in', 
      points: 10, 
      description: 'Visit daily to maintain your streak',
      color: 'text-warning',
      bgColor: 'bg-warning/20'
    },
    { 
      icon: Trophy, 
      title: 'Unlock Achievements', 
      points: 'Varies', 
      description: 'Complete milestones for bonus points',
      link: '/dashboard/achievements',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20'
    },
  ];

  const activityTypeLabels: Record<string, string> = {
    signup_bonus: '🎉 Welcome Bonus',
    referral: '👥 Referral Reward',
    recycling: '♻️ Recycling',
    achievement: '🏆 Achievement',
    daily_checkin: '📅 Daily Check-in',
    profile_complete: '✅ Profile Complete',
    model_upload: '📤 Model Upload',
    redemption: '🎁 Points Redemption',
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
                Rewards Center
              </h1>
              <p className="text-muted-foreground">
                Earn points, unlock rewards, and level up your 3D printing journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Balance */}
              <GlowCard className="p-6 text-center" variant="magenta">
                <div className="p-4 rounded-full bg-primary/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-tech font-bold text-foreground mb-1">
                  {pointWallet?.balance?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Available Points</div>
                <div className="mt-4">
                  <NeonButton size="sm" className="w-full">
                    Redeem Points
                  </NeonButton>
                </div>
              </GlowCard>

              {/* Streak */}
              <GlowCard className="p-6 text-center" variant="teal">
                <div className="p-4 rounded-full bg-orange-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-4xl font-tech font-bold text-foreground mb-1">
                  {pointWallet?.current_streak_days || 0}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Best: {pointWallet?.longest_streak_days || 0} days
                </div>
              </GlowCard>

              {/* Lifetime */}
              <GlowCard className="p-6 text-center">
                <div className="p-4 rounded-full bg-success/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <div className="text-4xl font-tech font-bold text-foreground mb-1">
                  {pointWallet?.lifetime_earned?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Lifetime Earned</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Redeemed: {pointWallet?.lifetime_redeemed?.toLocaleString() || 0}
                </div>
              </GlowCard>
            </div>
          </motion.div>

          {/* Referral Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlowCard className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Share & Earn 500 Points!</h3>
                    <p className="text-sm text-muted-foreground">
                      {referrals?.length || 0} friends referred • {referrals?.filter((r: any) => r.status === 'converted').length || 0} converted
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex-1 md:flex-initial flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-primary/20">
                    <code className="font-mono text-secondary text-lg font-bold">
                      {referralCode?.code || 'LOADING...'}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </div>
                  <button className="p-3 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors">
                    <Share2 className="w-5 h-5 text-[#1DA1F2]" />
                  </button>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('earn')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'earn' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Ways to Earn
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Point History
            </button>
          </div>

          {/* Content */}
          {activeTab === 'earn' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {earnOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlowCard className="p-5 h-full hover:border-secondary/50 transition-all group cursor-pointer">
                    {opportunity.link ? (
                      <Link to={opportunity.link} className="block">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-3 rounded-xl ${opportunity.bgColor}`}>
                            <opportunity.icon className={`w-6 h-6 ${opportunity.color}`} />
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-tech font-bold text-secondary">
                              +{opportunity.points}
                            </span>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">
                          {opportunity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.description}
                        </p>
                      </Link>
                    ) : (
                      <div onClick={opportunity.action}>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-3 rounded-xl ${opportunity.bgColor}`}>
                            <opportunity.icon className={`w-6 h-6 ${opportunity.color}`} />
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-tech font-bold text-secondary">
                              +{opportunity.points}
                            </span>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">
                          {opportunity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.description}
                        </p>
                      </div>
                    )}
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
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
                            {activityTypeLabels[tx.activity_type]?.split(' ')[0] || '💫'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tx.description}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(tx.created_at).toLocaleDateString('en-CA', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-tech font-bold ${tx.points > 0 ? 'text-success' : 'text-destructive'}`}>
                          {tx.points > 0 ? '+' : ''}{tx.points}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No point activity yet</p>
                      <p className="text-sm">Start earning by completing tasks above!</p>
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

export default RewardsCenter;
