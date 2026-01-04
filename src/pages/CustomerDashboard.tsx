import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useSubscription, useCreditWallet, usePointWallet, useReferralCode, usePointTransactions } from '@/hooks/useUserData';
import { useUserPrintRequests } from '@/hooks/useCustomerData';
import { Button } from '@/components/ui/button';
import { RepositoryDrawer } from '@/components/repositories/RepositoryDrawer';
import { 
  Coins, Recycle, Gift, Sparkles, Crown, Zap, Star, Package, FileText, Search,
  CreditCard, Lightbulb, Box, Layers, Target, Shield, Copy, Check,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCad, CAD_PER_CREDIT } from '@/config/credits';

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

  const copyReferralCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tierColors = {
    free: 'text-neutral-light',
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

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-xlight">
              Welcome, {profile?.full_name || 'there'}!
            </h1>
            <p className="text-neutral-light mt-1">
              Your 3D printing dashboard
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${subscription?.tier === 'pro' ? 'border-primary bg-primary/10' : subscription?.tier === 'maker' ? 'border-secondary bg-secondary/10' : 'border-neutral-dark bg-neutral-dark/50'}`}>
            {tierIcons[subscription?.tier || 'free']}
            <span className={`font-semibold capitalize ${tierColors[subscription?.tier || 'free']}`}>
              {subscription?.tier || 'Free'} Plan
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-5">
          <Coins className="w-6 h-6 text-primary mb-2" />
          <div className="text-3xl font-bold">{creditWallet?.balance?.toLocaleString() || 0}</div>
          <div className="text-sm text-neutral-light">Credits Balance</div>
        </div>
        <div className="glass-card p-5">
          <Sparkles className="w-6 h-6 text-secondary mb-2" />
          <div className="text-3xl font-bold">{pointWallet?.balance?.toLocaleString() || 0}</div>
          <div className="text-sm text-neutral-light">Reward Points</div>
        </div>
        <div className="glass-card p-5">
          <FileText className="w-6 h-6 text-yellow-500 mb-2" />
          <div className="text-3xl font-bold">{activeRequests}</div>
          <div className="text-sm text-neutral-light">Active Requests</div>
        </div>
        <div className="glass-card p-5">
          <Package className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-3xl font-bold">{completedPrints}</div>
          <div className="text-sm text-neutral-light">Completed Prints</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold font-display text-neutral-xlight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/#quote" className="glass-card p-4 text-center hover:border-primary/80 transition-colors">
            <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold">Get a Quote</div>
          </Link>
          <button onClick={() => setRepositoryOpen(true)} className="glass-card p-4 text-center hover:border-primary/80 transition-colors">
            <Search className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold">Find a Model</div>
          </button>
          <Link to="/dashboard/credits" className="glass-card p-4 text-center hover:border-primary/80 transition-colors">
            <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold">Buy Credits</div>
          </Link>
          <Link to="/dashboard/gift-cards" className="glass-card p-4 text-center hover:border-primary/80 transition-colors">
            <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold">Redeem Code</div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold font-display text-neutral-xlight mb-4">My Print Requests</h3>
          {requestsLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {printRequests?.slice(0, 5).map((req: any) => (
                <div key={req.id} className="flex justify-between items-center bg-neutral-dark/50 p-3 rounded-lg">
                  <div>{req.specs?.material || 'Print Request'}</div>
                  <div className="text-sm text-neutral-light">{req.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold font-display text-neutral-xlight mb-4">Rewards & Recycling</h3>
          <div className="space-y-4">
            <div className="bg-neutral-dark/50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Referral Code</span>
                <Button variant="ghost" size="sm" onClick={copyReferralCode}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <code className="text-lg font-mono text-secondary">{referralCode?.code || 'LOADING...'}</code>
            </div>
            <Link to="/dashboard/recycling" className="block bg-green-500/10 p-3 rounded-lg hover:bg-green-500/20">
              Recycle Prints & Earn Points
            </Link>
          </div>
        </div>
      </div>
      <RepositoryDrawer isOpen={repositoryOpen} onClose={() => setRepositoryOpen(false)} />
    </div>
  );
};

export default CustomerDashboard;
