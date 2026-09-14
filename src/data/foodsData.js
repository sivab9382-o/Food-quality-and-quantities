export const SAMPLE_FOODS = [
  {
    id: 'sample-apple-fresh',
    name: 'Honeycrisp Apple',
    category: 'Produce',
    image: '/images/fresh_apple.jpg',
    defaultScore: 96,
    status: 'Peak Freshness',
    statusType: 'optimal', // optimal, good, caution, danger
    metrics: {
      firmness: 'High (98%)',
      colorVibrancy: 'Optimal (95%)',
      surfaceIntegrity: 'Pristine (97%)',
      microBrowning: 'Negligible (<2%)'
    },
    shelfLife: {
      roomTemp: '7–10 days',
      refrigerated: '4–6 weeks'
    },
    idealTemp: '32°F – 36°F (0°C – 2°C)',
    humidity: '90% – 95% relative humidity',
    storageTips: [
      'Store in the crisper drawer with the humidity lever set to High.',
      'Keep apples separated from ethylene-sensitive items like leafy greens, carrots, and broccoli.',
      'Do not wash until immediately before eating to maintain natural protective cuticle wax.'
    ],
    sensoryChecklist: [
      { text: 'Skin is firm and taut under gentle thumb pressure', passed: true },
      { text: 'Pleasant, sweet, crisp apple aroma', passed: true },
      { text: 'No dark indentation or soft weeping spots', passed: true },
      { text: 'Stem intact and firm', passed: true }
    ],
    spoilageIndicators: [
      'Soft spongy yield around core or stem',
      'Brown translucent discoloration beneath peel',
      'Alcoholic / cidery fermentation odor'
    ]
  },
  {
    id: 'sample-banana-overripe',
    name: 'Cavendish Banana',
    category: 'Produce',
    image: '/images/overripe_banana.jpg',
    defaultScore: 54,
    status: 'Consume Soon / Best for Baking',
    statusType: 'caution',
    metrics: {
      firmness: 'Softened (45%)',
      colorVibrancy: 'Sugar Spotted (60%)',
      surfaceIntegrity: 'Thinning Peel (50%)',
      microBrowning: 'Extensive (68%)'
    },
    shelfLife: {
      roomTemp: '1–2 days',
      refrigerated: '3–4 days (peel darkens, pulp good)',
      frozen: 'Up to 3 months (peeled)'
    },
    idealTemp: '55°F – 60°F (13°C – 15°C)',
    humidity: 'Moderate',
    storageTips: [
      'Ideal time for banana bread, protein smoothies, or pancake batter!',
      'To preserve: peel, slice into disks, and freeze in a ziplock bag for quick smoothies.',
      'Separate from other fruit bunches to prevent accelerating ripening in surrounding fruit.'
    ],
    sensoryChecklist: [
      { text: 'Fragrant, intense banana sweetness', passed: true },
      { text: 'Peel has dense brown sugar spots', passed: true },
      { text: 'Stem has no fuzzy gray or blue mold', passed: true },
      { text: 'Flesh inside remains pale cream, not black/liquefying', passed: true }
    ],
    spoilageIndicators: [
      'Liquid or sticky syrup leaking from tip or stem',
      'Fuzzy gray or black mold near the crown',
      'Sharp vinegar or fermented alcohol smell'
    ]
  },
  {
    id: 'sample-salmon-fresh',
    name: 'Atlantic Salmon Fillet',
    category: 'Meat & Seafood',
    image: '/images/fresh_salmon.jpg',
    defaultScore: 93,
    status: 'Peak Freshness',
    statusType: 'optimal',
    metrics: {
      firmness: 'Springy & Elastic (95%)',
      colorVibrancy: 'Vibrant Coral (92%)',
      surfaceIntegrity: 'Moist Sheen (94%)',
      microBrowning: 'None (0%)'
    },
    shelfLife: {
      roomTemp: 'Do NOT leave at room temp (>2 hrs)',
      refrigerated: '1–2 days max at 34°F – 38°F',
      frozen: '2–3 months vacuum-sealed'
    },
    idealTemp: '32°F – 36°F (0°C – 2°C) on crushed ice',
    humidity: 'Airtight packaging',
    storageTips: [
      'Place in the coldest part of your refrigerator (bottom rear shelf).',
      'Keep packed in parchment and sealed container; cook within 24–48 hours of purchase.',
      'Target safe internal cooking temperature: 145°F (63°C).'
    ],
    sensoryChecklist: [
      { text: 'Mild clean ocean scent, strictly non-fishy', passed: true },
      { text: 'Flesh springs back immediately when pressed', passed: true },
      { text: 'Clean distinct white intramuscular fat lines', passed: true },
      { text: 'No sticky or cloudy opaque mucus', passed: true }
    ],
    spoilageIndicators: [
      'Pungent ammonia or sour rancid odor',
      'Milky, slimy coating on the surface of the fillet',
      'Dull gray or brownish-green coloration',
      'Mushy flesh where finger impressions remain dented'
    ]
  },
  {
    id: 'sample-avocado-overripe',
    name: 'Hass Avocado',
    category: 'Produce',
    image: '/images/overripe_avocado.jpg',
    defaultScore: 34,
    status: 'Approaching Spoilage / Trim Discoloration',
    statusType: 'danger',
    metrics: {
      firmness: 'Very Soft / Mushy (30%)',
      colorVibrancy: 'Dark Brown Oxidation (35%)',
      surfaceIntegrity: 'Collapsing Fibers (32%)',
      microBrowning: 'Severe Internal (72%)'
    },
    shelfLife: {
      roomTemp: 'Past peak (Use Today)',
      refrigerated: '1 day max (with lemon juice)'
    },
    idealTemp: '40°F (4°C) with acid barrier',
    humidity: 'Airtight sealed',
    storageTips: [
      'Inspect carefully: cut away stringy brown oxidized streaks.',
      'If the flesh tastes pleasant (nutty/creamy), blend into guacamole or salad dressing immediately.',
      'If sour or rancid tasting, discard completely to avoid gastrointestinal discomfort.'
    ],
    sensoryChecklist: [
      { text: 'Check for sour chemical odor', passed: false },
      { text: 'Vascular stringy fibers present throughout', passed: false },
      { text: 'Dark oxidized browning on cut surface', passed: false },
      { text: 'Skin yields excessively with loose cavity', passed: false }
    ],
    spoilageIndicators: [
      'Rancid, pungent, or sour fermented odor',
      'Deep black mushy pulp throughout',
      'White powdery mold or dark fungal spores around the stem cavity'
    ]
  }
];

export const GENERAL_CATEGORIES = [
  'Produce',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Bakery',
  'Pantry Staples',
  'Beverages',
  'Frozen'
];
