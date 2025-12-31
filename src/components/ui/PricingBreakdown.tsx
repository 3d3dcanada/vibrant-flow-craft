import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Info, DollarSign, Sparkles, UserPlus, Clock } from 'lucide-react';
import { QuoteBreakdown, MINIMUM_ORDER_TOTAL, FREE_MEMBER_DISCOUNT_RATE, SLA_TIMELINES } from '@/config/pricing';
import { formatCad, formatCredits } from '@/config/credits';
import { GlowCard } from './GlowCard';
import NeonButton from './NeonButton';

interface PricingBreakdownProps {
  breakdown: QuoteBreakdown;
  qty: number;
  isMember?: boolean;
  returnToQuote?: () => string;
  deliverySpeed?: 'standard' | 'emergency';
}

export const PricingBreakdown = ({ breakdown, qty, isMember = false, returnToQuote, deliverySpeed = 'standard' }: PricingBreakdownProps) => {
  const [showMakerPayout, setShowMakerPayout] = useState(false);
  const navigate = useNavigate();

  const displayTotal = isMember ? breakdown.memberTotal : breakdown.total;
  const displayCredits = isMember ? breakdown.memberTotalCredits : breakdown.totalCredits;

  const handleJoinFree = () => {
    navigate('/auth', { 
      state: { 
        returnTo: returnToQuote ? returnToQuote() : '/#quote',
        isSignup: true 
      } 
    });
  };

  // Filter visible line items (hide info type with show: false)
  const visibleLineItems = breakdown.lineItems.filter(item => 
    item.type !== 'info' || item.show !== false
  );

  return (
    <div className="space-y-4">
      {/* Member Savings Banner (for non-members) */}
      {!isMember && breakdown.memberSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-secondary/10 border border-secondary/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm font-bold text-foreground">
                  Save {formatCad(breakdown.memberSavings)} by becoming a free member
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(FREE_MEMBER_DISCOUNT_RATE * 100)}% off bed rental, material & post-processing
                </p>
              </div>
            </div>
            <NeonButton 
              variant="secondary" 
              size="sm"
              onClick={handleJoinFree}
              className="shrink-0"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Join Free
            </NeonButton>
          </div>
        </motion.div>
      )}

      {/* Member Pricing Applied Label */}
      {isMember && breakdown.memberSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-success text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Member pricing applied — saving {formatCad(breakdown.memberSavings)}</span>
        </motion.div>
      )}

      {/* Total Display */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {isMember ? 'Member Total' : 'Estimated Total'}
          </p>
          <p className="text-[10px] text-success mt-1">
            ✓ Designer Royalty included
          </p>
        </div>
        <div className="text-right">
          <motion.div
            className="text-4xl font-tech font-bold text-secondary"
            key={displayCredits}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatCredits(displayCredits)}
          </motion.div>
          <div className="text-sm text-muted-foreground">
            {formatCad(displayTotal)}
          </div>
          {!isMember && breakdown.memberSavings > 0 && (
            <div className="text-xs text-secondary mt-1">
              Member price: {formatCad(breakdown.memberTotal)}
            </div>
          )}
        </div>
      </div>

      {/* Line Items Breakdown */}
      <GlowCard className="p-4 bg-background/50">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
          <Info className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Pricing Breakdown {qty > 1 && `(×${qty})`}
          </span>
        </div>

        <div className="space-y-2">
          {visibleLineItems.map((item, index) => (
            <motion.div
              key={`${item.label}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex justify-between items-start text-sm ${
                item.type === 'discount' ? 'text-success' : 
                item.type === 'adjustment' ? 'text-warning' : 
                item.type === 'rush' ? 'text-primary' :
                item.type === 'info' ? 'text-muted-foreground/70 italic' :
                'text-muted-foreground'
              }`}
            >
              <div className="flex-1">
                <span className={
                  item.type === 'discount' || item.type === 'adjustment' || item.type === 'rush' 
                    ? 'font-medium' : ''
                }>
                  {item.label}
                </span>
                {item.details && (
                  <span className="block text-[10px] opacity-70">
                    {item.details}
                  </span>
                )}
              </div>
              <span className={`font-mono ${
                item.type === 'discount' ? 'text-success' : 
                item.type === 'adjustment' ? 'text-warning' : 
                item.type === 'rush' ? 'text-primary' :
                item.type === 'info' ? 'text-muted-foreground/50' :
                'text-foreground'
              }`}>
                {item.amount === 0 && item.type === 'info' 
                  ? '—' 
                  : `${item.amount < 0 ? '-' : ''}${formatCad(Math.abs(item.amount))}`
                }
              </span>
            </motion.div>
          ))}
        </div>

        {/* Subtotal & Total */}
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono text-foreground">{formatCad(breakdown.subtotal)}</span>
          </div>
          {breakdown.minimumAdjustment > 0 && (
            <div className="flex justify-between text-xs text-warning">
              <span>Min. order: {formatCad(MINIMUM_ORDER_TOTAL)}</span>
              <span>+{formatCad(breakdown.minimumAdjustment)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-1">
            <span className="text-foreground">Total</span>
            <div className="text-right">
              <span className="text-secondary">{formatCredits(breakdown.totalCredits)}</span>
              <span className="block text-xs text-muted-foreground font-normal">
                {formatCad(breakdown.total)}
              </span>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Estimated Turnaround (SLA) */}
      <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Estimated Turnaround
          </span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <span className="text-foreground font-medium">Standard prints:</span> {SLA_TIMELINES.standard}
          </p>
          <p>
            <span className="text-foreground font-medium">Large jobs:</span> {SLA_TIMELINES.largeJobs}
          </p>
          <p>
            <span className={deliverySpeed === 'emergency' ? 'text-primary font-medium' : 'text-foreground font-medium'}>
              Emergency (&lt;24h):
            </span>{' '}
            <span className={deliverySpeed === 'emergency' ? 'text-primary' : ''}>
              {SLA_TIMELINES.emergency}
            </span>
          </p>
        </div>
      </div>

      {/* Maker Payout (Collapsible) */}
      <div className="border border-border/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowMakerPayout(!showMakerPayout)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            Show Maker Payout Estimate
          </span>
          {showMakerPayout ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        <AnimatePresence>
          {showMakerPayout && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 space-y-2 border-t border-border/30 bg-muted/10">
                <p className="text-[10px] text-muted-foreground mb-3">
                  Estimated payout to the local maker for this order:
                </p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bed Rental</span>
                  <span className="font-mono text-foreground">{formatCad(breakdown.makerPayout.bedRental)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Material Share</span>
                  <span className="font-mono text-foreground">{formatCad(breakdown.makerPayout.materialShare)}</span>
                </div>
                
                {breakdown.makerPayout.postProcessingShare > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Post-Processing</span>
                    <span className="font-mono text-foreground">{formatCad(breakdown.makerPayout.postProcessingShare)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/30">
                  <span className="text-foreground">Maker Total</span>
                  <span className="text-secondary">{formatCad(breakdown.makerPayout.total)}</span>
                </div>
                
                <p className="text-[10px] text-muted-foreground/70 mt-2">
                  💡 This is an estimate. Actual payout depends on maker tier and print complexity.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PricingBreakdown;
