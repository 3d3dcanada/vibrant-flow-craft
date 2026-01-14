import { CheckCircle, ClipboardCheck, Package, Truck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatusHistoryEntry {
  to?: string;
  changed_at?: string;
}

interface MakerOrderSnapshot {
  status?: string | null;
  assigned_at?: string | null;
  tracking_info?: {
    carrier?: string | null;
    tracking_number?: string | null;
    shipped_at?: string | null;
  } | null;
}

interface FulfillmentTimelineProps {
  orderStatus: string;
  statusHistory?: StatusHistoryEntry[] | string | null;
  paymentConfirmedAt?: string | null;
  makerOrder?: MakerOrderSnapshot | null;
  showTracking?: boolean;
  className?: string;
}

const TOOLTIP_MESSAGES: Record<string, string> = {
  assigned: 'Admin action: a maker is explicitly assigned before work can begin.',
  shipped: 'Maker action: tracking number and carrier are required to mark shipped.',
  delivered: 'Admin action: delivery can only be confirmed after the maker ships the order.',
};

const normalizeHistory = (statusHistory?: StatusHistoryEntry[] | string | null) => {
  if (!statusHistory) return [] as StatusHistoryEntry[];
  if (Array.isArray(statusHistory)) return statusHistory;
  if (typeof statusHistory === 'string') {
    try {
      const parsed = JSON.parse(statusHistory) as StatusHistoryEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [] as StatusHistoryEntry[];
    }
  }
  return [] as StatusHistoryEntry[];
};

const getHistoryTimestamp = (statusHistory: StatusHistoryEntry[], status: string) => {
  const match = [...statusHistory].reverse().find((entry) => entry?.to === status && entry?.changed_at);
  return match?.changed_at ?? null;
};

const formatTimestamp = (timestamp?: string | null) => {
  if (!timestamp) return 'Not yet recorded';
  return new Date(timestamp).toLocaleString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InfoTooltip = ({ message }: { message: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground">
        <Info className="h-3.5 w-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-xs text-xs">
      {message}
    </TooltipContent>
  </Tooltip>
);

const FulfillmentTimeline = ({
  orderStatus,
  statusHistory,
  paymentConfirmedAt,
  makerOrder,
  showTracking = true,
  className,
}: FulfillmentTimelineProps) => {
  const history = normalizeHistory(statusHistory);
  const makerStatus = makerOrder?.status ?? null;
  const trackingInfo = makerOrder?.tracking_info ?? null;

  const paidAt = paymentConfirmedAt || getHistoryTimestamp(history, 'paid');
  const assignedAt = makerOrder?.assigned_at ?? null;
  const inProductionAt = getHistoryTimestamp(history, 'in_production');
  const shippedAt = trackingInfo?.shipped_at || getHistoryTimestamp(history, 'shipped');
  const deliveredAt = getHistoryTimestamp(history, 'delivered');

  const paidComplete = ['paid', 'in_production', 'shipped', 'delivered'].includes(orderStatus) || !!paidAt;
  const assignedComplete = !!assignedAt || ['assigned', 'in_production', 'shipped', 'completed'].includes(makerStatus ?? '');
  const inProductionComplete =
    ['in_production', 'shipped', 'completed'].includes(makerStatus ?? '') ||
    ['in_production', 'shipped', 'delivered'].includes(orderStatus);
  const shippedComplete =
    ['shipped', 'completed'].includes(makerStatus ?? '') ||
    ['shipped', 'delivered'].includes(orderStatus);
  const deliveredComplete = orderStatus === 'delivered' || !!deliveredAt;

  const steps = [
    {
      key: 'paid',
      label: 'Paid',
      actor: 'Admin action',
      timestamp: paidAt,
      complete: paidComplete,
      icon: CheckCircle,
    },
    {
      key: 'assigned',
      label: 'Assigned',
      actor: 'Admin action',
      timestamp: assignedAt,
      complete: assignedComplete,
      icon: ClipboardCheck,
    },
    {
      key: 'in_production',
      label: 'In Production',
      actor: 'Maker action',
      timestamp: inProductionAt,
      complete: inProductionComplete,
      icon: Package,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      actor: 'Maker action',
      timestamp: shippedAt,
      complete: shippedComplete,
      icon: Truck,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      actor: 'Admin action',
      timestamp: deliveredAt,
      complete: deliveredComplete,
      icon: CheckCircle,
    },
  ];

  return (
    <TooltipProvider>
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          const tooltipMessage = TOOLTIP_MESSAGES[step.key];
          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full border flex items-center justify-center',
                    step.complete ? 'bg-secondary/20 border-secondary text-secondary' : 'border-border text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-border/60 mt-1" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{step.label}</p>
                  {tooltipMessage && <InfoTooltip message={tooltipMessage} />}
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    {step.actor}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatTimestamp(step.timestamp)}</p>
                {step.key === 'shipped' && showTracking && (
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <div>
                      Carrier: {trackingInfo?.carrier || 'Not yet recorded'}
                    </div>
                    <div>
                      Tracking #: {trackingInfo?.tracking_number || 'Not yet recorded'}
                    </div>
                    <div>
                      Shipped at: {trackingInfo?.shipped_at ? formatTimestamp(trackingInfo?.shipped_at) : 'Not yet recorded'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default FulfillmentTimeline;
