import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { NeonButton } from '@/components/ui/NeonButton';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { Loader2, Mail, Lock, User, Gift, ArrowRight, KeyRound, CheckCircle, CloudOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { backendReady } from '@/config/backend';
import { CASLConsent } from '@/components/legal';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') as AuthMode | null;

  const [mode, setMode] = useState<AuthMode>(initialMode === 'reset' ? 'reset' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; consent?: string }>({});
  const [resetSent, setResetSent] = useState(false);
  const [caslConsent, setCaslConsent] = useState(false);
  const [caslConsentTimestamp, setCaslConsentTimestamp] = useState<Date | null>(null);

  const { signIn, signUp, user, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get return URL from navigation state
  const locationState = location.state as { returnTo?: string; isSignup?: boolean } | null;

  useEffect(() => {
    // If coming from quote with isSignup flag, switch to signup mode
    if (locationState?.isSignup && mode === 'login') {
      setMode('signup');
    }
  }, [locationState?.isSignup]);

  // Check if user is logged in and redirect based on role from user_roles table
  useEffect(() => {
    if (user) {
      const fetchAndRedirect = async () => {
        try {
          // First check profile for onboarding status
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            navigate('/dashboard');
            return;
          }

          // If no profile exists, go to onboarding
          if (!profileData) {
            navigate('/onboarding');
            return;
          }

          // If onboarding not completed, go there
          if (profileData.onboarding_completed === false) {
            navigate('/onboarding');
            return;
          }

          // Now check user_roles for actual role
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (rolesError) {
            console.error('Error fetching roles:', rolesError);
            navigate('/dashboard/customer', { replace: true });
            return;
          }

          // Determine primary role: admin > maker > customer
          const roles = rolesData?.map(r => r.role) || [];
          if (roles.includes('admin')) {
            navigate('/dashboard/admin', { replace: true });
          } else if (roles.includes('maker')) {
            navigate('/dashboard/maker', { replace: true });
          } else {
            navigate('/dashboard/customer', { replace: true });
          }
        } catch (err) {
          console.error('Redirect error:', err);
          navigate('/dashboard');
        }
      };

      fetchAndRedirect();
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (mode !== 'reset') {
      try {
        emailSchema.parse(email);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.email = e.errors[0].message;
        }
      }
    }

    if (mode === 'login' || mode === 'signup' || mode === 'reset') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }

    if (mode === 'reset') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // CASL consent required for signup
    if (mode === 'signup' && !caslConsent) {
      newErrors.consent = 'You must consent to receive emails to create an account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
    } catch {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setResetSent(true);
        toast({
          title: 'Email sent',
          description: 'Check your inbox for a password reset link.',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully reset.',
        });
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      return handleForgotPassword(e);
    }

    if (mode === 'reset') {
      return handleResetPassword(e);
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = (error?.message || '').toLowerCase();

          if (msg.includes('invalid login credentials')) {
            toast({
              title: 'Login Failed',
              description:
                "Invalid email or password. If you don't have an account yet, switch to Sign up.",
              variant: 'destructive',
            });
          } else if (msg.includes('email') && msg.includes('confirm')) {
            toast({
              title: 'Email not confirmed',
              description:
                'Your account exists but needs email confirmation. Please check your inbox or try signing up again.',
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
        }
      } else if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            toast({
              title: 'Account exists',
              description: 'This email is already registered. Please sign in instead.',
              variant: 'destructive',
            });
            setMode('login');
          } else {
            toast({
              title: 'Signup error',
              description: signUpError.message,
              variant: 'destructive',
            });
          }
        } else {
          // Auto sign in after signup
          const { error: signInError } = await signIn(email, password);
          if (signInError) {
            toast({
              title: 'Signup succeeded, but login failed',
              description: signInError.message,
              variant: 'destructive',
            });
            setMode('login');
            return;
          }

          // Save CASL consent to profile
          if (caslConsentTimestamp) {
            const { error: consentError } = await supabase
              .from('profiles')
              .update({
                consent_email_marketing: true,
                consent_email_timestamp: caslConsentTimestamp.toISOString(),
                consent_ip_address: 'client-side'
              } as any) // Type assertion: CASL columns added via migration 20260108100000
              .eq('id', (await supabase.auth.getUser()).data.user?.id);

            if (consentError) {
              console.error('Failed to save CASL consent:', consentError);
            }
          }

          toast({
            title: 'Account created',
            description: "You're signed in and ready to go.",
          });
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

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join the Network';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'Set New Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your dashboard';
      case 'signup': return 'Create your account and earn 100 bonus points!';
      case 'forgot': return 'Enter your email to receive a reset link';
      case 'reset': return 'Choose a new secure password';
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
            {/* Backend Offline Banner */}
            {!backendReady && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
              >
                <CloudOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Backend not connected yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sign-in will be enabled at launch. Thanks for your patience!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-3xl font-tech font-bold text-foreground mb-2"
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getTitle()}
              </motion.h1>
              <p className="text-muted-foreground">
                {getSubtitle()}
              </p>
            </div>

            {/* Reset Sent Confirmation */}
            {mode === 'forgot' && resetSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Check your email</p>
                  <p className="text-xs text-muted-foreground">
                    We've sent a password reset link to {email}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Signup Benefits */}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
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
              {/* Full Name (signup only) */}
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
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
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email (login, signup, forgot) */}
              {mode !== 'reset' && (
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
              )}

              {/* Password (login, signup, reset) */}
              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="relative">
                    {mode === 'reset' ? (
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    )}
                    <Input
                      type="password"
                      placeholder={mode === 'reset' ? 'New Password' : 'Password'}
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
              )}

              {/* Confirm Password (reset only) */}
              {mode === 'reset' && (
                <div className="space-y-1">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      className={`pl-10 bg-background/50 border-primary/20 focus:border-secondary h-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive ml-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Referral Code (signup only) */}
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
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

              {/* CASL Consent (signup only) */}
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <CASLConsent
                      onConsentChange={(consented, timestamp) => {
                        setCaslConsent(consented);
                        setCaslConsentTimestamp(timestamp);
                        if (consented) {
                          setErrors(prev => ({ ...prev, consent: undefined }));
                        }
                      }}
                      className="py-2"
                    />
                    {errors.consent && (
                      <p className="text-xs text-destructive ml-1">{errors.consent}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot Password Link (login only) */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-muted-foreground hover:text-secondary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <NeonButton
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    {mode === 'reset' && 'Update Password'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </NeonButton>
            </form>

            {/* Toggle Login/Signup */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  {mode === 'login' ? (
                    <>Don't have an account? <span className="text-secondary font-semibold">Sign up</span></>
                  ) : (
                    <>Already have an account? <span className="text-secondary font-semibold">Sign in</span></>
                  )}
                </button>
              </div>
            )}

            {/* Back to Login (forgot/reset) */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                    setResetSent(false);
                  }}
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            )}

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