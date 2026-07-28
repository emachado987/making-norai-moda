import React, { useState } from 'react';
import { PatternPiece } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Layers, Grid, Scissors, Info, Sparkles, Check, ChevronRight } from 'lucide-react';

interface PatternCanvas2DProps {
  pieces: PatternPiece[];
  garmentName: string;
}

export const PatternCanvas2D: React.FC<PatternCanvas2DProps> = ({ pieces, garmentName }) => {
  const [selectedPiece, setSelectedPiece] = useState<PatternPiece | null>(pieces[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSeamAllowance, setShowSeamAllowance] = useState<boolean>(true);
  const [fabricFilter, setFabricFilter] = useState<string>('Todos');

  const fabrics = ['Todos', ...Array.from(new Set(pieces.map((p) => p.fabricType)))];

  const filteredPieces = fabricFilter === 'Todos'
    ? pieces
    : pieces.filter((p) => p.fabricType === fabricFilter);

  // Fallback default vector path if piece doesn't have an explicit d path
  const getDefaultSvgPath = (piece: PatternPiece, index: number) => {
    if (piece.svgPath && piece.svgPath.length > 5) {
      return piece.svgPath;
    }
    const nameLower = piece.name.toLowerCase();
    if (nameLower.includes('delantero') || nameLower.includes('front')) {
      return "M 20 20 L 140 20 L 160 50 L 160 220 L 20 220 Z";
    }
    if (nameLower.includes('trasero') || nameLower.includes('back')) {
      return "M 20 20 L 130 20 L 150 50 L 150 220 L 20 220 Z";
    }
    if (nameLower.includes('manga') || nameLower.includes('sleeve')) {
      return "M 40 20 Q 90 0 140 20 L 160 180 L 20 180 Z";
    }
    if (nameLower.includes('cuello') || nameLower.includes('collar')) {
      return "M 20 30 L 160 30 L 150 70 L 30 70 Z";
    }
    if (nameLower.includes('pretina') || nameLower.includes('waistband')) {
      return "M 10 30 L 170 30 L 170 80 L 10 80 Z";
    }
    return "M 20 20 L 150 20 L 150 180 L 20 180 Z";
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Mapa de Patronaje Plano Vectorial (Despiece 2D)
            </h3>
            <p className="text-xs text-slate-400">
              {filteredPieces.length} piezas listas para marcado y tizado industrial
            </p>
          </div>
        </div>

        {/* Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Fabric Type Selector */}
          <div className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-mono">Tejido:</span>
            <select
              value={fabricFilter}
              onChange={(e) => setFabricFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold outline-none cursor-pointer"
            >
              {fabrics.map((fab) => (
                <option key={fab} value={fab} className="bg-slate-900 text-slate-100">
                  {fab}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Seam Allowance */}
          <button
            onClick={() => setShowSeamAllowance(!showSeamAllowance)}
            className={`px-2.5 py-1.5 rounded-lg font-medium border transition-all ${
              showSeamAllowance
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Margen Costura ({showSeamAllowance ? 'ON' : 'OFF'})
          </button>

          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border transition-all ${
              showGrid
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Alternar Rejilla de Medición"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-700 rounded"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-amber-400 px-1 font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-700 rounded"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded"
              title="Restablecer vista"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Vector Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-inner relative overflow-hidden min-h-[500px]">
          {/* Subtle Grid overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-transform origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {filteredPieces.map((piece, idx) => {
              const isSelected = selectedPiece?.id === piece.id;
              const dPath = getDefaultSvgPath(piece, idx);

              return (
                <div
                  key={piece.id || idx}
                  onClick={() => setSelectedPiece(piece)}
                  className={`bg-slate-900/90 rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02] relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Piece Header Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {piece.code || `P-${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                      Corte x{piece.cutsCount}
                    </span>
                  </div>

                  {/* SVG Rendered Piece Vector */}
                  <div className="w-full h-44 my-2 flex items-center justify-center p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 relative">
                    <svg
                      viewBox={piece.viewBox || "0 0 180 240"}
                      className="w-full h-full max-h-40 text-amber-400"
                    >
                      {/* Seam allowance outer boundary if enabled */}
                      {showSeamAllowance && (
                        <path
                          d={dPath}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.5"
                          transform="scale(1.06) translate(-5, -5)"
                        />
                      )}

                      {/* Main Pattern Cut Contour */}
                      <path
                        d={dPath}
                        fill="rgba(245, 158, 11, 0.12)"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />

                      {/* Grainline Arrow (Hilo de la Tela) */}
                      <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.8">
                        <line x1="90" y1="40" x2="90" y2="180" strokeDasharray="3 3" />
                        <polygon points="90,35 86,45 94,45" fill="#38bdf8" />
                        <polygon points="90,185 86,175 94,175" fill="#38bdf8" />
                      </g>

                      {/* Grainline Label */}
                      <text x="96" y="110" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                        HILO
                      </text>

                      {/* Notch markers (Piquetes) */}
                      <line x1="20" y1="120" x2="28" y2="120" stroke="#e11d48" strokeWidth="2" />
                      <line x1="150" y1="120" x2="142" y2="120" stroke="#e11d48" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Bottom Piece Label */}
                  <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-slate-100 truncate">{piece.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {piece.fabricType} • Margen {piece.seamAllowanceMm / 10 || 1.0} cm
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Piece Detail Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 flex flex-col justify-between">
          {selectedPiece ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 font-bold">
                    CÓDIGO: {selectedPiece.code}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded">
                    {selectedPiece.fabricType}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-100 mt-2">{selectedPiece.name}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ficha Técnica de Despiece para Corte Industrial
                </p>
              </div>

              {/* Spec Cards */}
              <div className="space-y-3 font-sans text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Cantidad de Cortes:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    {selectedPiece.cutsCount}x {selectedPiece.hasSymmetry ? '(1 Par / Izq + Der)' : '(Corte Único)'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Orientación Hilo:</span>
                  <span className="font-semibold text-sky-400 font-mono">
                    {selectedPiece.grainline}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Margen Costura:</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {selectedPiece.seamAllowanceMm} mm ({selectedPiece.seamAllowanceMm / 10} cm)
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Simetría / Lomo:</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {selectedPiece.hasSymmetry ? 'Corte doble simétrico' : 'Al lomo / Doblez'}
                  </span>
                </div>

                {selectedPiece.notes && (
                  <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl text-amber-200 space-y-1">
                    <p className="font-bold text-[11px] uppercase tracking-wider font-mono text-amber-400">
                      Observación Técnica de Ensamblaje:
                    </p>
                    <p className="text-xs leading-relaxed">{selectedPiece.notes}</p>
                  </div>
                )}
              </div>

              {/* Cutting instructions bullet points */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Indicaciones para Tizado y Mesado:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                  <li>Verificar aplomos de piquetes en sisa y costado antes de cortar.</li>
                  <li>Asegurar tensión constante de urdimbre alineada con la flecha de hilo.</li>
                  <li>Si aplica entretela fusionable, cortar con 2mm adicionales de margen.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Scissors className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Selecciona una pieza del mapa 2D para ver sus especificaciones técnicas de corte.</p>
            </div>
          )}

          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Prenda: {garmentName.substring(0, 24)}...</span>
            <span className="text-amber-400">Vector SVG 2D</span>
          </div>
        </div>
      </div>
    </div>
  );
};
