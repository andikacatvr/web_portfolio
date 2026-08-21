import React from "react";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const BENEFITS = [
  { name: "Akses tanpa batas ke semua artikel", free: false, premium: true },
  { name: "Bebas iklan", free: false, premium: true },
  { name: "Artikel eksklusif dan analisis mendalam", free: false, premium: true },
  { name: "Simpan artikel favorit", free: true, premium: true },
  { name: "Buletin harian gratis", free: true, premium: true },
];

const FAQS = [
  {
    question: "Apa keuntungan menjadi member?",
    answer: "Dengan menjadi member Premium, Anda mendapatkan akses tanpa batas ke seluruh arsip dan artikel terbaru kami, pengalaman membaca tanpa gangguan iklan, serta analisis mendalam dari jurnalis senior kami."
  },
  {
    question: "Apakah saya bisa berhenti berlangganan kapan saja?",
    answer: "Ya, Anda dapat membatalkan langganan Anda kapan saja melalui pengaturan akun. Akses Premium Anda akan tetap aktif hingga akhir periode penagihan saat ini."
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer: "Kami menerima berbagai metode pembayaran termasuk kartu kredit (Visa, Mastercard), transfer bank lokal, serta berbagai dompet digital populer di Indonesia."
  },
  {
    question: "Apakah ada diskon untuk pelajar atau institusi?",
    answer: "Kami menyediakan program khusus untuk pelajar dan langganan korporat. Silakan hubungi tim layanan pelanggan kami untuk informasi lebih lanjut."
  }
];

export function Membership() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-2xl mx-auto">
        <h1 
          className="text-4xl md:text-5xl font-black mb-6 uppercase"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Jadilah Member Premium
        </h1>
        <p 
          className="text-lg text-black/70 leading-relaxed"
          style={{ fontFamily: "PT Serif, Georgia, serif" }}
        >
          Dukung jurnalisme berkualitas dari The Vibey Sunday Media. Dapatkan akses penuh ke seluruh konten eksklusif dan analisis mendalam dari redaksi kami.
        </p>
      </section>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
        {/* Gratis */}
        <Card className="border-2 border-black/10 rounded-none shadow-none flex flex-col">
          <CardHeader className="text-center pt-8">
            <CardTitle 
              className="text-2xl font-black uppercase tracking-widest"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Gratis
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>Rp 0</span>
              <span className="text-black/50 ml-2">/ selamanya</span>
            </div>
            <CardDescription className="mt-4" style={{ fontFamily: "PT Serif, serif" }}>
              Akses terbatas untuk pembaca kasual.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-8">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-black/30" />
                <span>Baca 3 artikel gratis per bulan</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-black/30" />
                <span>Buletin harian dasar</span>
              </li>
              <li className="flex items-center gap-3 text-sm opacity-30">
                <div className="w-4 h-4" />
                <span>Bebas iklan</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pb-8 px-8">
            <Button variant="outline" className="w-full border-black rounded-none uppercase font-black tracking-widest text-[11px] py-6">
              Mulai Gratis
            </Button>
          </CardFooter>
        </Card>

        {/* Premium */}
        <Card className="border-[3px] border-black rounded-none shadow-none flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-black tracking-[0.2em] uppercase px-4 py-1.5 transform translate-x-[25%] translate-y-[50%] rotate-45 w-[150px] text-center">
            Populer
          </div>
          <CardHeader className="text-center pt-8">
            <CardTitle 
              className="text-2xl font-black uppercase tracking-widest"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Premium
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>Rp 49.000</span>
              <span className="text-black/50 ml-2">/ bulan</span>
            </div>
            <CardDescription className="mt-4" style={{ fontFamily: "PT Serif, serif" }}>
              Akses tanpa batas dan pengalaman terbaik.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-8">
            <ul className="space-y-4">
              {BENEFITS.filter(b => b.premium).map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-black" />
                  <span className="font-semibold">{benefit.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pb-8 px-8">
            <Button className="w-full bg-black hover:bg-black/90 text-white rounded-none uppercase font-black tracking-widest text-[11px] py-6">
              Berlangganan Sekarang
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Comparison Table */}
      <section className="mb-24">
        <h2 
          className="text-2xl font-black mb-8 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Perbandingan Paket
        </h2>
        <div className="border-t-[3px] border-black overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-black/10">
                <TableHead className="w-[50%] font-black uppercase tracking-widest text-xs text-black py-6">Manfaat</TableHead>
                <TableHead className="text-center font-black uppercase tracking-widest text-xs text-black">Gratis</TableHead>
                <TableHead className="text-center font-black uppercase tracking-widest text-xs text-black">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BENEFITS.map((benefit, i) => (
                <TableRow key={i} className="hover:bg-black/[0.02] border-b border-black/5">
                  <TableCell className="py-4 font-medium" style={{ fontFamily: "PT Serif, serif" }}>
                    {benefit.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {benefit.free ? <Check size={18} className="mx-auto" /> : <span className="text-black/10">—</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    {benefit.premium ? <Check size={18} className="mx-auto font-black" /> : <span className="text-black/10">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto border-t-[3px] border-black pt-12">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <HelpCircle size={24} />
          <h2 
            className="text-2xl font-black"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Pertanyaan Umum
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-black/10 py-2">
              <AccordionTrigger 
                className="text-left font-black tracking-tight hover:no-underline hover:text-black/60 transition-colors"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent 
                className="text-black/70 leading-relaxed pt-2 pb-4"
                style={{ fontFamily: "PT Serif, serif" }}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
