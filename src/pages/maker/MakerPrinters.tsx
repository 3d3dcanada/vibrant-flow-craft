import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMakerPrinters, useCreatePrinter, useUpdatePrinter, useDeletePrinter, useTestPrinterConnection, MakerPrinter } from '@/hooks/useMakerData';
import { useToast } from '@/hooks/use-toast';
import { 
  Printer, Plus, Wifi, WifiOff, Settings, Trash2, 
  Loader2, RefreshCw, CheckCircle, XCircle, Thermometer
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';

const statusColors: Record<MakerPrinter['status'], string> = {
  available: 'bg-green-500',
  printing: 'bg-secondary',
  maintenance: 'bg-warning',
  offline: 'bg-destructive'
};

const MakerPrinters = () => {
  const { toast } = useToast();
  const { data: printers = [], isLoading } = useMakerPrinters();
  const createMutation = useCreatePrinter();
  const updateMutation = useUpdatePrinter();
  const deleteMutation = useDeletePrinter();
  const testConnectionMutation = useTestPrinterConnection();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<MakerPrinter | null>(null);
  const [testingPrinterId, setTestingPrinterId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    model: '',
    nozzle_sizes: ['0.4'],
    job_size: 'medium',
    materials_supported: ['PLA'],
    status: 'available' as MakerPrinter['status'],
    notes: '',
    connection_type: 'none' as MakerPrinter['connection_type'],
    connection_url: '',
    api_key: ''
  });

  const resetForm = () => {
    setForm({
      model: '',
      nozzle_sizes: ['0.4'],
      job_size: 'medium',
      materials_supported: ['PLA'],
      status: 'available',
      notes: '',
      connection_type: 'none',
      connection_url: '',
      api_key: ''
    });
    setEditingPrinter(null);
  };

  const handleOpenDialog = (printer?: MakerPrinter) => {
    if (printer) {
      setEditingPrinter(printer);
      setForm({
        model: printer.model,
        nozzle_sizes: printer.nozzle_sizes,
        job_size: printer.job_size,
        materials_supported: printer.materials_supported,
        status: printer.status,
        notes: printer.notes || '',
        connection_type: printer.connection_type,
        connection_url: printer.connection_url || '',
        api_key: '' // Never show saved key
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingPrinter) {
        const updates: any = { ...form };
        if (!form.api_key) delete updates.api_key; // Don't overwrite if empty
        await updateMutation.mutateAsync({ printerId: editingPrinter.id, updates });
        toast({ title: 'Printer updated' });
      } else {
        await createMutation.mutateAsync(form);
        toast({ title: 'Printer added' });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save printer', variant: 'destructive' });
    }
  };

  const handleDelete = async (printerId: string) => {
    if (!confirm('Delete this printer?')) return;
    try {
      await deleteMutation.mutateAsync(printerId);
      toast({ title: 'Printer deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete printer', variant: 'destructive' });
    }
  };

  const handleTestConnection = async (printer: MakerPrinter) => {
    setTestingPrinterId(printer.id);
    try {
      const result = await testConnectionMutation.mutateAsync(printer.id);
      if (result.connected) {
        toast({ 
          title: 'Connected!', 
          description: `State: ${result.state}${result.progress ? ` (${Math.round(result.progress)}%)` : ''}` 
        });
      } else {
        toast({ 
          title: 'Connection failed', 
          description: result.error || 'Could not reach printer', 
          variant: 'destructive' 
        });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setTestingPrinterId(null);
    }
  };

  const PrinterCard = ({ printer }: { printer: MakerPrinter }) => {
    const lastStatus = printer.last_status as any;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GlowCard className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusColors[printer.status]}`} />
              <span className="font-medium">{printer.model}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleOpenDialog(printer)}
                className="p-1.5 hover:bg-muted rounded"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
              <button 
                onClick={() => handleDelete(printer.id)}
                className="p-1.5 hover:bg-destructive/20 rounded"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-muted-foreground">Nozzles:</span>
              <span className="ml-1">{printer.nozzle_sizes.join(', ')}mm</span>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <span className="ml-1 capitalize">{printer.job_size}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Materials:</span>
              <span className="ml-1">{printer.materials_supported.join(', ')}</span>
            </div>
          </div>

          {/* Connection status */}
          {printer.connection_type !== 'none' && (
            <div className="p-3 rounded-lg bg-muted/30 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {lastStatus?.connected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm capitalize">{printer.connection_type}</span>
                </div>
                <Badge variant={lastStatus?.connected ? 'secondary' : 'destructive'} className="text-xs">
                  {lastStatus?.state || 'Unknown'}
                </Badge>
              </div>
              
              {lastStatus?.temps && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Bed: {lastStatus.temps.bed?.toFixed(1) || '--'}°C
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Hotend: {lastStatus.temps.hotend?.toFixed(1) || '--'}°C
                  </div>
                </div>
              )}
              
              {lastStatus?.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round(lastStatus.progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all"
                      style={{ width: `${lastStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {printer.last_seen_at && (
                <div className="text-xs text-muted-foreground mt-2">
                  Last seen: {new Date(printer.last_seen_at).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {printer.connection_type !== 'none' && (
              <>
                <NeonButton 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleTestConnection(printer)}
                  disabled={testingPrinterId === printer.id}
                >
                  {testingPrinterId === printer.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" /> Test
                    </>
                  )}
                </NeonButton>
              </>
            )}
            <Badge variant="outline" className="capitalize">
              {printer.status}
            </Badge>
          </div>
        </GlowCard>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-tech font-bold text-foreground">Printer Fleet</h1>
          <p className="text-muted-foreground">Manage your 3D printers and connectivity</p>
        </div>
        <NeonButton onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Printer
        </NeonButton>
      </div>

      {printers.length === 0 ? (
        <GlowCard className="p-12 text-center">
          <Printer className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No printers yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first printer to get started</p>
          <NeonButton onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Printer
          </NeonButton>
        </GlowCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {printers.map(printer => (
            <PrinterCard key={printer.id} printer={printer} />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPrinter ? 'Edit Printer' : 'Add Printer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label>Printer Model *</Label>
              <Input 
                value={form.model}
                onChange={(e) => setForm(f => ({ ...f, model: e.target.value }))}
                placeholder="e.g., Bambu X1 Carbon, Prusa MK4"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nozzle Sizes</Label>
                <Input 
                  value={form.nozzle_sizes.join(', ')}
                  onChange={(e) => setForm(f => ({ ...f, nozzle_sizes: e.target.value.split(',').map(s => s.trim()) }))}
                  placeholder="0.4, 0.6"
                />
              </div>
              <div>
                <Label>Job Size</Label>
                <Select value={form.job_size} onValueChange={(v) => setForm(f => ({ ...f, job_size: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Materials Supported</Label>
              <Input 
                value={form.materials_supported.join(', ')}
                onChange={(e) => setForm(f => ({ ...f, materials_supported: e.target.value.split(',').map(s => s.trim()) }))}
                placeholder="PLA, PETG, ABS"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea 
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any notes about this printer..."
              />
            </div>

            {/* Connectivity Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Connectivity (Optional)
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Connection Type</Label>
                  <Select value={form.connection_type} onValueChange={(v: any) => setForm(f => ({ ...f, connection_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="octoprint">OctoPrint</SelectItem>
                      <SelectItem value="moonraker">Moonraker (Klipper)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.connection_type !== 'none' && (
                  <>
                    <div>
                      <Label>Connection URL</Label>
                      <Input 
                        value={form.connection_url}
                        onChange={(e) => setForm(f => ({ ...f, connection_url: e.target.value }))}
                        placeholder="http://192.168.1.100:5000"
                      />
                    </div>

                    {form.connection_type === 'octoprint' && (
                      <div>
                        <Label>API Key {editingPrinter && '(leave blank to keep existing)'}</Label>
                        <Input 
                          type="password"
                          value={form.api_key}
                          onChange={(e) => setForm(f => ({ ...f, api_key: e.target.value }))}
                          placeholder="Enter OctoPrint API key"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <NeonButton variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </NeonButton>
            <NeonButton 
              onClick={handleSave}
              disabled={!form.model || createMutation.isPending || updateMutation.isPending}
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
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerPrinters;
