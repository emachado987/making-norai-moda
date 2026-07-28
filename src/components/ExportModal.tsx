import React from 'react';
import { TechPackAnalysis } from '../types';
import { Printer, Download, FileJson, FileText, X, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  analysis: TechPackAnalysis;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ analysis, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `TechPack_${analysis.garmentName.replace(/\s+/g, '_')}_AQL25.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(analysis.rawMarkdownReport);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Ficha_Tecnica_${analysis.garmentName.replace(/\s+/g, '_')}.md`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-slate-200 pb-4">
          <h3 className="text-xl font-bold text-slate-900">Exportar Ficha Técnica y Patronaje</h3>
          <p className="text-xs text-slate-500">
            Descarga la documentación técnica para producción de taller o integración ERP/PLM
          </p>
        </div>

        <div className="space-y-3">
          {/* Printable Report */}
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-amber-800">
                  Imprimir / Exportar a PDF
                </p>
                <p className="text-xs text-slate-500">Formato A4 optimizado para taller de confección</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
          </button>

          {/* JSON Export */}
          <button
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-100 text-sky-800 rounded-lg flex items-center justify-center font-bold">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-sky-800">
                  Descargar Ficha en Formato JSON
                </p>
                <p className="text-xs text-slate-500">Compatible con Lectra, Gerber, Optitex y sistemas ERP</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
          </button>

          {/* Markdown Export */}
          <button
            onClick={handleDownloadMarkdown}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-800">
                  Descargar Documento Markdown (.md)
                </p>
                <p className="text-xs text-slate-500">Texto estructurado completo con tablas e instrucciones</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
