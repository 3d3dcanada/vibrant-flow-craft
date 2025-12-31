import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  useStoreItems, useUpsertStoreItem, useDeleteStoreItem, uploadAdminImage
} from '@/hooks/useAdminData';
import { ShoppingBag, Plus, Trash2, Upload, Loader2, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const AdminStoreManager = () => {
  const { toast } = useToast();
  const { data: items, isLoading } = useStoreItems();
  const upsertItem = useUpsertStoreItem();
  const deleteItem = useDeleteStoreItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file, 'store');
      setEditing(prev => prev ? { ...prev, image_url: url } : null);
      toast({ title: 'Image uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing?.name) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    await upsertItem.mutateAsync(editing);
    setDialogOpen(false);
    setEditing(null);
    toast({ title: 'Item saved' });
  };

  const openNew = () => {
    setEditing({
      name: '',
      description: '',
      type: 'design',
      base_price_cad: null,
      credits_price: null,
      active: true
    });
    setDialogOpen(true);
  };

  const typeLabels: Record<string, string> = {
    design: 'Design',
    service: 'Service',
    bundle: 'Bundle',
    'subscription-info': 'Subscription'
  };

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-secondary" />
                Store Manager
              </h1>
              <NeonButton onClick={openNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </NeonButton>
            </div>
          </motion.div>

          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items?.map((item) => (
                <GlowCard key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{item.name}</span>
                        {!item.active && <span className="text-xs px-2 py-0.5 bg-muted rounded">Inactive</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{typeLabels[item.type] || item.type}</div>
                      <div className="text-sm text-secondary mt-1">
                        {item.base_price_cad && `$${item.base_price_cad} CAD`}
                        {item.base_price_cad && item.credits_price && ' / '}
                        {item.credits_price && `${item.credits_price} credits`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <NeonButton size="sm" variant="secondary" className="flex-1" onClick={() => { setEditing(item); setDialogOpen(true); }}>
                      Edit
                    </NeonButton>
                    <button 
                      onClick={() => deleteItem.mutate(item.id)}
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
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing?.id ? 'Edit' : 'Add'} Store Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Name *</Label>
                  <Input 
                    value={String(editing?.name || '')} 
                    onChange={e => setEditing(p => p ? {...p, name: e.target.value} : null)} 
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select 
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
                    value={String(editing?.type || 'design')}
                    onChange={e => setEditing(p => p ? {...p, type: e.target.value} : null)}
                  >
                    <option value="design">Design</option>
                    <option value="service">Service</option>
                    <option value="bundle">Bundle</option>
                    <option value="subscription-info">Subscription Info</option>
                  </select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={String(editing?.description || '')} 
                    onChange={e => setEditing(p => p ? {...p, description: e.target.value} : null)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (CAD)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={String(editing?.base_price_cad ?? '')} 
                      onChange={e => setEditing(p => p ? {...p, base_price_cad: e.target.value ? parseFloat(e.target.value) : null} : null)} 
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Credits Price</Label>
                    <Input 
                      type="number" 
                      value={String(editing?.credits_price ?? '')} 
                      onChange={e => setEditing(p => p ? {...p, credits_price: e.target.value ? parseInt(e.target.value) : null} : null)} 
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {editing?.image_url && (
                      <img src={String(editing.image_url)} alt="Preview" className="w-16 h-16 rounded object-cover" />
                    )}
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <NeonButton size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload
                    </NeonButton>
                  </div>
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
                <NeonButton onClick={handleSave} disabled={upsertItem.isPending}>
                  {upsertItem.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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

export default AdminStoreManager;
