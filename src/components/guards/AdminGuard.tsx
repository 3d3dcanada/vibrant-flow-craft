import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, isError, refetch } = useProfile();

  // Show loading while auth or profile is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Show error state with retry button if profile fetch failed
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-tech font-bold mb-2 text-foreground">Failed to Load Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't verify your admin access. Please try again.
          </p>
          <div className="space-y-3">
            <NeonButton onClick={() => refetch()} className="w-full">
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

  // Check role from database - single source of truth
  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-tech font-bold mb-2 text-foreground">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            This area is restricted to administrators only.
          </p>
          <NeonButton variant="secondary" onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </NeonButton>
        </GlowCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
