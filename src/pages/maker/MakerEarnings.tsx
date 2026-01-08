import ComingSoonGate from '@/components/ui/ComingSoonGate';

/**
 * Maker Earnings Page
 * Currently gated as backend payment data is not yet wired.
 * Original implementation preserved in git history.
 */
export default function MakerEarnings() {
  return (
    <ComingSoonGate
      title="Maker Earnings"
      description="Earnings tracking is under development. Once payments go live, you'll see your income, payouts, and transaction history here."
      returnPath="/dashboard/maker"
      returnLabel="Back to Maker Dashboard"
    />
  );
}
