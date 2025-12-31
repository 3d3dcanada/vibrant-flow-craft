import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader2, Wrench, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface MakerGuardProps {
  children: React.ReactNode;
}

const MakerGuard = ({ children }: MakerGuardProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Show loading while checking auth/profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Check if user is a maker
  const isMaker = profile?.role === 'maker';

  if (!isMaker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-xl font-tech font-bold mb-2 text-foreground">Maker Access Required</h2>
          <p className="text-muted-foreground mb-6">
            This area is for verified makers only. Complete your maker profile to access the Creator Studio.
          </p>
          <div className="space-y-3">
            <NeonButton onClick={() => navigate('/onboarding')} className="w-full">
              <Wrench className="w-4 h-4 mr-2" />
              Become a Maker
            </NeonButton>
            <NeonButton variant="secondary" onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </NeonButton>
          </div>
        </GlowCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default MakerGuard;
