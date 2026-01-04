import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import NeonButton from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Wrench, ArrowRight, Loader2, CheckCircle2, 
  AlertCircle, Printer, Package
} from 'lucide-react';

type AccountRole = 'customer' | 'maker';

const MATERIAL_OPTIONS = [
  'PLA', 'PETG', 'ABS/ASA', 'TPU', 'PETG-CF', 'PLA Specialty'
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Common fields
  const [displayName, setDisplayName] = useState('');

  // Maker-specific fields
  const [dryBoxAck, setDryBoxAck] = useState(false);
  const [printerModels, setPrinterModels] = useState('');
  const [nozzleSizes, setNozzleSizes] = useState('0.4');
  const [materialsSupported, setMaterialsSupported] = useState<string[]>(['PLA']);
  const [postProcessingCapable, setPostProcessingCapable] = useState(false);
  const [hardwareInsertsCapable, setHardwareInsertsCapable] = useState(false);

  const handleRoleSelect = (selectedRole: AccountRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const toggleMaterial = (mat: string) => {
    setMaterialsSupported(prev => 
      prev.includes(mat) 
        ? prev.filter(m => m !== mat)
        : [...prev, mat]
    );
  };

  const validateMakerFields = () => {
    if (!displayName.trim()) {
      toast({ title: 'Display name required', variant: 'destructive' });
      return false;
    }
    if (!dryBoxAck) {
      toast({ 
        title: 'Dry box acknowledgement required', 
        description: 'You must confirm you have proper filament storage.',
        variant: 'destructive' 
      });
      return false;
    }
    if (!printerModels.trim()) {
      toast({ title: 'At least one printer model required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    if (!user || !role) return;

    // Validate maker fields
    if (role === 'maker' && !validateMakerFields()) {
      return;
    }

    // Validate customer fields
    if (role === 'customer' && !displayName.trim()) {
      toast({ title: 'Display name required', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      // Build profile update data (no role here - roles go in user_roles table)
      const baseData = {
        id: user.id,
        email: user.email,
        display_name: displayName.trim(),
        onboarding_completed: true,
      };

      const makerData = role === 'maker' ? {
        dry_box_required_ack: dryBoxAck,
        printer_models: printerModels.trim(),
        nozzle_sizes: nozzleSizes.trim(),
        materials_supported: materialsSupported.join(', '),
        post_processing_capable: postProcessingCapable,
        hardware_inserts_capable: hardwareInsertsCapable,
        availability_status: 'available',
      } : {};

      // Use upsert to handle both new profiles and existing ones
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ ...baseData, ...makerData }, { onConflict: 'id' });

      if (profileError) throw profileError;

      // Insert role into user_roles table (secure role storage)
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: user.id, role: role },
          { onConflict: 'user_id,role' }
        );

      if (roleError) {
        console.error('Failed to set role:', roleError);
        // Don't throw - profile was saved, role might already exist
      }

      toast({
        title: role === 'maker' ? 'Maker profile created!' : 'Welcome aboard!',
        description: 'Redirecting to your dashboard...',
      });

      // Redirect based on role
      if (role === 'maker') {
        navigate('/dashboard/maker');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AnimatedLogo size="md" />
          </div>

          {/* Role Selection Step */}
          {step === 'role' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-tech font-bold text-foreground mb-2">
                  Choose Your Path
                </h1>
                <p className="text-muted-foreground">
                  How will you use 3D3D Canada?
                </p>
              </div>

              <div className="grid gap-4">
                <GlowCard
                  variant="teal"
                  hover="glow"
                  className="p-6 cursor-pointer"
                  onClick={() => handleRoleSelect('customer')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Customer</h3>
                      <p className="text-sm text-muted-foreground">
                        Order 3D prints from local makers. Browse community models, 
                        earn rewards, and recycle plastic.
                      </p>
                    </div>
                  </div>
                </GlowCard>

                <GlowCard
                  variant="magenta"
                  hover="glow"
                  className="p-6 cursor-pointer"
                  onClick={() => handleRoleSelect('maker')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Maker</h3>
                      <p className="text-sm text-muted-foreground">
                        Fulfill print jobs and earn money. Share your printer capacity 
                        with the community. You can also order prints!
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </div>
            </motion.div>
          )}

          {/* Details Step */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlowCard className="p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-tech font-bold text-foreground mb-2">
                    {role === 'maker' ? 'Maker Application' : 'Complete Your Profile'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {role === 'maker' 
                      ? 'Tell us about your printing capabilities'
                      : 'Just a few details to get started'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Display Name (both roles) */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                      Display Name *
                    </label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="How should we call you?"
                      className="bg-background/50"
                    />
                  </div>

                  {/* Maker-specific fields */}
                  {role === 'maker' && (
                    <>
                      {/* Dry Box Acknowledgement */}
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="drybox"
                            checked={dryBoxAck}
                            onCheckedChange={(checked) => setDryBoxAck(checked === true)}
                            className="mt-0.5"
                          />
                          <label htmlFor="drybox" className="text-sm cursor-pointer">
                            <span className="font-bold text-warning">Required:</span>{' '}
                            <span className="text-foreground">
                              I have a dry box or proper filament storage and will only 
                              print with well-dried filament to ensure quality.
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Printer Models */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          <Printer className="w-3 h-3 inline mr-1" />
                          Printer Model(s) *
                        </label>
                        <Input
                          value={printerModels}
                          onChange={(e) => setPrinterModels(e.target.value)}
                          placeholder="e.g., Prusa MK4, Bambu X1C"
                          className="bg-background/50"
                        />
                      </div>

                      {/* Nozzle Sizes */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          Nozzle Sizes (mm)
                        </label>
                        <Input
                          value={nozzleSizes}
                          onChange={(e) => setNozzleSizes(e.target.value)}
                          placeholder="e.g., 0.4, 0.6"
                          className="bg-background/50"
                        />
                      </div>

                      {/* Materials Supported */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase">
                          <Package className="w-3 h-3 inline mr-1" />
                          Materials You Can Print
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {MATERIAL_OPTIONS.map((mat) => (
                            <button
                              key={mat}
                              type="button"
                              onClick={() => toggleMaterial(mat)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                materialsSupported.includes(mat)
                                  ? 'bg-secondary text-secondary-foreground'
                                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                              }`}
                            >
                              {materialsSupported.includes(mat) && (
                                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                              )}
                              {mat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 cursor-pointer">
                          <Checkbox
                            checked={postProcessingCapable}
                            onCheckedChange={(checked) => setPostProcessingCapable(checked === true)}
                          />
                          <span className="text-sm">Post-processing capable</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 cursor-pointer">
                          <Checkbox
                            checked={hardwareInsertsCapable}
                            onCheckedChange={(checked) => setHardwareInsertsCapable(checked === true)}
                          />
                          <span className="text-sm">Hardware inserts</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <NeonButton
                    onClick={handleComplete}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {role === 'maker' ? 'Submit Application' : 'Continue to Dashboard'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </NeonButton>

                  <button
                    type="button"
                    onClick={() => setStep('role')}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to role selection
                  </button>
                </div>

                {role === 'maker' && (
                  <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Maker accounts are reviewed before receiving jobs.
                  </p>
                )}
              </GlowCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;