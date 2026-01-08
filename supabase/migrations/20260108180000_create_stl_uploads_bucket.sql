-- Migration: Create stl-uploads storage bucket with RLS
-- Version: 1.0
-- Date: 2026-01-08
-- Purpose: Secure private storage for user-uploaded STL/3MF files

-- Section 1.1: Create the stl-uploads bucket
-- Private bucket, no public access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'stl-uploads',
    'stl-uploads',
    false,  -- Private bucket
    52428800,  -- 50MB file size limit
    ARRAY['application/sla', 'application/vnd.ms-pki.stl', 'model/stl', 'application/octet-stream', 'model/3mf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Section 1.2: RLS Policies for stl-uploads bucket

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can upload ONLY to their own folder
-- Path format: stl-uploads/{user_id}/{uuid}.{ext}
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'stl-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can read ONLY their own files
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'stl-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update ONLY their own files
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'stl-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'stl-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own files (immediate deletion path)
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'stl-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Service role has full access (for retention enforcement)
-- Note: Service role bypasses RLS by default, but we explicitly document this

-- NO public access policy - bucket is private

-- Add metadata column for tracking upload timestamp (for retention)
COMMENT ON TABLE storage.objects IS 'Storage objects with stl-uploads bucket supporting 14-day retention policy';
