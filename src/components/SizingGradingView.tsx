import React, { useState } from 'react';
import { SizeGradingPoint } from '../types';
import { Ruler, ShieldCheck, ChevronRight, Sliders } from 'lucide-react';

interface SizingGradingViewProps {
  gradingPoints: SizeGradingPoint[];
  garmentName: string;
}

export const SizingGradingView: React.FC<SizingGradingViewProps> = ({
  gradingPoints,
  garmentName,
}) => {
  const [selectedBaseSize, setSelectedBaseSize] = useState<string>('M / 38 EU');

  const sizeList = [
    { code: 'XS (34)', deltaMultiplier: -2 },
    { code: 'S (36)', deltaMultiplier: -1 },
    { code: 'M (38) [BASE]', deltaMultiplier: 0 },
    { code: 'L (40)', deltaMultiplier: 1 },
    { code: 'XL (42)', deltaMultiplier: 2 },
    { code: 'XXL (44)', deltaMultiplier: 3 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Tabla de Escalado y Gradación Industrial
            </h3>
            <p className="text-xs text-slate-500">
              Puntos anatómicos clave de medida con ratios de incremento por talla e inspección AQL
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-semibold px-2">Talla Base Muestra:</span>
          <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded shadow-sm">
            {selectedBaseSize}
          </span>
        </div>
      </div>

      {/* Measurement Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-100 font-mono border-b border-slate-800">
              <th className="p-3">Cód</th>
              <th className="p-3">Punto de Medida (POM)</th>
              <th className="p-3 text-center">Paso (Gradación)</th>
              <th className="p-3 text-center">Tolerancia</th>
              {sizeList.map((sz) => (
                <th
                  key={sz.code}
                  className={`p-3 text-center ${
                    sz.deltaMultiplier === 0 ? 'bg-amber-500 text-slate-950 font-bold' : ''
                  }`}
                >
                  {sz.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-sans">
            {gradingPoints.map((point, idx) => {
              return (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-amber-700 bg-amber-50/40">
                    {point.code || `M-${idx + 1}`}
                  </td>
                  <td className="p-3 font-bold text-slate-900">{point.measurementName}</td>
                  <td className="p-3 text-center font-mono text-sky-700 font-semibold">
                    {point.gradingStepCm > 0 ? `+${point.gradingStepCm}` : point.gradingStepCm} cm
                  </td>
                  <td className="p-3 text-center font-mono text-rose-700 bg-rose-50/50">
                    ±{point.toleranceMm} mm
                  </td>

                  {/* Calculated Sizing Values across size list */}
                  {sizeList.map((sz) => {
                    const calcVal = point.baseSizeValueCm + sz.deltaMultiplier * point.gradingStepCm;
                    const isBase = sz.deltaMultiplier === 0;
                    return (
                      <td
                        key={sz.code}
                        className={`p-3 text-center font-mono font-semibold ${
                          isBase ? 'bg-amber-50/80 text-slate-950 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {calcVal.toFixed(1)} cm
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Norma ISO 8559-2 para Designación de Tallas Textiles:</span>
        </div>
        <p className="leading-relaxed">
          Las medidas indicadas corresponden a la prenda terminada en plano (garment specs), incluyendo holgura de confort (ease) según el tipo de tejido. Verifique las tolerancias de encogimiento después del lavado en seco o lavandería industrial.
        </p>
      </div>
    </div>
  );
};
