import React from 'react';
import { Scissors, Ruler, Layers, Sparkles, FileText, LogOut, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasAnalysis: boolean;
  isDemoMode?: boolean;
  onToggleDemoMode?: (isDemo: boolean) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasAnalysis,
  isDemoMode,
  onToggleDemoMode,
  onLogout
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Scissors className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-100 font-sans">
                NØRAI • Patron<span className="text-amber-400">IA</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20 font-semibold">
                patronia.norai.moda
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Análisis Técnico de Visión por Computador e Ingeniería de Confección Textil
            </p>
          </div>
        </div>

        {/* Action Badges & Navigation */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60 font-mono">
            <div className="flex items-center space-x-1">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>Norma ISO 4915</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Despiece Vectorial</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>AQL 2.5 Tech Pack</span>
            </div>
          </div>

          {hasAnalysis && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs transition-all shadow-sm font-sans"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nueva Prenda</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-medium text-xs transition-all border border-slate-700"
              title="Salir de la sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
