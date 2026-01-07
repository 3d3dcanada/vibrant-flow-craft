import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'maker' | 'customer';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

/**
 * Fetch user roles from the secure user_roles table
 */
export const useUserRoles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data || []) as UserRole[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

/**
 * Check if user has a specific role
 */
export const useHasRole = (role: AppRole) => {
  const { data: roles, isLoading, isError } = useUserRoles();
  
  const hasRole = roles?.some(r => r.role === role) ?? false;
  
  return { hasRole, isLoading, isError };
};

/**
 * Check if user is an admin
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * Check if user is a maker
 */
export const useIsMaker = () => {
  return useHasRole('maker');
};

/**
 * Get the user's primary role (admin > maker > customer)
 */
export const usePrimaryRole = () => {
  const { data: roles, isLoading, isError } = useUserRoles();
  
  let primaryRole: AppRole = 'customer';
  
  if (roles?.some(r => r.role === 'admin')) {
    primaryRole = 'admin';
  } else if (roles?.some(r => r.role === 'maker')) {
    primaryRole = 'maker';
  }
  
  return { primaryRole, isLoading, isError, roles };
};
