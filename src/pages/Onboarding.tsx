import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import NeonButton from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, User } from 'lucide-react';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');

  const handleComplete = async () => {
    if (!user) return;

    if (!displayName.trim()) {
      toast({ title: 'Display name required', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const baseData = {
        id: user.id,
        email: user.email,
        display_name: displayName.trim(),
        onboarding_completed: true,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(baseData, { onConflict: 'id' });

      if (profileError) throw profileError;

      toast({
        title: 'Profile saved',
        description: 'Redirecting to your dashboard...',
      });

      navigate('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="flex justify-center mb-8">
            <AnimatedLogo size="md" />
          </div>

            <GlowCard className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-tech font-bold text-foreground mb-2">
                  Complete Your Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add a display name so your account is ready to go.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-xs text-secondary-foreground">
                Roles are assigned by the team in Supabase. Once assigned, your dashboard will update automatically.
              </div>

              <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                  Display Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    className="bg-background/50 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <NeonButton
                onClick={handleComplete}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </NeonButton>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
