import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface PrintRequest {
  id: string;
  user_id: string | null;
  maker_id: string | null;
  status: 'pending' | 'claimed' | 'quoted' | 'accepted' | 'declined' | 'cancelled';
  specs: Record<string, unknown>;
  attribution: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrintJob {
  id: string;
  request_id: string | null;
  maker_id: string;
  status: 'new' | 'printing' | 'post_processing' | 'ready' | 'shipped' | 'complete' | 'cancelled';
  sla_target_at: string | null;
  notes: string | null;
  photos: string[];
  quality_checks: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface MakerPrinter {
  id: string;
  maker_id: string;
  model: string;
  nozzle_sizes: string[];
  job_size: string;
  materials_supported: string[];
  status: 'available' | 'printing' | 'maintenance' | 'offline';
  notes: string | null;
  connection_type: 'none' | 'octoprint' | 'moonraker';
  connection_url: string | null;
  api_key: string | null;
  last_seen_at: string | null;
  last_status: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MakerFilament {
  id: string;
  maker_id: string;
  material: string;
  color: string;
  brand: string | null;
  grams_remaining: number;
  dry_status: 'dry' | 'needs_drying' | 'unknown';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayoutRequest {
  id: string;
  maker_id: string;
  amount_estimate: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  notes: string | null;
  processed_at: string | null;
  created_at: string;
}

// Hooks
export const usePendingRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pending_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .is('maker_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrintRequest[];
    },
    enabled: !!user
  });
};

export const useMakerRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['maker_requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .eq('maker_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrintRequest[];
    },
    enabled: !!user
  });
};

export const useMakerJobs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['maker_jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .eq('maker_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrintJob[];
    },
    enabled: !!user
  });
};

export const useMakerPrinters = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['maker_printers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('maker_printers')
        .select('*')
        .eq('maker_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as MakerPrinter[];
    },
    enabled: !!user
  });
};

export const useMakerFilament = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['maker_filament', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('maker_filament')
        .select('*')
        .eq('maker_id', user.id)
        .order('material', { ascending: true });
      if (error) throw error;
      return data as MakerFilament[];
    },
    enabled: !!user
  });
};

export const useMakerPayouts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['maker_payouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('maker_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PayoutRequest[];
    },
    enabled: !!user
  });
};

// Mutations
export const useClaimRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('print_requests')
        .update({ maker_id: user.id, status: 'claimed' })
        .eq('id', requestId)
        .is('maker_id', null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending_requests'] });
      queryClient.invalidateQueries({ queryKey: ['maker_requests'] });
    }
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: PrintRequest['status'] }) => {
      const { error } = await supabase
        .from('print_requests')
        .update({ status })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_requests'] });
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ requestId, slaHours }: { requestId: string; slaHours: number }) => {
      if (!user) throw new Error('Not authenticated');
      const slaTarget = new Date();
      slaTarget.setHours(slaTarget.getHours() + slaHours);
      
      const { error } = await supabase
        .from('print_jobs')
        .insert({
          request_id: requestId,
          maker_id: user.id,
          status: 'new',
          sla_target_at: slaTarget.toISOString()
        });
      if (error) throw error;
      
      await supabase
        .from('print_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_jobs'] });
      queryClient.invalidateQueries({ queryKey: ['maker_requests'] });
    }
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string; status: PrintJob['status'] }) => {
      const { error } = await supabase
        .from('print_jobs')
        .update({ status })
        .eq('id', jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_jobs'] });
    }
  });
};

export const useCreatePrinter = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (printer: Omit<MakerPrinter, 'id' | 'maker_id' | 'created_at' | 'updated_at' | 'last_seen_at' | 'last_status'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('maker_printers')
        .insert({ ...printer, maker_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_printers'] });
    }
  });
};

export const useUpdatePrinter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ printerId, updates }: { printerId: string; updates: Partial<MakerPrinter> }) => {
      const { error } = await supabase
        .from('maker_printers')
        .update(updates as never)
        .eq('id', printerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_printers'] });
    }
  });
};

export const useDeletePrinter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (printerId: string) => {
      const { error } = await supabase
        .from('maker_printers')
        .delete()
        .eq('id', printerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_printers'] });
    }
  });
};

export const useCreateFilament = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (filament: Omit<MakerFilament, 'id' | 'maker_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('maker_filament')
        .insert({ ...filament, maker_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_filament'] });
    }
  });
};

export const useUpdateFilament = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ filamentId, updates }: { filamentId: string; updates: Partial<MakerFilament> }) => {
      const { error } = await supabase
        .from('maker_filament')
        .update(updates)
        .eq('id', filamentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_filament'] });
    }
  });
};

export const useDeleteFilament = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (filamentId: string) => {
      const { error } = await supabase
        .from('maker_filament')
        .delete()
        .eq('id', filamentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_filament'] });
    }
  });
};

export const useCreatePayout = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('payout_requests')
        .insert({ maker_id: user.id, amount_estimate: amount });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maker_payouts'] });
    }
  });
};

export const useTestPrinterConnection = () => {
  return useMutation({
    mutationFn: async (printerId: string) => {
      const { data, error } = await supabase.functions.invoke('printer-status', {
        body: { printer_id: printerId }
      });
      if (error) throw error;
      return data;
    }
  });
};

// Get all makers for admin assignment - use user_roles table
export const useAllMakers = () => {
  return useQuery({
    queryKey: ['all_makers'],
    queryFn: async () => {
      // First get all maker user IDs from user_roles
      const { data: makerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'maker');
      
      if (rolesError) throw rolesError;
      if (!makerRoles || makerRoles.length === 0) return [];
      
      const makerIds = makerRoles.map(r => r.user_id);
      
      // Then get profiles for those makers
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, email, availability_status')
        .in('id', makerIds)
        .eq('onboarding_completed', true)
        .order('full_name', { ascending: true });
      if (error) throw error;
      return data;
    }
  });
};

// Get all unassigned requests for admin
export const useAllUnassignedRequests = () => {
  return useQuery({
    queryKey: ['all_unassigned_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .is('maker_id', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrintRequest[];
    }
  });
};

// Admin assign request to maker
export const useAssignRequestToMaker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, makerId }: { requestId: string; makerId: string }) => {
      const { error } = await supabase
        .from('print_requests')
        .update({ maker_id: makerId, status: 'claimed' })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending_requests'] });
      queryClient.invalidateQueries({ queryKey: ['all_unassigned_requests'] });
      queryClient.invalidateQueries({ queryKey: ['maker_requests'] });
    }
  });
};

// Submit a print request (from quote section)
export const useSubmitPrintRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (request: {
      specs: Record<string, unknown>;
      attribution?: Record<string, unknown>;
      notes?: string;
    }) => {
      const insertData = {
        user_id: user?.id || null,
        maker_id: null,
        status: 'pending' as const,
        specs: request.specs,
        attribution: request.attribution || {},
        notes: request.notes || null
      };
      const { data, error } = await supabase
        .from('print_requests')
        .insert(insertData as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending_requests'] });
      queryClient.invalidateQueries({ queryKey: ['all_unassigned_requests'] });
    }
  });
};

// Check if user is admin
export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is_admin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
    enabled: !!user
  });
};
