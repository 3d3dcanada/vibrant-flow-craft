import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminMakersList, useUpdateMakerVerification } from '@/hooks/useAdminData';
import { Users, CheckCircle, XCircle, Loader2, MapPin, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const AdminMakerManager = () => {
  const { toast } = useToast();
  const { data: makers, isLoading } = useAdminMakersList();
  const updateVerification = useUpdateMakerVerification();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaker, setSelectedMaker] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState('');

  const handleVerify = async (verified: boolean) => {
    if (!selectedMaker?.id) return;
    await updateVerification.mutateAsync({
      makerId: String(selectedMaker.id),
      verified,
      notes
    });
    toast({ title: verified ? 'Maker verified' : 'Verification removed' });
    setDialogOpen(false);
  };

  const openVerifyDialog = (maker: Record<string, unknown>) => {
    setSelectedMaker(maker);
    setNotes(String(maker.maker_verification_notes || ''));
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-secondary" />
              Maker Manager
            </h1>
            <p className="text-muted-foreground mt-2">Verify makers and manage their profiles</p>
          </motion.div>

          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
          ) : (
            <div className="space-y-4">
              {makers?.map((maker) => (
                <GlowCard key={maker.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold shrink-0">
                      {(maker.display_name || maker.full_name || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {maker.display_name || maker.full_name || 'Unnamed Maker'}
                        </span>
                        {maker.maker_verified ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-success/20 text-success rounded">
                            <Shield className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded">Unverified</span>
                        )}
                        {!maker.onboarding_completed && (
                          <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">Incomplete</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {maker.city && (
                          <>
                            <MapPin className="w-3 h-3" />
                            {maker.city}, {maker.province}
                          </>
                        )}
                        <span className="capitalize">• {maker.availability_status || 'unknown'}</span>
                      </div>
                      {maker.maker_verification_notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          Notes: {maker.maker_verification_notes}
                        </div>
                      )}
                    </div>
                    <NeonButton size="sm" variant="secondary" onClick={() => openVerifyDialog(maker)}>
                      {maker.maker_verified ? 'Manage' : 'Verify'}
                    </NeonButton>
                  </div>
                </GlowCard>
              ))}
              {makers?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No makers found</div>
              )}
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedMaker?.maker_verified ? 'Manage' : 'Verify'} Maker
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <div className="font-medium text-foreground">
                    {String(selectedMaker?.display_name || selectedMaker?.full_name || 'Maker')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {String(selectedMaker?.city || '')}, {String(selectedMaker?.province || '')}
                  </div>
                </div>
                <div>
                  <Label>Verification Notes</Label>
                  <Textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Add notes about this maker..."
                    className="mt-2"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                {selectedMaker?.maker_verified ? (
                  <NeonButton 
                    variant="secondary" 
                    onClick={() => handleVerify(false)}
                    disabled={updateVerification.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Remove Verification
                  </NeonButton>
                ) : (
                  <NeonButton 
                    onClick={() => handleVerify(true)}
                    disabled={updateVerification.isPending}
                  >
                    {updateVerification.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Verify Maker
                  </NeonButton>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default AdminMakerManager;
