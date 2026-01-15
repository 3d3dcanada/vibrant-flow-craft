import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Site Settings
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Record<string, unknown>) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert(settings);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site_settings'] })
  });
};

// Promo Products
export const usePromoProducts = (activeOnly = false) => {
  return useQuery({
    queryKey: ['promo_products', activeOnly],
    queryFn: async () => {
      let query = supabase.from('promo_products').select('*').order('name');
      if (activeOnly) query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpsertPromoProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Record<string, unknown>) => {
      const { id, ...rest } = product;
      if (id) {
        const { error } = await supabase
          .from('promo_products')
          .update(rest)
          .eq('id', id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('promo_products')
          .insert(rest as Record<string, unknown>);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promo_products'] })
  });
};

export const useDeletePromoProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promo_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promo_products'] })
  });
};

// Store Items
export const useStoreItems = (activeOnly = false) => {
  return useQuery({
    queryKey: ['store_items', activeOnly],
    queryFn: async () => {
      let query = supabase.from('store_items').select('*').order('name');
      if (activeOnly) query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpsertStoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Record<string, unknown>) => {
      const { id, ...rest } = item;
      if (id) {
        const { error } = await supabase
          .from('store_items')
          .update(rest)
          .eq('id', id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_items')
          .insert(rest as Record<string, unknown>);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['store_items'] })
  });
};

export const useDeleteStoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('store_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['store_items'] })
  });
};

// Credit Packages
export const useCreditPackages = (activeOnly = false) => {
  return useQuery({
    queryKey: ['credit_packages', activeOnly],
    queryFn: async () => {
      let query = supabase.from('credit_packages').select('*').order('price_cad');
      if (activeOnly) query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpsertCreditPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: Record<string, unknown>) => {
      const { id, ...rest } = pkg;
      if (id) {
        const { error } = await supabase
          .from('credit_packages')
          .update(rest)
          .eq('id', id as string);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('credit_packages')
          .insert(rest as Record<string, unknown>);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['credit_packages'] })
  });
};

export const useDeleteCreditPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credit_packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['credit_packages'] })
  });
};

// Admin stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      // Query user_roles to get maker count instead of profiles.role
      const [unassigned, assigned, jobs, payouts, unverifiedMakers] = await Promise.all([
        supabase.from('print_requests').select('id', { count: 'exact', head: true }).is('maker_id', null),
        supabase.from('print_requests').select('id', { count: 'exact', head: true }).not('maker_id', 'is', null),
        supabase.from('print_jobs').select('id', { count: 'exact', head: true }).neq('status', 'complete').neq('status', 'cancelled'),
        supabase.from('payout_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        // Join user_roles with profiles to get unverified makers
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('maker_verified', false).neq('maker_verified', null)
      ]);
      return {
        unassignedRequests: unassigned.count || 0,
        assignedRequests: assigned.count || 0,
        activeJobs: jobs.count || 0,
        pendingPayouts: payouts.count || 0,
        unverifiedMakers: unverifiedMakers.count || 0
      };
    }
  });
};

// Makers list for admin - join with user_roles to find makers
export const useAdminMakersList = () => {
  return useQuery({
    queryKey: ['admin_makers_list'],
    queryFn: async () => {
      // Get all users who have maker role from user_roles
      const { data: makerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'maker');
      
      if (rolesError) throw rolesError;
      if (!makerRoles || makerRoles.length === 0) return [];
      
      const makerIds = makerRoles.map(r => r.user_id);
      
      // Get profiles for those makers
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, city, province, availability_status, maker_verified, maker_verification_notes, onboarding_completed')
        .in('id', makerIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpdateMakerVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ makerId, verified, notes }: { makerId: string; verified: boolean; notes?: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ maker_verified: verified, maker_verification_notes: notes })
        .eq('id', makerId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_makers_list'] })
  });
};

// Payout requests for admin
export const useAdminPayoutRequests = () => {
  return useQuery({
    queryKey: ['admin_payout_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUpdatePayoutStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'processing' | 'completed' | 'rejected' }) => {
      const { error } = await supabase
        .from('payout_requests')
        .update({ status, processed_at: status === 'completed' ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_payout_requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    }
  });
};

// Image upload helper
export const uploadAdminImage = async (file: File, folder: string = 'images'): Promise<string> => {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { error } = await supabase.storage
    .from('public-assets')
    .upload(filename, file, { cacheControl: '3600', upsert: false });
  
  if (error) throw error;
  
  const { data } = supabase.storage.from('public-assets').getPublicUrl(filename);
  return data.publicUrl;
};
