import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X, Layers } from "lucide-react";
import profilePrintImg from "../../../gambar/profile_print.png";

interface PrintPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: any[];
  mainCategories: any[];
  devProfile: any;
  initialCategory?: string;
}

export function PrintPortfolioModal({
  isOpen,
  onClose,
  projects,
  mainCategories,
  devProfile,
  initialCategory
}: PrintPortfolioModalProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("SEMUA");

  if (!isOpen) return null;

  // Available categories dynamically
  const availableSubCategories = Array.from(
    new Set(
      projects.map((p) => p.subCategory).filter(Boolean)
    )
  );

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    return (
      selectedSubCategory === "SEMUA" ||
      (p.subCategory && p.subCategory.toUpperCase() === selectedSubCategory.toUpperCase())
    );
  });

  const handlePrint = () => {
    window.print();
  };

  const currentCategoryLabel =
    selectedSubCategory === "SEMUA"
      ? "Semua Kategori"
      : selectedSubCategory;

  const printableDocument = (
    <div id="print-portfolio-document" className="bg-white text-black p-8 font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
      
      {/* COVER HERO SPREAD PRINT */}
      <div className="bg-[#D93829] text-white p-8 rounded-xl relative overflow-hidden mb-10">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/80 border-b border-white/20 pb-3 mb-6">
          <span>ANDIKA CATUR ARIANTONO</span>
          <span>DESIGN PORTFOLIO • {new Date().getFullYear()} PRINT EDITION</span>
        </div>

        {/* Hero Title & Profile Photo Layout Grid */}
        <div className="flex items-center justify-between gap-6 my-8">
          {/* Left: Huge Title */}
          <div className="space-y-2">
            <h1 className="text-6xl font-black uppercase tracking-tight leading-none text-white">
              Design<br />Portfolio
            </h1>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest pt-2">
              STUDIO EDITORIAL CATALOG • PRINT EDITION
            </p>
          </div>

          {/* Right: Standalone Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src={profilePrintImg}
              alt={devProfile?.name || "Andika Catur Ariantono"}
              className="w-36 h-36 rounded-2xl object-cover border-2 border-white shadow-xl"
            />
          </div>
        </div>

        {/* 3-Column Info Footer in Red Cover */}
        <div className="grid grid-cols-3 gap-6 pt-5 border-t border-white/20 text-xs text-white/90">
          {/* Column 1: About Me */}
          <div className="space-y-1">
            <p className="font-black text-white text-xs uppercase tracking-wider">ABOUT ME</p>
            <p className="font-extrabold text-sm text-white">{devProfile?.name || "Andika Catur Ariantono"}</p>
            <p className="text-xs text-white/90 font-medium leading-snug">
              Universitas Esa Unggul (Jurusan Sistem Informasi)
            </p>
          </div>

          {/* Column 2: Interests */}
          <div className="space-y-1">
            <p className="font-black text-white text-xs uppercase tracking-wider">INTERESTS</p>
            <p className="text-xs leading-relaxed text-white/90 font-medium">
              UI/UX Designer, Graphic Designer, Visual Designer, Game Designer
            </p>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-1">
            <p className="font-black text-white text-xs uppercase tracking-wider">CONTACT &amp; LOCATION</p>
            <p className="text-xs text-white/90">Email: {devProfile?.email || "andikacaa@gmail.com"}</p>
            <p className="text-xs text-white/90">Location: {devProfile?.location || "Jakarta, ID"}</p>
          </div>
        </div>
      </div>

      {/* PROJECT SPREADS LIST PRINT */}
      <div className="space-y-12">
        {filteredProjects.map((item, index) => {
          const itemNum = String(index + 1).padStart(2, "0");
          return (
            <div key={item.id || index} className="print-page-break-avoid border-2 border-black rounded-xl overflow-hidden bg-white relative space-y-0 mb-10">
              
              {/* Red Header Bar */}
              <div className="bg-[#D93829] text-white p-4 flex items-center justify-between gap-3 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-black text-base border border-white/30">
                    {itemNum}
                  </span>
                  <div>
                    <h2 className="text-xl font-black uppercase text-white leading-tight">
                      {item.headline || item.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-black/40 text-white text-xs font-bold uppercase px-2.5 py-0.5 rounded border border-white/20">
                        {item.mainCategory}
                      </span>
                      {item.subCategory && (
                        <span className="bg-white text-[#D93829] text-xs font-extrabold uppercase px-2.5 py-0.5 rounded">
                          {item.subCategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {item.date && (
                  <span className="text-xs font-black uppercase bg-black text-white px-3 py-1 rounded border border-white/30">
                    YEAR: {item.date}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 bg-red-50/20 space-y-4">
                <div className="grid grid-cols-12 gap-6 items-start">
                  {(item.image || item.imageUrl) && (
                    <div className="col-span-6">
                      <div className="border-2 border-black bg-white overflow-hidden rounded-lg">
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.headline || item.title}
                          className="w-full h-auto max-h-[260px] object-cover"
                        />
                      </div>
                      {item.caption && (
                        <p className="text-xs font-medium italic text-gray-600 mt-2 border-l-2 border-[#D93829] pl-2">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )}

                  <div className={`${(item.image || item.imageUrl) ? "col-span-6" : "col-span-12"} space-y-3`}>
                    {item.deck && (
                      <p className="text-xs font-bold text-black leading-relaxed border-l-4 border-[#D93829] pl-3 py-1 bg-white border border-gray-200 rounded-r">
                        {item.deck}
                      </p>
                    )}

                    <div className="text-xs text-gray-800 space-y-2 leading-relaxed">
                      {Array.isArray(item.content) ? (
                        item.content.map((p: string, pIdx: number) => <p key={pIdx}>{p}</p>)
                      ) : (
                        <p>{item.content || item.fullContent}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-black/20 text-xs space-y-1 text-gray-900">
                      {item.tags && (
                        <p><span className="font-black text-black uppercase">TOOLS:</span> {Array.isArray(item.tags) ? item.tags.join(", ") : item.tags}</p>
                      )}
                      {item.linkUrl && (
                        <p><span className="font-black text-[#D93829] uppercase">LINK:</span> <span className="underline text-black font-bold">{item.linkUrl}</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Running Spread Footer */}
                <div className="pt-4 border-t border-black/20 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>ANDIKA CATUR ARIANTONO — PORTFOLIO</span>
                  <span>{currentCategoryLabel}</span>
                  <span>PAGE [ {itemNum} ]</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* POPUP MODAL CONTROL UI (HIDDEN DURING WINDOW.PRINT()) */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto no-print font-jost" style={{ fontFamily: "'Jost', sans-serif" }}>
        <div className="bg-white text-black w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-300 my-4 max-h-[94vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
          
          {/* Modal Control Bar */}
          <div className="bg-white text-gray-900 px-6 py-3.5 flex items-center justify-between rounded-t-2xl border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D93829] text-white rounded-xl shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-black">CETAK KATALOG PORTOFOLIO</h2>
                <p className="text-xs text-gray-500 font-medium">Studio Design Portfolio Edition • Adapted Layout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-gray-100/60">
            
            {/* Left Control Panel */}
            <div className="lg:col-span-4 p-5 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 space-y-5">
              
              {/* Filter Dropdown */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D93829]" /> Pilih Kategori:
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full bg-white text-black font-bold border-2 border-black rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D93829] cursor-pointer shadow-xs"
                >
                  <option value="SEMUA">Semua Kategori ({projects.length} Karya)</option>
                  {availableSubCategories.map((sub, idx) => {
                    const count = projects.filter((p) => (p.subCategory || "").toUpperCase() === (sub as string).toUpperCase()).length;
                    return (
                      <option key={idx} value={sub as string}>
                        {sub as string} ({count} Karya)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Quick Info Box */}
              <div className="p-4 bg-red-50/70 border border-[#D93829]/30 rounded-xl space-y-1.5">
                <p className="text-xs font-black uppercase text-[#D93829] flex items-center justify-between">
                  <span>Total Siap Cetak:</span>
                  <span className="bg-[#D93829] text-white px-2 py-0.5 rounded text-[10px] font-bold">{filteredProjects.length} Karya</span>
                </p>
                <p className="text-[11px] font-medium text-gray-600 leading-relaxed">
                  Layout mengadaptasi standar Studio Design Portfolio dengan cover merah kontras &amp; nomor halaman spread.
                </p>
              </div>
            </div>

            {/* Right Live Document Preview Panel */}
            <div className="lg:col-span-8 p-4 sm:p-6 bg-gray-200/80 overflow-y-auto max-h-[65vh] lg:max-h-none">
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>PREVIEW TAMPILAN KATALOG</span>
                <span className="bg-[#D93829] text-white px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md">
                  A4 STUDIO SPREAD FORMAT
                </span>
              </div>

              {/* Live Preview Paper Document */}
              <div className="bg-white text-black p-6 sm:p-8 shadow-xl font-jost space-y-10" style={{ fontFamily: "'Jost', sans-serif" }}>
                
                {/* COVER HERO SPREAD */}
                <div className="bg-[#D93829] text-white p-6 sm:p-8 rounded-xl relative overflow-hidden shadow-md">
                  
                  {/* Cover Header Bar */}
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/80 border-b border-white/20 pb-3 mb-6">
                    <span>ANDIKA CATUR ARIANTONO</span>
                    <span>DESIGN PORTFOLIO • {new Date().getFullYear()}</span>
                  </div>

                  {/* Hero Title & Profile Photo Layout Grid */}
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 my-6">
                    {/* Left: Huge Title */}
                    <div className="space-y-2">
                      <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none text-white">
                        Design<br />Portfolio
                      </h1>
                      <p className="text-xs font-bold text-white/80 uppercase tracking-widest pt-2">
                        STUDIO EDITORIAL CATALOG
                      </p>
                    </div>

                    {/* Right: Standalone Profile Photo */}
                    <div className="flex-shrink-0">
                      <img
                        src={profilePrintImg}
                        alt={devProfile?.name || "Andika Catur Ariantono"}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-white shadow-xl"
                      />
                    </div>
                  </div>

                  {/* 3-Column Info Footer in Red Cover */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-white/20 text-xs text-white/90">
                    {/* Column 1: About Me */}
                    <div className="space-y-1">
                      <p className="font-black text-white text-[11px] uppercase tracking-wider">ABOUT ME</p>
                      <p className="font-extrabold text-sm text-white">{devProfile?.name || "Andika Catur Ariantono"}</p>
                      <p className="text-[11px] text-white/90 font-medium leading-snug">
                        Universitas Esa Unggul (Jurusan Sistem Informasi)
                      </p>
                    </div>

                    {/* Column 2: Interests */}
                    <div className="space-y-1">
                      <p className="font-black text-white text-[11px] uppercase tracking-wider">INTERESTS</p>
                      <p className="text-[11px] leading-relaxed text-white/90 font-medium">
                        UI/UX Designer, Graphic Designer, Visual Designer, Game Designer
                      </p>
                    </div>

                    {/* Column 3: Contact & Location */}
                    <div className="space-y-1">
                      <p className="font-black text-white text-[11px] uppercase tracking-wider">CONTACT &amp; LOCATION</p>
                      <p className="text-[11px] text-white/90">Email: {devProfile?.email || "andikacaa@gmail.com"}</p>
                      <p className="text-[11px] text-white/90">Location: {devProfile?.location || "Jakarta, ID"}</p>
                    </div>
                  </div>
                </div>

                {/* PROJECT SPREADS LIST */}
                <div className="space-y-12 pt-2">
                  {filteredProjects.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <p className="font-bold text-xs uppercase text-gray-500">
                        Tidak ada karya ditemukan untuk kategori "{currentCategoryLabel}".
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map((item, index) => {
                      const itemNum = String(index + 1).padStart(2, "0");
                      return (
                        <div key={item.id || index} className="border-2 border-black rounded-xl overflow-hidden bg-white relative shadow-sm">
                          
                          {/* Red Header Bar */}
                          <div className="bg-[#D93829] text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black text-sm border border-white/30">
                                {itemNum}
                              </span>
                              <div>
                                <h2 className="text-lg font-black uppercase text-white leading-tight">
                                  {item.headline || item.title}
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="bg-black/40 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-white/20">
                                    {item.mainCategory}
                                  </span>
                                  {item.subCategory && (
                                    <span className="bg-white text-[#D93829] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                                      {item.subCategory}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {item.date && (
                              <span className="text-xs font-black uppercase bg-black text-white px-2.5 py-1 rounded border border-white/30">
                                YEAR: {item.date}
                              </span>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-5 bg-red-50/20 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                              
                              {/* Image Column */}
                              {(item.image || item.imageUrl) && (
                                <div className="md:col-span-6">
                                  <div className="border-2 border-black bg-white overflow-hidden shadow-xs rounded-lg">
                                    <img
                                      src={item.image || item.imageUrl}
                                      alt={item.headline || item.title}
                                      className="w-full h-auto max-h-[240px] object-cover"
                                    />
                                  </div>
                                  {item.caption && (
                                    <p className="text-[10px] font-medium italic text-gray-600 mt-1.5 border-l-2 border-[#D93829] pl-2">
                                      {item.caption}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Text Specs Column */}
                              <div className={`${(item.image || item.imageUrl) ? "md:col-span-6" : "md:col-span-12"} space-y-3`}>
                                {item.deck && (
                                  <p className="text-xs font-bold text-black leading-relaxed border-l-4 border-[#D93829] pl-3 py-1 bg-white border border-gray-200 rounded-r">
                                    {item.deck}
                                  </p>
                                )}

                                <div className="text-xs text-gray-800 space-y-1.5 leading-relaxed">
                                  {Array.isArray(item.content) ? (
                                    item.content.map((p: string, pIdx: number) => <p key={pIdx}>{p}</p>)
                                  ) : (
                                    <p>{item.content || item.fullContent}</p>
                                  )}
                                </div>

                                {/* Studio Specs */}
                                <div className="pt-3 border-t border-black/20 text-[11px] space-y-1 text-gray-900">
                                  {item.tags && (
                                    <p><span className="font-black text-black uppercase">TOOLS:</span> {Array.isArray(item.tags) ? item.tags.join(", ") : item.tags}</p>
                                  )}
                                  {item.linkUrl && (
                                    <p><span className="font-black text-[#D93829] uppercase">LINK:</span> <span className="underline text-black font-bold">{item.linkUrl}</span></p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Running Spread Footer */}
                            <div className="pt-3 border-t border-black/20 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              <span>ANDIKA CATUR ARIANTONO — PORTFOLIO</span>
                              <span>{currentCategoryLabel}</span>
                              <span>PAGE [ {itemNum} ]</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="bg-white text-gray-900 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
            <div className="text-xs font-bold text-gray-600">
              Kategori Terpilih: <span className="font-black text-black">{currentCategoryLabel}</span> ({filteredProjects.length} Karya)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handlePrint}
                disabled={filteredProjects.length === 0}
                className="px-6 py-2.5 text-xs font-black uppercase bg-[#D93829] text-white hover:bg-red-700 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Printer className="w-4 h-4 text-white" /> CETAK DOKUMEN / SAVE PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PORTALED PRINT DOCUMENT ATTACHED TO DOCUMENT.BODY FOR CLEAN PRINTING */}
      {typeof document !== "undefined" && createPortal(printableDocument, document.body)}
    </>
  );
}
