import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vyohpzwvrbtsbrwpzwnd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b2hwend2cmJ0c2Jyd3B6d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY0NzIsImV4cCI6MjEwMjk2MjQ3Mn0.XUhss832r2XPg8zHNkp8eVKWtvXmBYk6YOv46kjCfVQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEMO_PROJECTS = [
  {
    id: "proj-1",
    main_category: "Technology",
    sub_category: "E-Commerce Architecture",
    headline: "Platform E-Commerce Minimalis dengan Arsitektur Headless",
    deck: "Toko online modern berkecepatan tinggi dengan integrasi sistem pembayaran, manajemen inventaris, dan pencarian cepat.",
    author: "Andika Catur Ariantono",
    date: "2026",
    link_url: "https://andikacatur.dev/ecommerce-demo",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    is_featured: true
  },
  {
    id: "proj-6",
    main_category: "Technology",
    sub_category: "Analytics Dashboards",
    headline: "Dashboard Analitik Real-Time & Visualisasi Data E-Commerce",
    deck: "Olah data transaksi e-commerce, grafik tren penjualan, & dashboard performa interaktif berbasis Recharts dan Python.",
    author: "Andika Catur Ariantono",
    date: "2026",
    link_url: "https://andikacatur.dev/data-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Data Analytics", "Recharts", "Python", "SQL"],
    is_featured: true
  },
  {
    id: "proj-3",
    main_category: "Design",
    sub_category: "Branding & Identity",
    headline: "Rebranding 'Kopi Senja': Estetika Klasik di Era Digital",
    deck: "Perancangan ulang identitas visual, kemasan produk, dan aplikasi pemesanan digital untuk kedai kopi lokal.",
    author: "Andika Catur Ariantono",
    date: "2025",
    link_url: "https://behance.net/andikacatvr",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&h=320&fit=crop&auto=format&q=80",
    tags: ["Branding", "UI/UX", "Design System"],
    is_featured: true
  },
  {
    id: "proj-5",
    main_category: "Design",
    sub_category: "Comic Strips & Storytelling",
    headline: "Komik Strip 'Kilas Senja': Seri Cerita Humor Digital",
    deck: "Kumpulan cerita komik pendek 4-panel bertema kehidupan harian developer dan kehidupan perkotaan.",
    author: "Andika Catur Ariantono",
    date: "2025",
    link_url: "https://webtoons.com/demo-comic",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Komik Strip", "Clip Studio Paint", "Digital Art"],
    is_featured: true
  },
  {
    id: "proj-2",
    main_category: "Visuals",
    sub_category: "Urban & Architecture",
    headline: "Seri 'Urban Silence': Dokumentasi Arsitektur Kota",
    deck: "Eksplorasi visual lanskap ibu kota sebelum fajar, menangkap interaksi cahaya dan struktur beton dalam monokrom.",
    author: "Andika Catur Ariantono",
    date: "2026",
    link_url: "https://instagram.com/andikacatvr",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=320&fit=crop&auto=format&q=80",
    tags: ["Fotografi", "Monokrom", "Art Direction"],
    is_featured: true
  },
  {
    id: "proj-4",
    main_category: "Visuals",
    sub_category: "Editing & Post-Production",
    headline: "Cinematic Reel 2025: Dokumenter Eksplorasi Visual",
    deck: "Kumpulan sinematografi pendek lanskap alam Indonesia dan dokumentasi kehidupan urban 4K.",
    author: "Andika Catur Ariantono",
    date: "2025",
    link_url: "https://youtube.com/watch?v=demo-reel",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Videografi", "Color Grading", "DaVinci Resolve"],
    is_featured: true
  }
];

const DEMO_CERTIFICATES = [
  {
    id: "cert-1",
    title: "Google UX Design Professional Certificate",
    issuer: "Google / Coursera",
    date: "2026",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&auto=format&q=80",
    category: "UI/UX DESIGN",
    description: "Sertifikasi profesional merancang alur pengguna, wireframing, riset UX, dan desain antarmuka berbasis Figma."
  },
  {
    id: "cert-2",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    date: "2025",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format&q=80",
    category: "ENGINEERING",
    description: "Akreditasi tingkat lanjut untuk pengembangan aplikasi web modern dengan React, JavaScript ES6+, dan Tailwind CSS."
  },
  {
    id: "cert-3",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2026",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&auto=format&q=80",
    category: "CLOUD & DATA",
    description: "Sertifikasi pemahaman arsitektur cloud, keamanan server, dan manajemen infrastruktur web di AWS."
  }
];

async function seed() {
  const { data: projData, error: projErr } = await supabase.from("projects").upsert(DEMO_PROJECTS).select();
  console.log("Seeded projects count:", projData ? projData.length : 0);
  if (projErr) console.error("Projects seed error:", projErr);

  const { data: certData, error: certErr } = await supabase.from("certificates").upsert(DEMO_CERTIFICATES).select();
  console.log("Seeded certificates count:", certData ? certData.length : 0);
  if (certErr) console.error("Certificates seed error:", certErr);
}

seed();
