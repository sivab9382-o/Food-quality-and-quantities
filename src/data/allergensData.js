export const ALLERGENS = [
  {
    id: 'gluten',
    name: 'Gluten / Wheat',
    icon: '🌾',
    keywords: ['wheat', 'barley', 'rye', 'spelt', 'kamut', 'semolina', 'flour', 'gluten', 'malt', 'triticale', 'durum'],
    riskNote: 'Causes severe autoimmune reaction in Celiac disease; gastrointestinal distress in non-celiac gluten sensitivity.'
  },
  {
    id: 'dairy',
    name: 'Dairy / Lactose',
    icon: '🥛',
    keywords: ['milk', 'dairy', 'lactose', 'whey', 'casein', 'caseinate', 'butter', 'cream', 'cheese', 'yogurt', 'curd', 'ghee'],
    riskNote: 'Contains lactose (digestive enzyme deficiency) and milk proteins (IgE-mediated allergy risk).'
  },
  {
    id: 'peanuts',
    name: 'Peanuts',
    icon: '🥜',
    keywords: ['peanut', 'peanuts', 'arachis', 'groundnut', 'peanut oil', 'peanut butter'],
    riskNote: 'High risk of severe anaphylaxis. Legume family.'
  },
  {
    id: 'tree_nuts',
    name: 'Tree Nuts',
    icon: '🌰',
    keywords: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut', 'chestnut', 'praline', 'marzipan'],
    riskNote: 'Distinct from peanuts; potent allergen with high anaphylaxis probability.'
  },
  {
    id: 'soy',
    name: 'Soybeans',
    icon: '🫘',
    keywords: ['soy', 'soya', 'soybean', 'edamame', 'tofu', 'tempeh', 'miso', 'soy lecithin', 'soy protein', 'tamari'],
    riskNote: 'Common in ultra-processed emulsifiers and protein isolates.'
  },
  {
    id: 'eggs',
    name: 'Eggs',
    icon: '🥚',
    keywords: ['egg', 'eggs', 'albumin', 'ovalbumin', 'ovomucin', 'lysozyme', 'yolk', 'mayonnaise', 'meringue'],
    riskNote: 'Prevalent pediatric allergen found in baked goods, sauces, and pasta.'
  },
  {
    id: 'fish_shellfish',
    name: 'Fish & Shellfish',
    icon: '🦐',
    keywords: ['fish', 'salmon', 'tuna', 'cod', 'shrimp', 'crab', 'lobster', 'prawn', 'oyster', 'mussel', 'clam', 'scallop', 'anchovy', 'squid'],
    riskNote: 'Parvalbumin and tropomyosin proteins can provoke severe acute reactions.'
  },
  {
    id: 'sesame',
    name: 'Sesame',
    icon: '🌱',
    keywords: ['sesame', 'tahini', 'halvah', 'til', 'benne'],
    riskNote: 'Officially added to FDA major 9 food allergens due to rising anaphylactic cases.'
  },
  {
    id: 'sulfites',
    name: 'Sulfites',
    icon: '🍷',
    keywords: ['sulfite', 'sulphite', 'sulfur dioxide', 'bisulfite', 'metabisulfite', 'e220', 'e221', 'e222', 'e223', 'e224'],
    riskNote: 'Preservative in dried fruits and wine; triggers severe bronchospasm in asthmatics.'
  }
];

