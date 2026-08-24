-- -------------------------------------------------------------
-- SQL MIGRATION FOR SUPABASE "certificates" TABLE
-- Jalankan perintah ini di Supabase SQL Editor
-- (Dashboard Supabase -> SQL Editor -> New Query -> Run)
-- -------------------------------------------------------------

-- 1. Buat tabel certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT,
    date TEXT,
    image_url TEXT,
    credential_url TEXT,
    category TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) & Berikan Akses Publik (Read, Insert, Update, Delete)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read certificates" ON public.certificates;
CREATE POLICY "Allow public read certificates" ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert certificates" ON public.certificates;
CREATE POLICY "Allow public insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update certificates" ON public.certificates;
CREATE POLICY "Allow public update certificates" ON public.certificates FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete certificates" ON public.certificates;
CREATE POLICY "Allow public delete certificates" ON public.certificates FOR DELETE USING (true);

-- 3. Aktifkan Fitur Realtime pada tabel certificates
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
