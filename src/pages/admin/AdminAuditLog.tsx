import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminGuard from '@/components/guards/AdminGuard';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import {
    ClipboardList, Search, Loader2, Filter, RefreshCw,
    User, Package, Coins, CreditCard, ChevronDown, ChevronUp
} from 'lucide-react';

interface AuditLogEntry {
    id: string;
    admin_id: string;
    action_type: string;
    target_type: string;
    target_id: string;
    before_state: unknown;
    after_state: unknown;
    reason?: string;
    metadata?: unknown;
    created_at: string;
    profiles?: { email?: string; full_name?: string };
}

const ACTION_TYPES: Record<string, { label: string; icon: typeof ClipboardList; color: string }> = {
    'order_status_update': { label: 'Order Status Update', icon: Package, color: 'text-blue-400' },
    'payment_confirmation': { label: 'Payment Confirmed', icon: CreditCard, color: 'text-success' },
    'credit_adjustment': { label: 'Credit Adjustment', icon: Coins, color: 'text-warning' },
    'gift_card_approved': { label: 'Gift Card Approved', icon: Coins, color: 'text-success' },
    'gift_card_rejected': { label: 'Gift Card Rejected', icon: Coins, color: 'text-destructive' },
};

const TARGET_TYPES: Record<string, { label: string; icon: typeof ClipboardList }> = {
    'order': { label: 'Order', icon: Package },
    'credit_wallet': { label: 'Credit Wallet', icon: Coins },
    'gift_card': { label: 'Gift Card', icon: CreditCard },
    'user': { label: 'User', icon: User },
};

const AdminAuditLog = () => {
    const [actionFilter, setActionFilter] = useState<string>('');
    const [targetFilter, setTargetFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
    const [limit, setLimit] = useState(50);

    // Fetch audit log entries
    const { data: entries, isLoading, refetch } = useQuery({
        queryKey: ['admin_audit_log', actionFilter, targetFilter, limit],
        queryFn: async () => {
            let query = supabase
                .from('admin_audit_log' as never)
                .select(`
                    *,
                    profiles:admin_id (email, full_name)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (actionFilter) {
                query = query.eq('action_type', actionFilter);
            }
            if (targetFilter) {
                query = query.eq('target_type', targetFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as AuditLogEntry[];
        }
    });

    const filteredEntries = entries?.filter(entry => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            entry.admin_id.toLowerCase().includes(query) ||
            entry.target_id.toLowerCase().includes(query) ||
            entry.reason?.toLowerCase().includes(query) ||
            entry.profiles?.email?.toLowerCase().includes(query) ||
            entry.profiles?.full_name?.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const getActionConfig = (actionType: string) => {
        return ACTION_TYPES[actionType] || { label: actionType, icon: ClipboardList, color: 'text-muted-foreground' };
    };

    const getTargetConfig = (targetType: string) => {
        return TARGET_TYPES[targetType] || { label: targetType, icon: ClipboardList };
    };

    const formatJson = (obj: unknown) => {
        if (!obj) return 'null';
        try {
            return JSON.stringify(obj, null, 2);
        } catch {
            return String(obj);
        }
    };

    return (
        <DashboardLayout>
            <AdminGuard>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-tech font-bold text-foreground flex items-center gap-3">
                            <ClipboardList className="w-8 h-8 text-secondary" />
                            Audit Log
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Immutable record of all admin operations — cannot be modified or deleted
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                            >
                                <option value="">All Actions</option>
                                {Object.entries(ACTION_TYPES).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={targetFilter}
                                onChange={(e) => setTargetFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                            >
                                <option value="">All Targets</option>
                                {Object.entries(TARGET_TYPES).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by admin, target ID, or reason..."
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

                    {/* Summary */}
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredEntries?.length || 0} of {entries?.length || 0} entries
                        {limit < 200 && (
                            <button
                                onClick={() => setLimit(prev => prev + 50)}
                                className="ml-2 text-secondary hover:underline"
                            >
                                Load more
                            </button>
                        )}
                    </div>

                    {/* Audit Log List */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                    ) : filteredEntries?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No audit log entries found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEntries?.map((entry) => {
                                const actionConfig = getActionConfig(entry.action_type);
                                const targetConfig = getTargetConfig(entry.target_type);
                                const ActionIcon = actionConfig.icon;
                                const isExpanded = expandedEntry === entry.id;

                                return (
                                    <GlowCard key={entry.id} className="p-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Action Badge */}
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-background border ${actionConfig.color}`}>
                                                <ActionIcon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{actionConfig.label}</span>
                                            </div>

                                            {/* Target */}
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <targetConfig.icon className="w-4 h-4" />
                                                <span className="text-sm">{targetConfig.label}</span>
                                                <code className="text-xs bg-muted px-1 rounded">
                                                    {entry.target_id.slice(0, 8)}...
                                                </code>
                                            </div>

                                            {/* Admin */}
                                            <div className="flex-1 min-w-[150px]">
                                                <div className="text-sm text-foreground">
                                                    {entry.profiles?.full_name || entry.profiles?.email || 'Admin'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {entry.profiles?.email}
                                                </div>
                                            </div>

                                            {/* Timestamp */}
                                            <div className="text-sm text-muted-foreground min-w-[180px] text-right">
                                                {formatDate(entry.created_at)}
                                            </div>

                                            {/* Expand */}
                                            <button
                                                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            >
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Reason Preview */}
                                        {entry.reason && !isExpanded && (
                                            <div className="mt-2 text-sm text-muted-foreground truncate">
                                                Reason: {entry.reason}
                                            </div>
                                        )}

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 pt-4 border-t border-border"
                                            >
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Before State */}
                                                    <div>
                                                        <h4 className="font-bold text-foreground mb-2">Before State</h4>
                                                        <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto max-h-40 text-muted-foreground">
                                                            {formatJson(entry.before_state)}
                                                        </pre>
                                                    </div>

                                                    {/* After State */}
                                                    <div>
                                                        <h4 className="font-bold text-foreground mb-2">After State</h4>
                                                        <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto max-h-40 text-muted-foreground">
                                                            {formatJson(entry.after_state)}
                                                        </pre>
                                                    </div>
                                                </div>

                                                {/* Reason */}
                                                {entry.reason && (
                                                    <div className="mt-4">
                                                        <h4 className="font-bold text-foreground mb-2">Reason</h4>
                                                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                                            {entry.reason}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Full IDs */}
                                                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                    <span>Entry ID: {entry.id}</span>
                                                    <span>Admin ID: {entry.admin_id}</span>
                                                    <span>Target ID: {entry.target_id}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </GlowCard>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AdminGuard>
        </DashboardLayout>
    );
};

export default AdminAuditLog;
