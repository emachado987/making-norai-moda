import { TechPackAnalysis } from '../types';

export const DEMO_ANALYSES: Record<string, TechPackAnalysis> = {
  'blazer-sastre': {
    isGarmentDomain: true,
    garmentName: 'Blazer Estructurado Masculino / Femenino Sastre',
    garmentCategory: 'Sastrería / Chaqueta Exterior',
    generalDescription: 'Blazer ajustado con solapa muesca, bolsillo de pecho con filete, bolsillos inferiores con tapeta y manga sastre de dos piezas estructurada.',
    materials: [
      {
        category: 'Tejido Principal',
        name: 'Paño de Lana 100% Sastre',
        specification: '280 g/m², ligamento sarga 2/2, acabado suave',
        estimatedConsumption: '1.80',
        unit: 'metros',
        notes: 'Ancho útil 150 cm'
      },
      {
        category: 'Forros y Entretelas',
        name: 'Forro Viscosa Satén',
        specification: '110 g/m², alta densidad de trama',
        estimatedConsumption: '1.40',
        unit: 'metros',
        notes: 'Color a juego con tejido principal'
      },
      {
        category: 'Forros y Entretelas',
        name: 'Entretela Fusionable Sastre',
        specification: 'Tricot con inserción de trama, 75 g/m²',
        estimatedConsumption: '1.20',
        unit: 'metros',
        notes: 'Aplicar a vistas, solapas y canesú'
      },
      {
        category: 'Fornituras y Mercería',
        name: 'Botones de Cuero o Resina Sastre',
        specification: '24 mm (delanteros 2ud), 15 mm (puños 8ud)',
        estimatedConsumption: '10',
        unit: 'unidades',
        notes: 'Cuatro ojales practicables en puño'
      },
      {
        category: 'Fornituras y Mercería',
        name: 'Hombreras Sastre Rellenas',
        specification: 'Grosor 12 mm, forma anatómica',
        estimatedConsumption: '1',
        unit: 'par',
        notes: 'Fijar a costura de hombro y sisa'
      }
    ],
    assemblySequence: [
      {
        stepNumber: 1,
        operation: 'Termofijado de entretelas en delanteros, solapas, vistas y pretina.',
        machineryStitch: 'Prensa de termofijado continuo (140°C, 3.5 bar, 12s)',
        timeMinutesEstimate: 8,
        criticalQualityNote: 'Verificar adherencia y evitar burbujas en solapa.'
      },
      {
        stepNumber: 2,
        operation: 'Confección de bolsillos de solapa inferior y vivo de pecho.',
        machineryStitch: 'Plana 1 aguja (Stitch 301), puntada 4 p/cm',
        timeMinutesEstimate: 15,
        criticalQualityNote: 'Esquinas cortadas limpias a 1mm de la costura.'
      },
      {
        stepNumber: 3,
        operation: 'Unión de costuras de corte princesa y centro espalda con abertura sastre.',
        machineryStitch: 'Plana 1 aguja (Stitch 301), planchado abierto',
        timeMinutesEstimate: 12,
        criticalQualityNote: 'Cargar costura de centro espalda hacia la izquierda.'
      },
      {
        stepNumber: 4,
        operation: 'Montaje de manga sastre de dos piezas (hoja alta y hoja baja) e inserción de hombreras.',
        machineryStitch: 'Plana 1 aguja embrabadora de sisa',
        timeMinutesEstimate: 20,
        criticalQualityNote: 'Repartir embebido de copa (1.5 cm) de forma uniforme sin pliegues.'
      },
      {
        stepNumber: 5,
        operation: 'Ensamblaje del forro interior y embolsado final del bajo y solapas.',
        machineryStitch: 'Plana 1 aguja (Stitch 301)',
        timeMinutesEstimate: 25,
        criticalQualityNote: 'Dejar fuelle de holgura de 1.5cm en bajo de forro.'
      }
    ],
    constructionDetails: [
      {
        element: 'Solapa Muesca',
        specification: 'Ancho muesca 4.5 cm, ángulo de quiebre 75°',
        recommendedMarginCm: 0.7,
        stitchType: 'Stitch 301 Plana',
        finishType: 'Cargado y planchado con plantilla'
      },
      {
        element: 'Costura de Sisa',
        specification: 'Reforzada con cinta de tricot termofijada',
        recommendedMarginCm: 1.0,
        stitchType: 'Stitch 301 Plana',
        finishType: 'Abierta con vivo en borde'
      },
      {
        element: 'Bajo / Dobladillo Inferior',
        specification: 'Dobladillo sastre punteado invisible',
        recommendedMarginCm: 3.5,
        stitchType: 'Stitch 101 Punteadora',
        finishType: 'Fijado con entretela fusible en borde'
      }
    ],
    patternPieces: [
      {
        id: 'delantero-principal',
        name: 'Delantero Principal con Solapa',
        code: 'BLZ-DEL-01',
        cutsCount: 2,
        fabricType: 'Paño de Lana Principal',
        notes: 'Cortar a hilo. Aplicar entretela completa en vista.',
        grainline: 'Hilo Paralelo a Canto Frontal',
        hasSymmetry: true,
        seamAllowanceMm: 10,
        svgPath: 'M 30 20 C 60 15, 110 20, 150 40 L 170 80 L 160 260 L 30 260 Z',
        viewBox: '0 0 200 280',
        dimensions: { widthCm: 35, heightCm: 72 }
      },
      {
        id: 'espalda-posterior',
        name: 'Espalda Posterior con Corte Centro',
        code: 'BLZ-ESP-02',
        cutsCount: 2,
        fabricType: 'Paño de Lana Principal',
        notes: 'Abertura inferior sastre de 18cm.',
        grainline: 'Hilo Recto Centro Espalda',
        hasSymmetry: true,
        seamAllowanceMm: 10,
        svgPath: 'M 20 20 C 50 15, 90 20, 130 40 L 140 80 L 130 260 L 20 260 Z',
        viewBox: '0 0 160 280',
        dimensions: { widthCm: 30, heightCm: 72 }
      },
      {
        id: 'manga-hoja-alta',
        name: 'Manga Sastre (Hoja Superior)',
        code: 'BLZ-MNG-03A',
        cutsCount: 2,
        fabricType: 'Paño de Lana Principal',
        notes: 'Embeber 1.5 cm en copa superior.',
        grainline: 'Hilo Recto Central',
        hasSymmetry: true,
        seamAllowanceMm: 10,
        svgPath: 'M 40 20 C 80 0, 120 0, 160 20 L 150 240 L 50 240 Z',
        viewBox: '0 0 200 260',
        dimensions: { widthCm: 28, heightCm: 62 }
      },
      {
        id: 'manga-hoja-baja',
        name: 'Manga Sastre (Hoja Inferior)',
        code: 'BLZ-MNG-03B',
        cutsCount: 2,
        fabricType: 'Paño de Lana Principal',
        notes: 'Unir a sangría interior.',
        grainline: 'Hilo Recto Central',
        hasSymmetry: true,
        seamAllowanceMm: 10,
        svgPath: 'M 30 30 C 60 20, 90 20, 120 30 L 110 230 L 40 230 Z',
        viewBox: '0 0 150 250',
        dimensions: { widthCm: 22, heightCm: 58 }
      },
      {
        id: 'cuello-vista',
        name: 'Cuello Superior Sastre',
        code: 'BLZ-CUE-04',
        cutsCount: 1,
        fabricType: 'Paño de Lana Principal',
        notes: 'Cortar a bies 45° para mejor asentado.',
        grainline: 'Bies 45°',
        hasSymmetry: false,
        seamAllowanceMm: 7,
        svgPath: 'M 20 30 L 180 30 L 165 75 L 35 75 Z',
        viewBox: '0 0 200 100',
        dimensions: { widthCm: 42, heightCm: 9 }
      }
    ],
    sizingGrading: [
      { measurementName: 'Contorno de Pecho', code: 'PCH', baseSizeValueCm: 92, gradingStepCm: 4.0, toleranceMm: 5 },
      { measurementName: 'Contorno de Cintura', code: 'CNT', baseSizeValueCm: 76, gradingStepCm: 4.0, toleranceMm: 5 },
      { measurementName: 'Contorno de Cadera', code: 'CDR', baseSizeValueCm: 100, gradingStepCm: 4.0, toleranceMm: 5 },
      { measurementName: 'Largo Total de Prenda', code: 'LT', baseSizeValueCm: 72, gradingStepCm: 1.0, toleranceMm: 5 },
      { measurementName: 'Largo de Manga', code: 'LM', baseSizeValueCm: 61, gradingStepCm: 0.8, toleranceMm: 3 },
      { measurementName: 'Ancho de Hombros', code: 'AH', baseSizeValueCm: 40, gradingStepCm: 1.0, toleranceMm: 3 }
    ],
    generationPromptEn: '2D technical flat pattern layout of a tailored blazer on clean white background with seam allowances, grainline arrows, notches, and piece labels',
    rawMarkdownReport: `### 1. ESPECIFICACIÓN TÉCNICA (TECH PACK)
- **Nombre / Tipo de Prenda:** Blazer Estructurado Masculino / Femenino Sastre
- **Descripción General:** Blazer ajustado con solapa muesca, bolsillo de pecho con filete, bolsillos inferiores con tapeta y manga sastre de dos piezas estructurada.

### 2. ESTRUCTURA Y DESARROLLO DEL PATRÓN
- **Piezas de Patrón:** Delantero Principal, Espalda Posterior, Manga Hoja Alta, Manga Hoja Baja, Cuello Superior.`,
    visualUnclearNotes: [
      'Espalda con abertura central sastre estándar.',
      'Interior con forro completo de viscosa satén.'
    ],
    qualityChecklist: [
      'Verificar simetría de solapas y piquetes de aplomo en escote.',
      'Comprobar aplastamiento de costuras planchadas con almohadilla de sastre.',
      'Control AQL 2.5: Resistencia de tracción de botones (mínimo 70N).'
    ]
  }
};

// Aliases for matching sample IDs
DEMO_ANALYSES['blazer-tailored'] = DEMO_ANALYSES['blazer-sastre'];

export function getGenericDemoAnalysis(queryTitle?: string): TechPackAnalysis {
  const base = DEMO_ANALYSES['blazer-sastre'];
  if (!queryTitle) return base;
  return {
    ...base,
    garmentName: `${queryTitle} (Patronaje Industrial IA)`,
    generalDescription: `Análisis estructural de confección para "${queryTitle}". Incluye mapa de despiece 2D, tabla de medidas con escalado ISO y ficha técnica completa.`,
  };
}
