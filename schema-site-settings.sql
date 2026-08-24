-- -------------------------------------------------------------
-- SQL MIGRATION FOR SUPABASE "site_settings" TABLE
-- Jalankan perintah ini di Supabase SQL Editor
-- (Dashboard Supabase -> SQL Editor -> New Query -> Run)
-- -------------------------------------------------------------

-- 1. Buat tabel site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) & Berikan Akses Publik (Read, Insert, Update, Delete)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert site_settings" ON public.site_settings;
CREATE POLICY "Allow public insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update site_settings" ON public.site_settings;
CREATE POLICY "Allow public update site_settings" ON public.site_settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete site_settings" ON public.site_settings;
CREATE POLICY "Allow public delete site_settings" ON public.site_settings FOR DELETE USING (true);

-- 3. Aktifkan Fitur Realtime pada tabel site_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
