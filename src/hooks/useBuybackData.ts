import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type BuybackItemType = 'printer' | 'filament' | 'electronics' | 'donation';
export type BuybackStatus = 'new' | 'in_review' | 'quoted' | 'accepted' | 'declined' | 'closed';

export interface BuybackRequest {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  item_type: BuybackItemType;
  brand_model: string | null;
  condition: string | null;
  notes: string | null;
  photo_url: string | null;
  city: string | null;
  province: string | null;
  contact_email: string;
  status: BuybackStatus;
  quoted_amount_cad: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBuybackRequest {
  item_type: BuybackItemType;
  brand_model?: string;
  condition?: string;
  notes?: string;
  photo_url?: string;
  city?: string;
  province?: string;
  contact_email: string;
  guest_email?: string;
}

// Hook for users to submit buyback requests
export const useSubmitBuybackRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateBuybackRequest) => {
      const { data: result, error } = await supabase
        .from('buyback_requests')
        .insert({
          ...data,
          user_id: user?.id || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyback-requests'] });
    },
  });
};

// Hook for users to view their own buyback requests
export const useUserBuybackRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['buyback-requests', 'user', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('buyback_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BuybackRequest[];
    },
    enabled: !!user?.id,
  });
};

// Hook for admins to view all buyback requests
export const useAdminBuybackRequests = () => {
  return useQuery({
    queryKey: ['buyback-requests', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buyback_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BuybackRequest[];
    },
  });
};

// Hook for admins to update buyback request status
export const useUpdateBuybackRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      quoted_amount_cad, 
      admin_notes 
    }: { 
      id: string; 
      status?: BuybackStatus; 
      quoted_amount_cad?: number | null;
      admin_notes?: string;
    }) => {
      const updates: Record<string, unknown> = {};
      if (status !== undefined) updates.status = status;
      if (quoted_amount_cad !== undefined) updates.quoted_amount_cad = quoted_amount_cad;
      if (admin_notes !== undefined) updates.admin_notes = admin_notes;

      const { data, error } = await supabase
        .from('buyback_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyback-requests'] });
    },
  });
};
