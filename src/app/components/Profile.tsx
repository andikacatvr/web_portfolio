import React from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Settings, 
  Key, 
  Bookmark, 
  History, 
  Bell, 
  LogOut, 
  CreditCard,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

interface ProfileProps {
  onLogout: () => void;
  onNavigateToArticle: () => void;
}

export function Profile({ onLogout, onNavigateToArticle }: ProfileProps) {
  const user = {
    name: "Rian Prasetya",
    email: "rian.prasetya@email.com",
    status: "Premium",
    expiryDate: "21 Juli 2027",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format"
  };

  const savedArticles = [
    { id: 1, title: "Revolusi Komputasi Kuantum: Bagaimana Indonesia Mempersiapkan Diri", category: "TEKNOLOGI", date: "2 jam lalu" },
    { id: 2, title: "Hilirisasi Nikel: Kemenangan Jangka Pendek atau Jebakan Industri?", category: "EKONOMI", date: "Kemarin" },
  ];

  const historyArticles = [
    { id: 3, title: "Timnas Indonesia Lolos ke Final Piala AFF Usai Kalahkan Thailand", category: "OLAHRAGA", date: "30 menit lalu" },
    { id: 4, title: "Presiden Umumkan Program Stimulus Ekonomi Senilai Rp 500 Triliun", category: "NASIONAL", date: "3 jam lalu" },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-black/10 pb-12">
        <div className="relative group">
          <div className="w-32 h-32 overflow-hidden bg-gray-100 border-[3px] border-black p-1">
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 hover:bg-blue-700 transition-colors">
            <Settings size={16} />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>{user.name}</h1>
            <Badge className="w-fit mx-auto md:mx-0 bg-black text-white hover:bg-black/80 rounded-none uppercase tracking-widest text-[9px] px-3">
              {user.status} Member
            </Badge>
          </div>
          <p className="text-black/50 flex items-center justify-center md:justify-start gap-2 mb-6">
            <Mail size={14} /> {user.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button variant="outline" className="border-black rounded-none uppercase font-black tracking-widest text-[10px] h-9 px-6 hover:bg-black hover:text-white transition-all">
              Edit Profil
            </Button>
            <Button variant="outline" className="border-black rounded-none uppercase font-black tracking-widest text-[10px] h-9 px-6 hover:bg-black hover:text-white transition-all">
              <Key size={12} className="mr-2" /> Ubah Password
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Subscriptions & Settings */}
        <div className="lg:col-span-1 space-y-8">
          {/* Subscription Info */}
          <section>
            <div className="border-t-[3px] border-black pt-2 mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest">Informasi Paket</h2>
            </div>
            <Card className="rounded-none border-black/10 shadow-none bg-gray-50/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-black text-white">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tighter">{user.status} Membership</p>
                    <p className="text-[11px] text-black/50 leading-none mt-1">Berlaku hingga {user.expiryDate}</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none uppercase font-black tracking-widest text-[10px] py-4 h-auto">
                  Perbarui Langganan
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Notifications */}
          <section>
            <div className="border-t-[3px] border-black pt-2 mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest">Notifikasi</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Buletin Harian</p>
                  <p className="text-[11px] text-black/50">Rangkuman berita setiap pagi</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Berita Sela (Breaking)</p>
                  <p className="text-[11px] text-black/50">Pemberitahuan berita darurat</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Analisis Eksklusif</p>
                  <p className="text-[11px] text-black/50">Artikel opini & riset mendalam</p>
                </div>
                <Switch className="data-[state=checked]:bg-blue-600" />
              </div>
            </div>
          </section>

          {/* Logout */}
          <div className="pt-8">
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none uppercase font-black tracking-widest text-[11px] px-0"
            >
              <LogOut size={16} className="mr-3" /> Keluar dari Akun
            </Button>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className="lg:col-span-2 space-y-12">
          {/* Bookmarks */}
          <section>
            <div className="border-t-[3px] border-black pt-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Artikel Disimpan</h2>
              </div>
              <span className="text-[10px] text-black/40 font-bold">{savedArticles.length} ARTIKEL</span>
            </div>
            <div className="space-y-4">
              {savedArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="group flex items-start justify-between gap-4 p-4 border border-black/5 hover:border-black/20 transition-all cursor-pointer bg-white"
                  onClick={onNavigateToArticle}
                >
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-blue-600 uppercase mb-1 block">{article.category}</span>
                    <h3 className="text-[14px] font-bold leading-snug group-hover:underline" style={{ fontFamily: "PT Serif, serif" }}>{article.title}</h3>
                    <p className="text-[10px] text-black/40 mt-1">{article.date}</p>
                  </div>
                  <ChevronRight size={16} className="text-black/20 group-hover:text-black mt-1" />
                </div>
              ))}
            </div>
          </section>

          {/* History */}
          <section>
            <div className="border-t-[3px] border-black pt-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest">Riwayat Baca</h2>
              </div>
              <button className="text-[10px] text-blue-600 font-bold hover:underline">HAPUS RIWAYAT</button>
            </div>
            <div className="space-y-4">
              {historyArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="group flex items-start justify-between gap-4 py-3 border-b border-black/5 hover:bg-black/[0.02] px-2 -mx-2 transition-colors cursor-pointer"
                  onClick={onNavigateToArticle}
                >
                  <div className="flex-1">
                    <h3 className="text-[13px] font-bold leading-snug" style={{ fontFamily: "PT Serif, serif" }}>{article.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-black tracking-widest text-black/40 uppercase">{article.category}</span>
                      <span className="text-[10px] text-black/30 italic">{article.date}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-black/10 group-hover:text-black/40 mt-1" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
