import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlowCard } from '../ui/GlowCard';
import NeonButton from '../ui/NeonButton';
import { Printer, Cpu, CircleDot, Recycle, ArrowRight } from 'lucide-react';

const BuybackPromoSection = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: Printer,
      title: 'Sell a Printer',
      desc: 'Entry-level to prosumer. Working or for parts.',
      price: '$50 – $900+ CAD',
      color: 'secondary',
    },
    {
      icon: Cpu,
      title: 'Free Electronics Drop-off',
      desc: 'Motors, PSUs, boards, fans — we repurpose it all.',
      price: 'Free',
      color: 'success',
    },
    {
      icon: CircleDot,
      title: 'Sell Filament Spools',
      desc: 'Partially used? We buy clean, dry spools.',
      price: '30-50% of retail',
      color: 'primary',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 text-success text-sm font-medium mb-6">
            <Recycle className="w-4 h-4" />
            CIRCULAR ECONOMY
          </div>
          <h2 className="text-3xl md:text-4xl font-tech font-bold text-foreground mb-4">
            Got an Old 3D Printer?{' '}
            <span className="gradient-text">We'll Buy It or Recycle It.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fair prices, Atlantic roots, and a commitment to keeping good machines out of landfills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlowCard 
                variant={card.color as 'teal' | 'magenta' | undefined}
                hover="lift"
                className="h-full cursor-pointer"
                onClick={() => navigate('/recycle-buyback')}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border`}
                    style={{
                      backgroundColor: `hsl(var(--${card.color}) / 0.1)`,
                      borderColor: `hsl(var(--${card.color}) / 0.3)`,
                    }}
                  >
                    <card.icon 
                      className="w-6 h-6" 
                      style={{ color: `hsl(var(--${card.color}))` }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-tech font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                    <div 
                      className="text-lg font-tech font-bold"
                      style={{ color: `hsl(var(--${card.color}))` }}
                    >
                      {card.price}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <NeonButton
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={() => navigate('/recycle-buyback')}
          >
            Get a Quote
          </NeonButton>
        </div>
      </div>
    </section>
  );
};

export default BuybackPromoSection;
