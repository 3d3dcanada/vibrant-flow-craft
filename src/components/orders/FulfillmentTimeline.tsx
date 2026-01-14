import { CheckCircle, Clock, Package, Truck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MakerOrderSnapshot = {
  status?: string | null;
  tracking_info?: Record<string, unknown> | null;
};

type FulfillmentTimelineProps = {
  orderStatus: string;
  paymentConfirmedAt?: string | null;
  statusHistory?: unknown;
  makerOrder?: MakerOrderSnapshot | null;
};

const FulfillmentTimeline = ({
  orderStatus,
  paymentConfirmedAt,
  makerOrder,
}: FulfillmentTimelineProps) => {
  const isPaymentConfirmed =
    Boolean(paymentConfirmedAt) ||
    ['paid', 'in_production', 'shipped', 'delivered'].includes(orderStatus);
  const isInProduction =
    ['in_production', 'shipped', 'delivered'].includes(orderStatus) ||
    ['in_production', 'shipped', 'completed'].includes(makerOrder?.status || '');
  const isShipped =
    ['shipped', 'delivered'].includes(orderStatus) ||
    ['shipped', 'completed'].includes(makerOrder?.status || '');
  const isDelivered = orderStatus === 'delivered';

  const steps = [
    {
      key: 'payment',
      label: 'Payment confirmed',
      description: 'We have confirmed your payment and queued the order.',
      complete: isPaymentConfirmed,
      current: !isPaymentConfirmed,
      icon: CheckCircle,
    },
    {
      key: 'production',
      label: 'In production',
      description: 'A vetted maker is preparing your print.',
      complete: isInProduction,
      current: isPaymentConfirmed && !isInProduction,
      icon: Package,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      description: 'Tracking details appear once the maker ships.',
      complete: isShipped,
      current: isInProduction && !isShipped,
      icon: Truck,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Marked delivered after carrier confirmation.',
      complete: isDelivered,
      current: isShipped && !isDelivered,
      icon: CheckCircle,
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <ol className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isPending = !step.complete && !step.current;
          const badgeStyles = step.complete
            ? 'bg-success/15 text-success border-success/50'
            : step.current
              ? 'bg-secondary/15 text-secondary border-secondary/50'
              : 'bg-muted/40 text-muted-foreground border-border';

          return (
            <li key={step.key} className="flex items-start gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border ${badgeStyles}`}>
                    {isPending ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  {step.description}
                </TooltipContent>
              </Tooltip>
              <div>
                <div className="text-sm font-medium text-foreground">{step.label}</div>
                <div className="text-xs text-muted-foreground">
                  {step.complete
                    ? 'Complete'
                    : step.current
                      ? 'In progress'
                      : 'Pending'}
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-1 mt-3 h-4 w-px bg-border" />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </TooltipProvider>
  );
};

export default FulfillmentTimeline;
