import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Menu,
  X,
  Clock,
  User as UserIcon,
  ArrowUpRight,
  Printer,
  Bookmark,
  Calendar as CalendarIcon,
  CloudSun,
  Sun,
  Send,
  Mail,
  MapPin,
  Code,
  Layers,
  Sparkles,
  Award,
  ExternalLink,
  Briefcase,
  PlusCircle,
  Trash2,
  Edit,
  CheckCircle,
  Video,
  Camera,
  Palette,
  Globe,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Terminal,
  Brush,
  Film,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Layers3,
  ShieldCheck,
  KeyRound,
  LogOut,
  Instagram,
  Github,
  Youtube,
  Linkedin,
  Upload,
  HelpCircle,
  RefreshCw,
  Wrench,
  House
} from "lucide-react";
import fotoPerkenalan from "../../gambar/si catur ganteng.png";
import stickmanImg from "../imports/Untitled_design__13_.png";
import nycSkylineImg from "../../gambar/nyc_skyline.png";
import headerLogoImg from "../../gambar/andika's+webportfolio.svg";
import servicesSymbolImg from "../../gambar/services_symbol.png";
import { PrintPortfolioModal } from "./components/PrintPortfolioModal";
import {
  fetchProjectsFromSupabase,
  upsertProjectToSupabase,
  deleteProjectFromSupabase,
  subscribeToProjectsRealtime,
  CertificateItem,
  fetchCertificatesFromSupabase,
  upsertCertificateToSupabase,
  deleteCertificateFromSupabase,
  subscribeToCertificatesRealtime,
  fetchSiteSettingFromSupabase,
  upsertSiteSettingToSupabase,
  subscribeToSiteSettingsRealtime
} from "../lib/supabase";

const getOrdinal = (n: number) => {
  const s = ["ᵗʰ", "ˢᵗ", "ⁿᵈ", "ʳᵈ"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatCategoryBadge = (cat: string): string => {
  if (!cat) return "Technology";
  const u = cat.trim().toUpperCase();
  if (u === "ENGINEERING & DATA" || u === "TECH" || u === "TECHNOLOGY") return "Technology";
  if (u === "CREATIVE & ART" || u === "VISUAL ARTS" || u === "DESIGN") return "Design";
  if (u === "MEDIA & PRODUCTION" || u === "VISUALS") return "Visuals";
  return cat;
};

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_FULL = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const parseEventDate = (evtDate: any, fallbackDay: number, fallbackMonthYear: string = "AUGUST 2026"): Date => {
  if (evtDate && typeof evtDate === "string" && evtDate.includes("-")) {
    const parts = evtDate.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  let y = 2026;
  let m = 7; // August 0-indexed
  if (fallbackMonthYear) {
    const matchY = String(fallbackMonthYear).match(/\d{4}/);
    if (matchY) y = parseInt(matchY[0], 10);
    const upper = String(fallbackMonthYear).toUpperCase();
    for (let i = 0; i < MONTH_NAMES_FULL.length; i++) {
      if (upper.includes(MONTH_NAMES_FULL[i])) {
        m = i;
        break;
      }
    }
  }
  return new Date(y, m, Number(fallbackDay) || 1);
};

const formatDateFull = (d: Date): string => {
  if (!d || isNaN(d.getTime())) return "";
  const day = getOrdinal(d.getDate());
  const month = MONTH_NAMES_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const toISODateString = (d: Date): string => {
  if (!d || isNaN(d.getTime())) return "2026-08-01";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export interface SubCategory {
  id: string;
  name: string;
  desc: string;
}

export interface MainCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  subcategories: SubCategory[];
  megaMenu: {
    columns: {
      heading: string;
      items: { name: string; filterSub: string }[];
    }[];
    featuredProjects: {
      id: string;
      title: string;
      desc: string;
      image: string;
      subCategory: string;
    }[];
    tools: string[];
  };
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: "engineering-data",
    title: "Technology",
    subtitle: "Technical & Analytical Solutions",
    icon: Terminal,
    subcategories: [
      { id: "web-applications", name: "Web Applications", desc: "Web Apps & Digital Platforms" },
      { id: "frontend-component-systems", name: "Frontend & Component Systems", desc: "Design Systems & React Components" },
      { id: "ecommerce-architecture", name: "E-Commerce Architecture", desc: "Headless E-Commerce & Systems" },
      { id: "analytics-dashboards", name: "Analytics Dashboards", desc: "Real-Time Analytics Dashboards" },
      { id: "data-visualization", name: "Data Visualization", desc: "Charts & Data Visualization" },
      { id: "data-processing-querying", name: "Data Processing & Querying", desc: "Python & SQL Data Processing" }
    ],
    megaMenu: {
      columns: [
        {
          heading: "WEB DEVELOPMENT",
          items: [
            { name: "Web Applications", filterSub: "Web Applications" },
            { name: "Frontend & Component Systems", filterSub: "Frontend & Component Systems" },
            { name: "E-Commerce Architecture", filterSub: "E-Commerce Architecture" }
          ]
        },
        {
          heading: "DATA ANALYSIS",
          items: [
            { name: "Analytics Dashboards", filterSub: "Analytics Dashboards" },
            { name: "Data Visualization", filterSub: "Data Visualization" },
            { name: "Data Processing & Querying", filterSub: "Data Processing & Querying" }
          ]
        }
      ],
      featuredProjects: [
        {
          id: "proj-1",
          title: "Platform E-Commerce Headless",
          desc: "Toko online modern Next.js + React berkecepatan tinggi.",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "E-Commerce Architecture"
        },
        {
          id: "proj-6",
          title: "Dashboard Analitik Real-Time",
          desc: "Olah data transaksi e-commerce & grafik Recharts.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "Analytics Dashboards"
        }
      ],
      tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "Recharts", "SQL", "Vite"]
    }
  },
  {
    id: "creative-art",
    title: "Design",
    subtitle: "Art & Visual Design",
    icon: Brush,
    subcategories: [
      { id: "branding-identity", name: "Branding & Identity", desc: "Brand Identity & Logos" },
      { id: "packaging-design", name: "Packaging Design", desc: "Product Packaging Design" },
      { id: "digital-print-layouts", name: "Digital & Print Layouts", desc: "Posters & Media Layouts" },
      { id: "comic-strips-storytelling", name: "Comic Strips & Storytelling", desc: "Comic Strips & Digital Narratives" },
      { id: "character-design", name: "Character Design", desc: "Digital Character Design" },
      { id: "web-app-illustration", name: "Web & App Illustration", desc: "Digital Media & App Illustrations" }
    ],
    megaMenu: {
      columns: [
        {
          heading: "GRAPHIC DESIGN",
          items: [
            { name: "Branding & Identity", filterSub: "Branding & Identity" },
            { name: "Packaging Design", filterSub: "Packaging Design" },
            { name: "Digital & Print Layouts", filterSub: "Digital & Print Layouts" }
          ]
        },
        {
          heading: "COMICS & ILLUSTRATION",
          items: [
            { name: "Comic Strips & Storytelling", filterSub: "Comic Strips & Storytelling" },
            { name: "Character Design", filterSub: "Character Design" },
            { name: "Web & App Illustration", filterSub: "Web & App Illustration" }
          ]
        }
      ],
      featuredProjects: [
        {
          id: "proj-3",
          title: "Rebranding 'Kopi Senja'",
          desc: "Perancangan ulang identitas visual & kemasan produk.",
          image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "Branding & Identity"
        },
        {
          id: "proj-5",
          title: "Komik Strip 'Kilas Senja'",
          desc: "Kumpulan komik digital 4-panel fabel modern.",
          image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "Comic Strips & Storytelling"
        }
      ],
      tools: ["Figma", "Adobe Illustrator", "Photoshop", "Clip Studio Paint", "Digital Tablet"]
    }
  },
  {
    id: "media-production",
    title: "Visuals",
    subtitle: "Audio-Visual & Production",
    icon: Film,
    subcategories: [
      { id: "urban-architecture", name: "Urban & Architecture", desc: "Architecture & Cityscapes" },
      { id: "documentary-street", name: "Documentary & Street", desc: "Street Photography & Documentaries" },
      { id: "creative-fine-art", name: "Creative & Fine Art", desc: "Creative Monochrome & Fine Art" },
      { id: "commercials-promos", name: "Commercials & Promos", desc: "Commercial Videos & Promo Reels" },
      { id: "short-films-reels", name: "Short Films & Reels", desc: "Short Films & Cinematography" },
      { id: "editing-post-production", name: "Editing & Post-Production", desc: "Color Grading & Post-Production" }
    ],
    megaMenu: {
      columns: [
        {
          heading: "PHOTOGRAPHY",
          items: [
            { name: "Urban & Architecture", filterSub: "Urban & Architecture" },
            { name: "Documentary & Street", filterSub: "Documentary & Street" },
            { name: "Creative & Fine Art", filterSub: "Creative & Fine Art" }
          ]
        },
        {
          heading: "VIDEOGRAPHY",
          items: [
            { name: "Commercials & Promos", filterSub: "Commercials & Promos" },
            { name: "Short Films & Reels", filterSub: "Short Films & Reels" },
            { name: "Editing & Post-Production", filterSub: "Editing & Post-Production" }
          ]
        }
      ],
      featuredProjects: [
        {
          id: "proj-2",
          title: "Seri 'Urban Silence'",
          desc: "Dokumentasi fotografi monokrom sudut Jakarta.",
          image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "Urban & Architecture"
        },
        {
          id: "proj-4",
          title: "Cinematic Reel 2025",
          desc: "Sinematografi pendek dengan color grading khusus.",
          image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&h=320&fit=crop&auto=format&q=80",
          subCategory: "Editing & Post-Production"
        }
      ],
      tools: ["Sony Alpha Gear", "DaVinci Resolve Studio", "Adobe Premiere Pro", "Lightroom Classic"]
    }
  }
];

const FOOTER_SUBCATEGORY_LABELS: Record<string, string> = {
  // ENGINEERING & DATA
  "Web Applications": "Web",
  "Frontend & Component Systems": "Frontend",
  "E-Commerce Architecture": "Commerce",
  "Analytics Dashboards": "Dashboards",
  "Data Visualization": "Visualization",
  "Data Processing & Querying": "Analytics",

  // CREATIVE & ART
  "Branding & Identity": "Branding",
  "Packaging Design": "Packaging",
  "Digital & Print Layouts": "Layouts",
  "Comic Strips & Storytelling": "Comics",
  "Character Design": "Characters",
  "Web & App Illustration": "Illustration",

  // MEDIA & PRODUCTION
  "Urban & Architecture": "Architecture",
  "Documentary & Street": "Street",
  "Creative & Fine Art": "Fineart / Creative",
  "Commercials & Promos": "Commercials",
  "Short Films & Reels": "Cinema / Reels",
  "Editing & Post-Production": "Editing"
};

const COLOR_OPTIONS = [
  { name: "Abu-Abu Muda", bg: "bg-[#E3E3E3]", label: "#E3E3E3" },
  { name: "Merah Tomat", bg: "bg-[#E63946]", label: "#E63946" },
  { name: "Biru Marine", bg: "bg-[#0F4C81]", label: "#0F4C81" },
  { name: "Hijau Emerald", bg: "bg-[#2A9D8F]", label: "#2A9D8F" },
  { name: "Kuning Mustard", bg: "bg-[#D97706]", label: "#D97706" },
  { name: "Ungu Violet", bg: "bg-[#6D28D9]", label: "#6D28D9" },
];

const WRITINGS = [
  {
    id: "note-1",
    title: "Why Editorial Typography is Highly Effective for Web Portfolios",
    quote: "Good readability doesn't require excessive ornamentation. Bold structure directly communicates your professionalism."
  },
  {
    id: "note-2",
    title: "The Beauty & Challenges Behind Monochromatic Design",
    quote: "Without color as a distraction, every pixel spacing, font weight, and line contrast becomes crucial."
  }
];

const DEFAULT_SERVICES = [
  {
    id: "srv-1",
    title: "FRONTEND DEVELOPMENT",
    desc: "Building modern web applications with React, Next.js, TypeScript, and Tailwind CSS that are fast, SEO-friendly, & responsive."
  },
  {
    id: "srv-2",
    title: "DATA ANALYSIS & DASHBOARDS",
    desc: "Interactive data visualization, dataset processing, and building intuitive & informative business analytics dashboards."
  },
  {
    id: "srv-3",
    title: "UI/UX DESIGN & PROTOTYPING",
    desc: "Designing user interfaces from wireframes and Figma prototypes to production-ready Design Systems."
  },
  {
    id: "srv-4",
    title: "PHOTOGRAPHY & DOCUMENTARY",
    desc: "Monochrome visual exploration, urban architecture photography, and high-resolution landscape documentation."
  },
  {
    id: "srv-5",
    title: "VIDEOGRAPHY & POST-PRODUCTION",
    desc: "Short film cinematography, promo reels creation, and cinematic color grading with DaVinci Resolve."
  },
  {
    id: "srv-6",
    title: "DIGITAL COMICS & ILLUSTRATION",
    desc: "Creating 4-panel comic strips, fable characters, and cartoon digital illustrations for web media."
  }
];

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Google UX Design Professional Certificate",
    issuer: "Google / Coursera",
    date: "2026",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&auto=format&q=80",
    credentialUrl: "https://coursera.org/verify/professional-cert/google-ux",
    category: "UI/UX DESIGN",
    description: "Sertifikasi profesional merancang alur pengguna, wireframing, riset UX, dan desain antarmuka berbasis Figma."
  },
  {
    id: "cert-2",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    date: "2025",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&auto=format&q=80",
    credentialUrl: "https://coursera.org/verify/professional-cert/meta-frontend",
    category: "ENGINEERING",
    description: "Akreditasi tingkat lanjut untuk pengembangan aplikasi web modern dengan React, JavaScript ES6+, dan Tailwind CSS."
  },
  {
    id: "cert-3",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2026",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&auto=format&q=80",
    credentialUrl: "https://aws.amazon.com/verification",
    category: "CLOUD & DATA",
    description: "Sertifikasi pemahaman arsitektur cloud, keamanan server, dan manajemen infrastruktur web di AWS."
  }
];

