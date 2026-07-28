import React, { useState } from 'react';
import { Copy, Check, Sparkles, Code2, ExternalLink } from 'lucide-react';

interface PromptViewerProps {
  promptEn: string;
}

export const PromptViewer: React.FC<PromptViewerProps> = ({ promptEn }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptEn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Prompt Técnico de Generación Visual / Diagrama 2D
            </h3>
            <p className="text-xs text-slate-400">
              Especificación en inglés optimizada para generadores vectoriales y CAD
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>¡Prompt Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Prompt para CAD / Midjourney</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
        {promptEn}
      </div>

      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Utilización del Prompt Técnico:</span>
        </div>
        <p className="leading-relaxed">
          Este prompt describe de manera geométrica y vectorial el despiece plano 2D de la prenda sobre fondo blanco limpio, especificando líneas de corte, márgenes de costura discontinuos, flechas de hilo y etiquetas de piezas en inglés técnico.
        </p>
      </div>
    </div>
  );
};
