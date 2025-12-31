import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePendingRequests, useMakerRequests, useClaimRequest, useUpdateRequestStatus, useCreateJob } from '@/hooks/useMakerData';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardList, ExternalLink, User, Package, Clock, 
  CheckCircle, XCircle, ArrowRight, Loader2
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

const MakerRequests = () => {
  const { toast } = useToast();
  const { data: pendingRequests = [], isLoading: loadingPending } = usePendingRequests();
  const { data: makerRequests = [], isLoading: loadingMaker } = useMakerRequests();
  
  const claimMutation = useClaimRequest();
  const updateStatusMutation = useUpdateRequestStatus();
  const createJobMutation = useCreateJob();
  
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [slaHours, setSlaHours] = useState('48');

  const handleClaim = async (requestId: string) => {
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

  const RequestCard = ({ request, isPending }: { request: any; isPending: boolean }) => (
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
          {request.attribution?.source_platform && (
            <Badge variant="outline" className="text-xs">
              {request.attribution.source_platform}
            </Badge>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Material</div>
            <div className="text-sm font-medium">{request.specs?.material || 'PLA'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Color</div>
            <div className="text-sm font-medium">{request.specs?.color || 'Any'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Size</div>
            <div className="text-sm font-medium capitalize">{request.specs?.jobSize || 'Medium'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Quantity</div>
            <div className="text-sm font-medium">{request.specs?.quantity || 1}</div>
          </div>
        </div>

        {/* Quantity breaks display */}
        <div className="flex gap-2 mb-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-muted/30 rounded">25: -5%</span>
          <span className="px-2 py-1 bg-muted/30 rounded">50: -10%</span>
          <span className="px-2 py-1 bg-muted/30 rounded">100: -15%</span>
        </div>

        {/* Attribution */}
        {request.attribution?.model_url && (
          <div className="p-3 rounded-lg bg-muted/20 border border-border/50 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-3 h-3 text-secondary" />
              <span className="text-xs font-medium">Model Source</span>
            </div>
            <a 
              href={request.attribution.model_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:underline truncate block"
            >
              {request.attribution.model_url}
            </a>
            {request.attribution.designer_name && (
              <div className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                <span className="text-xs">{request.attribution.designer_name}</span>
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

        {/* Actions */}
        <div className="flex gap-2">
          {isPending ? (
            <>
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-tech font-bold text-foreground">Requests & Quotes</h1>
        <p className="text-muted-foreground">Manage incoming print requests</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            My Requests ({makerRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {loadingPending ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <GlowCard className="p-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No pending requests</h3>
              <p className="text-sm text-muted-foreground">New requests will appear here</p>
            </GlowCard>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map(req => (
                <RequestCard key={req.id} request={req} isPending={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="space-y-4 mt-4">
          {loadingMaker ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : makerRequests.length === 0 ? (
            <GlowCard className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No claimed requests</h3>
              <p className="text-sm text-muted-foreground">Claim requests from the pending tab</p>
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
              Set the SLA target for this job
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Delivery Speed / SLA Target</Label>
              <Select value={slaHours} onValueChange={setSlaHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">Emergency (&lt;24h, +15-25%)</SelectItem>
                  <SelectItem value="48">Standard Basic (24-48h)</SelectItem>
                  <SelectItem value="168">Large (4-8 days)</SelectItem>
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
    </div>
  );
};

export default MakerRequests;
