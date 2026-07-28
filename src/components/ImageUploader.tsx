import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, Sparkles, Plus, Trash2, Image as ImageIcon, HelpCircle, ArrowRight, Layers, Eye } from 'lucide-react';
import { SampleGarment, GarmentImageSlot } from '../types';
import { SAMPLE_GARMENTS } from '../data/samples';

interface ImageUploaderProps {
  onAnalyze: (data: {
    images: GarmentImageSlot[];
    notes: string;
    targetSize: string;
    industryStandard: string;
  }) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [imageSlots, setImageSlots] = useState<GarmentImageSlot[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [targetSize, setTargetSize] = useState<string>('M / 38 EU');
  const [industryStandard, setIndustryStandard] = useState<string>('EU / España (Centímetros)');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addSpecificViewRef = useRef<HTMLInputElement>(null);
  const [pendingViewType, setPendingViewType] = useState<GarmentImageSlot['viewType']>('Posterior / Espalda');

  const handleFiles = (files: FileList | File[], defaultView?: GarmentImageSlot['viewType']) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      alert('Por favor selecciona archivos de imagen válidos (JPG, PNG, WEBP).');
      return;
    }

    const viewOptions: Array<GarmentImageSlot['viewType']> = [
      'Delantero / Principal',
      'Posterior / Espalda',
      'Detalle / Interior',
      'Lateral / Otro',
    ];

    validImageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Str = event.target.result as string;

          // Determine appropriate view type label automatically if not passed
          let assignedView: GarmentImageSlot['viewType'] = defaultView || 'Delantero / Principal';
          if (!defaultView) {
            const existingCount = imageSlots.length + index;
            if (existingCount === 0) assignedView = 'Delantero / Principal';
            else if (existingCount === 1) assignedView = 'Posterior / Espalda';
            else if (existingCount === 2) assignedView = 'Detalle / Interior';
            else assignedView = 'Lateral / Otro';
          }

          const newSlot: GarmentImageSlot = {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            imageBase64: base64Str,
            mimeType: file.type || 'image/jpeg',
            viewType: assignedView,
          };

