import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { usePrimaryRole } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  const { primaryRole, isLoading: roleLoading, isError: roleError } = usePrimaryRole();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    if (profileLoading || roleLoading) return;
    if (!profile && !profileError) {
      navigate('/onboarding');
      return;
    }
    if (profile) {
      if (!profile.onboarding_completed) {
        navigate('/onboarding');
        return;
      }
      if (primaryRole === 'admin') navigate('/dashboard/admin', { replace: true });
      else if (primaryRole === 'maker') navigate('/dashboard/maker', { replace: true });
      else navigate('/dashboard/customer', { replace: true });
    }
  }, [user, authLoading, profileLoading, roleLoading, profile, primaryRole, profileError, navigate]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const renderState = (title: string, message: string, content?: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        {content || <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />}
        <h2 className="text-xl font-bold mb-2 text-neutral-xlight">{title}</h2>
        <p className="text-neutral-light">{message}</p>
      </div>
    </div>
  );

  if (authLoading || profileLoading || roleLoading) {
    return renderState("Loading Dashboard", "Please wait while we fetch your data...");
  }

  if (profileError || roleError) {
    return renderState(
      "Failed to Load Profile",
      "We couldn't load your profile data. Please try again or sign out.",
      <>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-3 mt-6">
          <Button onClick={() => refetchProfile()} className="w-full btn btn-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button variant="ghost" onClick={handleSignOut} className="w-full btn btn-ghost">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </>
    );
  }

  return renderState("Redirecting...", "Please wait...");
};

export default Dashboard;
