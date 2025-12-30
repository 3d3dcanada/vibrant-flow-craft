import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Wallet, Copy, Check, Mail, Clock, ShieldCheck,
  AlertCircle, CheckCircle2, Coins, Info
} from 'lucide-react';

const ETransferCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [step, setStep] = useState(1);

  // Get package info from URL params
  const credits = parseInt(searchParams.get('credits') || '0');
  const price = parseFloat(searchParams.get('price') || '0');
  const bonus = parseInt(searchParams.get('bonus') || '0');

  const ETRANSFER_EMAIL = "payments@3d3d.ca";
  const ORDER_ID = `3D${Date.now().toString(36).toUpperCase()}`;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (credits === 0 || price === 0) {
      navigate('/dashboard/credits');
    }
  }, [credits, price, navigate]);

  const copyEmail = () => {
    navigator.clipboard.writeText(ETRANSFER_EMAIL);
    setCopied(true);
    toast({ title: "Copied!", description: "Email address copied to clipboard" });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = () => {
    if (!senderName.trim()) {
      toast({ 
        title: "Name Required", 
        description: "Please enter the name on your bank account", 
        variant: "destructive" 
      });
      return;
    }
    
    setConfirmed(true);
    setStep(3);
    toast({
      title: "Payment Registered! 🎉",
      description: "We'll credit your account within 2 hours of receiving the transfer.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedLogo size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/credits">
              <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </Link>
            <AnimatedLogo size="sm" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
            <Wallet className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-tech font-bold text-foreground mb-2">
            Interac e-Transfer
          </h1>
          <p className="text-muted-foreground">
            Order ID: <code className="text-secondary font-mono">{ORDER_ID}</code>
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlowCard className="p-6" variant="teal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-secondary/20">
                  <Coins className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-tech font-bold text-foreground">
                    {credits} Credits
                  </div>
                  {bonus > 0 && (
                    <div className="text-sm text-success">+ {bonus} bonus credits!</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-secondary">
                  ${price.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">CAD</div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Send e-Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard className={`p-6 ${step >= 1 ? 'border-secondary/30' : 'opacity-50'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step > 1 ? 'bg-success text-white' : 'bg-secondary/20 text-secondary'
                }`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Send e-Transfer</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">Send to this email:</Label>
                      <div className="mt-1 flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                        <Mail className="w-5 h-5 text-secondary" />
                        <code className="flex-1 text-lg font-mono text-foreground">{ETRANSFER_EMAIL}</code>
                        <button
                          onClick={copyEmail}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-success" />
                          ) : (
                            <Copy className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-sm">Amount to send:</Label>
                      <div className="mt-1 p-3 rounded-lg bg-background/50 border border-border">
                        <span className="text-2xl font-bold text-secondary">${price.toFixed(2)} CAD</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div className="text-sm text-warning">
                          <strong>Important:</strong> Include your order ID <code className="bg-background/50 px-1 rounded">{ORDER_ID}</code> in the e-Transfer message!
                        </div>
                      </div>
                    </div>
                  </div>

                  {step === 1 && (
                    <NeonButton 
                      onClick={() => setStep(2)}
                      className="mt-4"
                    >
                      I've Sent the e-Transfer
                    </NeonButton>
                  )}
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Step 2: Confirm Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlowCard className={`p-6 ${step >= 2 ? 'border-secondary/30' : 'opacity-50'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step > 2 ? 'bg-success text-white' : step === 2 ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Confirm Your Details</h3>
                  
                  {step >= 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="senderName" className="text-foreground">Name on Bank Account *</Label>
                        <Input
                          id="senderName"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="John Smith"
                          className="mt-1 bg-input border-border"
                          disabled={confirmed}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This helps us match your transfer faster
                        </p>
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm">Account Email:</Label>
                        <div className="mt-1 p-3 rounded-lg bg-background/50 border border-border">
                          <span className="text-foreground">{user?.email}</span>
                        </div>
                      </div>

                      {!confirmed && (
                        <NeonButton 
                          onClick={handleConfirmPayment}
                          className="w-full"
                        >
                          Confirm Payment Sent
                        </NeonButton>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Step 3: Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlowCard className={`p-6 ${step >= 3 ? 'border-success/30 bg-success/5' : 'opacity-50'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  confirmed ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {confirmed ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {confirmed ? 'Payment Registered!' : 'Awaiting Confirmation'}
                  </h3>
                  
                  {confirmed && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        We'll credit your account within <strong className="text-foreground">2 hours</strong> of receiving the e-Transfer.
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Processing time: 15 minutes - 2 hours</span>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
                            You'll receive an email at <strong className="text-foreground">{user?.email}</strong> when your credits are added.
                          </div>
                        </div>
                      </div>

                      <Link to="/dashboard">
                        <NeonButton variant="secondary" className="w-full">
                          Return to Dashboard
                        </NeonButton>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help? Contact <a href="mailto:support@3d3d.ca" className="text-secondary hover:underline">support@3d3d.ca</a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default ETransferCheckout;
