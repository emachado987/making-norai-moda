import React, { useState } from 'react';
import { TechPackAnalysis } from '../types';
import { FileText, Copy, Check, Scissors, AlertCircle, Clock, Package, Wrench, Layers } from 'lucide-react';

interface TechPackViewProps {
  analysis: TechPackAnalysis;
}

export const TechPackView: React.FC<TechPackViewProps> = ({ analysis }) => {
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'structured' | 'markdown'>('structured');

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(analysis.rawMarkdownReport);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const totalAssemblyTime = analysis.assemblySequence.reduce(
    (acc, item) => acc + (item.timeMinutesEstimate || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('structured')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'structured'
                ? 'bg-slate-900 text-amber-400 shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Vista Estructurada Industrial
          </button>
          <button
            onClick={() => setActiveSubTab('markdown')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'markdown'
                ? 'bg-slate-900 text-amber-400 shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ficha Técnica Texto (Markdown)
          </button>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          {copiedMarkdown ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado al portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Ficha Técnica Completa</span>
            </>
          )}
        </button>
      </div>

      {/* Unclear Visual Warning Notice if any */}
      {analysis.visualUnclearNotes && analysis.visualUnclearNotes.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Confirmaciones Visuales Pendientes / Estándares Aplicados:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-800">
            {analysis.visualUnclearNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {activeSubTab === 'structured' ? (
        <div className="space-y-8">
          {/* Garment Identification Header Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  {analysis.garmentCategory}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-100 mt-2">
                  {analysis.garmentName}
                </h2>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                <p>Tiempo de Ensamblaje Est.: <strong className="text-amber-400">{totalAssemblyTime || 28} min</strong></p>
                <p>Piezas de Patrón: <strong className="text-sky-400">{analysis.patternPieces.length} piezas</strong></p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                Descripción Analítica de Construcción
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {analysis.generalDescription}
              </p>
            </div>
          </div>

          {/* Section 1: Materiales Sugeridos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Materiales Sugeridos e Insumos</h3>
                <p className="text-xs text-slate-500">Especificaciones de tejido, entretelas y mercería</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-mono font-bold border-b border-slate-200">
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Insumo / Nombre</th>
                    <th className="p-3">Especificación Técnica</th>
                    <th className="p-3">Consumo Aprox.</th>
                    <th className="p-3">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {analysis.materials.map((mat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                        {mat.category}
                      </td>
                      <td className="p-3 font-bold">{mat.name}</td>
                      <td className="p-3 text-slate-600">{mat.specification}</td>
                      <td className="p-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {mat.estimatedConsumption} {mat.unit}
                      </td>
                      <td className="p-3 text-slate-500 italic">{mat.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Desglose de Confección y Secuencia de Ensamblaje */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-100 text-sky-800 rounded-lg flex items-center justify-center font-bold">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    2. Desglose de Confección y Secuencia de Ensamblaje
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ruta operativa de taller y norma ISO de puntada por máquina
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-mono bg-sky-50 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo Total: {totalAssemblyTime || 28} min</span>
              </div>
            </div>

            <div className="space-y-3">
              {analysis.assemblySequence.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs gap-3 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{step.operation}</p>
                      {step.criticalQualityNote && (
                        <p className="text-amber-800 mt-1 font-medium text-[11px] bg-amber-100/60 px-2 py-0.5 rounded inline-block">
                          ★ Nota Crítica: {step.criticalQualityNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 font-mono text-[11px] self-end sm:self-center shrink-0">
                    <span className="bg-slate-200 text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-semibold">
                      {step.machineryStitch}
                    </span>
                    {step.timeMinutesEstimate && (
                      <span className="text-slate-500 font-bold">{step.timeMinutesEstimate} min</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Detalles Constructivos Críticos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">3. Detalles Constructivos Críticos</h3>
                <p className="text-xs text-slate-500">
                  Márgenes de costura obligatorios, remalles y acabados de dobladillo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.constructionDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-900 text-sm">{detail.element}</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {detail.recommendedMarginCm} cm ({detail.recommendedMarginCm * 10} mm)
                    </span>
                  </div>
                  <p className="text-slate-700">{detail.specification}</p>
                  <div className="pt-1 flex flex-wrap gap-1 font-mono text-[10px]">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      Puntada: {detail.stitchType}
                    </span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      Acabado: {detail.finishType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Markdown Raw Text Display */
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 font-mono text-xs border border-slate-800 shadow-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {analysis.rawMarkdownReport}
        </div>
      )}
    </div>
  );
};
