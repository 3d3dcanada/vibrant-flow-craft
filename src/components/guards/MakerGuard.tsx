import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMaker } from '@/hooks/useUserRoles';
import { useProfile } from '@/hooks/useUserData';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader2, Wrench, AlertTriangle, RefreshCw } from 'lucide-react';

interface MakerGuardProps {
  children: React.ReactNode;
}

const MakerGuard = ({ children }: MakerGuardProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasRole: isMaker, isLoading: roleLoading, isError: roleError } = useIsMaker();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Show loading while auth or role is loading
  if (authLoading || roleLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Verifying maker access...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Show error state with retry button if role fetch failed
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-tech font-bold mb-2 text-foreground">Failed to Load Permissions</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't verify your maker access. Please try again.
          </p>
          <div className="space-y-3">
            <NeonButton onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </NeonButton>
            <NeonButton variant="secondary" onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </NeonButton>
          </div>
        </GlowCard>
      </div>
    );
  }

  // Check if user hasn't completed onboarding as maker
  if (!isMaker && profile && !profile.onboarding_completed) {
    navigate('/onboarding');
    return null;
  }

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
