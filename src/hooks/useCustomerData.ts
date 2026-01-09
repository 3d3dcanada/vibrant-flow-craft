import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Fetch user's print requests
export const useUserPrintRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_print_requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('print_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Fetch user's quotes
// Note: quotes table exists but types may not be regenerated
export const useUserQuotes = (limit = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_quotes', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];
      // Using explicit any to handle quotes table not in generated types
      const { data, error } = await (supabase as any)
        .from('quotes')
        .select('id, material, quality, quantity, total_cad, status, expires_at, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Array<{
        id: string;
        material: string;
        quality: string;
        quantity: number;
        total_cad: number;
        status: string;
        expires_at: string;
        created_at: string;
      }>;
    },
    enabled: !!user
  });
};

// Fetch user's orders
// Note: orders table exists but types may not be regenerated
export const useUserOrders = (limit = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_orders', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];
      // Using explicit any to handle orders table not in generated types
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('id, order_number, total_cad, payment_method, status, created_at, quote_snapshot, shipping_address')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Array<{
        id: string;
        order_number: string;
        total_cad: number;
        payment_method: string;
        status: string;
        created_at: string;
        quote_snapshot: any;
        shipping_address: any;
      }>;
    },
    enabled: !!user
  });
};
