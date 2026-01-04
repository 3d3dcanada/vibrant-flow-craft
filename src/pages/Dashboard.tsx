import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { usePrimaryRole } from '@/hooks/useUserRoles';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader2, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

/**
 * Dashboard.tsx - Pure Redirect Controller
 * This component NEVER renders UI. It only:
 * 1. Fetches the authenticated user's role from user_roles table
 * 2. Redirects based on role
 * 3. Shows loading/error states during the process
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  const { primaryRole, isLoading: roleLoading, isError: roleError } = usePrimaryRole();

  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) return;

    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Wait for profile and role to load
    if (profileLoading || roleLoading) return;

    // If no profile exists, go to onboarding
    if (!profile && !profileError) {
      navigate('/onboarding');
      return;
    }

    // If profile exists, check onboarding status and redirect based on role
    if (profile) {
      // If onboarding not completed, go there first
      if (profile.onboarding_completed === false) {
        navigate('/onboarding');
        return;
      }

      // Redirect based on role from user_roles table
      if (primaryRole === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (primaryRole === 'maker') {
        navigate('/dashboard/maker', { replace: true });
      } else {
        navigate('/dashboard/customer', { replace: true });
      }
    }
  }, [user, authLoading, profileLoading, roleLoading, profile, primaryRole, profileError, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    window.location.href = '/';
  };

  // Loading state while auth, profile, or role is loading
  if (authLoading || profileLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state if profile or role fetch failed
  if (profileError || roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GlowCard className="max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-tech font-bold mb-2 text-foreground">Failed to Load Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load your profile data. Please try again or sign out.
          </p>
          <div className="space-y-3">
            <NeonButton onClick={() => refetchProfile()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </NeonButton>
            <NeonButton variant="secondary" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </NeonButton>
          </div>
        </GlowCard>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

export default Dashboard;
