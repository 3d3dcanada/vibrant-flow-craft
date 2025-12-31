import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info, DollarSign, Coins } from 'lucide-react';
import { QuoteBreakdown, MINIMUM_ORDER_TOTAL } from '@/config/pricing';
import { formatCad, formatCredits } from '@/config/credits';
import { GlowCard } from './GlowCard';

interface PricingBreakdownProps {
  breakdown: QuoteBreakdown;
  qty: number;
}

export const PricingBreakdown = ({ breakdown, qty }: PricingBreakdownProps) => {
  const [showMakerPayout, setShowMakerPayout] = useState(false);

  return (
    <div className="space-y-4">
      {/* Total Display */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Estimated Total
          </p>
          <p className="text-[10px] text-success mt-1">
            ✓ Includes Designer Royalty
          </p>
        </div>
        <div className="text-right">
          <motion.div
            className="text-4xl font-tech font-bold text-secondary"
            key={breakdown.totalCredits}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatCredits(breakdown.totalCredits)}
          </motion.div>
          <div className="text-sm text-muted-foreground">
            {formatCad(breakdown.total)}
          </div>
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
          {breakdown.lineItems.map((item, index) => (
            <motion.div
              key={`${item.label}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex justify-between items-start text-sm ${
                item.type === 'discount' ? 'text-success' : 
                item.type === 'adjustment' ? 'text-warning' : 
                'text-muted-foreground'
              }`}
            >
              <div className="flex-1">
                <span className={item.type === 'discount' || item.type === 'adjustment' ? 'font-medium' : ''}>
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
                'text-foreground'
              }`}>
                {item.amount < 0 ? '-' : ''}{formatCad(Math.abs(item.amount))}
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
