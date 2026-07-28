export interface PatternPiece {
  id: string;
  name: string;
  code: string;
  cutsCount: number; // e.g. 2x (1 par / 1 izq + 1 der)
  fabricType: 'Principal' | 'Forro' | 'Entretela' | 'Combinación' | string;
  notes?: string;
  grainline: 'Hilo' | 'A contrahílo' | 'Bies' | string;
  hasSymmetry: boolean;
  notchesCount?: number;
  seamAllowanceMm: number;
  svgPath?: string; // Path d attribute for vector diagram rendering
  viewBox?: string;
  dimensions?: { widthCm: number; heightCm: number };
}

export interface MaterialItem {
  category: 'Tejido Principal' | 'Forros y Entretelas' | 'Fornituras y Mercería';
  name: string;
  specification: string;
  estimatedConsumption: string;
  unit: string;
  notes?: string;
}

export interface AssemblyStep {
  stepNumber: number;
  operation: string;
  machineryStitch: string; // e.g. "Remalladora 4 hilos (Stitch 514)", "Plana 1 aguja (Stitch 301)"
  timeMinutesEstimate?: number;
  criticalQualityNote?: string;
}

export interface SizeGradingPoint {
  measurementName: string;
  code: string;
  baseSizeValueCm: number; // e.g. Size M or 38
  gradingStepCm: number; // Increment per size
  toleranceMm: number;
}

export interface ConstructionDetail {
  element: string;
  specification: string;
  recommendedMarginCm: number;
  stitchType: string;
  finishType: string;
}

export interface TechPackAnalysis {
  isGarmentDomain: boolean;
  errorMessage?: string;
  garmentName: string;
  garmentCategory: string;
  generalDescription: string;
  materials: MaterialItem[];
  assemblySequence: AssemblyStep[];
  constructionDetails: ConstructionDetail[];
  patternPieces: PatternPiece[];
  sizingGrading: SizeGradingPoint[];
  generationPromptEn: string;
  rawMarkdownReport: string;
  visualUnclearNotes?: string[];
  qualityChecklist?: string[];
  suggestedFabricWeightGsm?: number;
}

export interface GarmentImageSlot {
  id: string;
  imageBase64: string;
  mimeType: string;
  viewType: 'Delantero / Principal' | 'Posterior / Espalda' | 'Detalle / Interior' | 'Lateral / Otro';
}

export interface SampleGarment {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  suggestedNotes: string;
}
