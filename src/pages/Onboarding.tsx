import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  User, Wrench, ArrowRight, ArrowLeft, Loader2,
  CheckCircle2, Printer, Package
} from 'lucide-react';
import logo from '@/assets/3D3D_Canada_Logo.png';

type AccountRole = 'customer' | 'maker';

const MATERIAL_OPTIONS = ['PLA', 'PETG', 'ABS/ASA', 'TPU', 'PETG-CF', 'PLA Specialty'];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');

  // Maker fields
  const [dryBoxAck, setDryBoxAck] = useState(false);
  const [printerModels, setPrinterModels] = useState('');
  const [nozzleSizes, setNozzleSizes] = useState('0.4');
  const [materialsSupported, setMaterialsSupported] = useState<string[]>(['PLA']);
  const [postProcessingCapable, setPostProcessingCapable] = useState(false);
  const [hardwareInsertsCapable, setHardwareInsertsCapable] = useState(false);

  const handleRoleSelect = (r: AccountRole) => {
    setRole(r);
    setStep('details');
  };

  const toggleMaterial = (mat: string) => {
    setMaterialsSupported(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleComplete = async () => {
    if (!user || !role) return;

    if (!displayName.trim()) {
      toast({ title: 'Display name required', variant: 'destructive' });
      return;
    }
    if (role === 'maker') {
      if (!dryBoxAck) {
        toast({ title: 'Dry box acknowledgement required', variant: 'destructive' });
        return;
      }
      if (!printerModels.trim()) {
        toast({ title: 'Printer model required', variant: 'destructive' });
        return;
      }
    }

    setLoading(true);
    try {
      const profileData: Record<string, unknown> = {
        id: user.id,
        email: user.email,
        display_name: displayName.trim(),
        onboarding_completed: true,
      };

      if (role === 'maker') {
        Object.assign(profileData, {
          dry_box_required_ack: dryBoxAck,
          printer_models: printerModels.trim(),
          nozzle_sizes: nozzleSizes.trim(),
          materials_supported: materialsSupported.join(', '),
          post_processing_capable: postProcessingCapable,
          hardware_inserts_capable: hardwareInsertsCapable,
          availability_status: 'available',
        });
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData as never, { onConflict: 'id' });
      if (profileError) throw profileError;

      // Set role in user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: user.id, role } as never,
          { onConflict: 'user_id,role' }
        );
      if (roleError) console.error('Role upsert error:', roleError);

      toast({
        title: role === 'maker' ? 'Maker profile created!' : 'Welcome aboard!',
        description: 'Heading to your dashboard...',
      });

      navigate(role === 'maker' ? '/dashboard/maker' : '/dashboard/customer', { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-center pt-8 pb-4">
        <img src={logo} alt="3D3D Canada" className="h-10" />
      </div>

      <div className="flex-1 px-4 pb-8">
        <div className="max-w-sm mx-auto">
          {/* Role Selection */}
          {step === 'role' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-foreground mb-1">Choose your role</h1>
              <p className="text-sm text-muted-foreground mb-6">How will you use 3D3D Canada?</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('customer')}
                  className="w-full p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-left flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Customer</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Order 3D prints from local makers
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('maker')}
                  className="w-full p-5 rounded-xl border border-border bg-card hover:border-secondary/50 transition-all text-left flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Maker</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Fulfill print jobs & manage your workshop
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Details */}
          {step === 'details' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
              <button
                onClick={() => setStep('role')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <h1 className="text-2xl font-bold text-foreground mb-1">
                {role === 'maker' ? 'Maker setup' : 'Your profile'}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {role === 'maker' ? 'Tell us about your workshop' : 'Just a few details'}
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Display Name</Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    className="mt-1 h-12"
                  />
                </div>

                {role === 'maker' && (
                  <>
                    {/* Dry box ack */}
                    <div className="p-4 rounded-xl bg-accent/30 border border-accent">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="drybox"
                          checked={dryBoxAck}
                          onCheckedChange={(c) => setDryBoxAck(c === true)}
                          className="mt-0.5"
                        />
                        <label htmlFor="drybox" className="text-sm cursor-pointer leading-snug">
                          <span className="font-semibold">Required:</span>{' '}
                          I have proper filament storage and will print with dried filament.
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Printer className="w-3 h-3" /> Printer Model(s)
                      </Label>
                      <Input
                        value={printerModels}
                        onChange={(e) => setPrinterModels(e.target.value)}
                        placeholder="e.g., Prusa MK4, Bambu X1C"
                        className="mt-1 h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Nozzle Sizes (mm)</Label>
                      <Input
                        value={nozzleSizes}
                        onChange={(e) => setNozzleSizes(e.target.value)}
                        placeholder="0.4, 0.6"
                        className="mt-1 h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Package className="w-3 h-3" /> Materials
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {MATERIAL_OPTIONS.map((mat) => (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => toggleMaterial(mat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                              materialsSupported.includes(mat)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                            }`}
                          >
                            {materialsSupported.includes(mat) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card cursor-pointer">
                        <Checkbox
                          checked={postProcessingCapable}
                          onCheckedChange={(c) => setPostProcessingCapable(c === true)}
                        />
                        <span className="text-sm">Post-processing</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card cursor-pointer">
                        <Checkbox
                          checked={hardwareInsertsCapable}
                          onCheckedChange={(c) => setHardwareInsertsCapable(c === true)}
                        />
                        <span className="text-sm">Hardware inserts</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={handleComplete}
                disabled={loading}
                className="w-full h-12 mt-6 font-medium"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {role === 'maker' ? 'Submit application' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
