import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { usePrimaryRole } from '@/hooks/useUserRoles';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard - Pure redirect controller.
 * Routes to /dashboard/admin, /dashboard/maker, or /dashboard/customer.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { primaryRole, isLoading: roleLoading } = usePrimaryRole();

  useEffect(() => {
    if (authLoading || profileLoading || roleLoading) return;

    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    if (!profile || profile.onboarding_completed === false) {
      navigate('/onboarding', { replace: true });
      return;
    }

    if (primaryRole === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    } else if (primaryRole === 'maker') {
      navigate('/dashboard/maker', { replace: true });
    } else {
      navigate('/dashboard/customer', { replace: true });
    }
  }, [user, authLoading, profileLoading, roleLoading, profile, primaryRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Dashboard;
