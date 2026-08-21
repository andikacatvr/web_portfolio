# Roadmap & Arsitektur Proyek Web Portfolio

Dokumen ini berisi pedoman pengembangan, arsitektur sistem, dan panduan menjalankan proyek.

## 🚀 Tech Stack
- **Frontend**: React + Vite
- **Backend & Database**: Supabase (Cloud PostgreSQL + Instant REST API)
- **Hosting**: Vercel (100% Gratis & Otomatis)

## 📁 Project Structure
```text
web_porto/
├── src/                  # Source code React (Components, pages, styles)
│   ├── lib/              # Supabase Client Configuration
│   ├── components/       # UI Components
│   └── ...
├── .env.example          # Environment variables template
├── package.json          # Dependency manifest
├── vite.config.ts        # Vite build configuration
└── README.md             # Dokumentasi Proyek
```

## 🏗️ Architecture
```text
React + Vite (Frontend) <── (@supabase/supabase-js) ──> Supabase Cloud (Database & API)
```
- **React (Vercel)**: Menampilkan UI/UX portofolio yang dinamis dan modern.
- **Supabase Cloud**: Menyediakan database PostgreSQL, API otomatis, dan penyimpanan file tanpa perlu server backend lokal.

## 📍 Roadmap & Progress Tracking

### Phase 1: Frontend Setup & UI (React + Vite)
- [x] Inisialisasi proyek React + Vite
- [x] Desain UI/UX & Komponen Frontend Portofolio
- [x] Server lokal frontend siap di `http://localhost:5173`

### Phase 2: Integrasi Supabase Backend
- [x] Install SDK Supabase (`@supabase/supabase-js`)
- [x] Konfigurasi Supabase Client (`src/lib/supabase.ts`)
- [x] Menyiapkan template `.env.example` (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`)
- [ ] Menghubungkan data Portofolio (Projects, Experience, Skills, Messages) ke Supabase

### Phase 3: Deployment & Hosting Gratis (Vercel)
- [ ] Upload / Push repositori ke GitHub
- [ ] Connect repositori GitHub ke Vercel
- [ ] Set Environment Variables di Vercel Dashboard
- [ ] Deploy & Verifikasi Web Portfolio Live

## 💻 Development Guide

### Running Locally
```bash
npm install
npm run dev
```

### Konfigurasi Supabase Environment
Buat file `.env` di root proyek:
```env
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Catatan Development**:
> - Frontend lokal berjalan di `http://localhost:5173`
> - Supabase diakses langsung via cloud API client (`src/lib/supabase.ts`).

## ⚠️ Rules & Guidelines
1. Jangan menyimpan API Key rahasia secara langsung di dalam kode (gunakan `.env`).
2. Semua permintaan data ke Supabase dikelola secara terpusat melalui helper/lib di folder `src/lib/`.
3. Jaga estetika UI/UX tetap modern, responsif, dan ringan saat di-load di Vercel.