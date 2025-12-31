import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfile } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  User, AlertTriangle, CheckCircle, Loader2, Shield, 
  Wrench, Cpu, Droplets, Clock
} from 'lucide-react';

const MakerProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();
  
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    availability_status: 'available',
    post_processing_capable: false,
    hardware_inserts_capable: false,
    dry_box_required_ack: false,
    printer_models: '',
    nozzle_sizes: '',
    materials_supported: ''
  });

  useEffect(() => {
    if (profile) {
      setForm({
        availability_status: profile.availability_status || 'available',
        post_processing_capable: profile.post_processing_capable || false,
        hardware_inserts_capable: profile.hardware_inserts_capable || false,
        dry_box_required_ack: profile.dry_box_required_ack || false,
        printer_models: profile.printer_models || '',
        nozzle_sizes: profile.nozzle_sizes || '',
        materials_supported: profile.materials_supported || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(form)
        .eq('id', profile.id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Profile updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-tech font-bold text-foreground">Maker Profile</h1>
        <p className="text-muted-foreground">Configure your capabilities and availability</p>
      </div>

      {/* Dry Box Warning */}
      {!form.dry_box_required_ack && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-warning/50 bg-warning/10"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-warning">Dry Box Acknowledgement Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To maintain print quality, all makers must acknowledge that they have proper filament 
                drying equipment (dry box or filament dryer) and will use it for hygroscopic materials 
                like PETG, Nylon, and TPU.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability */}
        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Availability Status
          </h3>
          
          <Select 
            value={form.availability_status} 
            onValueChange={(v) => setForm(f => ({ ...f, availability_status: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Available - Accepting new jobs
                </div>
              </SelectItem>
              <SelectItem value="busy">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  Busy - Limited capacity
                </div>
              </SelectItem>
              <SelectItem value="unavailable">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  Unavailable - Not accepting jobs
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </GlowCard>

        {/* Capabilities */}
        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Capabilities
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                <span>Post-Processing (sanding, painting)</span>
              </div>
              <Switch 
                checked={form.post_processing_capable}
                onCheckedChange={(c) => setForm(f => ({ ...f, post_processing_capable: c }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <span>Hardware Inserts (heat-set, threaded)</span>
              </div>
              <Switch 
                checked={form.hardware_inserts_capable}
                onCheckedChange={(c) => setForm(f => ({ ...f, hardware_inserts_capable: c }))}
              />
            </div>
          </div>
        </GlowCard>

        {/* Equipment */}
        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-secondary" />
            Equipment Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Printer Models</Label>
              <Input 
                value={form.printer_models}
                onChange={(e) => setForm(f => ({ ...f, printer_models: e.target.value }))}
                placeholder="e.g., Bambu X1C, Prusa MK4"
              />
            </div>
            
            <div>
              <Label>Nozzle Sizes Available</Label>
              <Input 
                value={form.nozzle_sizes}
                onChange={(e) => setForm(f => ({ ...f, nozzle_sizes: e.target.value }))}
                placeholder="e.g., 0.4, 0.6, 0.8"
              />
            </div>
            
            <div>
              <Label>Materials Supported</Label>
              <Input 
                value={form.materials_supported}
                onChange={(e) => setForm(f => ({ ...f, materials_supported: e.target.value }))}
                placeholder="e.g., PLA, PETG, ABS, TPU"
              />
            </div>
          </div>
        </GlowCard>

        {/* Quality Gates */}
        <GlowCard className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Quality Gates
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="dry_box"
                checked={form.dry_box_required_ack}
                onCheckedChange={(c) => setForm(f => ({ ...f, dry_box_required_ack: !!c }))}
              />
              <div className="space-y-1">
                <Label htmlFor="dry_box" className="cursor-pointer">
                  Dry Box Acknowledgement
                </Label>
                <p className="text-xs text-muted-foreground">
                  I confirm I have proper filament drying equipment and will use it for hygroscopic 
                  materials to ensure print quality.
                </p>
              </div>
            </div>
            
            {form.dry_box_required_ack && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                Dry box requirement acknowledged
              </div>
            )}
          </div>
        </GlowCard>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <NeonButton onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </NeonButton>
      </div>
    </div>
  );
};

export default MakerProfile;
