import { GoogleGenAI, Type } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { images, imageBase64, mimeType, notes, targetSize = 'M / 38 EU', industryStandard = 'EU / España' } = body;

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
- Si la imagen presenta zonas de baja resolución o elementos ambiguos no visibles (ej. la espalda no es visible, interiores no claros), debes identificarlo explícitamente agregando "[Pendiente de confirmación visual / Valor estándar sugerido]" en los campos correspondientes.

FASE 1: Análisis Estructural y de Visión
- Examina la prenda: silueta, tipo de manga, escote/cuello, cierres, pinzas, cortes, pespuntes, bolsillos, forros y acabados.
- Cruza los hallazgos visuales con las especificaciones expresadas en las notas del usuario.
- Identifica la geometría base necesaria para el escalado y construcción del patrón plano.

FASE 2: Generación del Diagrama de Patronaje
- Describe con precisión geométrica y vectorial los componentes del patrón plano (delantero, trasero, mangas, vistas, pretinas, canesú, etc.).
- Proporciona una lista detallada de piezas con código, nombre, cantidad de cortes, tipo de tela, línea de hilo (hilo/contrahílo/bies), simetría y margen de costura recomendado.
- Genera un prompt en inglés altamente detallado para un modelo de generación visual/SVG que muestre el despiece plano 2D técnico sobre fondo blanco.
- Genera trazados SVG d-path representativos para cada pieza.

FASE 3: Redacción de la Ficha Técnica (Tech Pack)
Devuelve un objeto JSON estructurado con los campos: isGarmentDomain, garmentName, garmentCategory, generalDescription, materials, assemblySequence, constructionDetails, patternPieces, sizingGrading, generationPromptEn, rawMarkdownReport, visualUnclearNotes, qualityChecklist.
`;

    const userPrompt = `
Por favor analiza la prenda adjunta (${allImages.length} vistas proporcionadas) y genera la Ficha Técnica y Estructura de Patronaje Industrial completa.
${allImages.length > 1 ? `Se han adjuntado varias fotografías de la prenda mostrando distintos ángulos. Examina rigurosamente cada vista para completar la estructura técnica de la espalda, pretina, canesú y acabados.` : ''}
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
    console.error('Error in Vercel /api/analyze-garment:', err);
    return res.status(500).json({
      error: 'Error al procesar el análisis de la prenda.',
      details: err.message || String(err),
    });
  }
}
