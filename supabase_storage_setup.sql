-- Create the 'uploads' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on objects (usually enabled by default, but good to ensure)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to the 'uploads' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Policy to allow authenticated uploads (if you were using client-side upload)
-- Since we use admin client server-side, this is less critical for the upload itself,
-- but good for completeness if you switch to client-side later.
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'uploads' AND auth.role() = 'authenticated' );
