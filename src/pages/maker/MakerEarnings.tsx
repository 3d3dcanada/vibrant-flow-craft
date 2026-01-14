import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, DollarSign, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MakerGuard from '@/components/guards/MakerGuard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MakerEarning {
  id: string;
  order_id: string;
  gross_amount_cad: number;
  platform_fee_cad: number;
  payout_amount_cad: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at?: string;
  orders: {
    order_number: string;
    total_cad: number;
  };
}

const MakerEarnings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: earnings = [], isLoading } = useQuery({
    queryKey: ['maker-earnings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maker_earnings')
        .select(`
          id,
          order_id,
          gross_amount_cad,
          platform_fee_cad,
          payout_amount_cad,
          status,
          created_at,
          paid_at,
          orders!inner (
            order_number,
            total_cad
          )
        `)
        .eq('maker_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as MakerEarning[];
    },
    enabled: !!user,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not yet recorded';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const handleExportCsv = () => {
    const headers = [
      'Order #',
      'Gross CAD',
      'Fee CAD',
      'Payout CAD',
      'Status',
      'Created At',
      'Paid At',
    ];

    const rows = earnings.map((earning) => [
      earning.orders.order_number,
      Number(earning.gross_amount_cad).toFixed(2),
      Number(earning.platform_fee_cad).toFixed(2),
      Number(earning.payout_amount_cad).toFixed(2),
      earning.status,
      earning.created_at,
      earning.paid_at || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/\"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'maker-earnings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Export ready', description: 'Your earnings CSV has been downloaded.' });
  };

  // Calculate stats
  const totalEarned = earnings.reduce((sum, e) => sum + Number(e.payout_amount_cad), 0);
  const totalPaid = earnings
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + Number(e.payout_amount_cad), 0);
  const totalPending = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + Number(e.payout_amount_cad), 0);

  if (isLoading) {
    return (
      <DashboardLayout>
        <MakerGuard>
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        </MakerGuard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MakerGuard>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-tech font-bold text-foreground">Earnings & Payouts</h1>
            <p className="text-muted-foreground">Track your earnings and payment status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlowCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Out</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Earnings Table */}
          <GlowCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-semibold">Earnings History</h3>
              <NeonButton size="sm" variant="secondary" onClick={handleExportCsv}>
                Export CSV
              </NeonButton>
            </div>
            {earnings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No earnings records found. Complete orders to start earning!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Paid at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((earning) => (
                    <TableRow key={earning.id}>
                      <TableCell className="font-mono">{earning.orders.order_number}</TableCell>
                      <TableCell>{formatCurrency(Number(earning.gross_amount_cad))}</TableCell>
                      <TableCell>{formatCurrency(Number(earning.platform_fee_cad))}</TableCell>
                      <TableCell>{formatCurrency(Number(earning.payout_amount_cad))}</TableCell>
                      <TableCell>
                        <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                          {earning.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(earning.created_at)}</TableCell>
                      <TableCell>{formatDate(earning.paid_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </GlowCard>
        </div>
      </MakerGuard>
    </DashboardLayout>
  );
};

export default MakerEarnings;
