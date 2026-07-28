export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
  return res.json({ samples });
}
