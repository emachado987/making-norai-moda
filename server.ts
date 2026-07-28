import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for VPS / proxy setups
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'patronia.norai.moda API Server', timestamp: new Date().toISOString() });
});

// Sample Garments data endpoint for instant testing
app.get('/api/sample-garments', (req, res) => {
  const samples = [
    {
      id: 'blazer-sastre',
      title: 'Blazer Sastre Femenino con Solapa',
      category: 'Sastrería / Chaqueta',
      description: 'Blazer estructurado con solapa muesca, pinza de pecho y talle, bolsillo superior de filete y bolsillos de solapa inferior.',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      suggestedNotes: 'Tejido lana fría 100% (260 g/m²). Forro completo en viscosa satén. Hombrera sastre de 1.2 cm. Solapa muesca de 7 cm de ancho.',
    },
    {
      id: 'vestido-camisero',
      title: 'Vestido Camisero Midi con Cinturón',
      category: 'Vestido / Plana',
      description: 'Vestido camisero de manga corta con tirilla, canesú posterior con tabla central y cinturón en la misma tela con hebilla.',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      suggestedNotes: 'Popelín de algodón 100% (135 g/m²). Botones de nácar de 18L. Entretela ligera en cuello, tirilla y tapeta frontal.',
    },
    {
      id: 'chaqueta-biker',
      title: 'Chaqueta Biker Estilo Cuero',
      category: 'Cazadora / Exterior',
      description: 'Chaqueta estilo motera con cremallera asimétrica n°5, solapas con broches de presión y puños con cremalleras de expansión.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      suggestedNotes: 'Piel sintética estructurada PU (380 g/m²). Forro tafetán poliéster 100%. Cremalleras metálicas niqueladas.',
    },
    {
      id: 'pantalon-tailored',
      title: 'Pantalón Tailored con Pinzas Dobles',
      category: 'Pantalón / Sastrería',
      description: 'Pantalón de vestir de tiro alto con dobles pinzas frontales, bolsillos laterales en costura y pretina estructurada.',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      suggestedNotes: 'Gabardina elástica viscosa-poliéster-elastano (240 g/m²). Cierre invisible posterior/frontal con broche interno.',
    },
  ];
  res.json({ samples });
});

