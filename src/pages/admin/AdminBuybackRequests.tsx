import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminBuybackRequests, useUpdateBuybackRequest, BuybackStatus, BuybackRequest } from '@/hooks/useBuybackData';
import { 
  Recycle, Loader2, ExternalLink, Mail, MapPin, 
  DollarSign, Clock, CheckCircle2, XCircle, Eye,
  Printer, Cpu, CircleDot, Heart
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<BuybackStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_review: { label: 'In Review', color: 'bg-warning/20 text-warning border-warning/30' },
  quoted: { label: 'Quoted', color: 'bg-secondary/20 text-secondary border-secondary/30' },
  accepted: { label: 'Accepted', color: 'bg-success/20 text-success border-success/30' },
  declined: { label: 'Declined', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border' },
};

const ITEM_TYPE_ICONS = {
  printer: Printer,
  filament: CircleDot,
  electronics: Cpu,
  donation: Heart,
};

const AdminBuybackRequests = () => {
  const { toast } = useToast();
  const { data: requests, isLoading } = useAdminBuybackRequests();
  const updateMutation = useUpdateBuybackRequest();
  
  const [selectedRequest, setSelectedRequest] = useState<BuybackRequest | null>(null);
  const [editStatus, setEditStatus] = useState<BuybackStatus>('new');
  const [editQuote, setEditQuote] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const openDetail = (request: BuybackRequest) => {
    setSelectedRequest(request);
    setEditStatus(request.status);
    setEditQuote(request.quoted_amount_cad?.toString() || '');
    setEditNotes(request.admin_notes || '');
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedRequest.id,
        status: editStatus,
        quoted_amount_cad: editQuote ? parseFloat(editQuote) : null,
        admin_notes: editNotes || undefined,
      });

      toast({
        title: 'Request Updated',
        description: 'Buyback request has been updated successfully.',
      });
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update the request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredRequests = requests?.filter((r) => 
    filterStatus === 'all' || r.status === filterStatus
  ) || [];

  return (
    <DashboardLayout>
      <AdminGuard>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
              <Recycle className="w-8 h-8 text-secondary" />
              Buyback Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage incoming buyback quote requests
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredRequests.length} request{filteredRequests.length !== 1 && 's'}
            </span>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <GlowCard className="text-center py-12">
              <Recycle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No buyback requests found.</p>
            </GlowCard>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, i) => {
                const ItemIcon = ITEM_TYPE_ICONS[request.item_type] || Recycle;
                const statusConfig = STATUS_CONFIG[request.status];

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <GlowCard 
                      className="hover:border-secondary/50 transition-colors cursor-pointer"
                      onClick={() => openDetail(request)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <ItemIcon className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-tech font-bold text-foreground capitalize">
                                {request.item_type}
                              </span>
                              <Badge className={`${statusConfig.color} border`}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.brand_model || 'No brand/model specified'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {request.contact_email}
                              </span>
                              {(request.city || request.province) && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {[request.city, request.province].filter(Boolean).join(', ')}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(request.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {request.quoted_amount_cad && (
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Quote</div>
                              <div className="font-tech font-bold text-secondary">
                                ${request.quoted_amount_cad.toFixed(2)}
                              </div>
                            </div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Detail Modal */}
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-secondary" />
                  Buyback Request Details
                </DialogTitle>
                <DialogDescription>
                  Review and update this quote request
                </DialogDescription>
              </DialogHeader>

              {selectedRequest && (
                <div className="space-y-6 mt-4">
                  {/* Request Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Item Type</div>
                      <div className="font-medium text-foreground capitalize">{selectedRequest.item_type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Brand / Model</div>
                      <div className="font-medium text-foreground">{selectedRequest.brand_model || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Condition</div>
                      <div className="font-medium text-foreground capitalize">
                        {selectedRequest.condition?.replace('_', ' ') || '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Location</div>
                      <div className="font-medium text-foreground">
                        {[selectedRequest.city, selectedRequest.province].filter(Boolean).join(', ') || '—'}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">Contact Email</div>
                      <div className="font-medium text-foreground">{selectedRequest.contact_email}</div>
                    </div>
                  </div>

                  {/* Notes from User */}
                  {selectedRequest.notes && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">User Notes</div>
                      <div className="p-3 rounded-lg bg-muted/30 text-sm text-foreground">
                        {selectedRequest.notes}
                      </div>
                    </div>
                  )}

                  {/* Photo Link */}
                  {selectedRequest.photo_url && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Photo</div>
                      <a 
                        href={selectedRequest.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-secondary hover:underline text-sm"
                      >
                        View Photo <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <hr className="border-border" />

                  {/* Admin Actions */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Status</label>
                        <Select value={editStatus} onValueChange={(v) => setEditStatus(v as BuybackStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                              <SelectItem key={key} value={key}>{val.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Quote Amount (CAD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-9"
                            value={editQuote}
                            onChange={(e) => setEditQuote(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Admin Notes</label>
                      <Textarea
                        placeholder="Internal notes about this request..."
                        rows={3}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdate}
                        disabled={updateMutation.isPending}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
};

export default AdminBuybackRequests;
