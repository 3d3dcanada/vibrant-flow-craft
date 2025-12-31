import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMakerFilament, useCreateFilament, useUpdateFilament, useDeleteFilament, type MakerFilament as MakerFilamentType } from '@/hooks/useMakerData';
import { useToast } from '@/hooks/use-toast';
import { 
  Droplets, Plus, AlertTriangle, Trash2, Loader2, Edit
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const dryStatusColors: Record<MakerFilamentType['dry_status'], string> = {
  dry: 'bg-green-500',
  needs_drying: 'bg-warning',
  unknown: 'bg-muted-foreground'
};

const MakerFilament = () => {
  const { toast } = useToast();
  const { data: filament = [], isLoading } = useMakerFilament();
  const createMutation = useCreateFilament();
  const updateMutation = useUpdateFilament();
  const deleteMutation = useDeleteFilament();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<MakerFilamentType | null>(null);
  
  const [form, setForm] = useState({
    material: 'PLA',
    color: '',
    brand: '',
    grams_remaining: 1000,
    dry_status: 'unknown' as MakerFilamentType['dry_status'],
    notes: ''
  });

  const resetForm = () => {
    setForm({
      material: 'PLA',
      color: '',
      brand: '',
      grams_remaining: 1000,
      dry_status: 'unknown',
      notes: ''
    });
    setEditingFilament(null);
  };

  const handleOpenDialog = (fil?: MakerFilamentType) => {
    if (fil) {
      setEditingFilament(fil);
      setForm({
        material: fil.material,
        color: fil.color,
        brand: fil.brand || '',
        grams_remaining: fil.grams_remaining,
        dry_status: fil.dry_status,
        notes: fil.notes || ''
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingFilament) {
        await updateMutation.mutateAsync({ filamentId: editingFilament.id, updates: form });
        toast({ title: 'Filament updated' });
      } else {
        await createMutation.mutateAsync(form);
        toast({ title: 'Filament added' });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save filament', variant: 'destructive' });
    }
  };

  const handleDelete = async (filamentId: string) => {
    if (!confirm('Delete this filament spool?')) return;
    try {
      await deleteMutation.mutateAsync(filamentId);
      toast({ title: 'Filament deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleQuickUpdate = async (fil: MakerFilamentType, updates: Partial<MakerFilamentType>) => {
    try {
      await updateMutation.mutateAsync({ filamentId: fil.id, updates });
      toast({ title: 'Updated' });
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const needsDryingCount = filament.filter(f => f.dry_status === 'needs_drying').length;
  const lowFilamentCount = filament.filter(f => f.grams_remaining < 100).length;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-tech font-bold text-foreground">Filament Inventory</h1>
          <p className="text-muted-foreground">Track your materials and dry status</p>
        </div>
        <NeonButton onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Spool
        </NeonButton>
      </div>

      {/* Warnings */}
      {(needsDryingCount > 0 || lowFilamentCount > 0) && (
        <div className="flex gap-4">
          {needsDryingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-warning/20 border border-warning/50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm">{needsDryingCount} spool(s) need drying</span>
            </div>
          )}
          {lowFilamentCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive/50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm">{lowFilamentCount} spool(s) low (&lt;100g)</span>
            </div>
          )}
        </div>
      )}

      {filament.length === 0 ? (
        <GlowCard className="p-12 text-center">
          <Droplets className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No filament yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first spool to start tracking</p>
          <NeonButton onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Spool
          </NeonButton>
        </GlowCard>
      ) : (
        <GlowCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Dry Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filament.map(fil => (
                <TableRow key={fil.id} className={fil.grams_remaining < 100 ? 'bg-destructive/10' : ''}>
                  <TableCell className="font-medium">{fil.material}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: fil.color.toLowerCase() }}
                      />
                      {fil.color}
                    </div>
                  </TableCell>
                  <TableCell>{fil.brand || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={fil.grams_remaining < 100 ? 'text-destructive font-medium' : ''}>
                        {fil.grams_remaining}g
                      </span>
                      {fil.grams_remaining < 100 && (
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={fil.dry_status}
                      onValueChange={(v: any) => handleQuickUpdate(fil, { dry_status: v })}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${dryStatusColors[fil.dry_status]}`} />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Dry</SelectItem>
                        <SelectItem value="needs_drying">Needs Drying</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">{fil.notes || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenDialog(fil)}
                        className="p-1.5 hover:bg-muted rounded"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => handleDelete(fil.id)}
                        className="p-1.5 hover:bg-destructive/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlowCard>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFilament ? 'Edit Filament' : 'Add Filament'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Material *</Label>
                <Select value={form.material} onValueChange={(v) => setForm(f => ({ ...f, material: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="PETG">PETG</SelectItem>
                    <SelectItem value="ABS">ABS</SelectItem>
                    <SelectItem value="ASA">ASA</SelectItem>
                    <SelectItem value="TPU">TPU</SelectItem>
                    <SelectItem value="Nylon">Nylon</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="PVA">PVA</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Color *</Label>
                <Input 
                  value={form.color}
                  onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                  placeholder="e.g., Black, Red, Galaxy Purple"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand</Label>
                <Input 
                  value={form.brand}
                  onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))}
                  placeholder="e.g., Bambu, Polymaker"
                />
              </div>
              <div>
                <Label>Grams Remaining</Label>
                <Input 
                  type="number"
                  value={form.grams_remaining}
                  onChange={(e) => setForm(f => ({ ...f, grams_remaining: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label>Dry Status</Label>
              <Select value={form.dry_status} onValueChange={(v: any) => setForm(f => ({ ...f, dry_status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry (ready to use)</SelectItem>
                  <SelectItem value="needs_drying">Needs Drying</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea 
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <NeonButton variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </NeonButton>
            <NeonButton 
              onClick={handleSave}
              disabled={!form.material || !form.color || createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Save'
              )}
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MakerFilament;
