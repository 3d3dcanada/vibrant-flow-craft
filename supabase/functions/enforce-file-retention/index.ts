/**
 * Edge Function: enforce-file-retention
 * 
 * Purpose: Daily scheduled job to delete files older than 14 days from stl-uploads bucket
 * Section 1.3 of Phase 1 Hardening
 * 
 * - Runs daily via pg_cron or external scheduler
 * - Deletes files older than 14 calendar days
 * - Uses object metadata timestamps (created_at)
 * - Logs deletion events (path + timestamp)
 * - No file hashes retained
 * - No content inspection
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RETENTION_DAYS = 14;
const BUCKET_NAME = 'stl-uploads';

interface DeletionLog {
    path: string;
    deletedAt: string;
    createdAt: string;
    ageInDays: number;
}

Deno.serve(async (req) => {
    // Only allow POST requests (scheduled invocation)
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Verify authorization (basic check - should use service role key in production)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Initialize Supabase client with service role (bypasses RLS)
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing environment variables');
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Calculate cutoff date (14 days ago)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
        const cutoffIso = cutoffDate.toISOString();

        // List all files in the bucket
        // We need to list recursively since files are in user folders
        const { data: bucketList, error: listError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list('', {
                limit: 1000,
                offset: 0,
            });

        if (listError) {
            throw new Error(`Failed to list bucket: ${listError.message}`);
        }

        const deletionLogs: DeletionLog[] = [];
        const errors: string[] = [];
        let totalScanned = 0;
        let totalDeleted = 0;

        // Process each user folder
        for (const folder of bucketList || []) {
            if (!folder.name) continue;

            // List files in user folder
            const { data: userFiles, error: userListError } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list(folder.name, {
                    limit: 500,
                });

            if (userListError) {
                errors.push(`Error listing ${folder.name}: ${userListError.message}`);
                continue;
            }

            for (const file of userFiles || []) {
                if (!file.name || !file.created_at) continue;
                totalScanned++;

                const fileCreatedAt = new Date(file.created_at);
                const ageInDays = Math.floor((Date.now() - fileCreatedAt.getTime()) / (1000 * 60 * 60 * 24));

                // Check if file is older than retention period
                if (fileCreatedAt < cutoffDate) {
                    const filePath = `${folder.name}/${file.name}`;

                    // Delete the file
                    const { error: deleteError } = await supabase
                        .storage
                        .from(BUCKET_NAME)
                        .remove([filePath]);

                    if (deleteError) {
                        errors.push(`Failed to delete ${filePath}: ${deleteError.message}`);
                    } else {
                        totalDeleted++;
                        deletionLogs.push({
                            path: filePath,
                            deletedAt: new Date().toISOString(),
                            createdAt: file.created_at,
                            ageInDays,
                        });
                    }
                }
            }
        }

        // Log summary (no file content, no hashes - just paths and timestamps)
        console.log(JSON.stringify({
            type: 'retention_enforcement',
            timestamp: new Date().toISOString(),
            summary: {
                filesScanned: totalScanned,
                filesDeleted: totalDeleted,
                retentionDays: RETENTION_DAYS,
                cutoffDate: cutoffIso,
                errorsCount: errors.length,
            },
            deletions: deletionLogs,
            errors: errors.length > 0 ? errors : undefined,
        }));

        return new Response(JSON.stringify({
            success: true,
            summary: {
                filesScanned: totalScanned,
                filesDeleted: totalDeleted,
                retentionDays: RETENTION_DAYS,
                cutoffDate: cutoffIso,
            },
            deletions: deletionLogs,
            errors: errors.length > 0 ? errors : [],
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Retention enforcement error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
