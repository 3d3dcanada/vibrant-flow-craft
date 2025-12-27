import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { NeonButton } from '@/components/ui/NeonButton';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Loader2, Mail, Lock, User, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [demoEmail, setDemoEmail] = useState<string | null>(null);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const DEMO_PASSWORD = 'DemoPass123!';

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateDemoAccount = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    const generatedEmail = `demo+${Date.now()}@example.com`;

    try {
      const { error: signUpError } = await signUp(generatedEmail, DEMO_PASSWORD, 'Demo User');
      if (signUpError) {
        toast({
          title: 'Demo account error',
          description: signUpError.message,
          variant: 'destructive',
        });
        return;
      }

      const { error: signInError } = await signIn(generatedEmail, DEMO_PASSWORD);
      if (signInError) {
        toast({
          title: 'Demo login error',
          description: signInError.message,
          variant: 'destructive',
        });
        return;
      }

      setDemoEmail(generatedEmail);
      toast({
        title: 'Demo ready',
        description: 'Signed in with a temporary demo account.',
      });
      // Navigation happens when auth state updates (see useEffect above)
    } catch {
      toast({
        title: 'Demo account error',
        description: 'Could not create a demo account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = (error?.message || '').toLowerCase();

          if (msg.includes('invalid login credentials')) {
            toast({
              title: 'Login Failed',
              description:
                "Invalid email or password. If you don't have an account yet, switch to Sign up (or use Demo Account).",
              variant: 'destructive',
            });
          } else if (msg.includes('email') && msg.includes('confirm')) {
            toast({
              title: 'Email not confirmed',
              description:
                'Your account exists but needs email confirmation. Try signing up again with a fresh email or use Demo Account for testing.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Login Error',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Welcome back!',
            description: "You're successfully logged in.",
          });
          // Navigation happens when auth state updates (see useEffect above)
        }
      } else {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            toast({
              title: 'Account exists',
              description: 'This email is already registered. Please sign in instead.',
              variant: 'destructive',
            });
            setIsLogin(true);
          } else {
            toast({
              title: 'Signup error',
              description: signUpError.message,
              variant: 'destructive',
            });
          }
        } else {
          // Ensure the user is actually signed in (prevents "signup succeeded" but dashboard redirects back).
          const { error: signInError } = await signIn(email, password);
          if (signInError) {
            toast({
              title: 'Signup succeeded, but login failed',
              description: signInError.message,
              variant: 'destructive',
            });
            setIsLogin(true);
            return;
          }

          toast({
            title: 'Account created',
            description: "You're signed in and ready to go.",
          });
          // Navigation happens when auth state updates (see useEffect above)
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AnimatedLogo size="md" />
          </div>

          {/* Card */}
          <div className="glass-card p-8 rounded-2xl border border-primary/20">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                className="text-3xl font-tech font-bold text-foreground mb-2"
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isLogin ? 'Welcome Back' : 'Join the Network'}
              </motion.h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : 'Create your account and earn 100 bonus points!'}
              </p>
            </div>

            {/* Signup Benefits */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20"
                >
                  <div className="flex items-center gap-2 text-secondary mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">New Member Perks</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ 100 welcome points instantly</li>
                    <li>✓ Unique referral code for rewards</li>
                    <li>✓ Access to recycling program</li>
                    <li>✓ Exclusive Canadian pricing</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-background/50 border-primary/20 focus:border-secondary h-12"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`pl-10 bg-background/50 border-primary/20 focus:border-secondary h-12 ${errors.email ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive ml-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`pl-10 bg-background/50 border-primary/20 focus:border-secondary h-12 ${errors.password ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive ml-1">{errors.password}</p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Referral Code (optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="pl-10 bg-background/50 border-primary/20 focus:border-secondary h-12 uppercase"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <NeonButton
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </NeonButton>
            </form>

            {/* Demo */}
            <div className="mt-6">
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <NeonButton
                type="button"
                variant="outline"
                size="md"
                className="w-full h-12"
                disabled={loading}
                onClick={handleCreateDemoAccount}
                icon={<Sparkles className="w-5 h-5" />}
              >
                1‑Click Demo Login
              </NeonButton>

              <p className="mt-2 text-xs text-muted-foreground text-center">
                Creates a temporary demo account and signs you in instantly.
              </p>

              {demoEmail && (
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Demo email:{" "}
                  <span className="font-mono text-secondary">{demoEmail}</span>
                </p>
              )}
            </div>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                {isLogin ? (
                  <>Don't have an account? <span className="text-secondary font-semibold">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="text-secondary font-semibold">Sign in</span></>
                )}
              </button>
            </div>

            {/* Legal */}
            <p className="mt-6 text-xs text-center text-muted-foreground/60">
              By continuing, you agree to our Terms of Service and Privacy Policy. 
              All prices in CAD. Subject to Canadian regulations.
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
              ← Back to Homepage
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
