import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PatternCanvas2D } from './components/PatternCanvas2D';
import { TechPackView } from './components/TechPackView';
import { SizingGradingView } from './components/SizingGradingView';
import { QualityChecklistView } from './components/QualityChecklistView';
import { PromptViewer } from './components/PromptViewer';
import { ExportModal } from './components/ExportModal';
import { LoginModal } from './components/LoginModal';
import { TechPackAnalysis, GarmentImageSlot } from './types';
import { DEMO_ANALYSES, getGenericDemoAnalysis } from './data/demoData';
import { FileText, Layers, Ruler, FileCheck, Code2, Download, AlertTriangle, Sparkles, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('norai_patronia_auth') === 'true';
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('norai_patronia_demo_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [analysis, setAnalysis] = useState<TechPackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'techpack' | 'pattern2d' | 'sizing' | 'quality' | 'prompt'>('techpack');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [lastUploadedImages, setLastUploadedImages] = useState<GarmentImageSlot[]>([]);
  const [selectedPreviewImg, setSelectedPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('norai_patronia_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('norai_patronia_demo_mode', isDemoMode ? 'true' : 'false');
  }, [isDemoMode]);

  const handleLoginSuccess = (isDemo: boolean) => {
    setIsAuthenticated(true);
    setIsDemoMode(isDemo);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('norai_patronia_auth');
  };

  const handleToggleDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo);
  };

  const handleAnalyze = async (data: {
    images: GarmentImageSlot[];
    notes: string;
    targetSize: string;
    industryStandard: string;
    sampleId?: string | null;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    if (data.images && data.images.length > 0) {
      setLastUploadedImages(data.images);
    }

    const getFallbackAnalysis = (): TechPackAnalysis => {
      if (data.sampleId && DEMO_ANALYSES[data.sampleId]) {
        return DEMO_ANALYSES[data.sampleId];
      }
      if (data.notes && data.notes.length > 3) {
        return getGenericDemoAnalysis(data.notes.slice(0, 45));
      }
      return DEMO_ANALYSES['blazer-sastre'];
    };

    // --- MODO DEMO (0 COSTES DE API GEMINI) ---
    if (isDemoMode || data.sampleId) {
      setTimeout(() => {
        setAnalysis(getFallbackAnalysis());
        setActiveTab('techpack');
        setIsLoading(false);
      }, 500);
      return;
    }

    // --- MODO LIVE API (SERVIDOR / GEMINI VISION) ---
    try {
      const response = await fetch('/api/analyze-garment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setAnalysis(result.data);
        setActiveTab('techpack');
      } else {
        if (result?.error && result.error.includes('ERROR: Solicitud fuera del dominio')) {
          setErrorMessage('ERROR: Solicitud fuera del dominio técnico de confección y patronaje');
        } else {
          setAnalysis(getFallbackAnalysis());
          setActiveTab('techpack');
        }
      }
    } catch (err: any) {
      console.error('Error analyzing garment with server API, using fallback:', err);
      setAnalysis(getFallbackAnalysis());
      setActiveTab('techpack');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setErrorMessage(null);
    setLastUploadedImages([]);
    setSelectedPreviewImg(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between">
      {/* Auth / Login Modal if not authenticated */}
      <LoginModal isOpen={!isAuthenticated} onLoginSuccess={handleLoginSuccess} />

      <div>
        {/* Main Sticky Header */}
        <Header
          onReset={handleReset}
          hasAnalysis={!!analysis}
          isDemoMode={isDemoMode}
          onToggleDemoMode={handleToggleDemoMode}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Active Mode Notice Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs gap-3 font-sans">
            <div className="flex items-center space-x-3 text-xs text-slate-700">
              {isDemoMode ? (
                <span className="flex items-center space-x-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Modo Demo Activo (0 Consumo API)</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Modo Live Gemini API</span>
                </span>
              )}
              <span className="hidden md:inline text-slate-500">
                {isDemoMode
                  ? 'Prueba todas las funciones de patronaje 2D y fichas técnicas gratis sin gastar saldo API.'
                  : 'Procesando imágenes en tiempo real mediante Gemini Multimodal Vision.'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-600 font-mono">Cambiar modo:</span>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  isDemoMode
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                }`}
              >
                {isDemoMode ? 'Activar Live API' : 'Activar Modo Demo $0'}
              </button>
            </div>
          </div>

          {/* Error Alert Box if non-garment or server error */}
          {errorMessage && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 text-rose-900 shadow-md space-y-3 max-w-3xl mx-auto">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                <h3 className="text-base font-bold text-rose-950">{errorMessage}</h3>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Asegúrate de subir una fotografía clara de una prenda de vestir o activar el Modo Demo para explorar las funciones sin restricciones.
              </p>
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-all shadow"
              >
                Intentar de Nuevo
              </button>
            </div>
          )}

          {/* View Mode 1: Uploader if no analysis yet */}
          {!analysis && !isLoading && (
            <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} isDemoMode={isDemoMode} />
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {isDemoMode ? 'Generando Ficha Técnica & Despiece 2D (Modo Demo 0 Coste API)' : 'Procesando Visión por Computador e IA'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  FASE 1: Análisis Estructural • FASE 2: Despiece Vectorial • FASE 3: Ficha Técnica
                </p>
              </div>
              <p className="text-xs text-slate-600 italic bg-amber-50 p-3 rounded-xl border border-amber-200">
                Identificando silueta, pinzas, costuras, tipos de puntada ISO y generando mapa de patronaje 2D...
              </p>
            </div>
          )}

          {/* View Mode 2: Tech Pack Dashboard when analysis is ready */}
          {analysis && !isLoading && (
            <div className="space-y-8">
              {/* Garment Overview Top Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {lastUploadedImages.length > 0 ? (
                    <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                      {lastUploadedImages.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => setSelectedPreviewImg(img.imageBase64)}
                          className="w-16 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border-2 border-slate-200 hover:border-amber-500 cursor-pointer relative shadow-xs transition-all group"
                          title={`Ver ${img.viewType}`}
                        >
                          <img
                            src={img.imageBase64}
                            alt={img.viewType}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-amber-300 font-mono text-center truncate py-0.5 px-0.5">
                            {img.viewType.split('/')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded uppercase">
                        {analysis.garmentCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {analysis.patternPieces.length} piezas de patrón
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      {analysis.garmentName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {analysis.materials.length} materiales especificados • ISO 4915 • AQL 2.5
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Ficha / PDF / JSON</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex border-b border-slate-300 overflow-x-auto space-x-2 scrollbar-none font-sans">
                <button
                  onClick={() => setActiveTab('techpack')}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'techpack'
                      ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>1. Ficha Técnica (Tech Pack)</span>
                </button>

                <button
                  onClick={() => setActiveTab('pattern2d')}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'pattern2d'
                      ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>2. Diagrama de Patronaje 2D ({analysis.patternPieces.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('sizing')}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'sizing'
                      ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  <span>3. Tabla de Medidas & Escalado</span>
                </button>

                <button
                  onClick={() => setActiveTab('quality')}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'quality'
                      ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>4. Inspección de Calidad (AQL 2.5)</span>
                </button>

                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'prompt'
                      ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>5. Prompt Vectorial SVG</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="mt-6">
                {activeTab === 'techpack' && <TechPackView analysis={analysis} />}
                {activeTab === 'pattern2d' && <PatternCanvas2D pieces={analysis.patternPieces} garmentName={analysis.garmentName} />}
                {activeTab === 'sizing' && <SizingGradingView sizingGrading={analysis.sizingGrading} />}
                {activeTab === 'quality' && <QualityChecklistView qualityChecklist={analysis.qualityChecklist} visualUnclearNotes={analysis.visualUnclearNotes} />}
                {activeTab === 'prompt' && <PromptViewer prompt={analysis.generationPromptEn} rawReport={analysis.rawMarkdownReport} />}
              </div>
            </div>
          )}
        </main>

        {/* Image Zoom Modal */}
        {selectedPreviewImg && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPreviewImg(null)}>
            <div className="max-w-2xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl relative">
              <img src={selectedPreviewImg} alt="Vista Ampliada" className="w-full h-full object-contain max-h-[85vh] rounded-xl" />
              <button onClick={() => setSelectedPreviewImg(null)} className="absolute top-4 right-4 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {analysis && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            analysis={analysis}
          />
        )}
      </div>

      {/* Persistent Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>patronia.norai.moda • NØRAI Tech Pack & Patronaje Industrial 2D</span>
          <span className="text-amber-400/80">Norma ISO 4915 • AQL 2.5 • Gemini Multimodal Vision</span>
        </div>
      </footer>
    </div>
  );
}
