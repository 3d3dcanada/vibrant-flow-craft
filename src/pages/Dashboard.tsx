import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader2, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

/**
 * Dashboard.tsx - Pure Redirect Controller
 * This component NEVER renders UI. It only:
 * 1. Fetches the authenticated user's profile
 * 2. Redirects based on role from database
 * 3. Shows loading/error states during the process
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, isError, refetch } = useProfile();

  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) return;

    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Wait for profile to load
    if (profileLoading) return;

    // If profile loaded successfully, redirect based on role
    if (profile) {
      const role = profile.role || 'customer';
      
      if (role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (role === 'maker') {
        navigate('/dashboard/maker', { replace: true });
      } else {
        navigate('/dashboard/customer', { replace: true });
      }
    }
  }, [user, authLoading, profileLoading, profile, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Loading state while auth or profile is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state if profile fetch failed
  if (isError) {
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
            <NeonButton onClick={() => refetch()} className="w-full">
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

  // This should never be reached as we redirect above, but show loading as fallback
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
