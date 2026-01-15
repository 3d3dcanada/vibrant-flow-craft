/**
 * 🔒 LAUNCH-FROZEN (Phase 3H)
 * Fulfillment audit UI is frozen for launch readiness.
 * Any changes require a new phase review and explicit approval.
 * Phase 3I: Runtime smoke walkthrough + preview seed truthfulness hardening.
 */
import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClipboardCheck, RefreshCw, CheckCircle, XCircle, Clipboard, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

type GuardrailsResponse = {
  success: boolean;
  data?: {
    maker_orders_has_authenticated_update_policy: boolean;
    maker_orders_write_privileges_revoked_for_authenticated: boolean;
    maker_earnings_write_privileges_revoked_for_authenticated: boolean;
  };
  error?: string;
};

type PreviewOrder = {
  id: string;
  order_number: string;
  status: string;
};

type PreviewOrdersResponse = {
  success: boolean;
  data?: {
    orders: PreviewOrder[];
  };
  error?: string;
};

type PreviewFulfillmentResponse = {
  success: boolean;
  data?: {
    status_history?: unknown;
    tracking_info?: unknown;
    order_status?: string;
    maker_stage?: string;
  };
  error?: string;
};

type SmokeSnapshot = {
  lastRun: string;
  source: 'preview' | 'recent' | 'none';
  orders: PreviewOrder[];
  shippedOrder?: PreviewOrder;
  unshippedOrder?: PreviewOrder;
  shippedTrackingPresent?: boolean;
  unshippedTrackingPresent?: boolean;
  sanitizedHistoryPass?: boolean;
  trackingGatePass?: boolean;
  deliveredGuardPass?: boolean;
};

const actorKeys = ['changed_by', 'changed_by_role', 'admin_id', 'maker_id', 'user_id'];

const PREVIEW_ORDER_NUMBERS = ['3D-PREVIEW-A', '3D-PREVIEW-B'];
const SEED_COMMAND =
  'PREVIEW_MODE=true SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service_role_key> SEED_CUSTOMER_EMAIL=you@example.com SEED_MAKER_EMAIL=maker-preview@example.com SEED_ADMIN_EMAIL=admin-preview@example.com SEED_DEFAULT_PASSWORD=PreviewPass!234 pnpm seed:preview';

