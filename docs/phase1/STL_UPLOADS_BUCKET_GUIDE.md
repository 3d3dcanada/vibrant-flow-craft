# stl-uploads Storage Bucket - Manual Creation Guide

**Required before:** Quote Step 1 can handle real file uploads

**Time:** 5 minutes

---

## Steps (Supabase Dashboard)

1. **Navigate to Storage**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Left sidebar: Click "Storage"

2. **Create New Bucket**
   - Click "New bucket" button
   - Name: `stl-uploads`
   - Public bucket: **OFF** (keep private)
   - Click "Create bucket"

3. **Configure Bucket Settings**
   - Click on the `stl-uploads` bucket
   - Go to "Policies" tab
   - Ensure RLS is enabled (default)

4. **Set File Size Limit**
   - In bucket settings
   - Max file size: `52428800` bytes (50MB)
   - Or configure via Supabase CLI/API

5. **Add RLS Policies** (recommended)
   
   For authenticated users to upload:
   ```sql
   CREATE POLICY "Users can upload STL files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'stl-uploads');
   ```

   For users to read their own files:
   ```sql
   CREATE POLICY "Users can read own files"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'stl-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Verification

After creation, run from project root:
```bash
npx supabase storage ls
```

Expected output includes:
```
stl-uploads
```

## Evidence Required

Screenshot showing:
- Bucket name: `stl-uploads`
- Public access: OFF
- RLS: Enabled

---

**This bucket creation is required before any real STL file uploads will work.**