// Analyze Garment Endpoint using Gemini Multimodal Vision Analysis
app.post('/api/analyze-garment', async (req, res) => {
  try {
    const { images, imageBase64, mimeType, notes, targetSize = 'M / 38 EU', industryStandard = 'EU / España' } = req.body;

    const allImages: Array<{ imageBase64: string; mimeType: string; viewType?: string }> =
      images && Array.isArray(images) && images.length > 0
        ? images
        : imageBase64
        ? [{ imageBase64, mimeType: mimeType || 'image/jpeg', viewType: 'Delantero / Principal' }]
        : [];

    if (allImages.length === 0 && !notes) {
      return res.status(400).json({ error: 'Debes proporcionar al menos una imagen de la prenda o notas explicativas.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `
Eres un Ingeniero Técnico de Confección, Patronista Industrial y Arquitecto de IA especializado en Análisis de Visión por Computador para la Industria Textil (patronia.norai.moda).
Tu objetivo es analizar imágenes de prendas de vestir (en modelo o maniquí) combinadas con notas del usuario, para desglosar su estructura de patronaje y generar Fichas Técnicas (Tech Packs) listas para producción industrial.

REGLAS DE DOMINIO Y FALLBACK:
- Si la solicitud O la imagen NO están relacionadas con prendas de vestir, confección, moda, textiles o patronaje, debes marcar isGarmentDomain=false y devolver errorMessage: "ERROR: Solicitud fuera del dominio técnico de confección y patronaje".
- Si la imagen presenta zonas de baja resolución o elementos ambiguos no visibles, debes identificarlo explícitamente agregando "[Pendiente de confirmación visual / Valor estándar sugerido]" en los campos correspondientes.

FASE 1: Análisis Estructural y de Visión
FASE 2: Generación del Diagrama de Patronaje
FASE 3: Redacción de la Ficha Técnica (Tech Pack)
Devuelve un objeto JSON estructurado con los campos: isGarmentDomain, garmentName, garmentCategory, generalDescription, materials, assemblySequence, constructionDetails, patternPieces, sizingGrading, generationPromptEn, rawMarkdownReport, visualUnclearNotes, qualityChecklist.
`;

    const userPrompt = `
Por favor analiza la prenda adjunta (${allImages.length} vistas proporcionadas) y genera la Ficha Técnica y Estructura de Patronaje Industrial completa.
Notas adicionales del usuario: "${notes || 'Sin notas adicionales, realizar análisis técnico completo basado en las fotografías.'}"
Talla base objetivo: ${targetSize}
Normativa industrial de referencia: ${industryStandard}
`;

    const contentsParts: any[] = [];

    allImages.forEach((img, idx) => {
      if (img.imageBase64) {
        const cleanBase64 = img.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contentsParts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
        contentsParts.push({
          text: `[Imagen ${idx + 1} de la prenda - Perspectiva / Vista: ${img.viewType || 'General'}]`,
        });
      }
    });

    contentsParts.push({ text: userPrompt });

    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let response: any = null;
    let lastError: any = null;

    const requestConfig = {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isGarmentDomain: { type: Type.BOOLEAN },
          errorMessage: { type: Type.STRING },
          garmentName: { type: Type.STRING },
          garmentCategory: { type: Type.STRING },
          generalDescription: { type: Type.STRING },
          materials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                name: { type: Type.STRING },
                specification: { type: Type.STRING },
                estimatedConsumption: { type: Type.STRING },
                unit: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['category', 'name', 'specification', 'estimatedConsumption', 'unit'],
            },
          },
          assemblySequence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                operation: { type: Type.STRING },
                machineryStitch: { type: Type.STRING },
                timeMinutesEstimate: { type: Type.NUMBER },
                criticalQualityNote: { type: Type.STRING },
              },
              required: ['stepNumber', 'operation', 'machineryStitch'],
            },
          },
          constructionDetails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                element: { type: Type.STRING },
                specification: { type: Type.STRING },
                recommendedMarginCm: { type: Type.NUMBER },
                stitchType: { type: Type.STRING },
                finishType: { type: Type.STRING },
              },
              required: ['element', 'specification', 'recommendedMarginCm', 'stitchType'],
            },
          },
          patternPieces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                cutsCount: { type: Type.INTEGER },
                fabricType: { type: Type.STRING },
                notes: { type: Type.STRING },
                grainline: { type: Type.STRING },
                hasSymmetry: { type: Type.BOOLEAN },
                seamAllowanceMm: { type: Type.NUMBER },
                svgPath: { type: Type.STRING },
                viewBox: { type: Type.STRING },
                dimensions: {
                  type: Type.OBJECT,
                  properties: {
                    widthCm: { type: Type.NUMBER },
                    heightCm: { type: Type.NUMBER },
                  },
                },
              },
              required: ['id', 'name', 'code', 'cutsCount', 'fabricType', 'grainline', 'hasSymmetry', 'seamAllowanceMm'],
            },
          },
          sizingGrading: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                measurementName: { type: Type.STRING },
                code: { type: Type.STRING },
                baseSizeValueCm: { type: Type.NUMBER },
                gradingStepCm: { type: Type.NUMBER },
                toleranceMm: { type: Type.NUMBER },
              },
              required: ['measurementName', 'code', 'baseSizeValueCm', 'gradingStepCm', 'toleranceMm'],
            },
          },
          generationPromptEn: { type: Type.STRING },
          rawMarkdownReport: { type: Type.STRING },
          visualUnclearNotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          qualityChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'isGarmentDomain',
          'garmentName',
          'garmentCategory',
          'generalDescription',
          'materials',
          'assemblySequence',
          'constructionDetails',
          'patternPieces',
          'sizingGrading',
          'generationPromptEn',
          'rawMarkdownReport',
        ],
      },
    };

    for (const modelCandidate of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelCandidate,
          contents: { parts: contentsParts },
          config: requestConfig,
        });
        if (response && response.text) break;
      } catch (e) {
        console.warn(`Model ${modelCandidate} failed, trying next:`, e);
        lastError = e;
      }
    }

    const responseText = response?.text;
    if (!responseText) {
      throw lastError || new Error('No response generated by Gemini API.');
    }

    const parsedResult = JSON.parse(responseText);

    if (!parsedResult.isGarmentDomain) {
      return res.status(400).json({
        isGarmentDomain: false,
        error: parsedResult.errorMessage || 'ERROR: Solicitud fuera del dominio técnico de confección y patronaje',
      });
    }

    return res.json({ success: true, data: parsedResult });
  } catch (err: any) {
    console.error('Error in /api/analyze-garment:', err);
    return res.status(500).json({
      error: 'Error al procesar el análisis de la prenda.',
      details: err.message || String(err),
    });
  }
});

// Start Express server
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
