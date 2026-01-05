import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User, Gift, ArrowRight, KeyRound, CheckCircle, CloudOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { backendReady } from '@/config/backend';

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
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signUp, user, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const locationState = location.state as { returnTo?: string; isSignup?: boolean } | null;

  useEffect(() => {
    if (locationState?.isSignup && mode === 'login') {
      setMode('signup');
    }
  }, [locationState?.isSignup]);

  useEffect(() => {
    if (user) {
      const fetchAndRedirect = async () => {
        try {
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

          if (!profileData || !profileData.onboarding_completed) {
            navigate('/onboarding');
            return;
          }

          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (rolesError) {
            console.error('Error fetching roles:', rolesError);
            navigate('/dashboard/customer', { replace: true });
            return;
          }

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
        if (e instanceof z.ZodError) newErrors.email = e.errors[0].message;
      }
    }

    if (mode === 'login' || mode === 'signup' || mode === 'reset') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) newErrors.password = e.errors[0].message;
      }
    }

    if (mode === 'reset' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthAction = async (action: () => Promise<{ error: any }>, successToast: any, errorToast: any) => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error } = await action();
      if (error) {
        toast({ title: errorToast.title, description: error.message, variant: 'destructive' });
      } else {
        toast(successToast);
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (mode) {
      case 'login':
        return handleAuthAction(() => signIn(email, password), { title: 'Welcome back!', description: "You're successfully logged in." }, { title: 'Login Failed' });
      case 'signup':
        return handleAuthAction(() => signUp(email, password, fullName), { title: 'Account created', description: "You're signed in and ready to go." }, { title: 'Signup error' });
      case 'forgot':
        return handleAuthAction(() => resetPassword(email), { title: 'Email sent', description: 'Check your inbox for a password reset link.' }, { title: 'Error' });
      case 'reset':
        return handleAuthAction(() => updatePassword(password), { title: 'Password updated', description: 'Your password has been successfully reset.' }, { title: 'Error' });
    }
  };

  const getTitle = () => ({
    login: 'Welcome Back',
    signup: 'Join the Network',
    forgot: 'Reset Password',
    reset: 'Set New Password',
  }[mode]);

  const getSubtitle = () => ({
    login: 'Sign in to access your dashboard',
    signup: 'Create your account and earn 100 bonus points!',
    forgot: 'Enter your email to receive a reset link',
    reset: 'Choose a new secure password',
  }[mode]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-display text-neutral-xlight">3d3d.ca</h1>
        </div>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-xlight">{getTitle()}</h2>
            <p className="text-neutral-light">{getSubtitle()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Input className="input-filled" type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </motion.div>
              )}
            </AnimatePresence>

            {mode !== 'reset' && (
              <div>
                <Input className="input-filled" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <Input className="input-filled" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            )}

            {mode === 'reset' && (
              <div>
                <Input className="input-filled" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Input className="input-filled" type="text" placeholder="Referral Code (optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} />
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-neutral-light hover:text-primary"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
