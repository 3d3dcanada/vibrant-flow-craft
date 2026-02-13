import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import logo from '@/assets/3D3D_Canada_Logo.png';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'At least 6 characters');

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') as AuthMode | null;

  const [mode, setMode] = useState<AuthMode>(initialMode === 'reset' ? 'reset' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signUp, user, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (mode !== 'reset') {
      try { emailSchema.parse(email); } catch (e) {
        if (e instanceof z.ZodError) errs.email = e.errors[0].message;
      }
    }

    if (mode === 'login' || mode === 'signup' || mode === 'reset') {
      try { passwordSchema.parse(password); } catch (e) {
        if (e instanceof z.ZodError) errs.password = e.errors[0].message;
      }
    }

    if (mode === 'signup' && !fullName.trim()) {
      errs.fullName = 'Name is required';
    }

    if (mode === 'reset' && password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: 'Google sign-in failed', description: String(error), variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to Google.', variant: 'destructive' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
          setResetSent(true);
          toast({ title: 'Check your email', description: 'Password reset link sent.' });
        }
      } else if (mode === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Password updated', description: 'You can now sign in.' });
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials')) {
            toast({ title: 'Invalid credentials', description: 'Check your email and password.', variant: 'destructive' });
          } else if (msg.includes('email') && msg.includes('confirm')) {
            toast({ title: 'Email not confirmed', description: 'Please check your inbox for verification.', variant: 'destructive' });
          } else {
            toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
          }
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({ title: 'Account exists', description: 'Try signing in instead.', variant: 'destructive' });
            setMode('login');
          } else {
            toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
          }
        } else {
          toast({ title: 'Check your email', description: 'We sent a verification link to confirm your account.' });
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<AuthMode, { title: string; subtitle: string }> = {
    login: { title: 'Welcome back', subtitle: 'Sign in to your workshop' },
    signup: { title: 'Create account', subtitle: 'Join the 3D printing network' },
    forgot: { title: 'Reset password', subtitle: 'We\'ll send you a reset link' },
    reset: { title: 'New password', subtitle: 'Choose a secure password' },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with logo */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <img src={logo} alt="3D3D Canada" className="h-10" />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="mb-6"
            >
              {(mode === 'forgot' || mode === 'reset') && (
                <button
                  onClick={() => setMode('login')}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </button>
              )}
              <h1 className="text-2xl font-bold text-foreground">{titles[mode].title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{titles[mode].subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Reset sent state */}
          {mode === 'forgot' && resetSent && (
            <div className="mb-6 p-4 rounded-xl bg-accent/50 border border-accent text-sm">
              <p className="font-medium text-foreground">Email sent!</p>
              <p className="text-muted-foreground mt-1">Check your inbox for a password reset link.</p>
            </div>
          )}

          {/* Google Sign-In (login/signup only) */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-sm font-medium"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name (signup) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                      placeholder="Your name"
                      className={`pl-10 h-12 ${errors.fullName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            {mode !== 'reset' && (
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                    placeholder="you@example.com"
                    className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            )}

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
            )}

            {/* Confirm password (reset) */}
            {mode === 'reset' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                    placeholder="••••••••"
                    className={`pl-10 h-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Forgot password link */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrors({}); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {mode === 'login' && 'Sign in'}
              {mode === 'signup' && 'Create account'}
              {mode === 'forgot' && 'Send reset link'}
              {mode === 'reset' && 'Update password'}
            </Button>
          </form>

          {/* Toggle login/signup */}
          {(mode === 'login' || mode === 'signup') && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}
                className="text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
