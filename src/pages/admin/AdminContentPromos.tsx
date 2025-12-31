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
  useSiteSettings, useUpdateSiteSettings, 
  usePromoProducts, useUpsertPromoProduct, useDeletePromoProduct,
  uploadAdminImage
} from '@/hooks/useAdminData';
import { FileText, Plus, Trash2, Upload, Loader2, Save, ImageIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';

const AdminContentPromos = () => {
  const { toast } = useToast();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { data: promoProducts, isLoading: productsLoading } = usePromoProducts();
  const upsertProduct = useUpsertPromoProduct();
  const deleteProduct = useDeletePromoProduct();

  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('');
  const [bannerCtaUrl, setBannerCtaUrl] = useState('');

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Record<string, unknown> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when settings load
  useState(() => {
    if (settings) {
      setBannerEnabled(settings.homepage_banner_enabled || false);
      setBannerTitle(settings.homepage_banner_title || '');
      setBannerSubtitle(settings.homepage_banner_subtitle || '');
      setBannerCtaText(settings.homepage_banner_cta_text || '');
      setBannerCtaUrl(settings.homepage_banner_cta_url || '');
    }
  });

  const handleSaveBanner = async () => {
    await updateSettings.mutateAsync({
      homepage_banner_enabled: bannerEnabled,
      homepage_banner_title: bannerTitle,
      homepage_banner_subtitle: bannerSubtitle,
      homepage_banner_cta_text: bannerCtaText,
      homepage_banner_cta_url: bannerCtaUrl
    });
    toast({ title: 'Banner settings saved' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file, 'promo');
      setEditingProduct(prev => prev ? { ...prev, image_url: url } : null);
      toast({ title: 'Image uploaded' });
    } catch (err) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    await upsertProduct.mutateAsync(editingProduct);
    setProductDialogOpen(false);
    setEditingProduct(null);
    toast({ title: 'Product saved' });
  };

  const openNewProduct = () => {
    setEditingProduct({
      name: '',
      category: 'Office',
      description: '',
      default_material: 'PLA_STANDARD',
      grams_per_unit: 10,
      minutes_per_unit: 15,
      active: true,
      month_tag: new Date().toISOString().slice(0, 7)
    });
    setProductDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-secondary" />
              Content & Promos
            </h1>
          </motion.div>

          {/* Banner Settings */}
          <GlowCard className="p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Homepage Banner</h2>
            {settingsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={bannerEnabled} onCheckedChange={setBannerEnabled} />
                  <Label>Enable Homepage Banner</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} placeholder="Banner title" />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input value={bannerSubtitle} onChange={e => setBannerSubtitle(e.target.value)} placeholder="Banner subtitle" />
                  </div>
                  <div>
                    <Label>CTA Text</Label>
                    <Input value={bannerCtaText} onChange={e => setBannerCtaText(e.target.value)} placeholder="Learn More" />
                  </div>
                  <div>
                    <Label>CTA URL</Label>
                    <Input value={bannerCtaUrl} onChange={e => setBannerCtaUrl(e.target.value)} placeholder="/promo-products" />
                  </div>
                </div>
                <NeonButton onClick={handleSaveBanner} disabled={updateSettings.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Banner Settings
                </NeonButton>
              </div>
            )}
          </GlowCard>

          {/* Display-only promo settings */}
          <GlowCard className="p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-2">Promo Config (Display Only)</h2>
            <p className="text-sm text-muted-foreground mb-4">These settings are for reference. Change in code/database directly.</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Promo Pool Cap:</span>
                <span className="ml-2 font-mono text-foreground">${settings?.promo_pool_cap_cad || 500} CAD</span>
              </div>
              <div>
                <span className="text-muted-foreground">Social Reward:</span>
                <span className="ml-2 font-mono text-foreground">{settings?.social_reward_credits || 25} credits</span>
              </div>
            </div>
          </GlowCard>

          {/* Promo Products */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-tech font-bold text-foreground">Promo Products</h2>
            <NeonButton size="sm" onClick={openNewProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </NeonButton>
          </div>

          {productsLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-secondary" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promoProducts?.map((product) => (
                <GlowCard key={product.id} className="p-4">
                  <div className="flex gap-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{product.name}</span>
                        {!product.active && <span className="text-xs px-2 py-0.5 bg-muted rounded">Inactive</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{product.category} • {product.month_tag}</div>
                      <div className="text-xs text-muted-foreground mt-1">{product.grams_per_unit}g • {product.minutes_per_unit}min</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <NeonButton size="sm" variant="secondary" onClick={() => { setEditingProduct(product); setProductDialogOpen(true); }}>
                        Edit
                      </NeonButton>
                      <button 
                        onClick={() => deleteProduct.mutate(product.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}

          {/* Product Dialog */}
          <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProduct?.id ? 'Edit' : 'Add'} Promo Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Name *</Label>
                  <Input 
                    value={String(editingProduct?.name || '')} 
                    onChange={e => setEditingProduct(p => p ? {...p, name: e.target.value} : null)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select 
                      className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
                      value={String(editingProduct?.category || 'Office')}
                      onChange={e => setEditingProduct(p => p ? {...p, category: e.target.value} : null)}
                    >
                      <option value="Office">Office</option>
                      <option value="Utility">Utility</option>
                    </select>
                  </div>
                  <div>
                    <Label>Month Tag</Label>
                    <Input 
                      type="month" 
                      value={String(editingProduct?.month_tag || '')} 
                      onChange={e => setEditingProduct(p => p ? {...p, month_tag: e.target.value} : null)} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={String(editingProduct?.description || '')} 
                    onChange={e => setEditingProduct(p => p ? {...p, description: e.target.value} : null)} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Material</Label>
                    <Input 
                      value={String(editingProduct?.default_material || 'PLA_STANDARD')} 
                      onChange={e => setEditingProduct(p => p ? {...p, default_material: e.target.value} : null)} 
                    />
                  </div>
                  <div>
                    <Label>Grams/Unit</Label>
                    <Input 
                      type="number" 
                      value={Number(editingProduct?.grams_per_unit || 10)} 
                      onChange={e => setEditingProduct(p => p ? {...p, grams_per_unit: parseInt(e.target.value)} : null)} 
                    />
                  </div>
                  <div>
                    <Label>Mins/Unit</Label>
                    <Input 
                      type="number" 
                      value={Number(editingProduct?.minutes_per_unit || 15)} 
                      onChange={e => setEditingProduct(p => p ? {...p, minutes_per_unit: parseInt(e.target.value)} : null)} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {editingProduct?.image_url && (
                      <img src={String(editingProduct.image_url)} alt="Preview" className="w-16 h-16 rounded object-cover" />
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
                    checked={Boolean(editingProduct?.active)} 
                    onCheckedChange={checked => setEditingProduct(p => p ? {...p, active: checked} : null)} 
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setProductDialogOpen(false)}>Cancel</NeonButton>
                <NeonButton onClick={handleSaveProduct} disabled={upsertProduct.isPending}>
                  {upsertProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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

export default AdminContentPromos;