const FulfillmentAudit = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState<AuditCheck[]>([]);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'checks' | 'smoke'>('checks');
  const [seedBoxOpen, setSeedBoxOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [seedDialogCommand, setSeedDialogCommand] = useState('');
  const [smokeSnapshot, setSmokeSnapshot] = useState<SmokeSnapshot | null>(null);

  const copyReport = useCallback(async () => {
    const report = checks
      .map((check) => `${check.status.toUpperCase()} | ${check.label} | ${check.details} | ${check.lastRun}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(report);
      toast({ title: 'Copied', description: 'Audit report copied to clipboard.' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to copy to clipboard.';
      toast({
        title: 'Copy failed',
        description: message,
        variant: 'destructive',
      });
    }
  }, [checks, toast]);

  const copySeedCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SEED_COMMAND);
      toast({ title: 'Copied', description: 'Preview seed command copied to clipboard.' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to copy seed command.';
      setSeedDialogCommand(SEED_COMMAND);
      setSeedDialogOpen(true);
      toast({
        title: 'Copy failed',
        description: message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const runChecks = useCallback(async () => {
    if (!user?.id) {
      toast({ title: 'Auth required', description: 'Sign in as an admin to run checks.', variant: 'destructive' });
      return;
    }
    setRunning(true);
    const timestamp = new Date().toISOString();
    const results: AuditCheck[] = [];

    let previewOrders: PreviewOrder[] = [];
    let previewOrdersError: string | null = null;

    try {
      const { data, error } = await supabase.rpc('admin_get_preview_orders' as never);
      if (error) {
        throw error;
      }
      const payload = data as PreviewOrdersResponse;
      if (!payload.success) {
        throw new Error(payload.error || 'Preview orders RPC error');
      }
      previewOrders = payload.data?.orders || [];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to load preview orders.';
      previewOrdersError = message;
    }

    const { data: ownOrders, error: ownOrdersError } = await supabase
      .from('orders')
      .select('id, status, order_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const availableOrders = previewOrders.length ? previewOrders : ownOrders || [];
    const ordersSource: SmokeSnapshot['source'] = previewOrders.length
      ? 'preview'
      : availableOrders.length
      ? 'recent'
      : 'none';
    const shippedOrder = availableOrders.find((order) =>
      ['shipped', 'delivered'].includes(order.status)
    );
    const unshippedOrder = availableOrders.find((order) =>
      !['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)
    );

    if (previewOrdersError && !previewOrders.length) {
      results.push({
        id: 'preview-orders',
        label: 'Preview orders lookup (admin)',
        status: 'fail',
        details: previewOrdersError,
        lastRun: timestamp,
      });
    }

    if (ownOrdersError && !previewOrders.length) {
      results.push({
        id: 'orders-owned',
        label: 'Orders owned by current admin user',
        status: 'fail',
        details: ownOrdersError.message,
        lastRun: timestamp,
      });
    }

    const getCustomerFulfillment = async (orderId: string) => {
      const { data, error } = await supabase.rpc('customer_get_order_fulfillment' as never, {
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

    const getPreviewFulfillment = async (orderId: string) => {
      const { data, error } = await supabase.rpc('admin_get_preview_fulfillment_snapshot' as never, {
        p_order_id: orderId,
      });
      if (error) {
        throw error;
      }
      const payload = data as PreviewFulfillmentResponse;
      if (!payload.success) {
        throw new Error(payload.error || 'Preview fulfillment RPC error');
      }
      return payload.data || {};
    };

    const getFulfillmentSnapshot = previewOrders.length ? getPreviewFulfillment : getCustomerFulfillment;

    let shippedTrackingPresent: boolean | undefined;
    let unshippedTrackingPresent: boolean | undefined;
    let sanitizedHistoryPass: boolean | undefined;
    let trackingGatePass: boolean | undefined;
    let deliveredGuardPass: boolean | undefined;

    if (!shippedOrder) {
      results.push({
        id: 'sanitized-history',
        label: 'Customer RPC status_history sanitized (no actor IDs)',
        status: 'fail',
        details: previewOrders.length
          ? 'No shipped/delivered preview order available.'
          : 'No shipped/delivered order owned by this admin user.',
        lastRun: timestamp,
      });
    } else {
      try {
        const fulfillment = await getFulfillmentSnapshot(shippedOrder.id);
        const history = fulfillment.status_history;
        const isArray = Array.isArray(history);
        const hasActorIds =
          isArray &&
          history.some((entry) =>
            actorKeys.some((key) => Boolean((entry as Record<string, unknown>)?.[key]))
          );
        const trackingInfo = fulfillment.tracking_info;
        shippedTrackingPresent =
          Boolean(
            trackingInfo &&
              typeof trackingInfo === 'object' &&
              Object.keys(trackingInfo as Record<string, unknown>).length > 0
          );
        sanitizedHistoryPass = Boolean(isArray && !hasActorIds);
        results.push({
          id: 'sanitized-history',
          label: 'Customer RPC status_history sanitized (no actor IDs)',
          status: isArray && !hasActorIds ? 'pass' : 'fail',
          details: isArray && !hasActorIds ? 'Sanitized array verified.' : 'Actor fields detected or history not array.',
          lastRun: timestamp,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unable to load fulfillment data.';
        sanitizedHistoryPass = false;
        results.push({
          id: 'sanitized-history',
          label: 'Customer RPC status_history sanitized (no actor IDs)',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        });
      }
    }

    if (!unshippedOrder) {
      results.push({
        id: 'tracking-gate',
        label: 'Customer RPC tracking_info null unless shipped/delivered',
        status: 'fail',
        details: previewOrders.length
          ? 'No unshipped preview order available.'
          : 'No unshipped order owned by this admin user.',
        lastRun: timestamp,
      });
    } else {
      try {
        const fulfillment = await getFulfillmentSnapshot(unshippedOrder.id);
        const trackingInfo = fulfillment.tracking_info;
        const hasTracking =
          trackingInfo &&
          typeof trackingInfo === 'object' &&
          Object.keys(trackingInfo as Record<string, unknown>).length > 0;
        unshippedTrackingPresent = hasTracking;
        trackingGatePass = !hasTracking;
        results.push({
          id: 'tracking-gate',
          label: 'Customer RPC tracking_info null unless shipped/delivered',
          status: hasTracking ? 'fail' : 'pass',
          details: hasTracking ? 'Tracking info returned before shipment.' : 'Tracking info correctly withheld.',
          lastRun: timestamp,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unable to load fulfillment data.';
        trackingGatePass = false;
        results.push({
          id: 'tracking-gate',
          label: 'Customer RPC tracking_info null unless shipped/delivered',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        });
      }
    }

    try {
      const { data, error } = await supabase.rpc('admin_get_fulfillment_guardrails' as never);
      if (error) {
        throw error;
      }
      const payload = data as GuardrailsResponse;
      if (!payload.success || !payload.data) {
        throw new Error(payload.error || 'Guardrail RPC error');
      }

      const {
        maker_orders_has_authenticated_update_policy,
        maker_orders_write_privileges_revoked_for_authenticated,
        maker_earnings_write_privileges_revoked_for_authenticated,
      } = payload.data;

      results.push({
        id: 'maker-policy',
        label: 'maker_orders has no maker UPDATE policy (RPC-only)',
        status: maker_orders_has_authenticated_update_policy ? 'fail' : 'pass',
        details: maker_orders_has_authenticated_update_policy
          ? 'Authenticated UPDATE policy detected.'
          : 'No authenticated UPDATE policy found.',
        lastRun: timestamp,
      });

      results.push({
        id: 'maker-orders-privs',
        label: 'maker_orders write privileges revoked for authenticated',
        status: maker_orders_write_privileges_revoked_for_authenticated ? 'pass' : 'fail',
        details: maker_orders_write_privileges_revoked_for_authenticated
          ? 'Authenticated write privileges revoked.'
          : 'Authenticated write privileges still present.',
        lastRun: timestamp,
      });

      results.push({
        id: 'maker-earnings-privs',
        label: 'maker_earnings write privileges revoked for authenticated',
        status: maker_earnings_write_privileges_revoked_for_authenticated ? 'pass' : 'fail',
        details: maker_earnings_write_privileges_revoked_for_authenticated
          ? 'Authenticated write privileges revoked.'
          : 'Authenticated write privileges still present.',
        lastRun: timestamp,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Guardrail RPC failed';
      results.push(
        {
          id: 'maker-policy',
          label: 'maker_orders has no maker UPDATE policy (RPC-only)',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        },
        {
          id: 'maker-orders-privs',
          label: 'maker_orders write privileges revoked for authenticated',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        },
        {
          id: 'maker-earnings-privs',
          label: 'maker_earnings write privileges revoked for authenticated',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        }
      );
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
        const { data, error } = await supabase.rpc('admin_simulate_delivered_guard' as never, {
          p_order_id: unshippedOrder.id,
        });
        if (error) {
          throw error;
        }
        const payload = data as { success?: boolean; error?: string };
        deliveredGuardPass = payload.success === false;
        results.push({
          id: 'delivered-guard',
          label: 'Delivered guard rejects unshipped orders',
          status: payload.success === false ? 'pass' : 'fail',
          details: payload.success === false ? payload.error || 'Guard enforced.' : 'Guard unexpectedly passed.',
          lastRun: timestamp,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Simulation failed.';
        deliveredGuardPass = false;
        results.push({
          id: 'delivered-guard',
          label: 'Delivered guard rejects unshipped orders',
          status: 'fail',
          details: message,
          lastRun: timestamp,
        });
      }
    }

    setChecks(results);
    setSmokeSnapshot({
      lastRun: timestamp,
      source: ordersSource,
      orders: availableOrders,
      shippedOrder,
      unshippedOrder,
      shippedTrackingPresent,
      unshippedTrackingPresent,
      sanitizedHistoryPass,
      trackingGatePass,
      deliveredGuardPass,
    });
    setRunning(false);
  }, [toast, user?.id]);

  const summary = useMemo(() => {
    if (!checks.length) {
      return 'Run checks to generate a live readiness report.';
    }
    const failed = checks.filter((check) => check.status === 'fail').length;
    return failed === 0 ? 'All checks passing.' : `${failed} check(s) failing.`;
  }, [checks]);

  const requiredEnvVars = useMemo(
    () => [
      'PREVIEW_MODE=true',
      'SUPABASE_URL=https://<project>.supabase.co',
      'SUPABASE_SERVICE_ROLE_KEY=<service_role_key>',
      'SEED_CUSTOMER_EMAIL=you@example.com',
    ],
    []
  );

  const optionalEnvVars = useMemo(
    () => [
      'SEED_MAKER_EMAIL=maker-preview@example.com',
      'SEED_ADMIN_EMAIL=admin-preview@example.com',
      'SEED_DEFAULT_PASSWORD=PreviewPass!234',
    ],
    []
  );

  const smokeOrdersLabel = useMemo(() => {
    if (!smokeSnapshot?.orders.length) {
      return '';
    }
    return smokeSnapshot.orders
      .map((order) => `${order.order_number} (${order.status})`)
      .join(', ');
  }, [smokeSnapshot]);

  const smokeSourceLabel = useMemo(() => {
    if (!smokeSnapshot) {
      return 'No runtime smoke snapshot yet. Use “Refresh Walkthrough” to load live data.';
    }
    if (!smokeSnapshot.orders.length) {
      return 'No preview orders detected in this environment.';
    }
    if (smokeSnapshot.source === 'preview') {
      return `Preview orders detected: ${smokeOrdersLabel}`;
    }
    return `Using your last 10 orders: ${smokeOrdersLabel}`;
  }, [smokeOrdersLabel, smokeSnapshot]);

  const smokeSteps = useMemo(() => {
    const previewSearch = PREVIEW_ORDER_NUMBERS[0]?.split('-').slice(0, 2).join('-') || '3D-PREVIEW';
    const adminPaymentsUrl = `/dashboard/admin/payments?search=${encodeURIComponent(previewSearch)}`;
    const makerJobsUrl = '/dashboard/maker/jobs';
    const customerDashboardUrl = '/dashboard/customer';

    if (!smokeSnapshot) {
      return [];
    }

    const hasOrders = smokeSnapshot.orders.length > 0;
    const hasShippedOrder = Boolean(smokeSnapshot.shippedOrder);
    const hasUnshippedOrder = Boolean(smokeSnapshot.unshippedOrder);
    const shippedTrackingReady = smokeSnapshot.shippedTrackingPresent === true;
    const unshippedTrackingReady = smokeSnapshot.unshippedTrackingPresent === false;
    const trackingGateReady = shippedTrackingReady && unshippedTrackingReady;

    const sanitizedHistoryLabel =
      smokeSnapshot.sanitizedHistoryPass === true
        ? 'sanitized'
        : smokeSnapshot.sanitizedHistoryPass === false
        ? 'contains actor fields'
        : 'not verified';

    const trackingDetails = hasOrders
      ? `Unshipped tracking: ${
          smokeSnapshot.unshippedTrackingPresent ? 'present (should be withheld)' : 'withheld'
        }. Shipped tracking: ${smokeSnapshot.shippedTrackingPresent ? 'present' : 'missing'}. Status history: ${sanitizedHistoryLabel}.`
      : 'No orders available to validate tracking gate.';

    return [
      {
        id: 'seed',
        title: 'Preview seed present',
        status: hasOrders ? 'ready' : 'blocked',
        details: hasOrders
          ? `Orders available for smoke run: ${smokeOrdersLabel}`
          : 'No preview orders found. Run the preview seed command before continuing.',
        actionLabel: hasOrders ? undefined : 'Copy seed command',
        action: hasOrders ? undefined : copySeedCommand,
      },
      {
        id: 'admin-payments',
        title: 'Admin Payments → confirm + assign',
        status: hasOrders ? 'ready' : 'blocked',
        details: hasOrders
          ? `Open Payments & Orders, filter by ${previewSearch}, confirm payment, and assign a maker if needed.`
          : 'Seed preview orders before opening Payments & Orders.',
        actionLabel: 'Open Admin Payments',
        action: () => navigate(adminPaymentsUrl),
      },
      {
        id: 'maker-jobs',
        title: 'Maker Jobs → ship with tracking',
        status: hasOrders && shippedTrackingReady ? 'ready' : hasOrders ? 'action' : 'blocked',
        details: hasOrders
          ? shippedTrackingReady
            ? 'Tracking attached to the shipped preview order.'
            : 'Update Maker Jobs to mark one preview order shipped and add tracking.'
          : 'Seed preview orders before opening Maker Jobs.',
        actionLabel: 'Open Maker Jobs',
        action: () => navigate(makerJobsUrl),
      },
      {
        id: 'customer-dashboard',
        title: 'Customer Dashboard → verify tracking gate',
        status: hasOrders && trackingGateReady ? 'ready' : hasOrders ? 'action' : 'blocked',
        details: trackingDetails,
        actionLabel: 'Open Customer Dashboard',
        action: () => navigate(customerDashboardUrl),
      },
      {
        id: 'delivered-guard',
        title: 'Admin → delivered guard simulation',
        status: smokeSnapshot.deliveredGuardPass ? 'ready' : hasUnshippedOrder ? 'action' : 'blocked',
        details: hasUnshippedOrder
          ? smokeSnapshot.deliveredGuardPass
            ? 'Delivered guard correctly blocks unshipped orders.'
            : 'Re-run checks to confirm the delivered guard blocks unshipped orders.'
          : 'Need an unshipped preview order to validate the delivered guard.',
        actionLabel: undefined,
        action: undefined,
      },
    ];
  }, [copySeedCommand, navigate, smokeOrdersLabel, smokeSnapshot]);

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
            <p className="text-xs text-muted-foreground mt-2">
              Runtime checks require preview seed data. If no data is present, run the Phase 3G preview seed locally.
            </p>
          </motion.div>

          <GlowCard className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-foreground">Seed &amp; Smoke</div>
                <p className="text-xs text-muted-foreground">
                  Operator command block for preview seed + runtime smoke validation.
                </p>
              </div>
              <NeonButton
                variant="ghost"
                size="sm"
                glow={false}
                onClick={() => setSeedBoxOpen((open) => !open)}
              >
                {seedBoxOpen ? (
                  <>
                    Hide <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </NeonButton>
            </div>
            {seedBoxOpen && (
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-semibold text-foreground">Required env vars</div>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {requiredEnvVars.map((envVar) => (
                      <li key={envVar} className="font-mono text-xs text-muted-foreground">
                        {envVar}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Optional env vars</div>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {optionalEnvVars.map((envVar) => (
                      <li key={envVar} className="font-mono text-xs text-muted-foreground">
                        {envVar}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">One-line preview seed command</div>
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs text-foreground font-mono">
                    {SEED_COMMAND}
                  </pre>
                  <p className="text-xs text-destructive">
                    Requires SUPABASE_SERVICE_ROLE_KEY — do not run in prod.
                  </p>
                  <NeonButton size="sm" variant="secondary" onClick={copySeedCommand}>
                    <Clipboard className="w-4 h-4 mr-2" />
                    Copy seed command
                  </NeonButton>
                </div>
              </div>
            )}
          </GlowCard>

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
                  {mode === 'checks' ? 'Re-run Checks' : 'Refresh Walkthrough'}
                </NeonButton>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <NeonButton
                size="sm"
                variant={mode === 'checks' ? 'secondary' : 'outline'}
                onClick={() => setMode('checks')}
              >
                Audit Checks
              </NeonButton>
              <NeonButton
                size="sm"
                variant={mode === 'smoke' ? 'secondary' : 'outline'}
                onClick={() => setMode('smoke')}
              >
                Runtime Smoke Walkthrough
              </NeonButton>
              {smokeSnapshot?.lastRun && (
                <span className="text-xs text-muted-foreground">
                  Last refresh: {smokeSnapshot.lastRun}
                </span>
              )}
            </div>
          </GlowCard>

          {mode === 'checks' ? (
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
          ) : (
            <GlowCard className="p-5 space-y-5">
              <div>
                <div className="text-lg font-semibold text-foreground">Runtime Smoke Walkthrough</div>
                <p className="text-sm text-muted-foreground mt-1">{smokeSourceLabel}</p>
              </div>

              {smokeSnapshot && smokeSnapshot.orders.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                  <div className="text-sm font-semibold text-foreground">No preview orders available</div>
                  <p className="text-xs text-muted-foreground">
                    Seed preview orders before running the full fulfillment loop. This environment cannot show
                    tracking until a shipped preview order exists.
                  </p>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Required env vars</div>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {requiredEnvVars.map((envVar) => (
                        <li key={envVar} className="font-mono text-xs text-muted-foreground">
                          {envVar}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs text-foreground font-mono">
                    {SEED_COMMAND}
                  </pre>
                  <NeonButton size="sm" variant="secondary" onClick={copySeedCommand}>
                    <Clipboard className="w-4 h-4 mr-2" />
                    Copy seed command
                  </NeonButton>
                </div>
              )}

              <ol className="space-y-4">
                {smokeSteps.map((step, index) => (
                  <li
                    key={step.id}
                    className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-muted-foreground">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="text-sm font-semibold text-foreground">{step.title}</div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${
                          step.status === 'ready'
                            ? 'bg-success/15 text-success'
                            : step.status === 'action'
                            ? 'bg-warning/15 text-warning'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {step.status === 'ready' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.details}</p>
                    {step.action && step.actionLabel && (
                      <NeonButton size="sm" variant="outline" onClick={step.action}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {step.actionLabel}
                      </NeonButton>
                    )}
                  </li>
                ))}
              </ol>
            </GlowCard>
          )}

          <Dialog open={seedDialogOpen} onOpenChange={setSeedDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Copy seed command manually</DialogTitle>
                <DialogDescription>
                  Your browser blocked clipboard access. Copy the command below and run it in your local terminal.
                </DialogDescription>
              </DialogHeader>
              <pre className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs text-foreground font-mono">
                {seedDialogCommand}
              </pre>
            </DialogContent>
          </Dialog>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default FulfillmentAudit;
