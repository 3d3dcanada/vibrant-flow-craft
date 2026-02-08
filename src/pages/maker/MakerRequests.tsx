import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  usePendingRequests, 
  useMakerRequests, 
  useClaimRequest, 
  useUpdateRequestStatus, 
  useCreateJob,
  useIsAdmin,
  useAllMakers,
  useAssignRequestToMaker,
  useAllUnassignedRequests,
  type PrintRequest
} from '@/hooks/useMakerData';
import { useProfile } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardList, ExternalLink, User, Package, Clock, 
  CheckCircle, XCircle, ArrowRight, Loader2, Shield, UserPlus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';

const MakerRequests = () => {
  const { toast } = useToast();
  const { data: profile } = useProfile();
  const { data: isAdmin } = useIsAdmin();
  const { data: pendingRequests = [], isLoading: loadingPending } = usePendingRequests();
  const { data: makerRequests = [], isLoading: loadingMaker } = useMakerRequests();
  const { data: allUnassignedRequests = [] } = useAllUnassignedRequests();
  const { data: allMakers = [] } = useAllMakers();
  
  const claimMutation = useClaimRequest();
  const updateStatusMutation = useUpdateRequestStatus();
  const createJobMutation = useCreateJob();
  const assignMutation = useAssignRequestToMaker();
  
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [slaHours, setSlaHours] = useState('48');
  
  // Admin assignment state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMakerId, setSelectedMakerId] = useState<string>('');
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  // Check if maker can claim (has required fields)
  const canMakerClaim = profile?.dry_box_required_ack && 
    profile?.availability_status === 'available' &&
    profile?.onboarding_completed;

  const handleClaim = async (requestId: string) => {
    if (!canMakerClaim) {
      toast({ 
        title: 'Cannot claim request', 
        description: 'Complete your maker profile and ensure you are available.',
        variant: 'destructive'
      });
      return;
    }
    try {
      await claimMutation.mutateAsync(requestId);
      toast({ title: 'Request claimed', description: 'The request has been assigned to you.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to claim request', variant: 'destructive' });
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ requestId, status: 'declined' });
      toast({ title: 'Request declined' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to decline request', variant: 'destructive' });
    }
  };

  const handleConvertToJob = async () => {
    if (!selectedRequest) return;
    try {
      await createJobMutation.mutateAsync({ 
        requestId: selectedRequest, 
        slaHours: parseInt(slaHours) 
      });
      toast({ title: 'Job created', description: 'The request has been converted to a job.' });
      setConvertDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' });
    }
  };

  const handleAdminAssign = async () => {
    if (!assigningRequestId || !selectedMakerId) return;
    try {
      await assignMutation.mutateAsync({ 
        requestId: assigningRequestId, 
        makerId: selectedMakerId 
      });
      toast({ title: 'Request assigned', description: 'The request has been assigned to the maker.' });
      setAssignDialogOpen(false);
      setAssigningRequestId(null);
      setSelectedMakerId('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to assign request', variant: 'destructive' });
    }
  };

  const openAssignDialog = (requestId: string) => {
    setAssigningRequestId(requestId);
    setSelectedMakerId('');
    setAssignDialogOpen(true);
  };

  // Use all unassigned for admin, pending for makers
  const unassignedRequests = isAdmin ? allUnassignedRequests : pendingRequests;

  const RequestCard = ({ request, isPending, showAdminControls }: { 
    request: PrintRequest; 
    isPending: boolean;
    showAdminControls?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlowCard className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={isPending ? 'secondary' : 'outline'}>{request.status}</Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          </div>
          {(request.attribution as Record<string, unknown>)?.source_platform && (
            <Badge variant="outline" className="text-xs">
              {String((request.attribution as Record<string, unknown>).source_platform)}
            </Badge>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Material</div>
            <div className="text-sm font-medium">{String(request.specs?.material || request.specs?.materialType || 'PLA')}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Color</div>
            <div className="text-sm font-medium">{String(request.specs?.color || 'Any')}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Size</div>
            <div className="text-sm font-medium capitalize">{String(request.specs?.jobSize || 'Medium')}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Quantity</div>
            <div className="text-sm font-medium">{String(request.specs?.quantity || 1)}</div>
          </div>
        </div>

        {/* Extra specs */}
        {(request.specs?.grams || request.specs?.hours) && (
          <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
            {request.specs?.grams && <span>Weight: {String(request.specs.grams)}g</span>}
            {request.specs?.hours && <span>Est. Time: {Number(request.specs.hours).toFixed(1)}h</span>}
            {request.specs?.deliverySpeed && (
              <Badge variant={request.specs.deliverySpeed === 'emergency' ? 'destructive' : 'outline'} className="text-xs">
                {request.specs.deliverySpeed === 'emergency' ? 'RUSH' : 'Standard'}
              </Badge>
            )}
          </div>
        )}

        {/* Quantity breaks display */}
        <div className="flex gap-2 mb-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-muted/30 rounded">25: -5%</span>
          <span className="px-2 py-1 bg-muted/30 rounded">50: -10%</span>
          <span className="px-2 py-1 bg-muted/30 rounded">100: -15%</span>
        </div>

        {/* Attribution */}
        {(request.attribution as Record<string, unknown>)?.model_url && (
          <div className="p-3 rounded-lg bg-muted/20 border border-border/50 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-3 h-3 text-secondary" />
              <span className="text-xs font-medium">Model Source</span>
            </div>
            <a 
              href={String((request.attribution as Record<string, unknown>).model_url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:underline truncate block"
            >
              {String((request.attribution as Record<string, unknown>).model_url)}
            </a>
            {(request.attribution as Record<string, unknown>).designer_name && (
              <div className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                <span className="text-xs">{String((request.attribution as Record<string, unknown>).designer_name)}</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/20 rounded">
            {request.notes}
          </div>
        )}

        {/* Estimated Total */}
        {request.specs?.estimatedTotal && (
          <div className="text-sm font-medium text-secondary mb-4">
            Est. Total: ${Number(request.specs.estimatedTotal).toFixed(2)} CAD
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {isPending ? (
            <>
              {/* Admin assign button */}
              {showAdminControls && (
                <NeonButton 
                  size="sm"
                  variant="secondary"
                  onClick={() => openAssignDialog(request.id)}
                >
                  <UserPlus className="w-4 h-4 mr-1" /> Assign to Maker
                </NeonButton>
              )}
              
              {/* Maker claim button (if allowed) */}
              {canMakerClaim && !showAdminControls && (
                <NeonButton 
                  size="sm" 
                  onClick={() => handleClaim(request.id)}
                  disabled={claimMutation.isPending}
                >
                  {claimMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" /> Claim
                    </>
                  )}
                </NeonButton>
              )}
              
              {!canMakerClaim && !showAdminControls && (
                <Badge variant="outline" className="text-warning border-warning">
                  Complete profile to claim
                </Badge>
              )}
            </>
          ) : request.status === 'claimed' ? (
            <>
              <NeonButton 
                size="sm"
                onClick={() => {
                  setSelectedRequest(request.id);
                  setConvertDialogOpen(true);
                }}
              >
                <ArrowRight className="w-4 h-4 mr-1" /> Convert to Job
              </NeonButton>
              <NeonButton 
                size="sm" 
                variant="secondary"
                onClick={() => handleDecline(request.id)}
              >
                <XCircle className="w-4 h-4 mr-1" /> Decline
              </NeonButton>
            </>
          ) : (
            <Badge variant="outline">{request.status}</Badge>
          )}
        </div>
      </GlowCard>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-tech font-bold text-foreground">Requests & Quotes</h1>
              <p className="text-muted-foreground">Manage incoming print requests</p>
            </div>
            {isAdmin && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="w-3 h-3" /> Admin
              </Badge>
            )}
          </div>

          <Tabs defaultValue="unassigned">
            <TabsList>
              <TabsTrigger value="unassigned" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Unassigned ({unassignedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="my-requests" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                My Requests ({makerRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unassigned" className="space-y-4 mt-4">
              {loadingPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              ) : unassignedRequests.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No unassigned requests</h3>
                  <p className="text-sm text-muted-foreground">New customer requests will appear here</p>
                </GlowCard>
              ) : (
                <div className="grid gap-4">
                  {unassignedRequests.map(req => (
                    <RequestCard key={req.id} request={req} isPending={true} showAdminControls={isAdmin} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-requests" className="space-y-4 mt-4">
              {loadingMaker ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              ) : makerRequests.length === 0 ? (
                <GlowCard className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No assigned requests</h3>
                  <p className="text-sm text-muted-foreground">
                    {isAdmin ? 'Assign requests from the unassigned tab' : 'Claim requests from the unassigned tab'}
                  </p>
                </GlowCard>
              ) : (
                <div className="grid gap-4">
                  {makerRequests.map(req => (
                    <RequestCard key={req.id} request={req} isPending={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Convert to Job Dialog */}
          <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convert to Job</DialogTitle>
                <DialogDescription>
                  Set an SLA target for this job. The job will appear in your Jobs Queue.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>SLA Target</Label>
                  <Select value={slaHours} onValueChange={setSlaHours}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">Emergency - 24 hours</SelectItem>
                      <SelectItem value="48">Standard Small - 48 hours</SelectItem>
                      <SelectItem value="96">Standard Medium - 4 days</SelectItem>
                      <SelectItem value="192">Large - 8 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setConvertDialogOpen(false)}>
                  Cancel
                </NeonButton>
                <NeonButton onClick={handleConvertToJob} disabled={createJobMutation.isPending}>
                  {createJobMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Create Job'
                  )}
                </NeonButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Admin Assign Dialog */}
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign to Maker</DialogTitle>
                <DialogDescription>
                  Select a maker to assign this request to. Only verified makers with completed onboarding are shown.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Maker</Label>
                  <Select value={selectedMakerId} onValueChange={setSelectedMakerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a maker..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allMakers.map(maker => (
                        <SelectItem key={maker.id} value={maker.id}>
                          <div className="flex items-center gap-2">
                            <span>{maker.full_name || maker.display_name || maker.email}</span>
                            <Badge 
                              variant={maker.availability_status === 'available' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {maker.availability_status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {allMakers.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      No verified makers available. Makers must complete onboarding first.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <NeonButton variant="secondary" onClick={() => setAssignDialogOpen(false)}>
                  Cancel
                </NeonButton>
                <NeonButton 
                  onClick={handleAdminAssign} 
                  disabled={!selectedMakerId || assignMutation.isPending}
                >
                  {assignMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Assign'
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

export default MakerRequests;
