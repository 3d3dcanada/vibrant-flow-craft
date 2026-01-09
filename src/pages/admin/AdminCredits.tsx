import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Coins, Search, Loader2, AlertTriangle, Plus, Minus,
    History, User, RefreshCw, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatCredits, creditsToCad, formatCad } from '@/config/credits';

interface UserWallet {
    id: string;
    user_id: string;
    balance: number;
    lifetime_earned: number;
    lifetime_spent: number;
    created_at: string;
    updated_at: string;
    profiles?: { email?: string; full_name?: string };
}

interface CreditTransaction {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    balance_after: number;
    description?: string;
    reference_id?: string;
    created_at: string;
}

const AdminCredits = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [userTransactions, setUserTransactions] = useState<Record<string, CreditTransaction[]>>({});
    const [loadingTransactions, setLoadingTransactions] = useState<string | null>(null);

    // Adjustment modal state
    const [adjustModal, setAdjustModal] = useState<{
        userId: string;
        userName: string;
        currentBalance: number;
    } | null>(null);
    const [adjustAmount, setAdjustAmount] = useState('');
    const [adjustType, setAdjustType] = useState<'bonus' | 'correction' | 'refund'>('bonus');
    const [adjustReason, setAdjustReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch all user wallets with profiles
    const { data: wallets, isLoading, refetch } = useQuery({
        queryKey: ['admin_credit_wallets'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('credit_wallets')
                .select(`
                    *,
                    profiles:user_id (email, full_name)
                `)
                .order('balance', { ascending: false });
            if (error) throw error;
            return data as UserWallet[];
        }
    });

    // Credit adjustment mutation
    const adjustCredits = useMutation({
        mutationFn: async ({ userId, amount, reason, type }: { userId: string; amount: number; reason: string; type: string }) => {
            // Note: Type assertion used because RPC types need regeneration after migration
            const { data, error } = await (supabase.rpc as any)('admin_adjust_credits', {
                p_user_id: userId,
                p_amount: amount,
                p_reason: reason,
                p_type: type
            });
            if (error) throw error;
            const result = data as { success: boolean; error?: string; new_balance?: number };
            if (!result.success) throw new Error(result.error || 'Failed to adjust credits');
            return result;
        },
        onSuccess: (data) => {
            toast({
                title: 'Credits Adjusted',
                description: `New balance: ${formatCredits(data.new_balance || 0)}`
            });
            queryClient.invalidateQueries({ queryKey: ['admin_credit_wallets'] });
            setAdjustModal(null);
            setAdjustAmount('');
            setAdjustReason('');
            // Refresh transactions for this user
            if (expandedUser) {
                loadTransactions(expandedUser);
            }
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    // Load transactions for a user
    const loadTransactions = async (userId: string) => {
        setLoadingTransactions(userId);
        try {
            const { data, error } = await (supabase as any)
                .from('credit_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            setUserTransactions(prev => ({ ...prev, [userId]: data || [] }));
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoadingTransactions(null);
        }
    };

    const handleExpand = (userId: string) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
            if (!userTransactions[userId]) {
                loadTransactions(userId);
            }
        }
    };

    const handleAdjustSubmit = async () => {
        if (!adjustModal) return;

        const amount = parseInt(adjustAmount);
        if (isNaN(amount) || amount === 0) {
            toast({ title: 'Invalid Amount', description: 'Please enter a valid non-zero amount.', variant: 'destructive' });
            return;
        }
        if (!adjustReason.trim()) {
            toast({ title: 'Reason Required', description: 'Please provide a reason for this adjustment.', variant: 'destructive' });
            return;
        }

        setIsProcessing(true);
        try {
            await adjustCredits.mutateAsync({
                userId: adjustModal.userId,
                amount: amount,
                reason: adjustReason,
                type: adjustType
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredWallets = wallets?.filter(wallet => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            wallet.profiles?.email?.toLowerCase().includes(query) ||
            wallet.profiles?.full_name?.toLowerCase().includes(query) ||
            wallet.user_id.toLowerCase().includes(query)
        );
    });

    const getTransactionTypeLabel = (type: string) => {
        const labels: Record<string, { emoji: string; label: string; color: string }> = {
            purchase: { emoji: '💳', label: 'Purchase', color: 'text-success' },
            gift_card: { emoji: '🎁', label: 'Gift Card', color: 'text-success' },
            spend: { emoji: '📦', label: 'Spent', color: 'text-destructive' },
            bonus: { emoji: '✨', label: 'Bonus', color: 'text-success' },
            correction: { emoji: '⚙️', label: 'Correction', color: 'text-warning' },
            refund: { emoji: '↩️', label: 'Refund', color: 'text-success' },
            adjustment: { emoji: '🔧', label: 'Adjustment', color: 'text-muted-foreground' },
        };
        return labels[type] || { emoji: '💫', label: type, color: 'text-muted-foreground' };
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <DashboardLayout>
            <AdminGuard>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
                            <Coins className="w-8 h-8 text-secondary" />
                            Credits Administration
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View balances, issue credits, and manage user wallets
                        </p>
                    </motion.div>

                    {/* Search and Actions */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email, name, or user ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                        <NeonButton variant="secondary" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </NeonButton>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <GlowCard className="p-4" variant="teal">
                            <div className="text-sm text-muted-foreground">Total Credits in Circulation</div>
                            <div className="text-2xl font-tech font-bold text-secondary">
                                {formatCredits(wallets?.reduce((sum, w) => sum + w.balance, 0) || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                ≈ {formatCad(creditsToCad(wallets?.reduce((sum, w) => sum + w.balance, 0) || 0))}
                            </div>
                        </GlowCard>
                        <GlowCard className="p-4">
                            <div className="text-sm text-muted-foreground">Active Wallets</div>
                            <div className="text-2xl font-tech font-bold text-foreground">
                                {wallets?.length || 0}
                            </div>
                        </GlowCard>
                        <GlowCard className="p-4">
                            <div className="text-sm text-muted-foreground">Wallets with Balance</div>
                            <div className="text-2xl font-tech font-bold text-foreground">
                                {wallets?.filter(w => w.balance > 0).length || 0}
                            </div>
                        </GlowCard>
                    </div>

                    {/* User Wallets List */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : filteredWallets?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No wallets found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredWallets?.map((wallet) => {
                                const isExpanded = expandedUser === wallet.user_id;
                                const transactions = userTransactions[wallet.user_id] || [];

                                return (
                                    <GlowCard key={wallet.id} className="p-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-secondary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">
                                                        {wallet.profiles?.full_name || 'No Name'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {wallet.profiles?.email || wallet.user_id.slice(0, 8)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Balance */}
                                            <div className="text-center min-w-[120px]">
                                                <div className="text-xl font-tech font-bold text-secondary">
                                                    {wallet.balance.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatCad(creditsToCad(wallet.balance))}
                                                </div>
                                            </div>

                                            {/* Lifetime Stats */}
                                            <div className="text-sm text-muted-foreground min-w-[160px]">
                                                <div className="text-success">+{wallet.lifetime_earned.toLocaleString()} earned</div>
                                                <div className="text-destructive">-{wallet.lifetime_spent.toLocaleString()} spent</div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <NeonButton
                                                    size="sm"
                                                    onClick={() => setAdjustModal({
                                                        userId: wallet.user_id,
                                                        userName: wallet.profiles?.full_name || wallet.profiles?.email || 'User',
                                                        currentBalance: wallet.balance
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Adjust
                                                </NeonButton>
                                                <button
                                                    onClick={() => handleExpand(wallet.user_id)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Transaction History */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t border-border"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-bold text-foreground flex items-center gap-2">
                                                        <History className="w-4 h-4" />
                                                        Transaction History
                                                    </h4>
                                                    <button
                                                        onClick={() => loadTransactions(wallet.user_id)}
                                                        className="text-xs text-secondary hover:underline"
                                                    >
                                                        Refresh
                                                    </button>
                                                </div>

                                                {loadingTransactions === wallet.user_id ? (
                                                    <div className="flex justify-center py-4">
                                                        <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                                                    </div>
                                                ) : transactions.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                                        No transactions
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                                        {transactions.map((tx) => {
                                                            const typeInfo = getTransactionTypeLabel(tx.type);
                                                            return (
                                                                <div
                                                                    key={tx.id}
                                                                    className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-sm"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{typeInfo.emoji}</span>
                                                                        <span className={`font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                                                                        {tx.description && (
                                                                            <span className="text-muted-foreground">— {tx.description}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <span className={tx.amount > 0 ? 'text-success' : 'text-destructive'}>
                                                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground min-w-[100px] text-right">
                                                                            {formatDate(tx.created_at)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* User ID for reference */}
                                                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                                    User ID: {wallet.user_id}
                                                </div>
                                            </motion.div>
                                        )}
                                    </GlowCard>
                                );
                            })}
                        </div>
                    )}

                    {/* Adjust Credits Modal */}
                    {adjustModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-secondary" />
                                    Adjust Credits
                                </h3>

                                <p className="text-muted-foreground mb-2">
                                    User: <strong className="text-foreground">{adjustModal.userName}</strong>
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    Current Balance: <strong className="text-secondary">{formatCredits(adjustModal.currentBalance)}</strong>
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="adjustType">Adjustment Type</Label>
                                        <select
                                            id="adjustType"
                                            value={adjustType}
                                            onChange={(e) => setAdjustType(e.target.value as any)}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        >
                                            <option value="bonus">Bonus (add credits)</option>
                                            <option value="correction">Correction (add or remove)</option>
                                            <option value="refund">Refund (add credits)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="amount">Amount (positive to add, negative to remove)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="e.g., 100 or -50"
                                            value={adjustAmount}
                                            onChange={(e) => setAdjustAmount(e.target.value)}
                                        />
                                        {adjustAmount && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                = {formatCad(creditsToCad(Math.abs(parseInt(adjustAmount) || 0)))}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="reason">Reason (required)</Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Why is this adjustment being made?"
                                            value={adjustReason}
                                            onChange={(e) => setAdjustReason(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
                                    ⚠️ This action will be logged in the audit trail and cannot be undone.
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <NeonButton
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => {
                                            setAdjustModal(null);
                                            setAdjustAmount('');
                                            setAdjustReason('');
                                        }}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </NeonButton>
                                    <NeonButton
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleAdjustSubmit}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Adjust Credits'
                                        )}
                                    </NeonButton>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </AdminGuard>
        </DashboardLayout>
    );
};

export default AdminCredits;
