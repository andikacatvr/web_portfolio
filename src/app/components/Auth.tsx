import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Chrome } from "lucide-react";

interface AuthProps {
  initialMode: "login" | "register";
  onSwitch: (mode: "login" | "register") => void;
  onSuccess: () => void;
}

export function Auth({ initialMode, onSwitch, onSuccess }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const handleSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    onSwitch(newMode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md mx-auto px-6 py-12">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-black tracking-tighter uppercase"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          The Vibey Sunday Media
        </h1>
        <div className="h-px w-full bg-black/10 mt-2" />
      </div>

      <div className="w-full bg-white p-0">
        <h2 
          className="text-2xl font-black mb-6 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
        </h2>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-wider text-black/50">Nama Lengkap</Label>
              <Input 
                id="name" 
                placeholder="Nama Lengkap Anda" 
                className="rounded-none border-black/20 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-12" 
                required 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-wider text-black/50">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="email@contoh.com" 
              className="rounded-none border-black/20 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-12" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-wider text-black/50">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="rounded-none border-black/20 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-12" 
              required 
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-wider text-black/50">Konfirmasi Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                className="rounded-none border-black/20 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-12" 
                required 
              />
            </div>
          )}

          {mode === "login" ? (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded-none border-black/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                <Label htmlFor="remember" className="text-xs text-black/60 cursor-pointer">Ingat saya</Label>
              </div>
              <button type="button" className="text-xs text-blue-600 font-bold hover:underline">Lupa Password?</button>
            </div>
          ) : (
            <div className="flex items-start space-x-2 py-2">
              <Checkbox id="terms" className="rounded-none border-black/30 mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" required />
              <Label htmlFor="terms" className="text-xs text-black/60 leading-tight cursor-pointer">
                Saya menyetujui <span className="text-blue-600 font-bold">Syarat & Ketentuan</span> dan <span className="text-blue-600 font-bold">Kebijakan Privasi</span>.
              </Label>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-black/90 text-white rounded-none h-12 uppercase font-black tracking-widest text-[11px] mt-2 transition-colors active:bg-blue-900"
          >
            {mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/10"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-black/40 font-bold tracking-widest">Atau</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-black/20 rounded-none h-12 text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Chrome size={18} className="text-blue-600" />
          {mode === "login" ? "Masuk dengan Google" : "Daftar dengan Google"}
        </Button>

        <div className="mt-8 text-center">
          <p className="text-sm text-black/60">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button onClick={() => handleSwitch("register")} className="text-blue-600 font-black hover:underline">
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button onClick={() => handleSwitch("login")} className="text-blue-600 font-black hover:underline">
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
