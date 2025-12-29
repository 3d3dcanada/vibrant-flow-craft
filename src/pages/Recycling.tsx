import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRecyclingDrops } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Recycle, Scale, MapPin, Leaf, Check, Calendar,
  Award, TrendingUp, Sparkles
} from 'lucide-react';

const Recycling = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: recyclingDrops, isLoading, refetch } = useRecyclingDrops();
  
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    weight_grams: '',
    material_type: 'PLA',
    location: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async () => {
    const weight = parseInt(form.weight_grams);
    if (!weight || weight <= 0) {
      toast({ title: "Error", description: "Please enter a valid weight", variant: "destructive" });
      return;
    }
    if (!form.location.trim()) {
      toast({ title: "Error", description: "Please enter a drop-off location", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const points = weight; // 1 point per gram

      const { error } = await supabase.from('recycling_drops').insert({
        user_id: user?.id,
        weight_grams: weight,
        material_type: form.material_type,
        location: form.location,
        points_earned: points,
        verified: false,
      });

      if (error) throw error;

      toast({
        title: "Drop Logged!",
        description: `Your ${weight}g recycling drop has been submitted for verification. You'll earn ${points} points once verified!`,
      });
      
      setForm({ weight_grams: '', material_type: 'PLA', location: '' });
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to log recycling drop",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <AnimatedLogo size="lg" />
        </div>
      </div>
    );
  }

  const totalRecycled = recyclingDrops?.reduce((sum: number, drop: any) => sum + drop.weight_grams, 0) || 0;
  const totalPoints = recyclingDrops?.reduce((sum: number, drop: any) => drop.verified ? sum + drop.points_earned : sum, 0) || 0;
  const pendingPoints = recyclingDrops?.reduce((sum: number, drop: any) => !drop.verified ? sum + drop.points_earned : sum, 0) || 0;

  const materials = ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'Resin', 'Mixed'];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </Link>
              <AnimatedLogo size="sm" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4">
              <Recycle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
              Print Recycling
            </h1>
            <p className="text-muted-foreground">
              Recycle your old prints and failed models. Earn points for every gram!
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <GlowCard className="p-5 text-center" variant="teal">
              <Leaf className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-3xl font-tech font-bold text-foreground">
                {(totalRecycled / 1000).toFixed(1)}kg
              </div>
              <div className="text-sm text-muted-foreground">Total Recycled</div>
            </GlowCard>

            <GlowCard className="p-5 text-center" variant="magenta">
              <Sparkles className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-3xl font-tech font-bold text-success">
                +{totalPoints}
              </div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </GlowCard>

            <GlowCard className="p-5 text-center">
              <TrendingUp className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-3xl font-tech font-bold text-warning">
                {pendingPoints}
              </div>
              <div className="text-sm text-muted-foreground">Pending Verification</div>
            </GlowCard>
          </motion.div>

          {/* Log Drop Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-secondary" />
                Log a Recycling Drop
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="weight" className="text-foreground">Weight (grams) *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="weight"
                      type="number"
                      min="1"
                      value={form.weight_grams}
                      onChange={(e) => setForm(prev => ({ ...prev, weight_grams: e.target.value }))}
                      placeholder="500"
                      className="bg-input border-border"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">g</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="material" className="text-foreground">Material Type</Label>
                  <select
                    id="material"
                    value={form.material_type}
                    onChange={(e) => setForm(prev => ({ ...prev, material_type: e.target.value }))}
                    className="w-full h-10 px-3 mt-1 rounded-md bg-input border border-border text-foreground"
                  >
                    {materials.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-foreground">Drop-off Location *</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Partner store name"
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  You'll earn <span className="text-success font-bold">+{form.weight_grams || 0} points</span> when verified
                </div>
                <NeonButton onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Log Drop'}
                </NeonButton>
              </div>
            </GlowCard>
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Recycling History</h3>
            
            {recyclingDrops && recyclingDrops.length > 0 ? (
              <div className="space-y-3">
                {recyclingDrops.map((drop: any) => (
                  <GlowCard key={drop.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${drop.verified ? 'bg-success/20' : 'bg-warning/20'}`}>
                          {drop.verified ? (
                            <Check className="w-5 h-5 text-success" />
                          ) : (
                            <Recycle className="w-5 h-5 text-warning" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {drop.weight_grams}g of {drop.material_type}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {drop.location}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(drop.created_at).toLocaleDateString('en-CA')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-tech font-bold ${drop.verified ? 'text-success' : 'text-muted-foreground'}`}>
                          +{drop.points_earned}
                        </div>
                        <div className={`text-xs ${drop.verified ? 'text-success' : 'text-warning'}`}>
                          {drop.verified ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            ) : (
              <GlowCard className="p-8 text-center">
                <Recycle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No recycling drops yet</p>
                <p className="text-sm text-muted-foreground">Start recycling to earn points!</p>
              </GlowCard>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <GlowCard className="p-5 bg-success/5 border-success/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-success/20">
                  <Award className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">How It Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Collect your failed prints, supports, and old models</li>
                    <li>• Weigh them and drop off at any partner location</li>
                    <li>• Log your drop here with the weight and location</li>
                    <li>• Staff verifies and you earn 1 point per gram!</li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Recycling;