          setImageSlots((prev) => [...prev, newSlot]);
          setSelectedSampleId(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleAddSpecificViewClick = (viewType: GarmentImageSlot['viewType']) => {
    setPendingViewType(viewType);
    if (addSpecificViewRef.current) {
      addSpecificViewRef.current.value = '';
      addSpecificViewRef.current.click();
    }
  };

  const handleSpecificViewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files, pendingViewType);
    }
  };

  const handleRemoveSlot = (id: string) => {
    setImageSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleUpdateViewType = (id: string, newViewType: GarmentImageSlot['viewType']) => {
    setImageSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, viewType: newViewType } : slot))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSelectSample = async (sample: SampleGarment) => {
    setSelectedSampleId(sample.id);
    setNotes(sample.suggestedNotes);

    try {
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        const newSlot: GarmentImageSlot = {
          id: `sample-${sample.id}`,
          imageBase64: base64Str,
          mimeType: blob.type || 'image/jpeg',
          viewType: 'Delantero / Principal',
        };
        setImageSlots([newSlot]);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Error loading sample image:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageSlots.length === 0 && !notes.trim()) {
      alert('Debes proporcionar al menos una foto de la prenda o escribir notas técnicas.');
      return;
    }
    onAnalyze({
      images: imageSlots,
      notes,
      targetSize,
      industryStandard,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Hidden file input for specific views */}
      <input
        type="file"
        ref={addSpecificViewRef}
        onChange={handleSpecificViewFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs px-3 py-1 rounded-full font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor de Análisis de Visión Multivista & Confección Industrial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generador de Fichas Técnicas Multivista (Delantero + Posterior / Espalda)
          </h2>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Puedes subir <strong className="text-amber-400">múltiples fotografías de la prenda</strong> (vista frontal, vista de espalda/posterior, forros o detalles de costuras). La IA analizará todas las perspectivas simultáneamente para garantizar la precisión del trazado del patrón plano 2D.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Slots & Upload Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-800 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>1. Vistas Fotografías de la Prenda ({imageSlots.length} cargadas)</span>
            </label>
            {imageSlots.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setImageSlots([]);
                  setSelectedSampleId(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                Vaciar todas las fotos
              </button>
            )}
          </div>

          {/* Uploaded Images Gallery Cards */}
          {imageSlots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {imageSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-amber-400 transition-all"
                >
                  <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={slot.imageBase64}
                      alt={slot.viewType}
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-lg transition-colors shadow"
                      title="Eliminar esta vista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow uppercase">
                      {slot.viewType.split('/')[0]}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                      Etiqueta de Perspectiva:
                    </label>
                    <select
                      value={slot.viewType}
                      onChange={(e) =>
                        handleUpdateViewType(
                          slot.id,
                          e.target.value as GarmentImageSlot['viewType']
                        )
                      }
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option value="Delantero / Principal">Delantero / Frontal</option>
                      <option value="Posterior / Espalda">Posterior / Espalda</option>
                      <option value="Detalle / Interior">Detalle / Interior / Forro</option>
                      <option value="Lateral / Otro">Lateral / Perfil</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center ${
              isDragOver
                ? 'border-amber-500 bg-amber-50/50'
                : imageSlots.length > 0
                ? 'border-slate-300 bg-white hover:border-amber-500 py-4'
                : 'border-slate-300 hover:border-amber-500 bg-white hover:bg-slate-50/80 shadow-sm min-h-[220px]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="space-y-3 max-w-sm">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {imageSlots.length > 0
                    ? 'Haz clic o arrastra para añadir más fotos (ej. Espalda, Detalle)'
                    : 'Sube la foto frontal y opcionalmente vista posterior (espalda)'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Admite múltiples fotos en JPG, PNG, WEBP (maniquí, modelo o percha)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Add View Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 font-mono w-full block">
              Sugerencias de vistas para el patrón:
            </span>
            <button
              type="button"
              onClick={() => handleAddSpecificViewClick('Delantero / Principal')}
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Vista Delantera</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddSpecificViewClick('Posterior / Espalda')}
              className="flex items-center space-x-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Vista Posterior (Espalda)</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddSpecificViewClick('Detalle / Interior')}
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Detalle / Interior / Forro</span>
            </button>
          </div>

          {/* Sample Presets Selection */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono block">
              O elige un modelo de fábrica de ejemplo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_GARMENTS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-full h-16 rounded overflow-hidden mb-1.5 bg-slate-100">
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 truncate">{sample.title}</p>
                      <p className="text-[10px] text-slate-500">{sample.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Specification Notes & Parameters */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* User Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>2. Especificaciones y Notas del Cliente (Opcional)</span>
                </span>
                <span className="text-xs text-slate-400 font-normal">Palabras clave / Observaciones</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Ejemplo: Deseo lana fría 250g, con hombreras sastre de 1cm, forro completo en viscosa, cremallera metálica en espalda, dobladillo invisible de 3cm..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-800 bg-white shadow-sm resize-none"
              />
            </div>

            {/* Sizing & Standard Config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                  TALLA BASE DE PATRÓN
                </label>
                <select
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="S / 36 EU">S / 36 EU (Pecho 86-88cm)</option>
                  <option value="M / 38 EU">M / 38 EU (Pecho 90-92cm) [Estándar]</option>
                  <option value="L / 40 EU">L / 40 EU (Pecho 94-96cm)</option>
                  <option value="XL / 42 EU">XL / 42 EU (Pecho 98-102cm)</option>
                  <option value="Talla 44 EU">Talla 44 EU</option>
                  <option value="Talla Personalizada">Talla Muestra de Prototipo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                  NORMATIVA DE MEDIDAS
                </label>
                <select
                  value={industryStandard}
                  onChange={(e) => setIndustryStandard(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="EU / España (Centímetros)">EU / España (ISO 8559 - cm)</option>
                  <option value="US / América (Pulgadas / Inches)">US / ASTM (Inches)</option>
                  <option value="UK / Gran Bretaña">UK Standard (cm)</option>
                  <option value="JP / Asia">Asia / Japan Standard</option>
                </select>
              </div>
            </div>

            {/* ISO Quality Standards Notice */}
            <div className="flex items-start space-x-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                El análisis multivista detectará con exactitud tanto la parte delantera (sisa, escote, solapas) como la espalda (canesú, pinzas posteriores, abertura central) para despiezar el patrón en 2D con los márgenes de costura exactos.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (imageSlots.length === 0 && !notes.trim())}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2 ${
              isLoading || (imageSlots.length === 0 && !notes.trim())
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Procesando Visión Textil ({imageSlots.length} vistas)...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  Analizar Prenda ({imageSlots.length} {imageSlots.length === 1 ? 'vista' : 'vistas'}) y Generar Tech Pack
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
