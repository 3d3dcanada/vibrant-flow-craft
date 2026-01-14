import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClipboardCheck, RefreshCw, CheckCircle, XCircle, Clipboard } from 'lucide-react';

type CheckStatus = 'pass' | 'fail';

type AuditCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  details: string;
  lastRun: string;
};

type FulfillmentRpcResponse = {
  success: boolean;
  data?: {
    status_history?: unknown;
    tracking_info?: unknown;
  };
  error?: string;
};

const actorKeys = ['changed_by', 'changed_by_role', 'admin_id', 'maker_id', 'user_id'];

const FulfillmentAudit = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [checks, setChecks] = useState<AuditCheck[]>([]);
  const [running, setRunning] = useState(false);

  const copyReport = useCallback(() => {
    const report = checks
      .map((check) => `${check.status.toUpperCase()} | ${check.label} | ${check.details} | ${check.lastRun}`)
      .join('\n');
    navigator.clipboard.writeText(report);
    toast({ title: 'Copied', description: 'Audit report copied to clipboard.' });
  }, [checks, toast]);

  const runChecks = useCallback(async () => {
    if (!user?.id) {
      toast({ title: 'Auth required', description: 'Sign in as an admin to run checks.', variant: 'destructive' });
      return;
    }
    setRunning(true);
    const timestamp = new Date().toISOString();
    const results: AuditCheck[] = [];

    const { data: ownOrders, error: ownOrdersError } = await supabase
      .from('orders')
      .select('id, status, order_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const availableOrders = ownOrders || [];
    const shippedOrder = availableOrders.find((order) =>
      ['shipped', 'delivered'].includes(order.status)
    );
    const unshippedOrder = availableOrders.find((order) =>
      !['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)
    );

    if (ownOrdersError) {
      results.push({
        id: 'orders-owned',
        label: 'Orders owned by current admin user',
        status: 'fail',
        details: ownOrdersError.message,
        lastRun: timestamp,
      });
    }

    const getCustomerFulfillment = async (orderId: string) => {
      const { data, error } = await (supabase.rpc as any)('customer_get_order_fulfillment', {
        p_order_id: orderId,
      });
      if (error) {
        throw error;
      }
      const payload = data as FulfillmentRpcResponse;
      if (!payload.success) {
        throw new Error(payload.error || 'RPC error');
      }
      return payload.data || {};
    };

    if (!shippedOrder) {
      results.push({
        id: 'sanitized-history',
        label: 'Customer RPC status_history sanitized (no actor IDs)',
        status: 'fail',
        details: 'No shipped/delivered order owned by this admin user.',
        lastRun: timestamp,
      });
    } else {
      try {
        const fulfillment = await getCustomerFulfillment(shippedOrder.id);
        const history = fulfillment.status_history;
        const isArray = Array.isArray(history);
        const hasActorIds =
          isArray &&
          history.some((entry) =>
            actorKeys.some((key) => Boolean((entry as Record<string, unknown>)?.[key]))
          );
        results.push({
          id: 'sanitized-history',
          label: 'Customer RPC status_history sanitized (no actor IDs)',
          status: isArray && !hasActorIds ? 'pass' : 'fail',
          details: isArray && !hasActorIds ? 'Sanitized array verified.' : 'Actor fields detected or history not array.',
          lastRun: timestamp,
        });
      } catch (error: any) {
        results.push({
          id: 'sanitized-history',
          label: 'Customer RPC status_history sanitized (no actor IDs)',
          status: 'fail',
          details: error.message,
          lastRun: timestamp,
        });
      }
    }

    if (!unshippedOrder) {
      results.push({
        id: 'tracking-gate',
        label: 'Customer RPC tracking_info null unless shipped/delivered',
        status: 'fail',
        details: 'No unshipped order owned by this admin user.',
        lastRun: timestamp,
      });
    } else {
      try {
        const fulfillment = await getCustomerFulfillment(unshippedOrder.id);
        const trackingInfo = fulfillment.tracking_info;
        const hasTracking =
          trackingInfo &&
          typeof trackingInfo === 'object' &&
          Object.keys(trackingInfo as Record<string, unknown>).length > 0;
        results.push({
          id: 'tracking-gate',
          label: 'Customer RPC tracking_info null unless shipped/delivered',
          status: hasTracking ? 'fail' : 'pass',
          details: hasTracking ? 'Tracking info returned before shipment.' : 'Tracking info correctly withheld.',
          lastRun: timestamp,
        });
      } catch (error: any) {
        results.push({
          id: 'tracking-gate',
          label: 'Customer RPC tracking_info null unless shipped/delivered',
          status: 'fail',
          details: error.message,
          lastRun: timestamp,
        });
      }
    }

    try {
      const { data: policies, error } = await supabase
        .schema('pg_catalog')
        .from('pg_policies')
        .select('policyname, roles, cmd')
        .eq('schemaname', 'public')
        .eq('tablename', 'maker_orders');

      if (error) {
        throw error;
      }

      const hasMakerUpdatePolicy = (policies || []).some((policy: any) => {
        const roles = Array.isArray(policy.roles) ? policy.roles : String(policy.roles || '');
        const roleList = Array.isArray(roles) ? roles : roles.split(',');
        return policy.cmd === 'UPDATE' && roleList.map((r) => r.trim()).includes('authenticated');
      });

      results.push({
        id: 'maker-policy',
        label: 'maker_orders has no maker UPDATE policy (RPC-only)',
        status: hasMakerUpdatePolicy ? 'fail' : 'pass',
        details: hasMakerUpdatePolicy ? 'UPDATE policy still present.' : 'No authenticated UPDATE policy found.',
        lastRun: timestamp,
      });
    } catch (error: any) {
      results.push({
        id: 'maker-policy',
        label: 'maker_orders has no maker UPDATE policy (RPC-only)',
        status: 'fail',
        details: error.message,
        lastRun: timestamp,
      });
    }

    if (!unshippedOrder) {
      results.push({
        id: 'delivered-guard',
        label: 'Delivered guard rejects unshipped orders',
        status: 'fail',
        details: 'No unshipped order available to test delivered guard.',
        lastRun: timestamp,
      });
    } else {
      try {
        const { data, error } = await (supabase.rpc as any)('admin_update_order_status', {
          p_order_id: unshippedOrder.id,
          p_new_status: 'delivered',
          p_reason: 'Audit guard check',
          p_admin_notes: null,
        });
        if (error) {
          throw error;
        }
        const payload = data as { success?: boolean; error?: string };
        results.push({
          id: 'delivered-guard',
          label: 'Delivered guard rejects unshipped orders',
          status: payload.success === false ? 'pass' : 'fail',
          details: payload.success === false ? payload.error || 'Guard enforced.' : 'Order advanced unexpectedly.',
          lastRun: timestamp,
        });
      } catch (error: any) {
        results.push({
          id: 'delivered-guard',
          label: 'Delivered guard rejects unshipped orders',
          status: 'fail',
          details: error.message,
          lastRun: timestamp,
        });
      }
    }

    setChecks(results);
    setRunning(false);
  }, [toast, user?.id]);

  const summary = useMemo(() => {
    if (!checks.length) {
      return 'Run checks to generate a live readiness report.';
    }
    const failed = checks.filter((check) => check.status === 'fail').length;
    return failed === 0 ? 'All checks passing.' : `${failed} check(s) failing.`;
  }, [checks]);

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-secondary" />
              Fulfillment Audit
            </h1>
            <p className="text-muted-foreground mt-1">
              Live launch-readiness checks for fulfillment, privacy, and guardrails.
            </p>
          </motion.div>

          <GlowCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Launch Readiness</div>
                <div className="text-lg font-semibold text-foreground">{summary}</div>
              </div>
              <div className="flex items-center gap-3">
                <NeonButton variant="secondary" onClick={copyReport} disabled={!checks.length}>
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy Report
                </NeonButton>
                <NeonButton onClick={runChecks} disabled={running}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${running ? 'animate-spin' : ''}`} />
                  Re-run Checks
                </NeonButton>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2">Check</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Details</th>
                    <th className="py-2">Last Run</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">
                        No checks run yet. Use “Re-run Checks” to generate results.
                      </td>
                    </tr>
                  )}
                  {checks.map((check) => (
                    <tr key={check.id} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">{check.label}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${
                            check.status === 'pass'
                              ? 'bg-success/15 text-success'
                              : 'bg-destructive/15 text-destructive'
                          }`}
                        >
                          {check.status === 'pass' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {check.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{check.details}</td>
                      <td className="py-3 text-muted-foreground">{check.lastRun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default FulfillmentAudit;
