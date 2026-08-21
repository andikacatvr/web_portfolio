import React from "react";
import { 
  ChevronRight, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  Facebook, 
  Twitter, 
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const RELATED_ARTICLES = [
  {
    id: 101,
    category: "TEKNOLOGI",
    headline: "Masa Depan AI di Indonesia: Antara Peluang Ekonomi dan Etika Digital",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=260&fit=crop&auto=format&grayscale",
    time: "2 jam lalu",
  },
  {
    id: 102,
    category: "EKONOMI",
    headline: "Strategi Startup Lokal Bertahan di Tengah Ketidakpastian Ekonomi Global",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=260&fit=crop&auto=format&grayscale",
    time: "5 jam lalu",
  },
  {
    id: 103,
    category: "SAINS",
    headline: "Inovasi Energi Terbarukan: Memanfaatkan Arus Laut Kepulauan Nusantara",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=260&fit=crop&auto=format&grayscale",
    time: "1 hari lalu",
  }
];

interface ArticleDetailProps {
  onBack: () => void;
}

export function ArticleDetail({ onBack }: ArticleDetailProps) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 mb-8">
        <button onClick={onBack} className="hover:text-black transition-colors">Beranda</button>
        <ChevronRight size={10} />
        <span className="hover:text-black cursor-pointer">Teknologi</span>
        <ChevronRight size={10} />
        <span className="text-black/80">Detail Artikel</span>
      </nav>

      {/* Article Header */}
      <header className="mb-10">
        <span className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 mb-4">
          Teknologi
        </span>
        <h1 
          className="text-3xl md:text-5xl font-black leading-tight mb-6"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Revolusi Komputasi Kuantum: Bagaimana Indonesia Mempersiapkan Diri Menghadapi Era Baru Digital
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-black/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[12px] font-bold">
              <User size={14} className="text-black/40" />
              <span>Sari Indrawati</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-black/50">
              <Calendar size={14} />
              <span>21 Juli 2026</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-black/50">
              <Clock size={14} />
              <span>8 Menit Baca</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 border border-black/10 hover:border-black transition-colors rounded-none">
              <Bookmark size={16} />
            </button>
            <button className="p-2 border border-black/10 hover:border-black transition-colors rounded-none">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <figure className="mb-10 -mx-4 md:mx-0">
        <img 
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=700&fit=crop&auto=format&grayscale" 
          alt="Quantum Computing Illustration" 
          className="w-full h-auto grayscale border-b border-black/10"
        />
        <figcaption className="text-[11px] text-black/40 mt-3 px-4 md:px-0 italic">
          Ilustrasi sirkuit kuantum yang dikembangkan oleh tim peneliti gabungan di Jakarta. (Foto: NusantaraPost/Arsip)
        </figcaption>
      </figure>

      {/* Article Content */}
      <article 
        className="prose prose-lg max-w-none mb-16"
        style={{ fontFamily: "PT Serif, Georgia, serif" }}
      >
        <p className="text-xl leading-relaxed font-bold mb-8 text-black/80">
          Di tengah hiruk pikuk transformasi digital konvensional, sebuah gelombang baru teknologi sedang dipersiapkan di laboratorium-laboratorium riset Indonesia. Komputasi kuantum, yang selama ini dianggap sebagai fiksi ilmiah, mulai menampakkan urgensinya bagi keamanan siber dan kedaulatan data nasional.
        </p>
        
        <p className="mb-6 leading-relaxed">
          Pemerintah Indonesia, melalui konsorsium riset teknologi tinggi, baru saja mengumumkan peta jalan nasional untuk pengembangan sumber daya manusia di bidang mekanika kuantum. Langkah ini diambil sebagai respon atas kemajuan pesat negara-negara tetangga yang mulai mengintegrasikan infrastruktur kuantum dalam sistem keuangan mereka.
        </p>

        <h2 className="text-2xl font-black mt-10 mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
          Mengapa Kuantum Menjadi Krusial?
        </h2>
        
        <p className="mb-6 leading-relaxed">
          Berbeda dengan bit klasik yang hanya mengenal status 0 atau 1, qubit kuantum dapat berada dalam kedua status secara bersamaan berkat fenomena superposisi. Hal ini memungkinkan pemrosesan data dengan kecepatan ribuan kali lipat dibandingkan superkomputer tercepat saat ini.
        </p>

        <blockquote className="border-l-[4px] border-black pl-6 my-10 py-2 italic text-2xl text-black/70" style={{ fontFamily: "Playfair Display, serif" }}>
          "Ini bukan sekadar tentang komputer yang lebih cepat, ini tentang paradigma baru dalam memecahkan masalah kompleks yang sebelumnya dianggap mustahil oleh otak manusia maupun mesin."
          <footer className="text-sm font-bold mt-4 not-italic text-black">— Dr. Ahmad Zakaria, Ahli Fisika Teoretis ITB</footer>
        </blockquote>

        <p className="mb-6 leading-relaxed">
          Dalam konteks nasional, aplikasi paling mendesak adalah kriptografi pasca-kuantum. Sistem enkripsi perbankan dan data rahasia negara yang digunakan saat ini diprediksi akan sangat rentan jika mesin kuantum skala besar berhasil direalisasikan oleh pihak yang tidak bertanggung jawab.
        </p>
        
        <div className="my-10 overflow-hidden bg-gray-50 border border-black/5 p-1">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&auto=format&grayscale" 
            alt="Research Facility" 
            className="w-full h-auto grayscale"
          />
          <p className="text-[10px] text-black/40 mt-2 px-2 pb-2">Pusat Data Nasional sedang dalam proses migrasi ke sistem enkripsi berlapis.</p>
        </div>

        <p className="mb-6 leading-relaxed">
          Tantangan terbesar bagi Indonesia saat ini bukanlah ketersediaan perangkat keras, melainkan talenta. Diperlukan ribuan insinyur dan pengembang perangkat lunak yang mampu berpikir dalam logika kuantum untuk membangun ekosistem yang mandiri.
        </p>
      </article>

      {/* Social Share & Action */}
      <div className="flex items-center justify-between py-8 border-t border-b border-black mb-16">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/50">Bagikan</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-none border-black/10 hover:border-black">
              <Facebook size={16} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-none border-black/10 hover:border-black">
              <Twitter size={16} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-none border-black/10 hover:border-black">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
        <Button variant="outline" className="rounded-none border-black uppercase font-black tracking-widest text-[11px] px-6 h-10">
          <Bookmark size={14} className="mr-2" /> Simpan Artikel
        </Button>
      </div>

      {/* Related Articles */}
      <section className="mb-16">
        <div className="border-t-[3px] border-black pt-2 mb-8">
          <h2 className="text-xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>Artikel Terkait</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RELATED_ARTICLES.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="overflow-hidden mb-3">
                <img 
                  src={article.image} 
                  alt={article.headline} 
                  className="w-full h-[140px] object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-2 block">{article.category}</span>
              <h3 className="text-sm font-bold leading-tight group-hover:text-black/60 transition-colors" style={{ fontFamily: "PT Serif, serif" }}>
                {article.headline}
              </h3>
            </article>
          ))}
        </div>
      </section>

      {/* Simple Comment Section */}
      <section className="mb-12">
        <div className="border-t-[3px] border-black pt-2 mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>Komentar</h2>
          <span className="text-xs text-black/40 font-bold">12 Komentar</span>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4 p-4 border border-black/5 bg-gray-50/50">
            <div className="flex-1">
              <textarea 
                placeholder="Tambahkan komentar Anda..." 
                className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[80px] placeholder:text-black/30"
              />
              <div className="flex justify-end mt-2">
                <Button className="bg-black text-white rounded-none uppercase font-black tracking-widest text-[10px] px-6 py-2">
                  Kirim
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 py-4 border-b border-black/5">
            <div className="w-10 h-10 bg-black/5 rounded-none flex items-center justify-center text-black/20">
              <User size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider">Budi Setiawan</span>
                <span className="text-[10px] text-black/30">10 Menit lalu</span>
              </div>
              <p className="text-sm text-black/70 leading-relaxed" style={{ fontFamily: "PT Serif, serif" }}>
                Artikel yang sangat mencerahkan. Semoga kolaborasi antara akademisi dan industri bisa semakin dipererat untuk mengejar ketertinggalan ini.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest mt-2 text-black/40 hover:text-black">Balas</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Back to Home Button */}
      <div className="text-center pt-8 border-t border-black/10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="hover:bg-transparent hover:underline font-black tracking-widest text-[11px] uppercase"
        >
          <ArrowLeft size={14} className="mr-2" /> Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