const DEMO_PROJECTS = [
  {
    id: "proj-1",
    mainCategory: "Technology",
    subCategory: "E-Commerce Architecture",
    headline: "Platform E-Commerce Minimalis dengan Arsitektur Headless",
    deck: "Toko online modern berkecepatan tinggi dengan integrasi sistem pembayaran, manajemen inventaris, dan pencarian cepat.",
    author: "Andika Catur Ariantono",
    date: "2026",
    linkUrl: "https://andikacatur.dev/ecommerce-demo",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Tampilan antarmuka toko online headless dengan waktu muat halaman di bawah 1 detik.",
    content: [
      "Platform E-Commerce ini dirancang khusus untuk memberikan pengalaman belanja yang instan dan tanpa hambatan. Menggunakan Next.js App Router dan Tailwind CSS, setiap komponen dioptimalkan secara ketat.",
      "Fitur utama mencakup sistem filter cepat berbasis URL, manajemen keranjang belanja lokal instan, integrasi gateway pembayaran otomatis, serta dasbor analitik penjual yang intuitif."
    ]
  },
  {
    id: "proj-2",
    mainCategory: "Technology",
    subCategory: "Analytics Dashboards",
    headline: "Dashboard Analitik Real-Time & Visualisasi Data E-Commerce",
    deck: "Olah data transaksi e-commerce, grafik tren penjualan, & dashboard performa interaktif berbasis Recharts dan Python.",
    author: "Andika Catur Ariantono",
    date: "2026",
    linkUrl: "https://andikacatur.dev/data-dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Data Analytics", "Recharts", "Python", "SQL"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Dashboard visualisasi data interaktif untuk memantau KPI bisnis dan tren penjualan bulanan.",
    content: [
      "Proyek analitik ini memproses ribuan data transaksi e-commerce untuk menghasilkan wawasan bisnis yang dapat ditindaklanjuti secara real-time.",
      "Integrasi grafik dinamis menggunakan Recharts, pembersihan data awal dengan Python Pandas, serta tampilan dasbor bersih berbasis matriks performa utama (KPI)."
    ]
  },
  {
    id: "proj-3",
    mainCategory: "Design",
    subCategory: "Branding & Identity",
    headline: "Rebranding 'Kopi Senja': Estetika Klasik di Era Digital",
    deck: "Perancangan ulang identitas visual, kemasan produk, dan aplikasi pemesanan digital untuk kedai kopi lokal.",
    author: "Andika Catur Ariantono",
    date: "2025",
    linkUrl: "https://behance.net/andikacatvr",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&h=320&fit=crop&auto=format&q=80",
    tags: ["Branding", "UI/UX", "Design System"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Identitas visual baru Kopi Senja menggabungkan nuansa hangat dan tipografi bersih.",
    content: [
      "Proyek rebranding ini bertujuan memperbarui citra merek Kopi Senja agar relevan dengan segmen pelanggan muda tanpa kehilangan akar estetika klasiknya.",
      "Proses mencakup pembuatan panduan gaya brand, desain logo baru, sistem warna kemasan eco-friendly, hingga aplikasi mobile pemesanan 'pick-up' kopi."
    ]
  },
  {
    id: "proj-4",
    mainCategory: "Design",
    subCategory: "Comic Strips & Storytelling",
    headline: "Komik Strip 'Kilas Senja': Seri Cerita Humor Digital",
    deck: "Kumpulan cerita komik pendek 4-panel bertema kehidupan harian developer dan kehidupan perkotaan.",
    author: "Andika Catur Ariantono",
    date: "2025",
    linkUrl: "https://webtoons.com/demo-comic",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Komik Strip", "Clip Studio Paint", "Digital Art"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Ilustrasi komik digital bergaya garis hitam tegas dan warna pop.",
    content: [
      "Komik 'Kilas Senja' disajikan dalam bentuk panel strip interaktif yang dioptimalkan untuk perangkat seluler.",
      "Setiap episode menyampaikan potongan cerita fabel modern dengan gaya ilustrasi kartun yang ekspresif dan humor relatable."
    ]
  },
  {
    id: "proj-5",
    mainCategory: "Visuals",
    subCategory: "Urban & Architecture",
    headline: "Seri 'Urban Silence': Dokumentasi Arsitektur Kota",
    deck: "Eksplorasi visual lanskap ibu kota sebelum fajar, menangkap interaksi cahaya dan struktur beton dalam monokrom.",
    author: "Andika Catur Ariantono",
    date: "2026",
    linkUrl: "https://instagram.com/andikacatvr",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=320&fit=crop&auto=format&q=80",
    tags: ["Fotografi", "Monokrom", "Art Direction"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Dokumentasi fotografi monokrom sudut kota Jakarta di fajar hari.",
    content: [
      "Seri 'Urban Silence' adalah proyek dokumenter visual pribadi yang merekam sudut-sudut arsitektur gedung pencakar langit dan jalanan ibu kota saat keheningan pagi menyelimuti kota.",
      "Foto-foto diambil dengan fokus pada geometris garis, permainan bayangan kontras tinggi, dan tekstur material bangunan tanpa gangguan aktivitas manusia."
    ]
  },
  {
    id: "proj-6",
    mainCategory: "Visuals",
    subCategory: "Editing & Post-Production",
    headline: "Cinematic Reel 2025: Dokumenter Eksplorasi Visual",
    deck: "Kumpulan sinematografi pendek lanskap alam Indonesia dan dokumentasi kehidupan urban 4K.",
    author: "Andika Catur Ariantono",
    date: "2025",
    linkUrl: "https://youtube.com/watch?v=demo-reel",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=500&fit=crop&auto=format&q=80",
    tags: ["Videografi", "Color Grading", "DaVinci Resolve"],
    bgColor: "bg-[#E3E3E3]",
    textColor: "text-black",
    subTextColor: "text-black/80",
    badgeBg: "bg-black text-white",
    isFeatured: true,
    caption: "Sinematografi pendek dengan pengolahan warna sinematik khusus.",
    content: [
      "Video kompilasi sinematik ini menampilkan potongan-potongan adegan perjalanan lintas daerah di Jawa dan Bali.",
      "Pengambilan gambar menggunakan teknik slow-motion 60fps, color grading bernuansa hangat di DaVinci Resolve, serta desain tata suara atmosferik yang mendalam."
    ]
  }
];

const INITIAL_PROJECTS: any[] = [];

const DEFAULT_HERO_PORTFOLIO = {
  id: "hero-intro",
  mainCategory: "MAIN SUMMARY",
  subCategory: "PORTFOLIO PROFILE",
  headline: "MENGGABUNGKAN KODE, ESTETIKA VISUAL, DAN ANALISIS DATA MENJADI KARYA DIGITAL",
  deck: "Halo, nama saya Andika Catur Ariantono. Berfokus pada engineering & data analysis, desain visual art, serta produksi audio-visual yang intuitif.",
  author: "Andika Catur Ariantono",
  date: "2026",
  readTime: "5 MIN READ",
  image: fotoPerkenalan,
  caption: "Andika Catur Ariantono — Software Engineer, Data Analyst & Visual Creator",
  content: [
    "Selamat datang di portofolio editorial digital saya. Halaman ini adalah ruang dokumentasi terbuka yang merangkum berbagai eksplorasi di bidang pengembangan perangkat lunak (web & mobile), analisis data bisnis, desain antarmuka (UI/UX), hingga produksi media kreatif.",
    "Sebagai pengembang yang berfokus pada pengalaman pengguna yang cepat dan responsif, setiap proyek dibangun dengan arsitektur bersih, desain tipografi yang tegas, serta performa terbaik."
  ]
};

function Hairline({ thick = false }: { thick?: boolean }) {
  return <div className={`border-t ${thick ? "border-black border-t-2" : "border-black/20"} my-0`} />;
}

function WeatherWidget() {
  return (
    <div className="border-2 border-black p-4 bg-white rounded-none">
      <div className="border-b border-black pb-2 mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "Playfair Display, serif" }}>
          <CloudSun size={14} /> LOCATION &amp; WEATHER
        </h3>
        <span className="text-[9px] font-bold uppercase bg-black text-white px-1.5 py-0.5 rounded-none">
          WIB
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-50 border border-black/20 p-3 rounded-none">
        <div>
          <span className="text-[10px] font-bold text-black/50 uppercase block tracking-wider">JAKARTA, INDONESIA</span>
          <div className="text-2xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>
            28°C <span className="text-xs font-normal text-black/70">/ Sunny</span>
          </div>
          <span className="text-[11px] font-serif text-black/80 italic" style={{ fontFamily: "Jost, sans-serif" }}>
            Local Time: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
        </div>
        <div className="text-right flex flex-col items-center justify-center pl-2">
          <Sun size={26} className="text-black mb-1" />
          <span className="text-[9px] font-bold uppercase text-black/60">REMOTE / WFH BASED</span>
        </div>
      </div>
    </div>
  );
}

export interface CalendarSettings {
  startOfWeek: "Sunday" | "Monday";
  dateFormat: "D MMMM YYYY" | "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  showWeekNumbers: boolean;
  highlightToday: boolean;
}

function CalendarWidget({
  calendarStatus,
  setCalendarStatus,
  writings = [],
  isAdminLoggedIn,
  onEdit
}: {
  calendarStatus: any;
  setCalendarStatus: React.Dispatch<React.SetStateAction<any>>;
  writings?: any[];
  isAdminLoggedIn: boolean;
  onEdit: () => void;
}) {
  const realToday = new Date();

  // Dynamic View Month & Year State (Always initializes directly to the current real month and year)
  const [viewYear, setViewYear] = useState<number>(realToday.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(realToday.getMonth());  // Settings State with localStorage Persistence
  const [settings, setSettings] = useState<CalendarSettings>(() => {
    try {
      const saved = localStorage.getItem("andika_calendar_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            startOfWeek: parsed.startOfWeek || "Monday",
            dateFormat: parsed.dateFormat || "D MMMM YYYY",
            showWeekNumbers: Boolean(parsed.showWeekNumbers),
            highlightToday: parsed.highlightToday !== false
          };
        }
      }
    } catch (e) {
      console.error("Gagal membaca settings kalender", e);
    }
    return {
      startOfWeek: "Monday",
      dateFormat: "D MMMM YYYY",
      showWeekNumbers: false,
      highlightToday: true
    };
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("andika_calendar_settings", JSON.stringify(settings));
    } catch (e) {
      console.error("Gagal menyimpan settings kalender", e);
    }
  }, [settings]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // Calculations
  const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNamesFull[viewMonth].toUpperCase();
  const displayMonthYear = `${currentMonthName} ${viewYear}`;

  // Days in month calculation (handles leap years 28/29/30/31 dynamically)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon

  // Blank offset calculation based on startOfWeek
  const startDayOffset = settings.startOfWeek === "Monday"
    ? (firstDayOfMonth + 6) % 7
    : firstDayOfMonth;

  const daysOfWeek = settings.startOfWeek === "Monday"
    ? ["M", "T", "W", "T", "F", "S", "S"]
    : ["S", "M", "T", "W", "T", "F", "S"];

  const eventsList = calendarStatus?.events || [];

  // ISO Week number calculation helper
  const getISOWeekNumber = (y: number, m: number, d: number) => {
    const date = new Date(Date.UTC(y, m, d));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const gridColsClass = settings.showWeekNumbers ? "grid-cols-8" : "grid-cols-7";

  return (
    <div className="border-2 border-black p-4 bg-white rounded-none relative">
      {/* Widget Header with Navigation & Settings */}
      <div className="border-b border-black pb-2.5 mb-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "Playfair Display, serif" }}>
            <CalendarIcon size={14} /> CALENDAR
          </h3>
          <div className="flex items-center gap-1">
            {isAdminLoggedIn && (
              <button
                onClick={onEdit}
                className="bg-black text-[#FFCC00] hover:bg-gray-800 text-[9px] font-black uppercase px-1.5 py-0.5 border border-black flex items-center gap-1 transition-colors rounded-none cursor-pointer"
                title="Edit Availability Schedule (Admin)"
              >
                <Edit size={10} /> EDIT
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Month Navigation Bar */}
        <div className="flex items-center justify-between bg-gray-100 p-1.5 text-xs font-black">
          <button
            onClick={handlePrevMonth}
            className="px-2 py-0.5 bg-white hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
            title="Previous Month"
          >
            &lt;
          </button>

          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-widest text-[10px] text-black font-black">
              {displayMonthYear}
            </span>
            {realToday.getFullYear() === viewYear && realToday.getMonth() === viewMonth ? (
              <span
                className="text-[9px] bg-[#FFCC00] text-black px-1.5 py-0.5 font-black uppercase border border-black"
                title="Bulan Saat Ini"
              >
                TODAY
              </span>
            ) : (
              <button
                onClick={handleGoToday}
                className="text-[9px] bg-[#D6D6D6] hover:bg-[#c4c4c4] text-black px-1.5 py-0.5 font-black uppercase border border-black cursor-pointer transition-colors"
                title="Kembali ke Bulan Sekarang"
              >
                &larr; GO TO TODAY
              </button>
            )}
          </div>

          <button
            onClick={handleNextMonth}
            className="px-2 py-0.5 bg-white hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
            title="Next Month"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className={`grid ${gridColsClass} gap-1 text-center border-b border-black/20 pb-1.5 mb-2`}>
        {settings.showWeekNumbers && (
          <span className="text-[9px] font-black uppercase text-black/40">
            Wk
          </span>
        )}
        {daysOfWeek.map((d, idx) => (
          <span key={idx} className="text-[10px] font-black uppercase text-black/70">
            {d}
          </span>
        ))}
      </div>

      {/* Grid Kalender Dynamic */}
      <div className={`grid ${gridColsClass} gap-1 text-center text-xs font-semibold mb-3`}>
        {/* Row 1 Blank offset */}
        {settings.showWeekNumbers && (
          <div className="p-1 text-[9px] font-black text-black/40 bg-gray-50 border border-transparent">
            {getISOWeekNumber(viewYear, viewMonth, 1)}
          </div>
        )}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`blank-${i}`} className="p-1 text-transparent select-none">.</div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isRealToday = settings.highlightToday &&
            realToday.getFullYear() === viewYear &&
            realToday.getMonth() === viewMonth &&
            realToday.getDate() === day;

          const dayEvent = eventsList.find((evt: any) => {
            const evtStart = parseEventDate(evt.startDate, evt.startDay, calendarStatus?.monthYear);
            evtStart.setHours(0, 0, 0, 0);
            const evtEnd = parseEventDate(evt.endDate, evt.endDay, calendarStatus?.monthYear);
            evtEnd.setHours(23, 59, 59, 999);

            const cellDate = new Date(viewYear, viewMonth, day);
            cellDate.setHours(12, 0, 0, 0);

            return cellDate >= evtStart && cellDate <= evtEnd;
          });
          const hasConnectedNote = (writings || []).some((w: any) => {
            if (!w) return false;
            if (w.day && Number(w.day) === day) return true;
            if (w.date && String(w.date).toLowerCase().includes(String(day))) return true;
            return false;
          });

          let dateStyle = "hover:bg-black/10 text-black/80";
          if (isRealToday) {
            dateStyle = "bg-[#FFCC00] font-black text-black border-2 border-black shadow-sm ring-1 ring-black/20";
          } else if (dayEvent) {
            if (dayEvent.status === "SIBUK" || dayEvent.status === "BUSY") {
              dateStyle = "bg-red-600 text-white font-bold border border-transparent";
            } else if (dayEvent.status === "TERISI" || dayEvent.status === "BOOKED") {
              dateStyle = "bg-[#FFCC00] text-black font-bold border border-transparent";
            } else if (dayEvent.status === "TERBUKA" || dayEvent.status === "OPEN") {
              dateStyle = "bg-emerald-600 text-white font-bold border border-transparent";
            }
          }

          // Compute week number indicator for start of rows if showWeekNumbers is active
          const isStartOfRow = (i + startDayOffset) % 7 === 0;
          const renderWeekNum = settings.showWeekNumbers && isStartOfRow && i > 0;

          return (
            <React.Fragment key={day}>
              {renderWeekNum && (
                <div className="p-1 text-[9px] font-black text-black/40 bg-gray-50 flex items-center justify-center">
                  {getISOWeekNumber(viewYear, viewMonth, day)}
                </div>
              )}
              <div
                className={`p-1 text-[11px] rounded-none transition-all relative flex flex-col items-center justify-center min-h-[28px] ${dateStyle}`}
                title={isRealToday ? `TODAY (${getOrdinal(day)} ${monthNamesFull[viewMonth]} ${viewYear})` : dayEvent ? `Date ${day}: ${dayEvent.title} (${dayEvent.status})` : `Date ${day}`}
              >
                <span>{getOrdinal(day)}</span>
                {hasConnectedNote && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black border border-white absolute bottom-0.5" title="Connected Note Available" />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Schedule Overview Date Ranges */}
      {eventsList.length > 0 && (
        <div className="border-t border-black/20 pt-2 space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-black/50 block">
            ACTIVITIES &amp; DATE RANGES:
          </span>
          {eventsList.map((evt: any) => {
            const sDateObj = parseEventDate(evt.startDate, evt.startDay, calendarStatus?.monthYear);
            const eDateObj = parseEventDate(evt.endDate, evt.endDay, calendarStatus?.monthYear);
            return (
              <div
                key={evt.id}
                className="p-1.5 border text-[10px] transition-all flex items-center justify-between gap-1.5 border-black/20 bg-gray-50/80"
              >
                <div className="truncate">
                  <span className="font-black mr-1 text-black">
                    [{formatDateFull(sDateObj)} - {formatDateFull(eDateObj)}]
                  </span>
                  <span className="font-serif italic text-black/80">{evt.title || "Untitled Event..."}</span>
                </div>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 ${evt.status === "SIBUK" || evt.status === "BUSY" ? "bg-red-600 text-white" :
                    evt.status === "TERISI" || evt.status === "BOOKED" ? "bg-[#FFCC00] text-black" :
                      "bg-emerald-600 text-white"
                  }`}>
                  {evt.status === "SIBUK" ? "BUSY" : evt.status === "TERISI" ? "BOOKED" : evt.status === "TERBUKA" ? "OPEN" : evt.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="border-t-[3px] border-b border-black py-2 flex items-center justify-between">
        <h3
          className="text-lg md:text-xl font-black uppercase tracking-tight text-black"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          {title}
        </h3>
        {subtitle && (
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-black/50 hidden sm:inline-block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

const dbName = "AndikaPortoDB";
const storeName = "projects";

const initIDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(storeName);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const saveProjectsToIDB = async (data: any[]) => {
  try {
    const db = await initIDB();
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(data, "all_projects");
  } catch (e) {
    console.error("IndexedDB save error", e);
  }
};

const getProjectsFromIDB = async (): Promise<any[] | null> => {
  try {
    const db = await initIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get("all_projects");
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const getDeletedProjectIds = (): string[] => {
  try {
    const saved = localStorage.getItem("andika_deleted_project_ids");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Gagal membaca deleted project IDs dari localStorage", e);
  }
  return [];
};

const saveDeletedProjectId = (id: string) => {
  try {
    const current = getDeletedProjectIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem("andika_deleted_project_ids", JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Gagal menyimpan deleted project ID", e);
  }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMegaMenuId, setOpenMegaMenuId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Beranda");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("SEMUA");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  // Portfolio Projects State with localStorage & Supabase Sync
  const sanitizeProjectItem = (p: any) => ({
    ...p,
    mainCategory: formatCategoryBadge(p ? p.mainCategory : "Technology")
  });

  const [projects, setProjects] = useState<any[]>(() => {
    const deletedIds = getDeletedProjectIds();
    try {
      const isInitialized = localStorage.getItem("andika_projects_initialized");
      const saved = localStorage.getItem("andika_portfolio_projects");
      if (isInitialized === "true") {
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((p: any) => p && p.id && !deletedIds.includes(p.id))
              .map(sanitizeProjectItem);
          }
        }
        return [];
      }
    } catch (e) {
      console.error("Gagal membaca data dari localStorage", e);
    }
    return [];
  });
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load & Realtime Sync from Supabase Database across all devices live
  useEffect(() => {
    fetchProjectsFromSupabase()
      .then((supabaseProjects) => {
        const deletedIds = getDeletedProjectIds();
        if (supabaseProjects && Array.isArray(supabaseProjects)) {
          const cleanProjects = supabaseProjects
            .filter((p: any) => p && p.id && !deletedIds.includes(p.id))
            .map(sanitizeProjectItem);
          setProjects(cleanProjects);
        }
      })
      .catch((err) => {
        console.error("Supabase fetch promise error:", err);
      });

    const unsubscribe = subscribeToProjectsRealtime((realtimeProjects) => {
      const deletedIds = getDeletedProjectIds();
      if (realtimeProjects && Array.isArray(realtimeProjects)) {
        const cleanProjects = realtimeProjects
          .filter((p: any) => p && p.id && !deletedIds.includes(p.id))
          .map(sanitizeProjectItem);
        setProjects(cleanProjects);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync projects dynamically to IndexedDB & localStorage
  useEffect(() => {
    saveProjectsToIDB(projects);
    try {
      localStorage.setItem("andika_portfolio_projects", JSON.stringify(projects));
    } catch (e) {
      // Fallback: IndexedDB handles large files if localStorage 5MB quota is exceeded
    }
  }, [projects]);

  // Admin Auth States with Session Persistence across navigation & page reloads
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("andika_admin_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const [activeAdminUser, setActiveAdminUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem("andika_active_admin_user") || null;
    } catch {
      return null;
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      let existing = localStorage.getItem("andika_session_id");
      if (!existing) {
        existing = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 7);
      }
      return existing;
    } catch {
      return Date.now().toString();
    }
  });

  useEffect(() => {
    try {
      if (isAdminLoggedIn) {
        localStorage.setItem("andika_admin_logged_in", "true");
        if (activeAdminUser) {
          localStorage.setItem("andika_active_admin_user", activeAdminUser);
        }
      } else {
        localStorage.removeItem("andika_admin_logged_in");
        localStorage.removeItem("andika_active_admin_user");
      }
    } catch (e) {
      console.error("Gagal menyinkronkan status admin ke localStorage", e);
    }
  }, [isAdminLoggedIn, activeAdminUser]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "andika_session_id" && e.newValue) {
        if (isAdminLoggedIn && e.newValue !== currentSessionId) {
          setIsAdminLoggedIn(false);
          setActiveAdminUser(null);
          setSavedToast("⚠️ Sesi Admin diakhiri karena ada pengguna lain yang baru saja melakukan login di tab/perangkat lain.");
          setTimeout(() => setSavedToast(null), 5000);
        }
      } else if (e.key === "andika_admin_logged_in" && e.newValue !== "true") {
        if (isAdminLoggedIn) {
          setIsAdminLoggedIn(false);
          setActiveAdminUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAdminLoggedIn, currentSessionId]);

  // Custom admin credentials stored in localStorage with fallback to .env or defaults
  const getAdminCredentials = () => {
    try {
      const saved = localStorage.getItem("andika_admin_creds");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nickname && parsed.password) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca admin creds", e);
    }
    return {
      nickname: import.meta.env.VITE_ADMIN_USER || "andika",
      password: import.meta.env.VITE_ADMIN_PASS || "bismillah#1",
      securityAnswer: import.meta.env.VITE_SECURITY_ANSWER || "rachael"
    };
  };

  const [adminCreds, setAdminCreds] = useState(getAdminCredentials);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showChangeCredsModal, setShowChangeCredsModal] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [changeCredsForm, setChangeCredsForm] = useState(adminCreds);

  const saveAdminCredentials = (newCreds: { nickname: string; password: string; securityAnswer?: string }) => {
    const full = {
      nickname: newCreds.nickname || "mickythewarrior",
      password: newCreds.password || "catwarrior",
      securityAnswer: newCreds.securityAnswer || "micky"
    };
    setAdminCreds(full);
    try {
      localStorage.setItem("andika_admin_creds", JSON.stringify(full));
    } catch (e) {
      console.error("Gagal menyimpan admin creds", e);
    }
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [authNickname, setAuthNickname] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Developer Profile State with localStorage Persistence (Admin Editable)
  const [devProfile, setDevProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("andika_dev_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca devProfile dari localStorage", e);
    }
    return {
      name: "Andika Catur Ariantono",
      role: "Software Engineer & UI Architect",
      bio: "Berfokus pada engineering & data analysis, desain visual art, serta produksi audio-visual.",
      location: "Jakarta, Indonesia",
      email: "andikacaa@gmail.com"
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_dev_profile", JSON.stringify(devProfile));
    } catch (e) {
      console.error("Gagal menyimpan devProfile ke localStorage", e);
    }
  }, [devProfile]);

  const [showDevProfileModal, setShowDevProfileModal] = useState(false);
  const [devProfileForm, setDevProfileForm] = useState(devProfile);

  const handleOpenDevProfileModal = () => {
    setDevProfileForm(devProfile);
    setShowDevProfileModal(true);
  };

  const handleSaveDevProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setDevProfile(devProfileForm);
    upsertSiteSettingToSupabase("dev_profile", devProfileForm);
    setShowDevProfileModal(false);
    setSavedToast("Profil Pengembang berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Dynamic Default events list for calendar
  const currentNow = new Date();
  const curY = currentNow.getFullYear();
  const curM = String(currentNow.getMonth() + 1).padStart(2, "0");
  const currentMonthYearStr = `${MONTH_NAMES_FULL[currentNow.getMonth()]} ${curY}`;

  const DEFAULT_CALENDAR_EVENTS = [
    {
      id: "evt-1",
      startDate: `${curY}-${curM}-01`,
      endDate: `${curY}-${curM}-05`,
      title: "",
      status: "SIBUK"
    },
    {
      id: "evt-2",
      startDate: `${curY}-${curM}-08`,
      endDate: `${curY}-${curM}-18`,
      title: "",
      status: "TERISI"
    },
    {
      id: "evt-3",
      startDate: `${curY}-${curM}-19`,
      endDate: `${curY}-${curM}-31`,
      title: "",
      status: "TERBUKA"
    }
  ];

  // Calendar Status State with localStorage Persistence (Admin Editable)
  const [calendarStatus, setCalendarStatus] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("andika_calendar_status");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (!parsed.monthYear || parsed.monthYear !== currentMonthYearStr) {
            parsed.monthYear = currentMonthYearStr;
            parsed.events = DEFAULT_CALENDAR_EVENTS;
          }
          if (!parsed.events || !Array.isArray(parsed.events)) {
            parsed.events = DEFAULT_CALENDAR_EVENTS;
          } else {
            parsed.events = parsed.events.map((evt: any) => ({
              ...evt,
              title: evt.title && evt.title.includes("Hackathon") ? "" : (evt.title || "")
            }));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca calendarStatus dari localStorage", e);
    }
    return {
      monthYear: currentMonthYearStr,
      statusNote: "Slot jadwal terbuka untuk pengerjaan proyek baru.",
      events: DEFAULT_CALENDAR_EVENTS
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_calendar_status", JSON.stringify(calendarStatus));
    } catch (e) {
      console.error("Gagal menyimpan calendarStatus ke localStorage", e);
    }
  }, [calendarStatus]);

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarForm, setCalendarForm] = useState(calendarStatus);
  const [openRangePickerId, setOpenRangePickerId] = useState<string | null>(null);
  const [activeRangeStep, setActiveRangeStep] = useState<"start" | "end">("start");

  const handleOpenCalendarModal = () => {
    setCalendarForm(calendarStatus);
    setShowCalendarModal(true);
  };

  const handleSaveCalendarStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setCalendarStatus(calendarForm);
    upsertSiteSettingToSupabase("calendar", calendarForm);
    setShowCalendarModal(false);
    setSavedToast("Jadwal Ketersediaan berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Writings / Catatan & Opini Desain State with localStorage Persistence (Admin Editable)
  const [writings, setWritings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("andika_writings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca writings dari localStorage", e);
    }
    return WRITINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_writings", JSON.stringify(writings));
    } catch (e) {
      console.error("Gagal menyimpan writings ke localStorage", e);
    }
  }, [writings]);

  const [showWritingsModal, setShowWritingsModal] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [writingsForm, setWritingsForm] = useState(writings);

  const handleOpenWritingsModal = () => {
    setWritingsForm(writings);
    setShowWritingsModal(true);
  };

  const handleSaveWritings = (e: React.FormEvent) => {
    e.preventDefault();
    setWritings(writingsForm);
    upsertSiteSettingToSupabase("writings", writingsForm);
    setShowWritingsModal(false);
    setSavedToast("Catatan & Opini Desain berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Services & Keahlian Layanan State with localStorage Persistence (Admin Editable)
  const [services, setServices] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("andika_services");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca services dari localStorage", e);
    }
    return DEFAULT_SERVICES;
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_services", JSON.stringify(services));
    } catch (e) {
      console.error("Gagal menyimpan services ke localStorage", e);
    }
  }, [services]);

  const [showServicesModal, setShowServicesModal] = useState(false);
  const [servicesForm, setServicesForm] = useState<any[]>([]);

  // Certificates State with localStorage & Supabase Sync
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const isInitialized = localStorage.getItem("andika_certs_initialized");
      const saved = localStorage.getItem("andika_certificates");
      if (isInitialized === "true") {
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
        return [];
      }
    } catch (e) {}
    return DEFAULT_CERTIFICATES;
  });
  const [selectedCertModal, setSelectedCertModal] = useState<CertificateItem | null>(null);
  const [showManageCertModal, setShowManageCertModal] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certFormData, setCertFormData] = useState<CertificateItem>({
    id: "",
    title: "",
    issuer: "",
    date: new Date().getFullYear().toString(),
    imageUrl: "",
    credentialUrl: "",
    category: "ENGINEERING",
    description: ""
  });

  // Certificates Horizontal Scroll Ref & Wheel Listener (Callback Ref for guaranteed mount attachment)
  const certScrollRef = useRef<HTMLDivElement | null>(null);
  const certWheelCleanupRef = useRef<(() => void) | null>(null);
  const [isCertDragging, setIsCertDragging] = useState(false);
  const [certStartX, setCertStartX] = useState(0);
  const [certScrollLeft, setCertScrollLeft] = useState(0);

  const setCertScrollRef = useCallback((node: HTMLDivElement | null) => {
    if (certWheelCleanupRef.current) {
      certWheelCleanupRef.current();
      certWheelCleanupRef.current = null;
    }

    certScrollRef.current = node;

    if (node) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          node.scrollLeft += e.deltaY;
        }
      };

      node.addEventListener("wheel", handleWheel, { passive: false });
      certWheelCleanupRef.current = () => {
        node.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  const scrollCertificates = (direction: "left" | "right") => {
    if (certScrollRef.current) {
      const scrollAmount = 360;
      certScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleCertMouseDown = (e: React.MouseEvent) => {
    if (!certScrollRef.current) return;
    setIsCertDragging(true);
    setCertStartX(e.pageX - certScrollRef.current.offsetLeft);
    setCertScrollLeft(certScrollRef.current.scrollLeft);
  };

  const handleCertMouseLeaveOrUp = () => {
    setIsCertDragging(false);
  };

  const handleCertMouseMove = (e: React.MouseEvent) => {
    if (!isCertDragging || !certScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - certScrollRef.current.offsetLeft;
    const walk = (x - certStartX) * 1.5;
    certScrollRef.current.scrollLeft = certScrollLeft - walk;
  };

  // Load Certificates from Supabase & Subscribe to Realtime
  useEffect(() => {
    fetchCertificatesFromSupabase().then((supabaseCerts) => {
      if (supabaseCerts !== null && Array.isArray(supabaseCerts)) {
        localStorage.setItem("andika_certs_initialized", "true");
        setCertificates(supabaseCerts);
      }
    });

    const unsubscribe = subscribeToCertificatesRealtime((realtimeCerts) => {
      if (realtimeCerts !== null && Array.isArray(realtimeCerts)) {
        localStorage.setItem("andika_certs_initialized", "true");
        setCertificates(realtimeCerts);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load Site Settings (Hero, Dev Profile, Calendar, Writings, Services, Tools & Tech, Admin Creds) from Supabase
  useEffect(() => {
    fetchSiteSettingFromSupabase("hero").then(val => { if (val) setHeroPortfolio(val); });
    fetchSiteSettingFromSupabase("dev_profile").then(val => { if (val) setDevProfile(val); });
    fetchSiteSettingFromSupabase("calendar").then(val => { if (val) setCalendarStatus(val); });
    fetchSiteSettingFromSupabase("writings").then(val => { if (val) setWritings(val); });
    fetchSiteSettingFromSupabase("services").then(val => { if (val) setServices(val); });
    fetchSiteSettingFromSupabase("tools_tech").then(val => { if (val) setSectorTools(val); });
    fetchSiteSettingFromSupabase("admin_creds").then(val => { if (val) setAdminCreds(val); });

    const unSubHero = subscribeToSiteSettingsRealtime("hero", setHeroPortfolio);
    const unSubDev = subscribeToSiteSettingsRealtime("dev_profile", setDevProfile);
    const unSubCal = subscribeToSiteSettingsRealtime("calendar", setCalendarStatus);
    const unSubWritings = subscribeToSiteSettingsRealtime("writings", setWritings);
    const unSubServices = subscribeToSiteSettingsRealtime("services", setServices);
    const unSubTools = subscribeToSiteSettingsRealtime("tools_tech", setSectorTools);

    return () => {
      if (unSubHero) unSubHero();
      if (unSubDev) unSubDev();
      if (unSubCal) unSubCal();
      if (unSubWritings) unSubWritings();
      if (unSubServices) unSubServices();
      if (unSubTools) unSubTools();
    };
  }, []);

  // Save Certificates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("andika_certificates", JSON.stringify(certificates));
      localStorage.setItem("andika_certs_initialized", "true");
    } catch (e) {}
  }, [certificates]);

  const handleOpenAddCert = () => {
    setEditingCertId(null);
    setCertFormData({
      id: "cert-" + Date.now(),
      title: "Google Data Analytics Professional Certificate",
      issuer: "Google / Coursera",
      date: new Date().getFullYear().toString(),
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
      credentialUrl: "https://coursera.org/verify/professional-cert/google-data-analytics",
      category: "CLOUD & DATA",
      description: "Akreditasi keahlian pengolahan data, SQL, visualisasi R & Tableau, serta analisis bisnis berstandar industri."
    });
    setShowManageCertModal(true);
  };

  const handleEditCert = (cert: CertificateItem) => {
    setEditingCertId(cert.id);
    setCertFormData({ ...cert });
    setShowManageCertModal(true);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFormData.title.trim()) {
      alert("Harap masukkan nama/judul sertifikat.");
      return;
    }

    if (editingCertId) {
      setCertificates((prev) =>
        prev.map((c) => (c.id === editingCertId ? certFormData : c))
      );
      upsertCertificateToSupabase(certFormData);
      setSavedToast(`Sertifikat "${certFormData.title}" berhasil diperbarui!`);
    } else {
      const newCert = { ...certFormData, id: "cert-" + Date.now() };
      setCertificates((prev) => [newCert, ...prev]);
      upsertCertificateToSupabase(newCert);
      setSavedToast(`Sertifikat "${certFormData.title}" berhasil ditambahkan!`);
    }

    setShowManageCertModal(false);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleDeleteCert = (id: string, title: string) => {
    if (confirm(`Apakah kamu yakin ingin menghapus sertifikat "${title}"?`)) {
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      deleteCertificateFromSupabase(id);
      setSavedToast(`Sertifikat "${title}" berhasil dihapus secara permanen!`);
      setTimeout(() => setSavedToast(null), 3000);
    }
  };

  const handleOpenServicesModal = () => {
    setServicesForm(JSON.parse(JSON.stringify(services)));
    setShowServicesModal(true);
  };

  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    const validServices = servicesForm.filter((s) => s.title.trim() && s.desc.trim());
    if (validServices.length === 0) {
      alert("Harap masukkan minimal 1 layanan/keahlian.");
      return;
    }
    setServices(validServices);
    upsertSiteSettingToSupabase("services", validServices);
    setShowServicesModal(false);
    setSavedToast("Keahlian & Layanan berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleAddServiceItem = () => {
    setServicesForm((prev) => [
      ...prev,
      {
        id: "srv-" + Date.now(),
        title: "LAYANAN BARU",
        desc: "Deskripsi singkat mengenai layanan dan keahlian baru ini..."
      }
    ]);
  };

  const handleRemoveServiceItem = (id: string) => {
    setServicesForm((prev) => prev.filter((s) => s.id !== id));
  };

  const handleServiceChange = (id: string, field: "title" | "desc", value: string) => {
    setServicesForm((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Hero Portfolio (Ringkasan Utama & Profil) State with localStorage Persistence
  const [heroPortfolio, setHeroPortfolio] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("andika_hero_portfolio");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.headline) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca heroPortfolio dari localStorage", e);
    }
    return DEFAULT_HERO_PORTFOLIO;
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_hero_portfolio", JSON.stringify(heroPortfolio));
    } catch (e) {
      console.error("Gagal menyimpan heroPortfolio ke localStorage", e);
    }
  }, [heroPortfolio]);

  const [showHeroModal, setShowHeroModal] = useState(false);
  const [heroFormData, setHeroFormData] = useState({
    headline: "",
    deck: "",
    imageUrl: "",
    caption: "",
    fullContent: ""
  });

  // Sector Tools & Tech State (Editable by Admin)
  const [sectorTools, setSectorTools] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("andika_sector_tools");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Gagal membaca sector_tools dari localStorage", e);
    }
    const initial: Record<string, string[]> = {};
    MAIN_CATEGORIES.forEach((cat) => {
      initial[cat.id] = cat.megaMenu.tools;
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem("andika_sector_tools", JSON.stringify(sectorTools));
    } catch (e) {
      console.error("Gagal menyimpan sector_tools ke localStorage", e);
    }
  }, [sectorTools]);

  const [showToolsTechModal, setShowToolsTechModal] = useState(false);
  const [editingToolsCat, setEditingToolsCat] = useState<string>("engineering-data");
  const [toolsInputText, setToolsInputText] = useState<string>("");

  const handleOpenToolsTechModal = () => {
    const currentCatId = "engineering-data";
    setEditingToolsCat(currentCatId);
    const toolsArr = sectorTools[currentCatId] || MAIN_CATEGORIES.find(c => c.id === currentCatId)?.megaMenu.tools || [];
    setToolsInputText(toolsArr.join(", "));
    setShowToolsTechModal(true);
  };

  const handleSaveToolsTech = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTools = toolsInputText
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);
    const updatedTools = {
      ...sectorTools,
      [editingToolsCat]: parsedTools
    };
    setSectorTools(updatedTools);
    upsertSiteSettingToSupabase("tools_tech", updatedTools);
    setSavedToast("List Tools & Tech berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
    setShowToolsTechModal(false);
  };

  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenMegaMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form State for Admin Panel (Supports up to 5 images)
  const [formData, setFormData] = useState<{
    title: string;
    mainCategory: string;
    subCategory: string;
    imageUrl: string;
    images: string[];
    linkUrl: string;
    deck: string;
    fullContent: string;
    tags: string;
    bgColor: string;
    date: string;
    isFeatured: boolean;
  }>({
    title: "",
    mainCategory: "Technology",
    subCategory: "Web Development",
    imageUrl: "",
    images: [],
    linkUrl: "",
    deck: "",
    fullContent: "",
    tags: "",
    bgColor: "bg-[#E3E3E3]",
    date: new Date().getFullYear().toString(),
    isFeatured: false
  });

  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  const [formSuccess, setFormToast] = useState<string | null>(null);

  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printInitialCategory, setPrintInitialCategory] = useState<string>("SEMUA");

  const handlePrint = (catName?: string) => {
    const targetCat = typeof catName === "string" ? catName : (activeCategory !== "Beranda" ? activeCategory : "SEMUA");
    setPrintInitialCategory(targetCat);
    setShowPrintModal(true);
  };

  const toggleSave = (id: string, title: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter(item => item !== id));
      setSavedToast(`Item dihapus dari simpanan`);
    } else {
      setSavedArticles([...savedArticles, id]);
      setSavedToast(`"${title.slice(0, 30)}..." disimpan!`);
    }
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleToggleMegaMenu = (catId: string) => {
    if (openMegaMenuId === catId) {
      setOpenMegaMenuId(null);
    } else {
      setOpenMegaMenuId(catId);
    }
  };

  const handleSelectMainCategory = (catTitle: string, subName?: string) => {
    setActiveCategory(catTitle);
    setActiveSubCategory(subName || "SEMUA");
    setSelectedArticle(null);
    setOpenMegaMenuId(null);
    setMenuOpen(false);
  };

  // Open Admin Trigger Handler
  const handleOpenAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setActiveCategory("Panel Admin");
      setSelectedArticle(null);
      setOpenMegaMenuId(null);
    } else {
      setShowAuthModal(true);
      setAuthError(null);
    }
  };

  // Process Admin Auth Submission
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = authNickname.trim().toLowerCase();
    const cleanPassword = authPassword.trim();
    const creds = adminCreds;

    const validNickname = (creds.nickname || "").toLowerCase();
    const validPassword = creds.password || "";

    const isValidUser1 = (cleanNickname === "rachael" && cleanPassword === "bismillah#1");
    const isValidUser2 = (cleanNickname === "andika" && cleanPassword === "bismillah#1");
    const isValidUser3 = ((cleanNickname === "mickythewarrior" || cleanNickname === "micky") && (cleanPassword === "catwarrior" || cleanPassword === "bismillah#1"));
    const isValidCustom = (cleanNickname === validNickname && cleanPassword === validPassword);

    if (isValidUser1 || isValidUser2 || isValidUser3 || isValidCustom) {
      const newSessionId = Date.now().toString() + "_" + Math.random().toString(36).substring(2, 7);
      setCurrentSessionId(newSessionId);
      const upperUser = cleanNickname.toUpperCase();
      setActiveAdminUser(upperUser);
      setIsAdminLoggedIn(true);

      try {
        localStorage.setItem("andika_admin_logged_in", "true");
        localStorage.setItem("andika_active_admin_user", upperUser);
        localStorage.setItem("andika_session_id", newSessionId);
      } catch { }

      setShowAuthModal(false);
      setShowForgotModal(false);
      setAuthError(null);
      setAuthPassword("");
      setActiveCategory("Panel Admin");
      setSelectedArticle(null);
      setSavedToast(`Akses Admin Berhasil! Selamat datang, ${upperUser} (Sesi Tunggal Aktif).`);
      setTimeout(() => setSavedToast(null), 4000);
    } else {
      setAuthError("Nickname atau Password salah! Harap periksa kembali.");
    }
  };

  const VALID_SECURITY_KEYS = ["rachael", "micky", "anka", "rach", "askeladd", "tserriednich"];

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = recoveryInput.trim().toLowerCase();
    const customAnswer = (adminCreds.securityAnswer || "").toLowerCase();

    if (VALID_SECURITY_KEYS.includes(cleanInput) || cleanInput === customAnswer) {
      setRecoverySuccess(true);
      setRecoveryError(null);
    } else {
      setRecoveryError("Kata kunci / Jawaban Keamanan salah. Harap coba lagi.");
      setRecoverySuccess(false);
    }
  };

  const handleResetCredsToDefault = () => {
    const defaultCreds = {
      nickname: "mickythewarrior",
      password: "catwarrior",
      securityAnswer: "micky"
    };
    saveAdminCredentials(defaultCreds);
    setRecoverySuccess(true);
    setRecoveryError(null);
    setSavedToast("Akun Admin dikembalikan ke username & password default!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleSaveChangedCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeCredsForm.nickname || !changeCredsForm.password) {
      alert("Nickname & Password tidak boleh kosong.");
      return;
    }
    saveAdminCredentials(changeCredsForm);
    upsertSiteSettingToSupabase("admin_creds", changeCredsForm);
    setShowChangeCredsModal(false);
    setSavedToast("Credentials Login Admin berhasil diperbarui & disimpan aman!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveAdminUser(null);
    try {
      localStorage.removeItem("andika_admin_logged_in");
      localStorage.removeItem("andika_active_admin_user");
      localStorage.removeItem("andika_session_id");
    } catch { }
    setEditingProjectId(null);
    setActiveCategory("Beranda");
    setSavedToast("Anda telah keluar dari Mode Admin.");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setFormData({
      title: "",
      mainCategory: "Technology",
      subCategory: "Web Development",
      imageUrl: "",
      images: [],
      linkUrl: "",
      deck: "",
      fullContent: "",
      tags: "",
      bgColor: "bg-[#E3E3E3]",
      date: new Date().getFullYear().toString(),
      isFeatured: false
    });
  };

  const handleOpenHeroModal = () => {
    setHeroFormData({
      headline: heroPortfolio.headline || "",
      deck: heroPortfolio.deck || "",
      imageUrl: heroPortfolio.image || "",
      caption: heroPortfolio.caption || "",
      fullContent: Array.isArray(heroPortfolio.content) ? heroPortfolio.content.join("\n\n") : (heroPortfolio.content || "")
    });
    setShowHeroModal(true);
  };

  const handleHeroImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedString = await compressImageFile(file, 1200, 0.8);
      setHeroFormData((prev) => ({
        ...prev,
        imageUrl: compressedString
      }));
      setSavedToast("Foto profil berhasil diunggah!");
      setTimeout(() => setSavedToast(null), 3000);
    } catch (err) {
      console.error("Gagal mengunggah foto:", err);
      alert("Gagal membaca file foto. Harap coba file gambar lain.");
    }
  };

  const handleSaveHeroPortfolio = (e: React.FormEvent) => {
    e.preventDefault();

    const textContent = heroFormData.fullContent || "";
    const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 2000) {
      alert(`Isi Ringkasan Profil melebihi batas maksimal (saat ini ${wordCount} kata, maksimal 2.000 kata). Harap kurangi teks.`);
      return;
    }

    const paragraphs = heroFormData.fullContent
      ? heroFormData.fullContent.split("\n\n").filter((p) => p.trim())
      : [heroFormData.deck];

    const updated = {
      ...heroPortfolio,
      headline: heroFormData.headline,
      deck: heroFormData.deck,
      image: heroFormData.imageUrl,
      caption: heroFormData.caption,
      content: paragraphs
    };
    setHeroPortfolio(updated);
    upsertSiteSettingToSupabase("hero", updated);
    if (selectedArticle?.id === "hero-intro") {
      setSelectedArticle(updated);
    }
    setShowHeroModal(false);
    setSavedToast("Ringkasan Utama & Profil berhasil diperbarui!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleResetHeroPortfolio = () => {
    setHeroPortfolio(DEFAULT_HERO_PORTFOLIO);
    setSavedToast("Ringkasan Utama & Profil dikembalikan ke data sampel!");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const compressImageFile = (file: File, maxWidth = 1000, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(compressedDataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject("Gagal memuat gambar");
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject("Gagal membaca file");
      reader.readAsDataURL(file);
    });
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = formData.images || [];
    const remainingSlots = 5 - currentImages.length;
    if (remainingSlots <= 0) {
      alert("Maksimal 5 gambar per karya! Harap hapus salah satu gambar jika ingin menambah gambar baru.");
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(async (file) => {
      try {
        const compressedString = await compressImageFile(file);
        setFormData((prev) => {
          const updated = prev.images ? [...prev.images] : [];
          if (updated.length >= 5) return prev;
          updated.push(compressedString);
          return {
            ...prev,
            images: updated,
            imageUrl: updated[0] || compressedString
          };
        });
      } catch (err) {
        console.error("Gagal mengompres gambar:", err);
      }
    });

    e.target.value = "";
  };

  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const compressedString = await compressImageFile(files[0], 1200, 0.8);
      setCertFormData((prev) => ({
        ...prev,
        imageUrl: compressedString
      }));
    } catch (err) {
      console.error("Gagal mengompres gambar sertifikat:", err);
    }
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || ""
      };
    });
  };

  const handleSetCoverImage = (indexToCover: number) => {
    setFormData((prev) => {
      const current = prev.images || [];
      if (indexToCover <= 0 || indexToCover >= current.length) return prev;
      const target = current[indexToCover];
      const remaining = current.filter((_, idx) => idx !== indexToCover);
      const updated = [target, ...remaining];
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || ""
      };
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();

    const allImages = formData.images && formData.images.length > 0
      ? formData.images
      : (formData.imageUrl ? [formData.imageUrl] : []);

    if (!formData.title || allImages.length === 0) {
      alert("Harap isi Judul Karya dan unggah minimal 1 Gambar Cover terlebih dahulu!");
      return;
    }

    const textContent = formData.fullContent || "";
    const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 2000) {
      alert(`Deskripsi karya melebihi batas maksimal 2.000 kata (saat ini: ${wordCount} kata). Harap kurangi teks.`);
      return;
    }

    const tagArray = formData.tags
      ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      : [formData.subCategory];

    const contentParagraphs = formData.fullContent
      ? formData.fullContent.split("\n\n").filter(p => p.trim())
      : [];

    const computedDeck = formData.deck && formData.deck.trim()
      ? formData.deck.trim()
      : (contentParagraphs.length > 0 ? contentParagraphs[0] : formData.title);
    const primaryCoverImage = allImages[0];

    // Check max 6 featured limit for create/update
    const currentFeaturedCount = projects.filter(p => p.isFeatured && p.id !== editingProjectId).length;
    let actualIsFeatured = formData.isFeatured;
    if (actualIsFeatured && currentFeaturedCount >= 6) {
      alert("⚠️ Beranda sudah memiliki 6 karya pilihan (batas maksimal). Karya ini berhasil disimpan di kategorinya, namun centang Pilihan Beranda dinonaktifkan.");
      actualIsFeatured = false;
    }

    if (editingProjectId) {
      // Edit mode: Update existing project
      let updatedObj: any = null;
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id === editingProjectId) {
            updatedObj = {
              ...p,
              mainCategory: formData.mainCategory,
              subCategory: formData.subCategory,
              headline: formData.title,
              deck: computedDeck,
              date: formData.date || "2026",
              linkUrl: formData.linkUrl,
              image: primaryCoverImage,
              images: allImages,
              tags: tagArray,
              bgColor: formData.bgColor || "bg-[#E3E3E3]",
              isFeatured: actualIsFeatured,
              caption: formData.title + " — Karya " + formData.subCategory + " oleh Andika Catur Ariantono",
              content: contentParagraphs
            };
            return updatedObj;
          }
          return p;
        })
      );
      if (updatedObj) upsertProjectToSupabase(updatedObj);
      setFormToast(`Karya "${formData.title}" berhasil diperbarui!`);
      setEditingProjectId(null);
    } else {
      // Create mode: Add new project
      const newProj = {
        id: "proj-" + Date.now(),
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        headline: formData.title,
        deck: computedDeck,
        author: "Andika Catur Ariantono",
        date: formData.date || "2026",
        linkUrl: formData.linkUrl,
        image: primaryCoverImage,
        images: allImages,
        tags: tagArray,
        bgColor: formData.bgColor || "bg-[#E3E3E3]",
        textColor: "text-black",
        subTextColor: "text-black/80",
        badgeBg: "bg-black text-white",
        isFeatured: actualIsFeatured,
        caption: formData.title + " — Karya " + formData.subCategory + " oleh Andika Catur Ariantono",
        content: contentParagraphs
      };

      setProjects((prev) => [newProj, ...prev]);
      upsertProjectToSupabase(newProj);
      setFormToast(`Karya "${formData.title}" berhasil ditambahkan!`);
    }

    // Reset Form
    setFormData({
      title: "",
      mainCategory: "Technology",
      subCategory: "Web Development",
      imageUrl: "",
      images: [],
      linkUrl: "",
      deck: "",
      fullContent: "",
      tags: "",
      bgColor: "bg-[#E3E3E3]",
      date: new Date().getFullYear().toString(),
      isFeatured: false
    });

    setTimeout(() => setFormToast(null), 4000);
  };

  const handleStartEditProject = (proj: any) => {
    setEditingProjectId(proj.id);
    const existingImages = proj.images && proj.images.length > 0
      ? proj.images
      : (proj.image ? [proj.image] : []);

    setFormData({
      title: proj.headline || "",
      mainCategory: proj.mainCategory || "Technology",
      subCategory: proj.subCategory || "Web Development",
      imageUrl: proj.image || existingImages[0] || "",
      images: existingImages,
      linkUrl: proj.linkUrl || "",
      deck: proj.deck || "",
      fullContent: proj.content ? proj.content.join("\n\n") : "",
      tags: proj.tags ? proj.tags.join(", ") : "",
      bgColor: proj.bgColor || "bg-[#E3E3E3]",
      date: proj.date || "2026",
      isFeatured: proj.isFeatured !== undefined ? proj.isFeatured : true
    });
    setActiveCategory("Panel Admin");
  };

  const confirmDeleteProject = (id: string, title?: string) => {
    saveDeletedProjectId(id);
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    try {
      localStorage.setItem("andika_portfolio_projects", JSON.stringify(updatedProjects));
    } catch (e) {}
    saveProjectsToIDB(updatedProjects);
    deleteProjectFromSupabase(id);

    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
    setDeletingId(null);
    const shortTitle = title ? `"${title.slice(0, 25)}..."` : "Karya";
    setSavedToast(`${shortTitle} berhasil dihapus secara permanen dari Supabase!`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleToggleFeaturedProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetProject = projects.find((p) => p.id === id);
    const currentFeaturedCount = projects.filter((p) => p.isFeatured).length;

    if (targetProject && !targetProject.isFeatured && currentFeaturedCount >= 6) {
      setSavedToast("⚠️ Maksimal 6 karya pilihan di Beranda! Batalkan pilihan karya lain terlebih dahulu.");
      setTimeout(() => setSavedToast(null), 4000);
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id === id) {
          const nextStatus = !p.isFeatured;
          const updated = { ...p, isFeatured: nextStatus };
          upsertProjectToSupabase(updated);
          setSavedToast(
            nextStatus
              ? `"${p.headline.slice(0, 20)}..." dipilih untuk Beranda! (${currentFeaturedCount + 1}/6)`
              : `"${p.headline.slice(0, 20)}..." dihapus dari Pilihan Beranda.`
          );
          setTimeout(() => setSavedToast(null), 3000);
          return updated;
        }
        return p;
      })
    );
  };



  // Find active Main Category object if any
  const currentMainCatObj = MAIN_CATEGORIES.find(c => c.title === activeCategory);
  const activeMegaMenuCatObj = MAIN_CATEGORIES.find(c => c.id === openMegaMenuId);

  // Filter projects based on mainCategory, subCategory, and searchQuery
  const rawDisplayedProjects = (projects || []).filter(p => {
    if (!p || typeof p !== "object") return false;
    // 1. Search Query Filter (if active search query exists, filter by project title/headline)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = (p.headline || "").toLowerCase().includes(q) || (p.title || "").toLowerCase().includes(q);
      const matchDeck = (p.deck || "").toLowerCase().includes(q);
      return matchTitle || matchDeck;
    }

    if (activeCategory === "Beranda") {
      return p.isFeatured === true;
    }
    if (activeCategory === "Panel Admin") {
      return true;
    }
    const matchMain = p.mainCategory === activeCategory ||
      ((activeCategory === "Technology" || activeCategory === "TECHNOLOGY" || activeCategory === "TECH" || activeCategory === "ENGINEERING & DATA") && (p.mainCategory === "ENGINEERING & DATA" || p.mainCategory === "TECH" || p.mainCategory === "TECHNOLOGY" || p.mainCategory === "Technology")) ||
      ((activeCategory === "Design" || activeCategory === "DESIGN" || activeCategory === "CREATIVE & ART") && (p.mainCategory === "VISUAL ARTS" || p.mainCategory === "CREATIVE & ART" || p.mainCategory === "DESIGN" || p.mainCategory === "Design")) ||
      ((activeCategory === "Visuals" || activeCategory === "VISUALS" || activeCategory === "MEDIA & PRODUCTION") && (p.mainCategory === "MEDIA & PRODUCTION" || p.mainCategory === "VISUALS" || p.mainCategory === "Visuals"));
    if (!matchMain) return false;

    if (activeSubCategory === "SEMUA") return true;
    if (p.subCategory === activeSubCategory) return true;

    // Helper map for subcategory groupings to match both new and legacy subcategory strings
    const subGroups: Record<string, string[]> = {
      "WEB DEVELOPMENT": ["Web Applications", "Frontend & Component Systems", "E-Commerce Architecture", "Web Development"],
      "DATA ANALYSIS": ["Analytics Dashboards", "Data Visualization", "Data Processing & Querying", "Data Analysis"],
      "GRAPHIC DESIGN": ["Branding & Identity", "Packaging Design", "Digital & Print Layouts", "Desain Grafis", "Graphic Design"],
      "COMICS & ILLUSTRATION": ["Comic Strips & Storytelling", "Character Design", "Web & App Illustration", "Komik / Ilustrasi", "Comics & Illustration"],
      "PHOTOGRAPHY": ["Urban & Architecture", "Documentary & Street", "Creative & Fine Art", "Fotografi", "Photography"],
      "VIDEOGRAPHY": ["Commercials & Promos", "Short Films & Reels", "Editing & Post-Production", "Videografi", "Videography"]
    };

    for (const group of Object.values(subGroups)) {
      if (group.includes(activeSubCategory) && group.includes(p.subCategory)) {
        return true;
      }
    }

    return false;
  });

  const displayedProjects = (activeCategory === "Beranda" && searchQuery.trim() === "")
    ? rawDisplayedProjects.slice(0, 6)
    : rawDisplayedProjects;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white" style={{ fontFamily: "'Modern Antiqua', serif" }}>

      {/* Toast Notification */}
      {(savedToast || formSuccess) && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white text-xs px-4 py-3 shadow-2xl border border-white/20 flex items-center gap-2 rounded-none animate-bounce">
          <Bookmark size={14} className="fill-white" />
          <span>{savedToast || formSuccess}</span>
        </div>
      )}

      {/* FEATURED PROJECTS FILTER & SELECTION MODAL (MAX 6 CARDS) - ADMIN ONLY */}
      {showFeaturedModal && isAdminLoggedIn && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[680px] w-full max-h-[85vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button
              onClick={() => setShowFeaturedModal(false)}
              className="absolute top-4 right-4 p-1.5 text-black hover:bg-gray-200 border-2 border-black cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="border-b-2 border-black pb-4 mb-4 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block rounded-none">
                  HOME FEATURED SELECTION
                </span>
                <span className="bg-[#FFCC00] text-black text-[10px] font-black uppercase px-2 py-0.5 border border-black rounded-none">
                  MAXIMUM 6 CARDS
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Filter &amp; Featured Projects Selection
              </h3>
              <p className="text-xs text-black/70 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                {isAdminLoggedIn
                  ? "Manually choose which projects to feature on the Home Page cards (Max 6 projects)."
                  : "Curated list of featured projects shown on the Home Page."}
              </p>
            </div>

            {/* Status bar count */}
            <div className="bg-gray-100 border-2 border-black p-3 mb-4 flex items-center justify-between gap-2 flex-shrink-0 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="uppercase">Selected Projects:</span>
                <span className="text-sm font-black bg-black text-[#FFCC00] px-2 py-0.5 border border-black">
                  {projects.filter(p => p.isFeatured).length} / 6
                </span>
              </div>
              {projects.filter(p => p.isFeatured).length >= 6 ? (
                <span className="text-[10px] font-black uppercase bg-yellow-300 text-black border border-black px-2 py-1">
                  ⚠️ Maximum Capacity of 6 Cards Reached
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase text-black/60">
                  Can add {6 - projects.filter(p => p.isFeatured).length} more projects
                </span>
              )}
            </div>

            {/* List of projects */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {projects.length === 0 ? (
                <p className="text-xs italic text-center text-black/60 py-8">No projects registered yet.</p>
              ) : (
                projects.map((p) => {
                  const isFeat = Boolean(p.isFeatured);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (isAdminLoggedIn) handleToggleFeaturedProject(p.id);
                      }}
                      className={`border-2 border-black p-3 transition-all flex items-center justify-between gap-3 select-none ${isAdminLoggedIn ? "cursor-pointer" : ""
                        } ${isFeat
                          ? "bg-yellow-100/80 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white hover:bg-gray-50 border-black/40"
                        }`}
                    >
                      <img src={p.image} alt={p.headline} className="w-14 h-14 object-cover border border-black rounded-none flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5">
                            {p.mainCategory}
                          </span>
                          <span className="text-[8px] font-bold uppercase bg-white border border-black px-1 py-0.5">
                            {p.subCategory}
                          </span>
                        </div>
                        <h4 className="text-xs font-black truncate leading-tight">{p.headline}</h4>
                        <p className="text-[10px] text-black/70 truncate font-serif">{p.deck}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {isAdminLoggedIn ? (
                          <button
                            type="button"
                            onClick={(e) => handleToggleFeaturedProject(p.id, e)}
                            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black rounded-none transition-all flex items-center gap-1.5 cursor-pointer ${isFeat
                              ? "bg-[#FFCC00] text-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              : "bg-white text-black hover:bg-gray-200"
                              }`}
                          >
                            {isFeat ? (
                              <>
                                <CheckCircle size={14} className="text-black fill-[#FFCC00]" />
                                <span>SELECTED</span>
                              </>
                            ) : (
                              <>
                                <span>+ SELECT</span>
                              </>
                            )}
                          </button>
                        ) : (
                          isFeat && (
                            <span className="text-[10px] font-black bg-[#FFCC00] text-black px-2.5 py-1 border border-black uppercase">
                              ⭐ FEATURED
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-black pt-4 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <span className="text-[11px] text-black/60 italic font-serif" style={{ fontFamily: "Jost, sans-serif" }}>
                * Changes directly update the Home Page cards.
              </span>
              <button
                type="button"
                onClick={() => setShowFeaturedModal(false)}
                className="bg-black text-[#FFCC00] font-black uppercase text-xs px-5 py-2.5 border-2 border-black hover:bg-gray-900 transition-colors rounded-none cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                DONE &amp; CLOSE
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT KEAHLIAN & LAYANAN MODAL (ADMIN ONLY) */}
      {showServicesModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[700px] w-full max-h-[85vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none relative my-8">
            <button
              onClick={() => setShowServicesModal(false)}
              className="absolute top-4 right-4 p-1.5 text-black hover:bg-gray-200 border-2 border-black cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="border-b-2 border-black pb-4 mb-4 flex-shrink-0">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-1 rounded-none">
                PORTFOLIO ADMIN PANEL
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Edit Expertise
              </h3>
              <p className="text-xs text-black/70 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Manage services and expertise cards displayed on the marquee animation.
              </p>
            </div>

            <form onSubmit={handleSaveServices} className="flex-1 overflow-y-auto flex flex-col space-y-4 pr-1 mb-4">
              <div className="space-y-4">
                {servicesForm.map((item, index) => (
                  <div key={item.id || index} className="border-2 border-black p-4 bg-gray-50 rounded-none relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between border-b border-black/30 pb-2 mb-3">
                      <span className="text-[10px] font-black uppercase bg-black text-[#FFCC00] px-2 py-0.5">
                        SERVICE CARD #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceItem(item.id)}
                        className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 border border-black hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Delete This Service Card"
                      >
                        <Trash2 size={12} /> DELETE
                      </button>
                    </div>

                    <div className="space-y-3 text-xs font-bold">
                      <div>
                        <label className="block mb-1 text-black uppercase">Service / Expertise Title *</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleServiceChange(item.id, "title", e.target.value)}
                          required
                          placeholder="Example: FRONTEND DEVELOPMENT"
                          className="w-full p-2 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-black uppercase">Brief Service Description *</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleServiceChange(item.id, "desc", e.target.value)}
                          required
                          placeholder="Write brief service description here..."
                          className="w-full p-2 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddServiceItem}
                className="w-full bg-yellow-100 hover:bg-yellow-200 text-black text-xs font-black uppercase py-2.5 px-4 border-2 border-dashed border-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <PlusCircle size={14} /> + Add New Service Card
              </button>

              <div className="flex gap-3 pt-2 flex-shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} /> SAVE EXPERTISE &amp; SERVICES
                </button>
                <button
                  type="button"
                  onClick={() => setShowServicesModal(false)}
                  className="bg-gray-200 text-black text-xs font-black uppercase py-3 px-4 rounded-none border-2 border-black hover:bg-gray-300 cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN AUTHENTICATION POPUP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[420px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-white text-black border border-black text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                VERIFIKASI AKSES
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Autentikasi
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Masukkan Nickname &amp; Password untuk kelola karya.
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-600 text-red-800 text-xs font-bold font-serif">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">1. Nickname</label>
                <input
                  type="text"
                  placeholder=""
                  value={authNickname}
                  onChange={(e) => setAuthNickname(e.target.value)}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">2. Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    className="w-full p-2.5 pr-10 border-2 border-black rounded-none text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-black/60 hover:text-black transition-colors"
                    title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-[#FFCC00] text-xs font-black uppercase py-3.5 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <KeyRound size={14} /> MASUK
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setShowForgotModal(true);
                    setRecoveryError(null);
                    setRecoverySuccess(false);
                    setRecoveryInput("");
                  }}
                  className="text-[11px] font-bold uppercase text-black/70 hover:text-black hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                >
                  <HelpCircle size={13} /> Lupa Nickname / Password? (Bantuan Akses)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECOVERY / FORGOT PASSWORD POPUP MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[460px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                BANTUAN PEMULIHAN AKSES
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Lupa Password
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Verifikasi Kata Kunci Rahasia untuk melihat kredensial login Admin Anda.
              </p>
            </div>

            {recoveryError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-600 text-red-800 text-xs font-bold font-serif">
                ⚠️ {recoveryError}
              </div>
            )}

            {recoverySuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border-2 border-green-700 text-green-900 rounded-none space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-green-800">
                    <ShieldCheck size={16} /> Verifikasi Rahasia Berhasil!
                  </div>
                  <p className="text-xs font-serif italic text-black/80">
                    Berikut adalah data akun login Admin Anda:
                  </p>
                  <div className="bg-white p-3 border border-black space-y-1.5 text-xs font-mono">
                    <div><strong>Nickname Admin:</strong> <span className="text-black bg-yellow-200 px-1">{adminCreds.nickname}</span></div>
                    <div><strong>Password Admin:</strong> <span className="text-black bg-yellow-200 px-1">{adminCreds.password}</span></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminLoggedIn(true);
                      setShowForgotModal(false);
                      setActiveCategory("Panel Admin");
                      setSelectedArticle(null);
                      setSavedToast("Akses Admin Berhasil Diberikan!");
                      setTimeout(() => setSavedToast(null), 3000);
                    }}
                    className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound size={14} /> MASUK LANGSUNG SEKARANG
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCredsToDefault}
                    className="bg-gray-100 text-black hover:bg-gray-200 text-xs font-black uppercase py-3 px-3 rounded-none border-2 border-black flex items-center gap-1 cursor-pointer"
                    title="Reset ke Username & Password bawaan (mickythewarrior / catwarrior)"
                  >
                    <RefreshCw size={14} /> RESET
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block mb-1 text-black uppercase">
                    Masukkan Kata Kunci Rahasia / Security Answer
                  </label>
                  <p className="text-[10px] text-black/60 font-serif italic mb-2">
                    Default Kata Kunci Rahasia: <code className="bg-gray-200 px-1">micky</code> (atau jawaban yang diset di .env/localStorage).
                  </p>
                  <input
                    type="text"
                    placeholder="Masukkan jawaban rahasia..."
                    value={recoveryInput}
                    onChange={(e) => setRecoveryInput(e.target.value)}
                    required
                    className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-[#FFCC00] text-xs font-black uppercase py-3.5 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={14} /> VERIFIKASI &amp; TAMPILKAN KREDENSIAL
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setShowAuthModal(true);
                    }}
                    className="text-[11px] font-bold uppercase text-black/70 hover:text-black hover:underline cursor-pointer"
                  >
                    &larr; Kembali ke Form Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHANGE ADMIN CREDENTIALS POPUP MODAL */}
      {showChangeCredsModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[460px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button
              onClick={() => setShowChangeCredsModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                PENGATURAN KEAMANAN ADMIN
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Ganti Akun &amp; Password
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Perbarui Nickname, Password, dan Kata Kunci Rahasia Admin.
              </p>
            </div>

            <form onSubmit={handleSaveChangedCreds} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">1. Nickname Baru *</label>
                <input
                  type="text"
                  value={changeCredsForm.nickname}
                  onChange={(e) => setChangeCredsForm({ ...changeCredsForm, nickname: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">2. Password Baru *</label>
                <input
                  type="text"
                  value={changeCredsForm.password}
                  onChange={(e) => setChangeCredsForm({ ...changeCredsForm, password: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">3. Kata Kunci Rahasia / Security Answer *</label>
                <p className="text-[10px] text-black/60 font-serif italic mb-1">
                  Digunakan untuk membuka password jika sewaktu-waktu Anda lupa.
                </p>
                <input
                  type="text"
                  value={changeCredsForm.securityAnswer || "micky"}
                  onChange={(e) => setChangeCredsForm({ ...changeCredsForm, securityAnswer: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} /> SIMPAN CREDENTIALS
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangeCredsModal(false)}
                  className="bg-gray-200 text-black text-xs font-black uppercase py-3 px-4 rounded-none border-2 border-black hover:bg-gray-300 cursor-pointer"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RINGKASAN UTAMA & PROFIL MODAL (ADMIN ONLY) */}
      {showHeroModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[650px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative my-8">
            <button
              onClick={() => setShowHeroModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                MODE ADMIN PORTOFOLIO
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Edit Ringkasan Utama &amp; Profil
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Perbarui informasi pengenalan utama yang tampil di beranda.
              </p>
            </div>

            <form onSubmit={handleSaveHeroPortfolio} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">1. Judul Utama (Headline)</label>
                <input
                  type="text"
                  value={heroFormData.headline}
                  onChange={(e) => setHeroFormData({ ...heroFormData, headline: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">2. Sub-Judul / Kutipan Ringkasan (Deck)</label>
                <textarea
                  rows={2}
                  value={heroFormData.deck}
                  onChange={(e) => setHeroFormData({ ...heroFormData, deck: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-black uppercase">3. Foto Profil / Cover Ringkasan</label>

                  <div className="space-y-2">
                    <label className="w-full bg-black text-[#FFCC00] hover:bg-gray-800 text-xs font-black uppercase py-2.5 px-3 border-2 border-black flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Upload size={14} /> 📁 UPLOAD FOTO DARI PERANGKAT
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {heroFormData.imageUrl && (
                      <div className="flex items-center gap-2 border-2 border-black p-1.5 bg-gray-50">
                        <img
                          src={heroFormData.imageUrl}
                          alt="Preview Foto Profil"
                          className="w-12 h-12 object-cover border border-black rounded-none flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase text-green-700 block">✓ Foto Siap Digunakan</span>
                          <span className="text-[9px] text-black/60 truncate block font-mono">
                            {heroFormData.imageUrl.startsWith("data:") ? "Gambar Lokal Diunggah" : heroFormData.imageUrl}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-1">
                      <details className="text-[10px] text-black/70">
                        <summary className="cursor-pointer font-bold uppercase hover:underline">
                          Atau masukkan URL Web Gambar secara manual
                        </summary>
                        <input
                          type="text"
                          placeholder="https://... atau /gambar/foto.png"
                          value={heroFormData.imageUrl}
                          onChange={(e) => setHeroFormData({ ...heroFormData, imageUrl: e.target.value })}
                          className="w-full p-2 border border-black rounded-none text-xs bg-white focus:outline-none mt-1"
                        />
                      </details>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-black uppercase">4. Caption Foto</label>
                  <input
                    type="text"
                    value={heroFormData.caption}
                    onChange={(e) => setHeroFormData({ ...heroFormData, caption: e.target.value })}
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-black uppercase">5. Isi Ringkasan Profil (Maks. 2.000 Kata)</label>
                  <span className="text-[10px] text-black/60 font-serif">
                    {(heroFormData.fullContent || "").trim().split(/\s+/).filter(Boolean).length} / 2.000 Kata
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Tuliskan isi ringkasan profil lengkap Anda di sini... (Pisahkan antar paragraf dengan baris baru)"
                  value={heroFormData.fullContent}
                  onChange={(e) => setHeroFormData({ ...heroFormData, fullContent: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} /> SIMPAN PERUBAHAN PROFIL
                </button>
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="bg-gray-200 text-black text-xs font-black uppercase py-3 px-4 rounded-none border-2 border-black hover:bg-gray-300"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDIT PROFIL PENGEMBANG MODAL (ADMIN ONLY) */}
      {showDevProfileModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[550px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative my-8">
            <button
              onClick={() => setShowDevProfileModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                MODE ADMIN PORTOFOLIO
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Edit Profil Pengembang
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Perbarui informasi sidebar 'Tentang Pengembang' &amp; Kontak Email.
              </p>
            </div>

            <form onSubmit={handleSaveDevProfile} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">1. Nama Lengkap</label>
                <input
                  type="text"
                  value={devProfileForm.name}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, name: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">2. Peran / Job Title</label>
                <input
                  type="text"
                  value={devProfileForm.role}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, role: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">3. Biografi Ringkas (Bio)</label>
                <textarea
                  rows={3}
                  value={devProfileForm.bio}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, bio: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-black uppercase">4. Lokasi / Domisili</label>
                  <input
                    type="text"
                    value={devProfileForm.location}
                    onChange={(e) => setDevProfileForm({ ...devProfileForm, location: e.target.value })}
                    required
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-black uppercase">5. Email Kontak Utama *</label>
                  <input
                    type="email"
                    value={devProfileForm.email}
                    onChange={(e) => setDevProfileForm({ ...devProfileForm, email: e.target.value })}
                    required
                    placeholder="andikacaa@gmail.com"
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} /> SIMPAN PROFIL
                </button>
                <button
                  type="button"
                  onClick={() => setShowDevProfileModal(false)}
                  className="bg-gray-200 text-black text-xs font-black uppercase py-3 px-4 rounded-none border-2 border-black hover:bg-gray-300 cursor-pointer"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TOOLS & TECH PER SECTOR MODAL */}
      {showToolsTechModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[520px] w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button
              onClick={() => setShowToolsTechModal(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-gray-200 border border-black cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 inline-block mb-2 rounded-none">
                MODE ADMIN PORTOFOLIO
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Sunting Tools &amp; Tech Sektor
              </h3>
              <p className="text-xs text-black/60 font-serif italic mt-1" style={{ fontFamily: "Jost, sans-serif" }}>
                Kelola daftar perangkat lunak &amp; teknologi yang ditampilkan pada menu sektor.
              </p>
            </div>

            <form onSubmit={handleSaveToolsTech} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">1. Pilih Sektor / Menu Utama</label>
                <select
                  value={editingToolsCat}
                  onChange={(e) => {
                    const catId = e.target.value;
                    setEditingToolsCat(catId);
                    const toolsArr = sectorTools[catId] || MAIN_CATEGORIES.find(c => c.id === catId)?.megaMenu.tools || [];
                    setToolsInputText(toolsArr.join(", "));
                  }}
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs font-black uppercase bg-white focus:outline-none cursor-pointer"
                >
                  {MAIN_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title} ({cat.subtitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">2. Daftar Tools &amp; Tech (Pisahkan dengan Koma)</label>
                <textarea
                  rows={4}
                  value={toolsInputText}
                  onChange={(e) => setToolsInputText(e.target.value)}
                  placeholder="Contoh: React, Next.js, TypeScript, Tailwind CSS, Python"
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none placeholder:text-black/40"
                  required
                />
                <span className="text-[10px] text-black/60 font-serif italic block mt-1">
                  Ketik nama tools dipisahkan koma. Misal: React, Next.js, TypeScript
                </span>
              </div>

              {/* Preview of Tools Tags */}
              <div className="border border-black p-3 bg-gray-50 space-y-1">
                <span className="text-[9px] font-black uppercase text-black/60 block">PRATINJAU TAGS:</span>
                <div className="flex flex-wrap gap-1">
                  {toolsInputText.split(",").map(t => t.trim()).filter(Boolean).length > 0 ? (
                    toolsInputText.split(",").map(t => t.trim()).filter(Boolean).map((tool, idx) => (
                      <span key={idx} className="bg-gray-100 border border-black text-[9px] font-bold uppercase px-2 py-0.5 text-black">
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-black/40 italic">Belum ada tools yang dimasukkan.</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#FFCC00] text-xs font-black uppercase py-3 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} /> SIMPAN PERUBAHAN
                </button>
                <button
                  type="button"
                  onClick={() => setShowToolsTechModal(false)}
                  className="bg-gray-200 text-black text-xs font-black uppercase py-3 px-4 rounded-none border-2 border-black hover:bg-gray-300 cursor-pointer"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="border-b border-black bg-[#F2F2F2] text-black text-[11px] py-1.5 px-4 font-semibold">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest font-bold">EDITORIAL PORTFOLIO</span>
            <span className="hidden md:inline text-black/30">•</span>
            <span className="hidden md:inline text-black/70">{todayDate}</span>
          </div>
          <div className="flex items-center gap-4 text-black/80">
            <span className="flex items-center gap-1 font-bold text-black uppercase tracking-wider text-[10px]">
              JAKARTA &bull; INDONESIA
            </span>
          </div>
        </div>
      </div>

      {/* Main Masthead Header with #F2F2F2 Background */}
      <header className="bg-[#F2F2F2] text-black pt-2 pb-1 px-4 border-b-2 border-black relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex items-center justify-center relative min-h-[48px] sm:min-h-[68px] md:min-h-[82px]">


          <img
            src={headerLogoImg}
            alt="What's up? this is andikacatvr's PortoFolio"
            className="max-h-[52px] sm:max-h-[72px] md:max-h-[85px] w-auto max-w-full object-contain cursor-pointer select-none hover:opacity-90 transition-opacity z-10"
            onClick={() => handleSelectMainCategory("Beranda")}
          />
        </div>
      </header>

      {/* Primary Clean Navigation Bar (National Geographic Yellow Bar) */}
      <div ref={navContainerRef} className="relative z-50">
        <nav className="bg-[#FFCC00] text-black sticky top-0 border-b-2 border-black font-black shadow-md">
          <div className="max-w-[1240px] mx-auto px-4">
            {/* Mobile Top Navbar Bar (Hamburger + Home on Left, Search & Inline Input Bar on Right) */}
            <div className="flex lg:hidden items-center justify-between py-1.5 text-black font-black relative">
              {/* Left Side: Hamburger + Home side by side */}
              <div className="flex items-center gap-1">
                {/* 1. Hamburger Menu Button */}
                <button
                  className="p-2 text-black hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    setIsSearchOpen(false);
                  }}
                  title={menuOpen ? "Close Sidebar Menu" : "Open Sidebar Menu"}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* 2. Home Button (Side-by-side with Hamburger) */}
                <button
                  onClick={() => {
                    handleSelectMainCategory("Beranda");
                    setMenuOpen(false);
                    setOpenMegaMenuId(null);
                    setIsSearchOpen(false);
                  }}
                  className={`p-2 text-black hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center ${activeCategory === "Beranda" && !selectedArticle ? "bg-black/15" : ""}`}
                  title="Home"
                >
                  <House size={20} />
                </button>
              </div>

              {/* Right Side: Search Button & Expandable Inline Input Bar */}
              <div className="flex items-center gap-1 flex-1 justify-end max-w-[70%]">
                {isSearchOpen ? (
                  <div className="flex items-center gap-1.5 bg-white border-2 border-black px-2 py-1 w-full animate-in fade-in slide-in-from-right-2 duration-150">
                    <Search size={14} className="text-black/60 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="what are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }
                      }}
                      className="w-full bg-transparent text-xs font-bold text-black focus:outline-none placeholder:text-black/40"
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-0.5 hover:bg-gray-200 text-black/60 hover:text-black cursor-pointer transition-colors flex-shrink-0"
                      title="Close Search"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsSearchOpen(true);
                      setOpenMegaMenuId(null);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    className={`p-2 text-black hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center ${isSearchOpen || searchQuery ? "bg-black/15" : ""}`}
                    title="Search Projects"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Live Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() !== "" && (
              <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-black p-3 z-50 shadow-lg max-h-[300px] overflow-y-auto space-y-1">
                <div className="text-[9px] font-black uppercase text-black/50 tracking-wider mb-1">
                  SEARCH RESULTS ({projects.filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())).length})
                </div>
                {projects.filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())).length === 0 ? (
                  <p className="text-[11px] font-serif italic text-black/60 py-2 text-center">
                    No projects match "{searchQuery}".
                  </p>
                ) : (
                  projects
                    .filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase()))
                    .slice(0, 6)
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedArticle(p);
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 hover:bg-yellow-100 border border-transparent hover:border-black transition-colors cursor-pointer flex items-center gap-2 rounded-none"
                      >
                        {p.image && (
                          <img src={p.image} alt={p.headline || p.title} className="w-8 h-8 object-cover border border-black/30 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[11px] font-black truncate leading-tight">{p.headline || p.title}</h5>
                          <span className="text-[8px] font-bold uppercase text-black/60 block">{p.subCategory}</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* MOBILE SLIDE-OVER LEFT SIDEBAR DRAWER */}
            {menuOpen && (
              <div className="lg:hidden fixed inset-0 z-[100] flex">
                {/* Dark Backdrop Overlay */}
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Left Sidebar Content Drawer (Solid Black Theme) */}
                <div className="relative w-[280px] sm:w-[320px] bg-black text-white h-full border-r border-white/20 z-[101] shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 overflow-y-auto">
                  {/* Top Sidebar Header */}
                  <div>
                    <div className="p-4 border-b border-white/20 flex items-center justify-between bg-black text-[#FFCC00]">
                      <div className="flex items-center gap-2">
                        <Menu size={16} />
                        <span className="font-black text-xs uppercase tracking-widest">NAVIGATION</span>
                      </div>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="p-1 hover:bg-gray-800 text-[#FFCC00] cursor-pointer transition-colors"
                        title="Close Sidebar"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Navigation Links inside Sidebar */}
                    <div className="p-3 space-y-2">
                      {/* Beranda */}
                      <button
                        onClick={() => {
                          handleSelectMainCategory("Beranda");
                          setMenuOpen(false);
                          setOpenMegaMenuId(null);
                        }}
                        className={`w-full px-4 py-3 text-xs font-black tracking-widest uppercase flex items-center gap-3 border transition-all ${
                          activeCategory === "Beranda" && !selectedArticle
                            ? "bg-[#FFCC00] text-black border-[#FFCC00]"
                            : "bg-gray-950 text-white border-white/15 hover:bg-gray-900"
                        }`}
                      >
                        <House size={16} /> BERANDA
                      </button>

                      {/* Manage (if Admin) */}
                      {isAdminLoggedIn && (
                        <button
                          onClick={() => {
                            setActiveCategory("Panel Admin");
                            setSelectedArticle(null);
                            setOpenMegaMenuId(null);
                            setMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-xs font-black tracking-widest uppercase flex items-center gap-3 border transition-all ${
                            activeCategory === "Panel Admin" && !selectedArticle
                              ? "bg-[#FFCC00] text-black border-[#FFCC00]"
                              : "bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/40 hover:bg-[#FFCC00]/30"
                          }`}
                        >
                          <ShieldCheck size={16} /> MANAGE (ADMIN)
                        </button>
                      )}

                      {/* Categories: Technology, Design, Visuals */}
                      {MAIN_CATEGORIES.map((cat) => {
                        const IconComponent = cat.icon;
                        const isActive = activeCategory === cat.title && !selectedArticle;

                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              handleToggleMegaMenu(cat.id);
                              setActiveCategory(cat.title);
                              setSelectedArticle(null);
                              setMenuOpen(false);
                            }}
                            className={`w-full px-4 py-3.5 text-xs font-black tracking-widest uppercase flex items-center justify-between border transition-all ${
                              isActive
                                ? "bg-[#FFCC00] text-black border-[#FFCC00]"
                                : "bg-gray-950 text-white border-white/15 hover:bg-gray-900"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent size={16} />
                              <span>{cat.title}</span>
                            </div>
                            <ChevronDown size={14} className="-rotate-90" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="p-4 border-t border-white/20 bg-black space-y-3">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handlePrint();
                      }}
                      className="w-full bg-[#FFCC00] text-black font-black text-xs uppercase py-2.5 px-3 border border-[#FFCC00] flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors cursor-pointer"
                    >
                      <Printer size={14} /> PRINT PORTFOLIO
                    </button>
                    <div className="text-[9px] font-mono text-white/50 text-center uppercase tracking-wider">
                      ANDIKA CATUR ARIANTONO &bull; 2026
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Navigation Horizontal Bar */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-0">
                {/* Desktop Beranda Tab */}
                <button
                  onClick={() => handleSelectMainCategory("Beranda")}
                  title="Home"
                  className={`px-4 py-3 text-[11px] font-black tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-0 flex items-center justify-center ${activeCategory === "Beranda" && !selectedArticle ? "bg-[#F2F2F2] text-black shadow-sm font-black" : "text-black hover:bg-black/10"
                    }`}
                >
                  <House size={16} />
                </button>

                {/* Permanent Admin Panel Tab when logged in */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      setActiveCategory("Panel Admin");
                      setSelectedArticle(null);
                      setOpenMegaMenuId(null);
                    }}
                    className={`px-4 py-3 text-[11px] font-black tracking-[0.15em] transition-colors whitespace-nowrap border-b-0 flex items-center gap-1.5 ${activeCategory === "Panel Admin" && !selectedArticle ? "bg-[#F2F2F2] text-black shadow-sm font-black" : "bg-black text-[#FFCC00] hover:bg-gray-800"
                      }`}
                  >
                    <ShieldCheck size={13} /> Manage
                  </button>
                )}

                {/* 3 Categories: Technology, Design, Visuals */}
                {MAIN_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  const isActive = activeCategory === cat.title && !selectedArticle;
                  const isMegaOpen = openMegaMenuId === cat.id;

                  return (
                    <div key={cat.id} className="relative">
                      <button
                        onClick={() => {
                          handleToggleMegaMenu(cat.id);
                          setActiveCategory(cat.title);
                          setSelectedArticle(null);
                        }}
                        className={`px-4 py-3 text-[11px] font-black tracking-[0.15em] transition-all whitespace-nowrap flex items-center justify-start gap-1.5 ${isMegaOpen
                          ? "bg-[#F2F2F2] text-black font-black underline underline-offset-4 decoration-2 shadow-sm"
                          : isActive
                            ? "bg-[#F2F2F2] text-black font-black shadow-sm"
                            : "text-black hover:bg-black/10"
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComponent size={13} />
                          <span>{cat.title}</span>
                        </div>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${isMegaOpen ? "rotate-180 text-black" : "text-black"}`}
                        />
                      </button>
                    </div>
                  );
                })}

                {/* Desktop Search Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (isSearchOpen) {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      } else {
                        setIsSearchOpen(true);
                        setOpenMegaMenuId(null);
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                      }
                    }}
                    className={`px-4 py-3 text-[11px] font-black tracking-[0.15em] uppercase transition-all whitespace-nowrap flex items-center justify-start gap-1.5 cursor-pointer ${isSearchOpen || searchQuery
                      ? "bg-[#F2F2F2] text-black font-black shadow-sm"
                      : "text-black hover:bg-black/10"
                      }`}
                    title={isSearchOpen ? "Close & Clear Search" : "Search Projects"}
                  >
                    <div className="flex items-center justify-center">
                      {isSearchOpen ? <X size={15} /> : <Search size={15} />}
                    </div>
                    {searchQuery && (
                      <span className="bg-black text-[#FFCC00] text-[8px] px-1.5 py-0.5 font-black uppercase rounded-none ml-1">
                        ACTIVE
                      </span>
                    )}
                  </button>

                  {/* Popover Input Pencarian & Live Results Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute top-full left-0 lg:left-0 right-0 lg:w-[340px] sm:w-[360px] bg-white border-2 border-black p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 rounded-none">
                      <div className="flex items-center gap-2 border-2 border-black p-1 bg-gray-50">
                        <Search size={14} className="text-black/60 ml-1 flex-shrink-0" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="what are you looking for?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }
                          }}
                          className="w-full bg-transparent text-xs font-bold p-1 text-black focus:outline-none placeholder:text-black/40"
                        />
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="p-1 hover:bg-gray-200 text-black/60 hover:text-black cursor-pointer transition-colors"
                          title="Close Search & Clear Input"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {searchQuery.trim() !== "" && (
                        <div className="mt-2 pt-2 border-t border-black/20 max-h-[260px] overflow-y-auto space-y-1">
                          <div className="text-[9px] font-black uppercase text-black/50 tracking-wider mb-1">
                            SEARCH RESULTS ({projects.filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())).length})
                          </div>
                          {projects.filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())).length === 0 ? (
                            <p className="text-[11px] font-serif italic text-black/60 py-2 text-center">
                              No projects match "{searchQuery}".
                            </p>
                          ) : (
                            projects
                              .filter(p => (p.headline || p.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase()))
                              .slice(0, 6)
                              .map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    setSelectedArticle(p);
                                    setIsSearchOpen(false);
                                  }}
                                  className="p-1.5 hover:bg-yellow-100 border border-transparent hover:border-black transition-colors cursor-pointer flex items-center gap-2 rounded-none"
                                >
                                  {p.image && (
                                    <img src={p.image} alt={p.headline || p.title} className="w-8 h-8 object-cover border border-black/30 flex-shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-[11px] font-black truncate leading-tight">{p.headline || p.title}</h5>
                                    <span className="text-[8px] font-bold uppercase text-black/60 block">{p.subCategory}</span>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex items-center gap-3 ml-auto lg:ml-0 py-2">
                <button
                  onClick={handlePrint}
                  className="text-[10px] font-black uppercase tracking-wider text-black hover:bg-black hover:text-[#FFCC00] border border-black px-3 py-1.5 flex items-center gap-1.5 transition-colors rounded-none"
                  title="Print Portfolio View"
                >
                  <Printer size={12} /> <span className="hidden sm:inline">PRINT PORTFOLIO</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* NEW YORK TIMES-STYLE MEGA DROPDOWN PANEL */}
        {activeMegaMenuCatObj && (
          <div className="absolute top-full left-0 right-0 bg-[#F2F2F2] border-b-2 border-black shadow-[0px_10px_30px_rgba(0,0,0,0.25)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-[1240px] mx-auto p-6 md:p-8">
              {/* Header Bar inside Mega Menu */}
              <div className="border-b-2 border-black pb-3 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">
                    MENU
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                    {activeMegaMenuCatObj.title}
                  </h3>
                  <span className="text-xs text-black/60 italic font-serif hidden sm:inline" style={{ fontFamily: "Jost, sans-serif" }}>
                    ({activeMegaMenuCatObj.subtitle})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSelectMainCategory(activeMegaMenuCatObj.title, "SEMUA")}
                    className="bg-white text-black hover:bg-gray-100 font-black text-xs uppercase px-3 py-1 flex items-center gap-1 rounded-none border border-black transition-colors"
                  >
                    SEE ALL <ArrowUpRight size={12} />
                  </button>
                  <button
                    onClick={() => setOpenMegaMenuId(null)}
                    className="p-1 hover:bg-gray-200 border border-black text-black"
                    title="Tutup Menu"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Layout Grid inside Mega Menu */}
              {(() => {
                const targetTitle = (activeMegaMenuCatObj.title || "").trim().toLowerCase();
                const targetId = (activeMegaMenuCatObj.id || "").trim().toLowerCase();

                let categoryProjects = projects.filter((p) => {
                  const pCat = (p.mainCategory || "").trim().toLowerCase();
                  return pCat === targetTitle || pCat === targetId;
                });

                const hasProjectsToShow = categoryProjects.length > 0;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">

                    {/* Sub-sections list columns */}
                    {activeMegaMenuCatObj.megaMenu.columns.map((col, idx) => (
                      <div key={idx} className={`${hasProjectsToShow ? "lg:col-span-3" : "lg:col-span-4"} space-y-3 border-r border-black/10 pr-4`}>
                        <h4 className="font-black uppercase tracking-wider text-black text-xs border-b border-black/30 pb-1.5" style={{ fontFamily: "Playfair Display, serif" }}>
                          {col.heading}
                        </h4>
                        <ul className="space-y-2">
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <button
                                onClick={() => handleSelectMainCategory(activeMegaMenuCatObj.title, item.filterSub)}
                                className="text-left font-serif text-black/80 hover:text-black hover:font-bold hover:underline py-0.5 text-xs flex items-center gap-1.5 transition-colors"
                                style={{ fontFamily: "Jost, sans-serif" }}
                              >
                                <span className="text-[10px] font-black text-black/40">&bull;</span>
                                <span>{item.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Featured Projects Preview Column */}
                    {hasProjectsToShow && (
                      <div className="lg:col-span-4 space-y-3 border-r border-black/10 pr-4">
                        <h4 className="font-black uppercase tracking-wider text-black text-xs border-b border-black/30 pb-1.5" style={{ fontFamily: "Playfair Display, serif" }}>
                          LATEST PROJECT
                        </h4>
                        <div className="space-y-3">
                          {categoryProjects.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedArticle(p);
                                setOpenMegaMenuId(null);
                              }}
                              className="flex gap-3 bg-gray-50 border border-black p-2 hover:bg-gray-100 transition-colors cursor-pointer group rounded-none"
                            >
                              <img
                                src={p.imageUrl || p.image || p.images?.[0] || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"}
                                alt={p.headline || p.title}
                                className="w-16 h-14 object-cover border border-black/30 flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black uppercase bg-black text-[#FFCC00] px-1 py-0.2">
                                  {p.subCategory}
                                </span>
                                <h5 className="font-black text-xs truncate group-hover:underline mt-0.5">{p.headline || p.title}</h5>
                                <p className="text-[10px] text-black/70 font-serif line-clamp-1">{p.deck || p.desc || p.fullContent}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Software, Gear & Tools Column */}
                    <div className={`${hasProjectsToShow ? "lg:col-span-2" : "lg:col-span-4"} space-y-3`}>
                      <div className="flex items-center justify-between border-b border-black/30 pb-1.5">
                        <h4 className="font-black uppercase tracking-wider text-black text-xs" style={{ fontFamily: "Playfair Display, serif" }}>
                          TOOLS &amp; TECH
                        </h4>
                        {isAdminLoggedIn && (
                          <button
                            onClick={() => {
                              const catId = activeMegaMenuCatObj.id;
                              setEditingToolsCat(catId);
                              const toolsArr = sectorTools[catId] || activeMegaMenuCatObj.megaMenu.tools || [];
                              setToolsInputText(toolsArr.join(", "));
                              setShowToolsTechModal(true);
                            }}
                            className="bg-black text-[#FFCC00] hover:bg-gray-800 text-[8px] font-black uppercase px-1.5 py-0.5 border border-black flex items-center gap-1 rounded-none cursor-pointer transition-colors"
                            title="Edit Tools & Tech sektor ini"
                          >
                            <Edit size={10} /> EDIT
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(sectorTools[activeMegaMenuCatObj.id] || activeMegaMenuCatObj.megaMenu.tools).map((tool) => (
                          <span
                            key={tool}
                            className="bg-gray-100 border border-black text-[9px] font-bold uppercase px-2 py-1 text-black"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>
          </div>
        )}

      </div>

      {/* PANEL ADMIN PAGE VIEW */}
      {activeCategory === "Panel Admin" ? (
        <main className="max-w-[1100px] mx-auto px-4 py-10 font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
            <div>
              <span className="bg-[#E5E5E5] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-none inline-block mb-2">
                PORTFOLIO ADMIN MODE (VERIFIED {activeAdminUser ? `• USER: ${activeAdminUser}` : ""})
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
                Project Management &amp; Input Panel
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenHeroModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'Main Summary & Profile' Info"
              >
                <Sparkles size={14} /> MAIN SUMMARY
              </button>
              <button
                onClick={handleOpenDevProfileModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'About Developer' Info"
              >
                <Edit size={14} /> DEV PROFILE
              </button>
              <button
                onClick={handleOpenCalendarModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'Availability Schedule' Info"
              >
                <CalendarIcon size={14} /> CALENDAR SCHEDULE
              </button>
              <button
                onClick={handleOpenWritingsModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'Notes' Info"
              >
                <BookOpen size={14} /> NOTES
              </button>
              <button
                onClick={handleOpenServicesModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'Expertise' Info"
              >
                <Briefcase size={14} /> EXPERTISE
              </button>
              <button
                onClick={handleOpenToolsTechModal}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Edit 'Tools & Tech per Sector' Info"
              >
                <Wrench size={14} /> TOOLS &amp; TECH
              </button>
              <button
                onClick={() => {
                  setChangeCredsForm(adminCreds);
                  setShowChangeCredsModal(true);
                }}
                className="bg-[#E5E5E5] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Change Admin Nickname, Password & Security Answer"
              >
                <KeyRound size={14} /> ACCOUNT / PASS
              </button>
              <button
                onClick={() => handleSelectMainCategory("Beranda")}
                className="bg-[#FFCC00] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-black hover:text-[#FFCC00] transition-colors rounded-none flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={14} /> View Home Page
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-red-700 transition-colors rounded-none flex items-center gap-1.5 cursor-pointer"
                title="Logout from Admin"
              >
                <LogOut size={14} /> LOGOUT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Input Side */}
            <div className="lg:col-span-7 bg-gray-50 border-2 border-black p-6 rounded-none">
              <div className="flex items-center justify-between border-b border-black pb-2 mb-4">
                <h3 className="text-lg font-black flex items-center gap-2 font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
                  {editingProjectId ? <Edit size={18} /> : <PlusCircle size={18} />}
                  {editingProjectId ? "Edit Project" : "Add New Project"}
                </h3>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 text-black hover:bg-gray-300 text-[10px] font-black uppercase px-2.5 py-1 border border-black"
                  >
                    CANCEL EDIT
                  </button>
                )}
              </div>

              <form onSubmit={handleAddProject} className="space-y-4 text-xs font-bold">
                {/* Judul Karya */}
                <div>
                  <label className="block mb-1 text-black font-black">1. Project Title *</label>
                  <input
                    type="text"
                    placeholder="Example: Minimalist E-Commerce Website / Sunrise Photo Series"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Sub Judul Karya */}
                <div>
                  <label className="block mb-1 text-black font-black">2. Subtitle / Brief Caption (Optional)</label>
                  <input
                    type="text"
                    placeholder="Example: High-speed modern online store / Urban architecture series"
                    value={formData.deck}
                    onChange={(e) => setFormData({ ...formData, deck: e.target.value })}
                    className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Kategori Utama & Sub Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-black font-black">3. Main Category *</label>
                    <select
                      value={formData.mainCategory}
                      onChange={(e) => {
                        const newMainCat = e.target.value;
                        const mainObj = MAIN_CATEGORIES.find(m => m.title === newMainCat);
                        const firstSub = mainObj ? mainObj.subcategories[0].name : "Web Development";
                        setFormData({ ...formData, mainCategory: newMainCat, subCategory: firstSub });
                      }}
                      className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                    >
                      {MAIN_CATEGORIES.map(m => (
                        <option key={m.id} value={m.title}>
                          {m.title} ({m.subtitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-black font-black">4. Specific Sub-Category *</label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                    >
                      {MAIN_CATEGORIES.find(m => m.title === formData.mainCategory)?.subcategories.map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name} — {sub.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tahun & Upload Gambar Cover (Maks 5 Gambar) */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1 text-black font-black">5. Year / Date of Creation</label>
                    <input
                      type="text"
                      placeholder="2026"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-black font-black">6. Upload Project Images (Max 5 Images) *</label>
                      <span className="text-[10px] font-mono text-black/60 bg-gray-200 px-2 py-0.5 border border-black">
                        {(formData.images || []).length} / 5 Images
                      </span>
                    </div>

                    {/* Thumbnail Grid for Uploaded Images */}
                    {(formData.images || []).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3 bg-white p-2 border-2 border-black">
                        {(formData.images || []).map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group border border-black bg-gray-100 p-1 flex flex-col items-center">
                            <img
                              src={imgUrl}
                              alt={`Image ${imgIdx + 1}`}
                              className="w-full h-20 object-cover border border-black/30"
                            />
                            <div className="w-full text-center mt-1 flex flex-col gap-1">
                              {imgIdx === 0 ? (
                                <span className="bg-black text-[#FFCC00] text-[8px] font-black uppercase px-1 py-0.5">
                                  ★ MAIN COVER
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(imgIdx)}
                                  className="bg-gray-200 hover:bg-black hover:text-[#FFCC00] text-[8px] font-bold uppercase py-0.5 border border-black transition-colors"
                                  title="Set as Main Cover Image"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgIdx)}
                                className="bg-red-600 text-white hover:bg-red-700 text-[8px] font-bold uppercase py-0.5 border border-black transition-colors"
                                title="Delete Image"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Dropzone (Visible when less than 5 images uploaded) */}
                    {(formData.images || []).length < 5 && (
                      <div className="border-2 border-dashed border-black p-4 bg-white text-center cursor-pointer hover:bg-yellow-50 transition-colors relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultiImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Upload size={22} className="text-black/70" />
                          <span className="text-[11px] font-black text-black">
                            {(formData.images || []).length === 0
                              ? "+ Upload Project Images (Select up to 5 Photos)"
                              : `+ Add More Images (${5 - (formData.images || []).length} Photos Left)`}
                          </span>
                          <span className="text-[9px] font-jost text-black/60">
                            JPG, PNG, WEBP formats. Multiple photos supported (Max 15MB/file).
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link Proyek / Demo */}
                <div>
                  <label className="block mb-1 text-black font-black">7. Project Link / Youtube / Behance / Live Demo (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://andikacatur.dev / https://youtube.com/..."
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                  />
                </div>

                {/* Deskripsi & Uraian Cerita Lengkap Karya */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-black font-black">8. Full Description &amp; Narrative Story (Max 2,000 Words)</label>
                    <span className="text-[10px] text-black/60 font-jost">
                      {(formData.fullContent || "").trim().split(/\s+/).filter(Boolean).length} / 2,000 Words
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Write complete description, background, and narrative story here... (Separate paragraphs with newlines)"
                    value={formData.fullContent}
                    onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none font-jost"
                  />
                </div>

                {/* Tag & Warna Kartu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-black font-black">9. Software / Tools / Tags</label>
                    <input
                      type="text"
                      placeholder="React, Python, Clip Studio (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-black font-black">10. Card Background Colour (Optional)</label>
                    <select
                      value={formData.bgColor}
                      onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                      className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                    >
                      {COLOR_OPTIONS.map((c) => (
                        <option key={c.bg} value={c.bg}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkbox Featured */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-black border-2 border-black rounded-none"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-black cursor-pointer">
                    Display on Main Home Page
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-[#FFCC00] text-sm font-black uppercase py-3.5 px-4 tracking-widest hover:bg-black/80 transition-colors rounded-none border-2 border-black"
                >
                  {editingProjectId ? "SAVE PROJECT CHANGES" : "Save & Publish Project"}
                </button>
              </form>
            </div>

            {/* List Existing Projects Side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border-b border-black pb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-black font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Project List ({projects.length})
                </h3>
              </div>

              {projects.length === 0 ? (
                <div className="border-2 border-dashed border-black/30 p-6 bg-gray-50 text-center rounded-none my-2">
                  <p className="text-xs font-jost italic text-black/70" style={{ fontFamily: "'Jost', sans-serif" }}>
                    No projects registered yet. Add a new project using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {projects.map((p) => (
                    <div key={p.id} className="border-2 border-black p-3 bg-white rounded-none flex gap-3 items-center justify-between">
                      <img src={p.image} alt={p.headline} className="w-16 h-16 object-cover rounded-none border border-black flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black bg-black text-[#FFCC00] px-1.5 py-0.5 rounded-none">
                            {formatCategoryBadge(p.mainCategory)}
                          </span>
                          <span className="text-[9px] font-bold uppercase bg-gray-200 border border-black/30 px-1 py-0.5 rounded-none">
                            {p.subCategory}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleFeaturedProject(p.id)}
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 border border-black flex items-center gap-1 transition-colors cursor-pointer rounded-none ${p.isFeatured
                              ? "bg-[#FFCC00] text-black hover:bg-yellow-400 font-black"
                              : "bg-gray-100 text-black/60 hover:bg-gray-200 hover:text-black"
                              }`}
                            title={p.isFeatured ? "Click to remove from Home Featured" : "Click to feature on Main Home Page"}
                          >
                            {p.isFeatured ? "⭐ HOME FEATURED" : "☆ +SELECT TO HOME"}
                          </button>
                        </div>
                        <h4 className="text-xs font-black truncate mt-1">{p.headline}</h4>
                        <p className="text-[10px] text-black/60 truncate font-jost">{p.deck}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditProject(p)}
                          className="p-2 border border-black/30 hover:border-black hover:bg-black hover:text-[#FFCC00] transition-colors rounded-none text-black cursor-pointer"
                          title="Edit This Project"
                        >
                          <Edit size={16} />
                        </button>

                        {deletingId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => confirmDeleteProject(p.id, p.headline)}
                              className="px-2.5 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase rounded-none hover:bg-red-700 transition-colors animate-pulse border border-black"
                              title="Click to confirm deletion"
                            >
                              CONFIRM DELETE?
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1.5 bg-gray-200 text-black text-[10px] font-black uppercase rounded-none hover:bg-gray-300 border border-black"
                              title="Cancel"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(p.id)}
                            className="p-2 border border-black/30 hover:border-black hover:bg-red-600 hover:text-white transition-colors rounded-none text-red-600 cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MANAGE CERTIFICATES SECTION IN ADMIN PANEL */}
            <div className="mt-12 pt-8 border-t-4 border-black">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                    <span>Manage Certificates &amp; Accreditations ({certificates.length})</span>
                  </h3>
                  <p className="text-xs text-gray-600">Kelola lisensi resmi, akreditasi keahlian, dan sertifikasi profesional.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCert}
                  className="px-4 py-2 bg-[#FFCC00] text-black font-black text-xs uppercase hover:bg-black hover:text-[#FFCC00] transition-colors cursor-pointer"
                >
                  Add New Certificate
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border-2 border-black p-4 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-black text-[#FFCC00] text-[9px] font-black uppercase px-2 py-0.5 border border-black">
                          {cert.category || "General"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">{cert.date}</span>
                      </div>
                      <h4 className="font-black text-sm uppercase line-clamp-2 mb-1">{cert.title}</h4>
                      <p className="text-xs font-bold text-gray-700 mb-2">{cert.issuer}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-black/20 mt-3">
                      <button
                        type="button"
                        onClick={() => handleEditCert(cert)}
                        className="flex-1 py-1.5 border border-black text-xs font-black uppercase hover:bg-black hover:text-[#FFCC00] transition-colors text-center cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCert(cert.id, cert.title)}
                        className="py-1.5 px-3 border border-black text-xs font-black uppercase text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
      ) : selectedArticle ? (
        /* ARTICLE DETAIL VIEW MODAL / PAGE */
        <main className="max-w-[900px] mx-auto px-4 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-8 border border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-2 rounded-none"
          >
            &larr; BACK
          </button>

          <article>
            <div className="border-b-[3px] border-black pb-4 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-black text-[#FFCC00] text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 inline-block rounded-none">
                  {selectedArticle.mainCategory === "RINGKASAN UTAMA" ? "MAIN SUMMARY" : (selectedArticle.mainCategory || "Technology")}
                </span>
                {selectedArticle.subCategory && (
                  <span className="bg-gray-200 text-black border border-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block rounded-none">
                    {selectedArticle.subCategory === "PROFIL PORTOFOLIO" ? "PORTFOLIO PROFILE" : selectedArticle.subCategory}
                  </span>
                )}
              </div>
              <h1
                className="text-3xl md:text-5xl font-black leading-tight text-black mb-3"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                {selectedArticle.headline}
              </h1>

              {/* Sub-Judul / Caption Ringkas Karya */}
              {selectedArticle.deck && (
                <p className="text-lg md:text-xl text-black/75 italic leading-relaxed mb-4 font-serif" style={{ fontFamily: "Jost, sans-serif" }}>
                  {selectedArticle.deck}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-black/20 text-xs font-bold text-black/60">
                <div className="flex items-center gap-4">
                  <span>BY: {selectedArticle.author || "Andika Catur Ariantono"}</span>
                  <span>•</span>
                  <span>{selectedArticle.date || todayDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedArticle.linkUrl && (
                    <a
                      href={selectedArticle.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-black text-[#FFCC00] font-black px-3 py-1 flex items-center gap-1.5 rounded-none hover:bg-black/80 text-[11px]"
                    >
                      VISIT PROJECT LINK <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleSave(selectedArticle.id, selectedArticle.headline)}
                    className="border border-black/30 hover:border-black px-3 py-1 flex items-center gap-1.5 transition-colors rounded-none"
                  >
                    <Bookmark size={12} className={savedArticles.includes(selectedArticle.id) ? "fill-black" : ""} />
                    {savedArticles.includes(selectedArticle.id) ? "SAVED" : "SAVE"}
                  </button>
                  {isAdminLoggedIn && selectedArticle.id === "hero-intro" && (
                    <button
                      onClick={handleOpenHeroModal}
                      className="border border-black bg-black text-[#FFCC00] hover:bg-gray-800 px-3 py-1 flex items-center gap-1.5 transition-colors rounded-none text-xs font-black uppercase"
                    >
                      <Edit size={12} /> UPDATE PROFILE (ADMIN)
                    </button>
                  )}
                  {isAdminLoggedIn && selectedArticle.id !== "hero-intro" && (
                    <button
                      onClick={() => handleStartEditProject(selectedArticle)}
                      className="border border-black bg-black text-[#FFCC00] hover:bg-gray-800 px-3 py-1 flex items-center gap-1.5 transition-colors rounded-none text-xs font-black uppercase"
                    >
                      <Edit size={12} /> EDIT PROJECT (ADMIN)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Viewer for Article (Gambar Karya - di bawah Header & Sub Judul) */}
            {(() => {
              const galleryImages = (selectedArticle.images && selectedArticle.images.length > 0)
                ? selectedArticle.images
                : (selectedArticle.image ? [selectedArticle.image] : []);

              if (galleryImages.length === 0) return null;

              const activeImg = galleryImages[activeGalleryIndex] || galleryImages[0];

              return (
                <div className="mb-8 border-2 border-black p-3 bg-gray-50 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative">
                    <img
                      src={activeImg}
                      alt={selectedArticle.headline}
                      className="w-full h-auto max-h-[550px] object-cover border border-black/40 rounded-none bg-black"
                    />
                    {galleryImages.length > 1 && (
                      <span className="absolute top-3 right-3 bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 border border-black shadow-md">
                        PHOTO {activeGalleryIndex + 1} OF {galleryImages.length}
                      </span>
                    )}
                  </div>

                  {selectedArticle.caption && (
                    <p className="text-[11px] text-black/70 italic mt-2.5 text-center font-serif" style={{ fontFamily: "Jost, sans-serif" }}>
                      {selectedArticle.caption} {galleryImages.length > 1 ? `(Photo View #${activeGalleryIndex + 1})` : ""}
                    </p>
                  )}

                  {/* Thumbnail Strip for Multi-Image Switcher */}
                  {galleryImages.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-black/20 flex items-center justify-center gap-2 overflow-x-auto">
                      {galleryImages.map((imgUrl: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`relative border-2 transition-all p-0.5 flex-shrink-0 ${activeGalleryIndex === idx
                            ? "border-black scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "border-black/30 opacity-60 hover:opacity-100 hover:border-black"
                            }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-12 object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-black text-[#FFCC00] text-[7px] font-black uppercase text-center py-0.5">
                              COVER
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* DESKRIPSI & URAIAN CERITA KARYA */}
            {(() => {
              const paragraphs: string[] = selectedArticle.content && selectedArticle.content.length > 0
                ? selectedArticle.content
                : ["Every detail in this project is designed with principles of high readability, reusable component structure, and optimised page load performance."];

              return (
                <div className="prose max-w-none text-base md:text-lg leading-relaxed text-black/90 space-y-6 text-justify" style={{ fontFamily: "Jost, sans-serif" }}>
                  {paragraphs.map((paragraph: string, idx: number) => (
                    <p
                      key={idx}
                      className={`text-justify ${idx === 0 ? "first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:font-serif" : ""}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              );
            })()}

            {selectedArticle.tags && (
              <div className="mt-8 pt-4 border-t border-black/20 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider">TECHNOLOGY / TOOLS:</span>
                {selectedArticle.tags.map((tag: string) => (
                  <span key={tag} className="border border-black text-[10px] font-bold px-2 py-0.5 uppercase rounded-none">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </main>
      ) : (
        /* MAIN PORTFOLIO CONTENT (FILTERED BY CATEGORY) */
        <main className="max-w-[1240px] mx-auto px-4 py-8">

          {/* MAIN HERO & SIDEBAR (HANYA DITAMPILKAN DI BERANDA) */}
          {activeCategory === "Beranda" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                {/* Main Content Column (Left 8 Cols) */}
                <div className="lg:col-span-8 lg:border-r lg:border-black/20 lg:pr-8">

                  <div className="mb-4 flex items-center justify-between border-b border-black pb-2">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-black text-white px-2 py-0.5 rounded-none">
                      MAIN SUMMARY
                    </span>
                    <span className="text-[10px] font-bold text-black/50 uppercase">
                      PORTFOLIO &bull; ANDIKA CATUR
                    </span>
                  </div>

                  {(!heroPortfolio.headline && !heroPortfolio.deck && (!heroPortfolio.content || heroPortfolio.content.length === 0)) ? (
                    <div className="border-2 border-dashed border-black/30 p-8 bg-gray-50 text-center my-6 rounded-none space-y-4">
                      <p className="text-base font-serif italic text-black/80" style={{ fontFamily: "Jost, sans-serif" }}>
                        No Main Summary &amp; Profile inputted by Admin yet.
                      </p>
                      <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (isAdminLoggedIn) {
                              handleOpenHeroModal();
                            } else {
                              setShowAuthModal(true);
                            }
                          }}
                          className="bg-black text-[#FFCC00] hover:bg-gray-800 text-xs font-black uppercase px-4 py-2.5 border-2 border-black transition-colors rounded-none cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                        >
                          <Sparkles size={14} /> + ADD MAIN SUMMARY {isAdminLoggedIn ? "(ADMIN)" : "(LOGIN ADMIN)"}
                        </button>
                        <button
                          type="button"
                          onClick={handleResetHeroPortfolio}
                          className="bg-white hover:bg-gray-100 text-black text-xs font-black uppercase px-4 py-2.5 border-2 border-black transition-colors rounded-none cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                        >
                          🔄 LOAD DEFAULT SAMPLE DATA
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {heroPortfolio.headline && (
                        <h2
                          className="text-[32px] sm:text-[44px] md:text-[52px] font-black leading-[1.02] tracking-tight uppercase text-black mb-4 cursor-pointer hover:text-black/70 transition-colors"
                          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                          onClick={() => setSelectedArticle(heroPortfolio)}
                        >
                          {heroPortfolio.headline}
                        </h2>
                      )}

                      {heroPortfolio.deck && (
                        <p className="text-lg md:text-xl text-black/80 font-serif italic mb-6 leading-relaxed border-l-2 border-black pl-4 py-1" style={{ fontFamily: "Jost, sans-serif" }}>
                          "{heroPortfolio.deck}"
                        </p>
                      )}

                      {/* Lead Image Block */}
                      {heroPortfolio.image && (
                        <div className="mb-6 border-2 border-black p-2 bg-gray-50 rounded-none">
                          <div className="overflow-hidden aspect-[16/10] bg-gray-200 border border-black/30 rounded-none">
                            <img
                              src={heroPortfolio.image}
                              alt="Main Summary Cover"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                              onClick={() => setSelectedArticle(heroPortfolio)}
                            />
                          </div>
                          {heroPortfolio.caption && (
                            <p className="text-[11px] text-black/70 italic mt-2 px-1 text-center" style={{ fontFamily: "Jost, sans-serif" }}>
                              <strong>PHOTO:</strong> {heroPortfolio.caption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Two Column Text */}
                      {heroPortfolio.content && heroPortfolio.content.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-black/85 leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
                          <p className="first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:font-serif">
                            {heroPortfolio.content[0]}
                          </p>
                          <div className="space-y-4">
                            {heroPortfolio.content[1] && <p>{heroPortfolio.content[1]}</p>}
                            <button
                              onClick={() => setSelectedArticle(heroPortfolio)}
                              className="w-full border-2 border-black py-2.5 px-4 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 mt-4 rounded-none"
                            >
                              READ FULL PROFILE <ArrowUpRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}


                    </>
                  )}

                </div>

                {/* Sidebar Column (Right 4 Cols) */}
                <div className="lg:col-span-4 space-y-8">

                  {/* Profile Card (Tentang Pengembang) */}
                  <div className="border-2 border-black p-5 bg-white rounded-none">
                    <div className="border-b border-black pb-2 mb-4 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black uppercase tracking-wider" style={{ fontFamily: "Playfair Display, serif" }}>
                        ABOUT
                      </h3>
                      <div className="flex items-center gap-2">
                        {isAdminLoggedIn && (
                          <button
                            onClick={handleOpenDevProfileModal}
                            className="bg-black text-[#FFCC00] hover:bg-gray-800 text-[9px] font-black uppercase px-2 py-0.5 border border-black flex items-center gap-1 transition-colors rounded-none cursor-pointer"
                            title="Edit Developer Profile (Admin)"
                          >
                            <Edit size={10} /> EDIT (ADMIN)
                          </button>
                        )}
                        <UserIcon size={14} />
                      </div>
                    </div>
                    <h4 className="text-xl font-black mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
                      {devProfile.name}
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-3">
                      {devProfile.role}
                    </p>
                    <p className="text-xs text-black/80 leading-relaxed font-serif mb-4" style={{ fontFamily: "Jost, sans-serif" }}>
                      {devProfile.bio}
                    </p>
                    <div className="space-y-2 border-t border-black/20 pt-3 text-xs">
                      <div className="flex items-center gap-2 text-black/70">
                        <MapPin size={12} /> {devProfile.location}
                      </div>
                      <div className="flex items-center gap-2 text-black/70">
                        <Mail size={12} /> {devProfile.email}
                      </div>
                    </div>
                  </div>

                  {/* CALENDAR WIDGET */}
                  <CalendarWidget
                    calendarStatus={calendarStatus}
                    setCalendarStatus={setCalendarStatus}
                    writings={writings}
                    isAdminLoggedIn={isAdminLoggedIn}
                    onEdit={handleOpenCalendarModal}
                  />

                  {/* WEATHER WIDGET */}
                  <WeatherWidget />

                  {/* WRITINGS / NOTES */}
                  <div>
                    <div className="mb-4 border-t-2 border-b border-black/35 py-2 flex items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2">
                        <span
                          className="bg-black text-white text-xs md:text-sm font-black italic tracking-tight px-2.5 py-1 rounded-none inline-block"
                          style={{ fontFamily: "Playfair Display, Georgia, serif", fontStyle: "italic" }}
                        >
                          What's Going On?
                        </span>
                        {writings.length > 0 && <span className="text-xs text-black/50 font-sans ml-1">({writings.length})</span>}
                      </h3>
                      {isAdminLoggedIn && (
                        <button
                          onClick={handleOpenWritingsModal}
                          className="bg-black text-[#FFCC00] hover:bg-gray-800 text-[9px] font-black uppercase px-2 py-0.5 border border-black flex items-center gap-1 transition-colors rounded-none cursor-pointer flex-shrink-0"
                          title="Edit Notes (Admin)"
                        >
                          <Edit size={10} /> EDIT (ADMIN)
                        </button>
                      )}
                    </div>

                    {/* Compact Scrollable Notes Container (~2 notes height with sleek 4px scrollbar) */}
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-3 custom-scrollbar border-b border-black/10">
                      {writings.map((op: any) => (
                        <div key={op.id} className="border-b border-black/20 pb-4">
                          <h4 className="text-base font-black leading-tight mb-2" style={{ fontFamily: "Jost, sans-serif" }}>
                            {op.title}
                          </h4>
                          <p className="text-xs text-black/70 italic font-serif leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
                            "{op.quote}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Box */}
                  <div className="border border-black p-4 bg-gray-50 rounded-none">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-2">
                      CONTACT ANDIKA CATUR
                    </h4>
                    <p className="text-xs text-black/70 mb-3 font-serif" style={{ fontFamily: "Jost, sans-serif" }}>
                      Open for project discussions, technical consultation, or career opportunities.
                    </p>
                    <a
                      href={`mailto:${devProfile.email || "andikacaa@gmail.com"}`}
                      className="w-full bg-black text-white text-xs font-black uppercase py-2.5 px-3 tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-colors rounded-none"
                    >
                      SEND EMAIL MESSAGE <Send size={12} />
                    </a>
                  </div>

                </div>

              </div>
              <Hairline thick />
            </>
          )}

          {/* FEATURED PROJECTS SECTION CONTAINER WITH BLACK BACKGROUND & TRANSPARENT CARDS */}
          <section
            style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
            className="bg-black text-white p-6 sm:p-8 md:p-10 my-8 rounded-none"
          >
            {/* Banner Indikator Pencarian (jika ada query pencarian) */}
            {searchQuery.trim() !== "" && (
              <div className="mb-6 bg-[#FFCC00] text-black p-3.5 border border-white flex flex-wrap items-center justify-between gap-2 text-xs rounded-none shadow-md">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-black" />
                  <span className="font-bold">
                    SEARCHING PROJECT TITLE: <span className="underline font-black">"{searchQuery}"</span> ({displayedProjects.length} projects found)
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-black text-[#FFCC00] font-black uppercase text-[10px] px-3 py-1 hover:bg-gray-800 border border-black flex items-center gap-1 cursor-pointer rounded-none"
                >
                  <X size={12} /> CLEAR SEARCH
                </button>
              </div>
            )}

            <div className="mb-6 border-b-2 border-white/20 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3
                  className="text-xl md:text-2xl font-black uppercase tracking-tight text-white"
                  style={{ fontFamily: "Jost, sans-serif" }}
                >
                  {activeCategory === "Beranda"
                    ? "FEATURED PROJECTS"
                    : `PROJECTS: ${activeCategory.toUpperCase()}`}
                </h3>
                {activeSubCategory !== "SEMUA" && (
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Sub-Category Filter: #{activeSubCategory}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeCategory === "Beranda" && isAdminLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setShowFeaturedModal(true)}
                    className="bg-white text-black hover:bg-gray-100 text-xs font-black uppercase px-3.5 py-1.5 border border-white flex items-center gap-2 transition-all cursor-pointer rounded-none"
                    title="Click to select which projects are displayed on Homepage (Maximum 6 Cards)"
                  >
                    <Filter size={14} className="text-black" />
                    <span>FILTER / SELECT PROJECTS ({displayedProjects.length}/6)</span>
                    <span className="bg-[#FFCC00] text-black text-[9px] px-1.5 py-0.5 font-black uppercase ml-1 border border-black">
                      ADMIN
                    </span>
                  </button>
                ) : (
                  <span className="text-xs font-black uppercase bg-white text-black px-3 py-1.5 border border-white flex items-center gap-2">
                    <Filter size={14} className="text-black" />
                    {displayedProjects.length} {activeCategory === "Beranda" ? "PROJECTS DISPLAYED" : "PROJECTS FOUND"}
                  </span>
                )}
              </div>
            </div>

            {displayedProjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/30 p-8 rounded-none bg-white/5">
                <p className="text-lg font-serif italic text-white/80 mb-3" style={{ fontFamily: "Jost, sans-serif" }}>
                  {activeCategory === "Beranda"
                    ? "No featured projects selected by Admin yet."
                    : "No projects added for this category yet."}
                </p>
                {activeCategory === "Beranda" && isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("Panel Admin")}
                    className="bg-[#FFCC00] text-black text-xs font-black uppercase px-4 py-2 border border-white hover:bg-yellow-400 transition-colors"
                  >
                    + Manage &amp; Select Featured Projects in Admin Panel
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProjects.map((proj) => (
                  <article
                    key={proj.id}
                    onClick={() => setSelectedArticle(proj)}
                    className="bg-transparent text-white p-4 flex flex-col justify-between group transition-all rounded-none overflow-hidden cursor-pointer select-none"
                  >
                    <div>
                      <div className="overflow-hidden aspect-[4/3] bg-black/60 mb-3 rounded-none relative border border-white/20">
                        <img
                          src={proj.image}
                          alt={proj.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {proj.linkUrl && (
                          <div className="absolute top-2 right-2 bg-black text-[#FFCC00] p-1.5 rounded-none font-black border border-white/40">
                            <ExternalLink size={12} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span className="text-[9px] font-black tracking-widest bg-black text-[#FFCC00] px-2.5 py-1 inline-block rounded-none border border-white/30">
                          {formatCategoryBadge(proj.mainCategory)}
                        </span>
                        <span className="text-[9px] font-black tracking-wider uppercase bg-white text-black px-2 py-0.5 inline-block rounded-none border border-black">
                          {proj.subCategory}
                        </span>
                      </div>

                      <h4
                        className="text-base font-black leading-snug mb-2 uppercase group-hover:text-[#FFCC00] transition-colors"
                        style={{ fontFamily: "Jost, sans-serif" }}
                      >
                        {proj.headline}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-serif line-clamp-3 mb-4" style={{ fontFamily: "Jost, sans-serif" }}>
                        {proj.deck}
                      </p>
                    </div>

                    <div className="border-t border-white/20 pt-3 flex items-center justify-between text-[10px] font-black uppercase text-white/80">
                      <span>{proj.date}</span>
                      <span className="flex items-center gap-1 font-black group-hover:text-[#FFCC00] group-hover:underline">
                        VIEW PROJECT <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* SERVICES & OFFERINGS (SOLID YELLOW CARDS WITH UNIFORM SIZE, BLACK TEXT & SYNCHRONIZED WALKING STICKMEN) */}
          <section className="pt-4 pb-12">
            <div className="mb-6">
              <div className="border-t-2 border-b-2 border-black py-2 flex items-center justify-between gap-2">
                <h3
                  className="text-lg md:text-xl font-black uppercase tracking-tight text-black"
                  style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                >
                  EXPERTISE &amp; SERVICES
                </h3>
                <div className="flex items-center gap-2">
                  {isAdminLoggedIn && (
                    <button
                      onClick={handleOpenServicesModal}
                      className="bg-black text-[#FFCC00] hover:bg-gray-800 text-[9px] font-black uppercase px-2 py-0.5 border border-black flex items-center gap-1 transition-colors rounded-none cursor-pointer"
                      title="Sunting Keahlian (Admin)"
                    >
                      <Edit size={10} /> EDIT (ADMIN)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden py-6 my-4 select-none">
              <div className="animate-marquee flex gap-6">
                {[...services, ...services, ...services].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-shrink-0">
                    {/* Solid Yellow Card with Uniform Width & Height */}
                    <div
                      style={{ backgroundColor: "#FFCC00", color: "#000000" }}
                      className="w-[300px] sm:w-[350px] h-[190px] sm:h-[200px] bg-[#FFCC00] text-black p-5 rounded-none flex flex-col justify-between hover:scale-[1.02] transition-transform border-2 border-black"
                    >
                      <div>
                        <span
                          style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
                          className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-2.5 py-1 inline-block mb-3 border border-black"
                        >
                          SERVICE &bull; {(idx % services.length) + 1}
                        </span>
                        <h4 className="text-sm font-black uppercase tracking-wider mb-2 text-black" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-black/90 font-serif leading-relaxed line-clamp-4" style={{ fontFamily: "Jost, sans-serif" }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CERTIFICATES SECTION */}
          <section className="mb-16 border-b-2 border-black pb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                  CERTIFICATES
                </h2>
              </div>

              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={handleOpenAddCert}
                  className="px-4 py-2 bg-[#FFCC00] text-black font-black text-xs uppercase hover:bg-black hover:text-[#FFCC00] transition-colors rounded-none cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ ADD</span>
                </button>
              )}
            </div>

            {/* Certificates Horizontal Scrollable Area */}
            {certificates.length === 0 ? (
              <div className="border-2 border-dashed border-black bg-[#E5E5E5] p-8 text-center my-4 font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Belum ada sertifikat terdaftar</p>
                <p className="text-xs text-gray-500">
                  {isAdminLoggedIn
                    ? 'Klik tombol "+ ADD" di atas untuk menambahkan sertifikat atau akreditasi baru.'
                    : 'Daftar sertifikat & lisensi keahlian akan segera diperbarui.'}
                </p>
              </div>
            ) : (
              <div className="relative py-2">
                <div
                  ref={setCertScrollRef}
                  onMouseDown={handleCertMouseDown}
                  onMouseLeave={handleCertMouseLeaveOrUp}
                  onMouseUp={handleCertMouseLeaveOrUp}
                  onMouseMove={handleCertMouseMove}
                  className={`flex flex-nowrap overflow-x-auto gap-6 pb-4 pt-2 select-none scroll-smooth custom-scrollbar ${
                    isCertDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="group bg-[#E5E5E5] p-5 flex flex-col justify-between transition-all duration-200 w-[300px] sm:w-[340px] md:w-[360px] shrink-0 flex-none"
                    >
                      <div>
                        {/* Cover / Certificate Preview Image */}
                        <div className="w-full h-44 bg-gray-200 border-2 border-black overflow-hidden mb-4 relative">
                          {cert.imageUrl ? (
                            <img
                              src={cert.imageUrl}
                              alt={cert.title}
                              draggable={false}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#E3E3E3] text-black/40 font-black text-xs select-none">
                              NO CERTIFICATE IMAGE
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-black text-[#FFCC00] text-[9px] font-black uppercase px-2 py-0.5 border border-black select-none">
                            {cert.category || "General"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-2 select-none">
                          <span className="text-[10px] font-black uppercase bg-[#FFCC00] text-black px-2 py-0.5 border border-black">
                            {cert.issuer}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">
                            {cert.date}
                          </span>
                        </div>

                        <h3 className="text-base font-black uppercase line-clamp-2 mb-4 select-none" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                          {cert.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-black/20">
                        <button
                          type="button"
                          onClick={() => setSelectedCertModal(cert)}
                          className="flex-1 py-2 bg-black text-white hover:bg-[#FFCC00] hover:text-black border border-black text-xs font-black uppercase transition-colors text-center cursor-pointer select-none"
                        >
                          VIEW
                        </button>

                        {isAdminLoggedIn && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditCert(cert)}
                              className="p-2 border border-black hover:bg-black hover:text-[#FFCC00] transition-colors cursor-pointer"
                              title="Edit Certificate"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCert(cert.id, cert.title)}
                              className="p-2 border border-black text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete Certificate"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t-[3px] border-black bg-black text-white py-10 px-4">
        <div className="max-w-[1240px] mx-auto text-center space-y-8">

          {/* Main Footer Layout: Centered Categories Grid above, Center NYC Skyline Photo below */}
          <div className="max-w-[1100px] mx-auto border-b border-white/20 pb-8 mb-4 space-y-8">

            {/* Top Row: 3 Categories with Custom Alignments (Left / Center / Right) */}
            <div className="max-w-[800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {MAIN_CATEGORIES.map(m => {
                const isCenter = m.id === "creative-art";
                const isRight = m.id === "media-production";
                const textAlign = isCenter ? "text-center" : isRight ? "text-right" : "text-left";
                const itemsAlign = isCenter ? "items-center" : isRight ? "items-end" : "items-start";

                return (
                  <div key={m.id} className={`space-y-1 ${textAlign}`}>
                    <h4
                      className={`text-lg md:text-xl font-bold text-[#FFCC00] tracking-wide unifrakturcook-bold ${textAlign}`}
                      style={{ fontFamily: '"UnifrakturCook", cursive', fontWeight: 700 }}
                    >
                      {m.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </h4>
                    <p className={`text-[9px] text-white/60 font-serif italic ${textAlign}`}>{m.subtitle}</p>
                    <div className={`flex flex-col text-[10px] text-white/80 pt-1 ${itemsAlign}`}>
                      {m.subcategories.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            handleSelectMainCategory(m.title, s.name);
                          }}
                          className={`${textAlign} hover:text-[#FFCC00] py-0.5 transition-colors leading-tight`}
                        >
                          {FOOTER_SUBCATEGORY_LABELS[s.name] || s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: NYC Skyline Photo Centered below categories */}
            <div className="flex justify-center pt-2">
              <img
                src={nycSkylineImg}
                alt="New York City Skyline"
                className="w-full max-w-[550px] max-h-[250px] h-auto object-contain mx-auto"
              />
            </div>

          </div>

          <div className="max-w-[750px] mx-auto my-4 text-center px-4">
            <p className="text-xs sm:text-sm text-white/90 italic font-serif leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
              "Welcome to my portfolio! Whether it’s a full-time role, a quick project, or a potential partnership, I’m always happy to connect. Feel free to send an email or follow my social media. Thanks!"
            </p>
          </div>

          {/* Social Media Links Section */}
          <div className="border-t border-white/20 pt-6 pb-2 max-w-[900px] mx-auto">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFCC00] mb-3">
              SOCIAL MEDIA
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
              <a
                href="mailto:andikacaa@gmail.com"
                className="bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white px-3 py-1.5 flex items-center gap-2 transition-colors border border-white/20"
              >
                <Mail size={14} /> <span>Email: andikacaa@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/andikacatvr"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white px-3 py-1.5 flex items-center gap-2 transition-colors border border-white/20"
              >
                <Instagram size={14} /> <span>Instagram: @andikacatvr</span>
              </a>
              <a
                href="https://github.com/andikacatvr"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white px-3 py-1.5 flex items-center gap-2 transition-colors border border-white/20"
              >
                <Github size={14} /> <span>GitHub: @andikacatvr</span>
              </a>
              <a
                href="https://youtube.com/@andikacatvr"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white px-3 py-1.5 flex items-center gap-2 transition-colors border border-white/20"
              >
                <Youtube size={14} /> <span>YouTube: @andikacatvr</span>
              </a>
              <a
                href="https://www.linkedin.com/in/andika-catur-ariantono-177438182/"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-[#FFCC00] hover:text-black text-white px-3 py-1.5 flex items-center gap-2 transition-colors border border-white/20"
              >
                <Linkedin size={14} /> <span>LinkedIn: Andika Catur Ariantono</span>
              </a>
            </div>
          </div>

          {/* Discreet Secret Admin Link in Footer */}
          <div className="border-t border-white/20 pt-6 text-[10px] text-white/50 flex flex-wrap items-center justify-between gap-2 max-w-[900px] mx-auto">
            <span>&copy; 2026 andikacatvr</span>

            <button
              onClick={handleOpenAdminTrigger}
              className="text-white/30 hover:text-[#FFCC00] transition-colors text-[9px] font-black uppercase flex items-center gap-1 opacity-60 hover:opacity-100"
              title="Akses Sistem Admin"
            >
              <Lock size={10} /> <span>{isAdminLoggedIn ? "KELOLA PORTOFOLIO (ADMIN)" : "+ ONLY WARRIOR +"}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL EDIT PROFIL PENGEMBANG (ADMIN ONLY) */}
      {showDevProfileModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-[550px] w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h3 className="text-lg font-black uppercase flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
                <Edit size={18} /> Edit Profil Pengembang (Admin)
              </h3>
              <button
                onClick={() => setShowDevProfileModal(false)}
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDevProfile} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-black uppercase">Nama Lengkap Pengembang</label>
                <input
                  type="text"
                  value={devProfileForm.name}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, name: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">Peran / Spesialisasi (Role)</label>
                <input
                  type="text"
                  value={devProfileForm.role}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, role: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-sm bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-black uppercase">Biodata Ringkas / Fokus Kerja</label>
                <textarea
                  rows={3}
                  value={devProfileForm.bio}
                  onChange={(e) => setDevProfileForm({ ...devProfileForm, bio: e.target.value })}
                  required
                  className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none font-serif"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-black uppercase">Lokasi Domisili</label>
                  <input
                    type="text"
                    value={devProfileForm.location}
                    onChange={(e) => setDevProfileForm({ ...devProfileForm, location: e.target.value })}
                    required
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-black uppercase">Email Kontak</label>
                  <input
                    type="text"
                    value={devProfileForm.email}
                    onChange={(e) => setDevProfileForm({ ...devProfileForm, email: e.target.value })}
                    required
                    className="w-full p-2.5 border-2 border-black rounded-none text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDevProfileModal(false)}
                  className="border-2 border-black px-4 py-2 text-xs font-black uppercase hover:bg-gray-200 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-black text-[#FFCC00] border-2 border-black px-5 py-2 text-xs font-black uppercase hover:bg-gray-800 cursor-pointer"
                >
                  SIMPAN PROFIL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT JADWAL KALENDER (ADMIN ONLY - CLICK-BASED VISUAL EDITOR) */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-[700px] w-full p-6 rounded-none max-h-[90vh] overflow-y-auto font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h3 className="text-lg font-black uppercase flex items-center gap-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                <CalendarIcon size={18} /> Visual Calendar Editor (Click-Based)
              </h3>
              <button
                type="button"
                onClick={() => setShowCalendarModal(false)}
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCalendarStatus} className="space-y-5 text-xs font-bold">


              {/* TOP ACTION BAR */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newEvt = {
                      id: "evt-" + Date.now(),
                      startDate: toISODateString(new Date()),
                      endDate: toISODateString(new Date()),
                      title: "",
                      status: "SIBUK"
                    };
                    setCalendarForm((prev: any) => ({
                      ...prev,
                      events: [...(prev.events || []), newEvt]
                    }));
                  }}
                  className="bg-[#FFCC00] text-black hover:bg-yellow-400 text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all cursor-pointer rounded-none"
                >
                  + New
                </button>
              </div>

              {/* CARD FORM AGENDA LIST */}
              <div className="space-y-4">
                {(calendarForm.events || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-black/30 p-4 bg-gray-50">
                    <p className="text-xs font-jost italic text-black/60 mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>
                      Let's create one!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newEvt = {
                          id: "evt-" + Date.now(),
                          startDate: toISODateString(new Date()),
                          endDate: toISODateString(new Date()),
                          title: "",
                          status: "SIBUK"
                        };
                        setCalendarForm((prev: any) => ({
                          ...prev,
                          events: [newEvt]
                        }));
                      }}
                      className="bg-[#FFCC00] text-black hover:bg-yellow-400 text-xs font-black uppercase px-3 py-1 border border-black"
                    >
                      + New
                    </button>
                  </div>
                ) : (
                  (calendarForm.events || []).map((evt: any, idx: number) => {
                    const sDateObj = parseEventDate(evt.startDate, evt.startDay, calendarForm?.monthYear);
                    const eDateObj = parseEventDate(evt.endDate, evt.endDay, calendarForm?.monthYear);
                    const diffTime = Math.abs(eDateObj.getTime() - sDateObj.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <div key={evt.id || idx} className="border-2 border-black p-4 bg-gray-50/80 space-y-4 rounded-none relative">
                        {/* Header Card */}
                        <div className="flex items-center justify-between border-b border-black/30 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black uppercase text-xs bg-[#FFCC00] text-black px-2.5 py-1 rounded-none border border-black">
                              Activity #{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-black/70 bg-white px-2 py-0.5 border border-black/30">
                              {formatDateFull(sDateObj)} - {formatDateFull(eDateObj)} ({evt.status === "SIBUK" ? "BUSY" : evt.status === "TERISI" ? "BOOKED" : evt.status === "TERBUKA" ? "OPEN" : evt.status})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCalendarForm((prev: any) => ({
                                ...prev,
                                events: (prev.events || []).filter((e: any) => e.id !== evt.id)
                              }));
                            }}
                            className="text-red-600 hover:bg-red-600 hover:text-white p-1.5 border border-red-600 transition-colors cursor-pointer rounded-none flex items-center justify-center"
                            title="Hapus Activity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Form Field 1: Nama Kegiatan (Clean text input + preset chips) */}
                        <div>
                          <label className="block text-[10px] font-black uppercase text-black/80 mb-1">
                            Activity:
                          </label>
                          <input
                            type="text"
                            placeholder="Untitled Event..."
                            value={evt.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCalendarForm((prev: any) => ({
                                ...prev,
                                events: prev.events.map((item: any) => item.id === evt.id ? { ...item, title: val } : item)
                              }));
                            }}
                            className="w-full p-2.5 border-2 border-black text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black rounded-none placeholder:text-black/40 placeholder:italic font-jost"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          />
                        </div>

                        {/* Form Field 2: Single Date-Range Selector (Input Field Tunggal Start Date - End Date with Popover Calendar) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-black uppercase text-black/80 flex items-center gap-1">
                              <CalendarIcon size={12} className="text-black" /> Start Date - End Date:
                            </label>
                            <span className="text-[10px] font-black text-black bg-gray-100 border border-black px-2 py-0.5">
                              {formatDateFull(sDateObj)} TO {formatDateFull(eDateObj)} ({diffDays} DAYS)
                            </span>
                          </div>

                          {/* Single Control Box displaying Start Date - End Date */}
                          <div className="relative">
                            <div className="w-full bg-white border-2 border-black p-2 flex flex-wrap items-center justify-between gap-2">
                              {/* Left: Input Tunggal Visual Display */}
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black uppercase text-black/80">Start:</span>
                                  <input
                                    type="date"
                                    value={toISODateString(sDateObj)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (!val) return;
                                      setCalendarForm((prev: any) => ({
                                        ...prev,
                                        events: prev.events.map((item: any) => {
                                          if (item.id === evt.id) {
                                            const newStart = val;
                                            const newEnd = item.endDate && item.endDate < val ? val : (item.endDate || val);
                                            return { ...item, startDate: newStart, endDate: newEnd };
                                          }
                                          return item;
                                        })
                                      }));
                                    }}
                                    className="bg-gray-100 hover:bg-white text-black text-xs font-black p-1 px-2 border border-black focus:outline-none cursor-pointer rounded-none font-jost"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                  />
                                </div>

                                <span className="text-black font-black text-xs">➔</span>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black uppercase text-black/80">End:</span>
                                  <input
                                    type="date"
                                    value={toISODateString(eDateObj)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (!val) return;
                                      setCalendarForm((prev: any) => ({
                                        ...prev,
                                        events: prev.events.map((item: any) => {
                                          if (item.id === evt.id) {
                                            const newStart = item.startDate && item.startDate > val ? val : (item.startDate || val);
                                            const newEnd = val;
                                            return { ...item, startDate: newStart, endDate: newEnd };
                                          }
                                          return item;
                                        })
                                      }));
                                    }}
                                    className="bg-gray-100 hover:bg-white text-black text-xs font-black p-1 px-2 border border-black focus:outline-none cursor-pointer rounded-none font-jost"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                  />
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                        {/* Form Field 3: Status Ketersediaan (Segmented Control / Radio Pill Buttons Horizontal) */}
                        <div>
                          <label className="block text-[10px] font-black uppercase text-black/80 mb-1.5">
                            Status:
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 border-2 border-black rounded-none">
                            {/* Option 1: Busy - Merah */}
                            <button
                              type="button"
                              onClick={() => {
                                setCalendarForm((prev: any) => ({
                                  ...prev,
                                  events: prev.events.map((item: any) => item.id === evt.id ? { ...item, status: "SIBUK" } : item)
                                }));
                              }}
                              className={`py-2 px-2 text-xs font-black uppercase transition-all border border-black flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${evt.status === "SIBUK" || evt.status === "BUSY"
                                  ? "bg-red-600 text-white border-black font-black scale-[1.02] z-10"
                                  : "bg-white text-black/80 hover:bg-red-100 border-transparent"
                                }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black flex-shrink-0" />
                              <span>BUSY</span>
                            </button>

                            {/* Option 2: Booked - Kuning */}
                            <button
                              type="button"
                              onClick={() => {
                                setCalendarForm((prev: any) => ({
                                  ...prev,
                                  events: prev.events.map((item: any) => item.id === evt.id ? { ...item, status: "TERISI" } : item)
                                }));
                              }}
                              className={`py-2 px-2 text-xs font-black uppercase transition-all border border-black flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${evt.status === "TERISI" || evt.status === "BOOKED"
                                  ? "bg-[#FFCC00] text-black border-black font-black scale-[1.02] z-10"
                                  : "bg-white text-black/80 hover:bg-yellow-100 border-transparent"
                                }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black flex-shrink-0" />
                              <span>BOOKED</span>
                            </button>

                            {/* Option 3: Open - Hijau */}
                            <button
                              type="button"
                              onClick={() => {
                                setCalendarForm((prev: any) => ({
                                  ...prev,
                                  events: prev.events.map((item: any) => item.id === evt.id ? { ...item, status: "TERBUKA" } : item)
                                }));
                              }}
                              className={`py-2 px-2 text-xs font-black uppercase transition-all border border-black flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${evt.status === "TERBUKA" || evt.status === "OPEN"
                                  ? "bg-emerald-600 text-white border-black font-black scale-[1.02] z-10"
                                  : "bg-white text-black/80 hover:bg-emerald-100 border-transparent"
                                }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black flex-shrink-0" />
                              <span>OPEN</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(false)}
                  className="border-2 border-black px-4 py-2 text-xs font-black uppercase hover:bg-gray-200 cursor-pointer rounded-none"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-[#FFCC00] text-black hover:bg-yellow-400 border-2 border-black px-5 py-2 text-xs font-black uppercase cursor-pointer rounded-none"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT CATATAN & OPINI DESAIN (ADMIN ONLY) */}
      {showWritingsModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-[650px] w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h3 className="text-lg font-black uppercase flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
                <BookOpen size={18} /> Edit Catatan &amp; Opini Desain (Admin)
              </h3>
              <button
                onClick={() => setShowWritingsModal(false)}
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveWritings} className="space-y-4 text-xs font-bold">
              <div className="flex items-center justify-between mb-2">
                <label className="text-black uppercase font-black text-sm">
                  Daftar Catatan &amp; Opini ({writingsForm.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newOp = {
                      id: "note-" + Date.now(),
                      title: "Judul Catatan & Opini Baru",
                      quote: "Kutipan atau ringkasan opini desain Anda di sini."
                    };
                    setWritingsForm([...writingsForm, newOp]);
                  }}
                  className="bg-black text-[#FFCC00] text-[10px] font-black uppercase px-2.5 py-1 border border-black hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  + Tambah Catatan Baru
                </button>
              </div>

              <div className="space-y-4">
                {writingsForm.map((op: any, idx: number) => (
                  <div key={op.id || idx} className="border-2 border-black p-3 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-black/30 pb-1.5">
                      <span className="font-black uppercase text-[10px]">
                        Opini #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setWritingsForm(writingsForm.filter((item: any) => item.id !== op.id));
                        }}
                        className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 border border-black hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-black/70 mb-0.5 uppercase">Judul Catatan</label>
                      <input
                        type="text"
                        value={op.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWritingsForm(writingsForm.map((item: any) => item.id === op.id ? { ...item, title: val } : item));
                        }}
                        required
                        className="w-full p-2 border border-black text-xs bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-black/70 mb-0.5 uppercase">Kutipan / Isi Opini</label>
                      <textarea
                        rows={2}
                        value={op.quote}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWritingsForm(writingsForm.map((item: any) => item.id === op.id ? { ...item, quote: val } : item));
                        }}
                        required
                        className="w-full p-2 border border-black text-xs bg-white font-serif italic"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-black flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWritingsModal(false)}
                  className="border-2 border-black px-4 py-2 text-xs font-black uppercase hover:bg-gray-200 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-black text-[#FFCC00] border-2 border-black px-5 py-2 text-xs font-black uppercase hover:bg-gray-800 cursor-pointer"
                >
                  SIMPAN CATATAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE DETAIL VIEWER MODAL */}
      {selectedCertModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[650px] w-full max-h-[90vh] overflow-y-auto flex flex-col rounded-none relative">
            <button
              type="button"
              onClick={() => setSelectedCertModal(null)}
              className="absolute top-4 right-4 p-2 bg-[#E5E5E5] text-black hover:bg-gray-300 transition-colors font-black text-xs cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-widest bg-[#E5E5E5] text-black px-2.5 py-1 inline-block self-start mb-3">
              {selectedCertModal.category || "ACCREDITATION"}
            </span>

            <h3 className="text-xl sm:text-2xl font-black uppercase mb-2" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              {selectedCertModal.title}
            </h3>

            <div className="flex items-center gap-3 text-xs font-bold text-gray-600 mb-4 pb-3 border-b border-black/20">
              <span className="bg-[#FFCC00] text-black px-2 py-0.5 border border-black font-black uppercase">
                {selectedCertModal.issuer}
              </span>
              <span>Tahun: {selectedCertModal.date}</span>
            </div>

            {/* Image Preview */}
            {selectedCertModal.imageUrl && (
              <div className="w-full h-64 sm:h-80 bg-[#E5E5E5] overflow-hidden mb-5">
                <img
                  src={selectedCertModal.imageUrl}
                  alt={selectedCertModal.title}
                  className="w-full h-full object-contain bg-[#E5E5E5] p-2"
                />
              </div>
            )}

            {selectedCertModal.description && (
              <div className="space-y-1 text-xs font-serif text-gray-800 leading-relaxed mb-6 bg-gray-50 p-3 border border-black/20">
                <h4 className="font-black uppercase text-[11px] text-black font-sans">Deskripsi Singkat:</h4>
                <p>{selectedCertModal.description}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t-2 border-black">
              <button
                type="button"
                onClick={() => setSelectedCertModal(null)}
                className="px-6 py-2.5 bg-[#E5E5E5] text-black hover:bg-gray-300 text-xs font-black uppercase transition-colors cursor-pointer"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MANAGE / EDIT CERTIFICATE MODAL */}
      {showManageCertModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto flex flex-col rounded-none relative font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
              <h3 className="text-lg font-black uppercase tracking-tight font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
                <span>{editingCertId ? "EDIT SERTIFIKAT (ADMIN)" : "TAMBAH SERTIFIKAT BARU (ADMIN)"}</span>
              </h3>
              <div className="flex items-center gap-2">
                {!editingCertId && (
                  <button
                    type="button"
                    onClick={() => {
                      setCertFormData({
                        id: "cert-" + Date.now(),
                        title: "Google Data Analytics Professional Certificate",
                        issuer: "Google / Coursera",
                        date: new Date().getFullYear().toString(),
                        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
                        credentialUrl: "https://coursera.org/verify/professional-cert/google-data-analytics",
                        category: "CLOUD & DATA",
                        description: "Akreditasi keahlian pengolahan data, SQL, visualisasi R & Tableau, serta analisis bisnis berstandar industri."
                      });
                    }}
                    className="px-2.5 py-1 bg-[#FFCC00] text-black border border-black font-black text-[10px] uppercase hover:bg-black hover:text-[#FFCC00] transition-colors cursor-pointer font-jost"
                    title="Isi otomatis formulir dengan data contoh"
                  >
                    ISI CONTOH DATA
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowManageCertModal(false)}
                  className="p-1 hover:bg-gray-200 border border-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4 text-xs font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
              <div>
                <label className="block font-black uppercase mb-1">Judul / Nama Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={certFormData.title}
                  onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                  placeholder="Misal: Google UX Design Professional Certificate"
                  className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-50 font-jost"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase mb-1">Penerbit (Issuer) *</label>
                  <input
                    type="text"
                    required
                    value={certFormData.issuer}
                    onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                    placeholder="Misal: Google / Coursera / AWS"
                    className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-50 font-jost"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase mb-1">Tahun / Tanggal *</label>
                  <input
                    type="text"
                    required
                    value={certFormData.date}
                    onChange={(e) => setCertFormData({ ...certFormData, date: e.target.value })}
                    placeholder="Misal: 2026 atau Agustus 2026"
                    className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-50 font-jost"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase mb-1">Kategori Sertifikat</label>
                <select
                  value={certFormData.category}
                  onChange={(e) => setCertFormData({ ...certFormData, category: e.target.value })}
                  className="w-full border-2 border-black p-2 font-bold focus:outline-none bg-white cursor-pointer font-jost"
                >
                  <option value="ENGINEERING">ENGINEERING</option>
                  <option value="UI/UX DESIGN">UI/UX DESIGN</option>
                  <option value="CLOUD & DATA">CLOUD &amp; DATA</option>
                  <option value="MEDIA & ART">MEDIA &amp; ART</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase mb-1 font-jost">Foto / Gambar Sertifikat *</label>
                
                {/* Upload File Dropzone Box */}
                <div className="border-2 border-dashed border-black p-4 bg-white text-center cursor-pointer hover:bg-yellow-50 transition-colors relative mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCertImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 font-jost">
                    <Upload size={22} className="text-black/70" />
                    <span className="text-xs font-black text-black font-jost">
                      {certFormData.imageUrl ? "Klik / Pilih Gambar Baru Untuk Mengganti Foto" : "+ Upload Foto Sertifikat Dari Komputer"}
                    </span>
                    <span className="text-[9px] font-jost text-black/60">
                      Format JPG, PNG, WEBP didukung. Otomatis terkompresi.
                    </span>
                  </div>
                </div>

                {/* Preview Thumbnail if image exists */}
                {certFormData.imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-gray-100 border-2 border-black mb-2 font-jost">
                    <img
                      src={certFormData.imageUrl}
                      alt="Preview Sertifikat"
                      className="w-16 h-12 object-cover border border-black bg-white flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase block text-green-700 font-jost">Gambar Sertifikat Terpasang</span>
                      <span className="text-[9px] font-mono text-gray-500 truncate block">
                        {certFormData.imageUrl.startsWith("data:") ? "File lokal terkompresi (Base64)" : certFormData.imageUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertFormData({ ...certFormData, imageUrl: "" })}
                      className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-black uppercase border border-black hover:bg-red-700 transition-colors cursor-pointer flex-shrink-0 font-jost"
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}

                {/* Direct URL Fallback */}
                <details className="mt-1 text-[10px] font-jost">
                  <summary className="font-bold text-gray-600 cursor-pointer hover:text-black font-jost">
                    Atau gunakan URL Gambar Web langsung (Opsional)
                  </summary>
                  <input
                    type="url"
                    value={certFormData.imageUrl || ""}
                    onChange={(e) => setCertFormData({ ...certFormData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau URL foto"
                    className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-50 mt-1 font-jost"
                  />
                </details>
              </div>

              <div>
                <label className="block font-black uppercase mb-1 font-jost">Deskripsi Singkat Sertifikat</label>
                <textarea
                  rows={2}
                  value={certFormData.description || ""}
                  onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                  placeholder="Misal: Akreditasi keahlian pengolahan data, SQL, dan analisis bisnis."
                  className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-50 font-jost"
                />
              </div>

              <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-3 font-jost">
                <button
                  type="button"
                  onClick={() => setShowManageCertModal(false)}
                  className="border-2 border-black px-4 py-2 text-xs font-black uppercase hover:bg-gray-200 cursor-pointer font-jost"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-black text-[#FFCC00] border-2 border-black px-5 py-2 text-xs font-black uppercase hover:bg-gray-800 cursor-pointer font-jost"
                >
                  {editingCertId ? "SIMPAN PERUBAHAN" : "TAMBAH SERTIFIKAT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PORTFOLIO CATALOG MODAL */}
      <PrintPortfolioModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        projects={projects}
        mainCategories={MAIN_CATEGORIES}
        devProfile={devProfile}
        initialCategory={printInitialCategory}
      />
    </div>
  );
}
