import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, AlertTriangle, FileCheck } from 'lucide-react';

interface QualityChecklistViewProps {
  checklist?: string[];
  garmentName: string;
}

export const QualityChecklistView: React.FC<QualityChecklistViewProps> = ({
  checklist,
  garmentName,
}) => {
  const defaultItems = [
    'Verificación de simetría de solapas, cuello y caídas delanteras en maniquí.',
    'Alineación exacta de estampados o rayas en costuras de costado y sisas.',
    'Constancia de tensión de hilo y ausencia de fruncidos en pespuntes visibles.',
    'Prueba de resistencia al desgarro en ojales y fijación de botones / broches.',
    'Inspección de márgenes de costura y acabado interno de overlock / remalle.',
    'Control de planchado final y vaporizado de formas anatómicas en hombros y pecho.',
    'Verificación de simetría de largo de manga y dobladillo inferior (±3mm máx).',
    'Revisión de fusión de entretelas sin burbujas ni delaminación térmica.',
  ];

  const items = checklist && checklist.length > 0 ? checklist : defaultItems;
  const [checkedState, setCheckedState] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    const updated = [...checkedState];
    updated[index] = !updated[index];
    setCheckedState(updated);
  };

  const completedCount = checkedState.filter(Boolean).length;
  const percent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Checklist de Control de Calidad e Inspección (AQL 2.5)
            </h3>
            <p className="text-xs text-slate-500">
              Puntos críticos de aprobación previa al empaque y despacho final
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono bg-slate-100 p-2 rounded-lg border border-slate-200">
          <span>Avance de Auditoría:</span>
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            {completedCount} / {items.length} ({percent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Checkbox List */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isDone = checkedState[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-slate-100/80'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {isDone && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
              </div>
              <div className="text-xs leading-relaxed font-medium">
                <span>{item}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
