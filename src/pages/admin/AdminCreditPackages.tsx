import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  useCreditPackages, useUpsertCreditPackage, useDeleteCreditPackage
} from '@/hooks/useAdminData';
import { CreditCard, Plus, Trash2, Loader2, Coins, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const AdminCreditPackages = () => {
  const { toast } = useToast();
  const { data: packages, isLoading } = useCreditPackages();
  const upsertPkg = useUpsertCreditPackage();
  const deletePkg = useDeleteCreditPackage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const handleSave = async () => {
    if (!editing?.name || !editing?.price_cad || !editing?.credits_amount) {
      toast({ title: 'Name, price, and credits required', variant: 'destructive' });
      return;
    }
    await upsertPkg.mutateAsync(editing);
    setDialogOpen(false);
    setEditing(null);
    toast({ title: 'Package saved' });
  };

  const openNew = () => {
    setEditing({
      name: '',
      price_cad: 10,
      credits_amount: 100,
      bonus_credits: 0,
      tagline: '',
      active: true
    });
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-secondary" />
                Credit Packages
              </h1>
              <NeonButton onClick={openNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </NeonButton>
            </div>
            <p className="text-muted-foreground mt-2">
              Manage credit packages shown in the Credits Store. Standard rate: 10 credits = $1 CAD.
            </p>
          </motion.div>

          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages?.map((pkg) => (
                <GlowCard key={pkg.id} className={`p-5 ${pkg.tagline ? 'border-secondary' : ''}`}>
                  {pkg.tagline && (
                    <div className="text-xs font-bold text-secondary mb-2 uppercase">{pkg.tagline}</div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-secondary/20">
                      <Coins className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{pkg.name}</div>
                      {!pkg.active && <span className="text-xs px-2 py-0.5 bg-muted rounded">Inactive</span>}
                    </div>
                  </div>
                  <div className="text-3xl font-tech font-bold text-foreground mb-1">
                    {pkg.credits_amount} <span className="text-sm text-muted-foreground">credits</span>
                  </div>
                  {pkg.bonus_credits > 0 && (
                    <div className="inline-flex items-center gap-1 text-sm text-success mb-2">
                      <Sparkles className="w-3 h-3" />
                      +{pkg.bonus_credits} bonus
                    </div>
                  )}
                  <div className="text-lg font-bold text-secondary">${pkg.price_cad} CAD</div>
                  <div className="flex gap-2 mt-4">
                    <NeonButton size="sm" variant="secondary" className="flex-1" onClick={() => { setEditing(pkg); setDialogOpen(true); }}>
                      Edit
                    </NeonButton>
                    <button 
                      onClick={() => deletePkg.mutate(pkg.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editing?.id ? 'Edit' : 'Add'} Credit Package</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Name *</Label>
                  <Input 
                    value={String(editing?.name || '')} 
                    onChange={e => setEditing(p => p ? {...p, name: e.target.value} : null)} 
                    placeholder="e.g., Starter, Pro, Enterprise"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (CAD) *</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={String(editing?.price_cad ?? '')} 
                      onChange={e => setEditing(p => p ? {...p, price_cad: parseFloat(e.target.value)} : null)} 
                    />
                  </div>
                  <div>
                    <Label>Credits Amount *</Label>
                    <Input 
                      type="number" 
                      value={String(editing?.credits_amount ?? '')} 
                      onChange={e => setEditing(p => p ? {...p, credits_amount: parseInt(e.target.value)} : null)} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Bonus Credits</Label>
                  <Input 
                    type="number" 
                    value={String(editing?.bonus_credits ?? 0)} 
                    onChange={e => setEditing(p => p ? {...p, bonus_credits: parseInt(e.target.value) || 0} : null)} 
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Tagline (optional)</Label>
                  <Input 
                    value={String(editing?.tagline || '')} 
                    onChange={e => setEditing(p => p ? {...p, tagline: e.target.value} : null)} 
                    placeholder="e.g., BEST VALUE, MOST POPULAR"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={Boolean(editing?.active)} 
                    onCheckedChange={checked => setEditing(p => p ? {...p, active: checked} : null)} 
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</NeonButton>
                <NeonButton onClick={handleSave} disabled={upsertPkg.isPending}>
                  {upsertPkg.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save
                </NeonButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default AdminCreditPackages;