export const PRESET_PACKAGED_FOODS = [
  {
    id: 'food-cereal-crunch',
    name: 'Morning Crunch Granola & Chocolate Clusters',
    brand: 'Golden Morning Foods',
    barcode: '8901030456123',
    category: 'Breakfast Cereals',
    novaGroup: 4,
    novaLabel: 'Ultra-Processed Food',
    nutriScore: 'C',
    ingredientsText: 'Rolled whole grain oats, sugar, vegetable palm oil, wheat flour, whole milk powder, cocoa butter, crisp rice, glucose-fructose syrup, soy lecithin (E322), natural bourbon vanilla flavoring, antioxidant: tocopherol-rich extract (E306).',
    nutritionPer100g: {
      energy: '465 kcal',
      fat: '19.2 g',
      saturatedFat: '8.4 g',
      carbs: '63.0 g',
      sugars: '24.5 g',
      fiber: '5.8 g',
      protein: '7.8 g',
      salt: '0.35 g'
    },
    warnings: [
      'High added sugar content (>24% by weight)',
      'High saturated fat from fractionated palm oil',
      'Ultra-processed classification (NOVA 4)'
    ]
  },
  {
    id: 'food-protein-shake',
    name: 'PurePlant Vanilla Keto Shake',
    brand: 'BioFit Nutrition',
    barcode: '0712345678901',
    category: 'Nutritional Drinks',
    novaGroup: 4,
    novaLabel: 'Ultra-Processed Food',
    nutriScore: 'B',
    ingredientsText: 'Filtered water, organic pea protein isolate, almond butter, high oleic sunflower oil, erythritol, natural vanilla bean extract, marine mineral complex (calcium, magnesium), stabilizer: carrageenan (E407), sunflower lecithin (E322), artificial sweeteners: acesulfame potassium (E950) and sucralose (E955), pink Himalayan salt.',
    nutritionPer100g: {
      energy: '68 kcal',
      fat: '3.5 g',
      saturatedFat: '0.4 g',
      carbs: '2.1 g',
      sugars: '0.2 g',
      fiber: '1.2 g',
      protein: '7.5 g',
      salt: '0.22 g'
    },
    warnings: [
      'Contains synthetic non-nutritive sweeteners (Ace-K, Sucralose)',
      'Contains Carrageenan (E407) which may cause digestive discomfort in sensitive stomachs',
      'Contains Tree Nuts (Almonds)'
    ]
  },
  {
    id: 'food-ramen-spicy',
    name: 'Tokyo Fire Miso Instant Noodles',
    brand: 'NoodleCraft Japan',
    barcode: '4901234567894',
    category: 'Ready Meals',
    novaGroup: 4,
    novaLabel: 'Ultra-Processed Food',
    nutriScore: 'E',
    ingredientsText: 'Enriched wheat flour, refined palm oil, modified tapioca starch, salt, acidity regulators (potassium carbonate E501, sodium carbonate E500). Seasoning Packet: Red miso powder (soybean, rice, salt), monosodium glutamate (E621), disodium inosinate (E631), disodium guanylate (E627), chili pepper extract, dehydrated green scallions, caramel color (E150d), silicon dioxide.',
    nutritionPer100g: {
      energy: '440 kcal',
      fat: '17.5 g',
      saturatedFat: '8.2 g',
      carbs: '61.0 g',
      sugars: '3.1 g',
      fiber: '2.4 g',
      protein: '9.5 g',
      salt: '4.8 g'
    },
    warnings: [
      'Extremely high sodium (exceeds 85% recommended daily allowance per bowl)',
      'Multiple synthetic flavor enhancers (MSG + E631 + E627)',
      'Palm oil frying produces high saturated fat content'
    ]
  },
  {
    id: 'food-greek-yogurt',
    name: 'Artisan Plain Authentic Greek Yogurt',
    brand: 'Olympos Dairy',
    barcode: '5201234987654',
    category: 'Dairy & Eggs',
    novaGroup: 1,
    novaLabel: 'Unprocessed or Minimally Processed Food',
    nutriScore: 'A',
    ingredientsText: 'Grade A pasteurized skim milk, pure dairy cream, live active yogurt cultures (Streptococcus thermophilus, Lactobacillus bulgaricus, Lactobacillus acidophilus, Bifidobacterium).',
    nutritionPer100g: {
      energy: '73 kcal',
      fat: '2.0 g',
      saturatedFat: '1.2 g',
      carbs: '3.8 g',
      sugars: '3.6 g (naturally occurring lactose)',
      fiber: '0.0 g',
      protein: '10.2 g',
      salt: '0.08 g'
    },
    warnings: []
  },
  {
    id: 'food-truffle-salami',
    name: 'Aged Truffle Cured Salami',
    brand: 'Salumiere Roma',
    barcode: '8001234567890',
    category: 'Meat & Seafood',
    novaGroup: 3,
    novaLabel: 'Processed Food',
    nutriScore: 'D',
    ingredientsText: 'Pork meat, pork fat, sea salt, summer black truffle (Tuber aestivum), dextrose, black pepper, garlic powder, antioxidant: sodium ascorbate (E301), preservatives: potassium nitrate (E252), sodium nitrite (E250).',
    nutritionPer100g: {
      energy: '395 kcal',
      fat: '32.0 g',
      saturatedFat: '12.5 g',
      carbs: '1.2 g',
      sugars: '0.8 g',
      fiber: '0.0 g',
      protein: '26.0 g',
      salt: '3.9 g'
    },
    warnings: [
      'Preserved with Sodium Nitrite (E250) & Potassium Nitrate (E252)',
      'High sodium and saturated animal fats'
    ]
  }
];
