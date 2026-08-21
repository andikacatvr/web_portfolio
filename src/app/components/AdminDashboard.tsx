import React, { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const STATS = [
  { label: "Total Artikel", value: "1,284", change: "+12%", icon: FileText },
  { label: "Total Pengguna", value: "45,820", change: "+5%", icon: Users },
  { label: "Member Premium", value: "8,421", change: "+18%", icon: CreditCard },
  { label: "Total Kategori", value: "12", change: "0%", icon: Layers },
];

const CHART_DATA = [
  { month: "Jan", count: 45 }, { month: "Feb", count: 52 }, { month: "Mar", count: 48 },
  { month: "Apr", count: 61 }, { month: "Mei", count: 55 }, { month: "Jun", count: 67 },
  { month: "Jul", count: 72 },
];

const INITIAL_ARTICLES = [
  { id: 1, title: "Revolusi Komputasi Kuantum di Indonesia", category: "Teknologi", author: "Sari Indrawati", date: "21 Juli 2026", status: "Published", type: "Premium" },
  { id: 2, title: "Strategi Ekonomi Pasca Pandemi 2026", category: "Ekonomi", author: "Dimas Prasetyo", date: "20 Juli 2026", status: "Draft", type: "Gratis" },
  { id: 3, title: "Kemenangan Dramatis Timnas di AFF", category: "Olahraga", author: "Fajar Nugroho", date: "19 Juli 2026", status: "Published", type: "Gratis" },
  { id: 4, title: "Inovasi Pertanian Organik di Bali", category: "Nasional", author: "Budi Santoso", date: "18 Juli 2026", status: "Published", type: "Premium" },
];

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [showAddModal, setShowAddModal] = useState(false);

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Kelola Artikel", icon: FileText },
    { name: "Kelola Kategori", icon: Layers },
    { name: "Kelola Pengguna", icon: Users },
    { name: "Kelola Membership", icon: CreditCard },
    { name: "Komentar", icon: MessageSquare },
    { name: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* CMS SIDEBAR */}
      <aside className="w-64 bg-[#1F2937] text-white flex flex-col flex-shrink-0">
        <div className="p-6 bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center font-black rounded-sm">TVS</div>
            <span className="font-bold tracking-tight text-lg">TVS CMS <span className="text-blue-400 text-xs block font-normal uppercase tracking-widest">Admin Panel</span></span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-md ${
                activeMenu === item.name 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all rounded-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* CMS MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">{activeMenu}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Cari data..." 
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-gray-200 rounded-md text-sm"
              />
            </div>
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 leading-none">Admin TVS</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Super Admin</p>
              </div>
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeMenu === "Dashboard" ? (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                  <Card key={stat.label} className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                          <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <stat.icon size={24} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">vs bulan lalu</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <Card className="lg:col-span-2 border-none shadow-md">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-base font-bold text-gray-800">Trend Publikasi Konten</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-base font-bold text-gray-800">Aktivitas Terbaru</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                      {[
                        { action: "Publish Artikel", target: "Revolusi Kuantum...", time: "2 jam lalu", color: "text-green-500" },
                        { action: "Edit Kategori", target: "Politik", time: "4 jam lalu", color: "text-blue-500" },
                        { action: "Hapus Komentar", target: "ID #2312", time: "5 jam lalu", color: "text-red-500" },
                        { action: "User Baru", target: "rian@email.com", time: "1 hari lalu", color: "text-purple-500" },
                      ].map((act, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className={`text-xs font-bold ${act.color}`}>{act.action}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[140px]">{act.target}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : activeMenu === "Kelola Artikel" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Cari artikel..." className="pl-10 pr-4 py-2 w-72 rounded-md" />
                  </div>
                  <Button variant="outline" className="rounded-md border-gray-200 flex items-center gap-2 text-xs font-bold">
                    <Filter size={14} /> Filter
                  </Button>
                </div>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 font-bold px-6"
                >
                  <Plus size={18} /> Tambah Artikel
                </Button>
              </div>

              <Card className="border-none shadow-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4">Judul Artikel</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4">Kategori</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4">Penulis</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4">Status</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4">Jenis</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider py-4 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell className="py-4">
                          <p className="font-bold text-gray-900 text-sm">{article.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{article.date}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 font-medium">{article.category}</TableCell>
                        <TableCell className="text-sm text-gray-500 font-medium">{article.author}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            article.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            article.type === 'Premium' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
                          }`}>
                            {article.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><MoreVertical size={16} /></button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-lg font-bold">Menu {activeMenu}</h3>
              <p className="text-sm">Fitur sedang dalam pengembangan untuk antarmuka CMS.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL PLACEHOLDER UNTUK TAMBAH ARTIKEL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">Tambah Artikel Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black transition-colors"><XCircle size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Judul Artikel</label>
                <Input placeholder="Masukkan judul utama..." className="h-12 text-lg font-bold rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Kategori</label>
                  <select className="w-full h-12 rounded-md border border-gray-200 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none">
                    <option>Pilih Kategori</option>
                    <option>Politik</option>
                    <option>Ekonomi</option>
                    <option>Teknologi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Jenis Akses</label>
                  <div className="flex gap-4 p-2 bg-gray-50 rounded-md">
                    <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 bg-white rounded shadow-sm text-xs font-bold">
                      <input type="radio" name="type" className="hidden" /> Gratis
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 text-xs font-bold opacity-40">
                      <input type="radio" name="type" className="hidden" /> Premium
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Gambar Utama</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer">
                  <ImageIcon size={32} className="mb-2" />
                  <p className="text-xs font-bold">Klik atau seret gambar ke sini</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Konten Artikel</label>
                <textarea 
                  placeholder="Tulis artikel di sini..." 
                  className="w-full h-64 border border-gray-200 rounded-md p-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="rounded-md font-bold px-6">Simpan Draft</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold px-8">Publikasikan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
