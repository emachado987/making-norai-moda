import React, { useState } from 'react';
import { Scissors, Lock, Key, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (isDemo: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const envPasscode = (import.meta as any).env?.VITE_PATRONIA_ACCESS_CODE;
    const validKeys = [
      envPasscode,
      'NORAI-PATRONIA-2026-X9',
      'PATRONIA-TALLER-PRO#2026',
      'NORAI-PATRON-88',
      'patronia2026',
      'patronia'
    ].filter(Boolean).map(k => (k as string).toLowerCase().trim());

    if (validKeys.includes(passcode.toLowerCase().trim())) {
      setError(null);
      onLoginSuccess(false); // Live Studio access
    } else {
      setError('Clave de estudio incorrecta. Verifica tus credenciales o accede directamente en Modo Demo Rápido.');
    }
  };

  const handleQuickDemo = () => {
    setError(null);
    onLoginSuccess(true); // Demo mode ($0 API cost)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Ambient Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Scissors className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
              patronia.norai.moda
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-2 font-sans">
              NØRAI • Patron<span className="text-amber-400">IA</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Plataforma de Patronaje Industrial & Fichas Técnicas IA
            </p>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmitPasscode} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Clave de Estudio / Taller
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(null);
                }}
                placeholder="Introduce tu clave de acceso..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-lg text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Acceder con Clave de Estudio</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
            o prueba sin coste
          </span>
        </div>

        {/* Quick Demo Access Button ($0 API cost) */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-slate-200 font-bold text-xs transition-all flex items-center justify-between px-4 group"
        >
          <div className="flex items-center space-x-2 text-left">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold group-hover:text-amber-300 transition-colors">
                Entrar en Modo Demo
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                100% Gratuito • $0 Gasto API Gemini
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Security Badges Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>patronia.norai.moda</span>
          </span>
          <span className="text-slate-400">v1.0 • NØRAI Tech</span>
        </div>
      </div>
    </div>
  );
};
