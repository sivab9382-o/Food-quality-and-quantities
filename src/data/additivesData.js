export const ADDITIVES_DB = [
  {
    code: 'E102',
    name: 'Tartrazine (Yellow 5)',
    category: 'Synthetic Colorant',
    risk: 'Moderate', // Safe, Moderate, High
    description: 'A synthetic lemon-yellow azo dye used in confectionery, sodas, and chips.',
    warning: 'May trigger hyperactivity in sensitive children and hypersensitivity/asthma flare-ups in aspirin-sensitive individuals.',
    dietary: 'Synthetic / Vegan',
    regulatory: 'Requires warning label in EU; restricted in several European nations.'
  },
  {
    code: 'E129',
    name: 'Allura Red AC (Red 40)',
    category: 'Synthetic Colorant',
    risk: 'Moderate',
    description: 'Widely used petroleum-derived red dye found in candy, soft drinks, cereals, and baked snacks.',
    warning: 'Associated with attention deficit and hyperactivity symptoms in pediatric studies.',
    dietary: 'Synthetic / Vegan',
    regulatory: 'EU warning label mandated: "May have an adverse effect on activity and attention in children".'
  },
  {
    code: 'E150d',
    name: 'Ammonia Caramel (Caramel IV)',
    category: 'Colorant',
    risk: 'Moderate',
    description: 'Dark brown color produced by heating carbohydrates in presence of ammonia and sulfite compounds.',
    warning: 'Contains trace byproducts (4-MEI) under research for long-term chronic toxicity at high volumes.',
    dietary: 'Plant-derived / Vegan',
    regulatory: 'Common in colas, dark beers, gravies, and barbecue sauces.'
  },
  {
    code: 'E200',
    name: 'Sorbic Acid',
    category: 'Preservative',
    risk: 'Safe',
    description: 'Naturally occurring organic compound used to inhibit mold, yeast, and fungal growth in cheeses and dried fruits.',
    warning: 'Generally safe and metabolized naturally as a fatty acid.',
    dietary: 'Vegan',
    regulatory: 'Approved globally with high safety profile.'
  },
  {
    code: 'E202',
    name: 'Potassium Sorbate',
    category: 'Preservative',
    risk: 'Safe',
    description: 'Widely used antimicrobial salt that prevents fermentation and mold in dairy, wines, and baked goods.',
    warning: 'Non-toxic at standard culinary levels; very rare contact allergy.',
    dietary: 'Vegan',
    regulatory: 'FDA GRAS (Generally Recognized As Safe) and EFSA approved.'
  },
  {
    code: 'E211',
    name: 'Sodium Benzoate',
    category: 'Preservative',
    risk: 'Moderate',
    description: 'Preservative effective in acidic foods like salad dressings, fruit juices, and carbonated beverages.',
    warning: 'When combined with Vitamin C (Ascorbic Acid, E300) in beverages under heat/light, can form trace benzene (a known carcinogen).',
    dietary: 'Vegan',
    regulatory: 'Strict ppm dosage limits enforced internationally.'
  },
  {
    code: 'E250',
    name: 'Sodium Nitrite',
    category: 'Preservative & Color Fixative',
    risk: 'High',
    description: 'Inorganic salt used to cure bacon, hot dogs, sausages, and ham to prevent botulism and maintain pink color.',
    warning: 'Reacts with amines under high cooking heat to form nitrosamines, classified as carcinogenic by the WHO IARC.',
    dietary: 'Mineral origin',
    regulatory: 'Strictly limited; consumption of cured meats recommended to be kept minimal.'
  },
  {
    code: 'E300',
    name: 'Ascorbic Acid (Vitamin C)',
    category: 'Antioxidant & Nutrient',
    risk: 'Safe',
    description: 'Essential water-soluble antioxidant that prevents browning and oxidative rancidity in foods.',
    warning: 'Completely safe; supports immune function and cellular health.',
    dietary: 'Plant fermentation / Vegan',
    regulatory: 'Unrestricted culinary use.'
  },
  {
    code: 'E322',
    name: 'Lecithin (Soy / Sunflower)',
    category: 'Emulsifier',
    risk: 'Safe',
    description: 'Natural phospholipid that keeps fats and liquids evenly mixed in chocolate, dressings, and bakery doughs.',
    warning: 'Safe, but check source if you have a severe Soy allergy (Soy Lecithin).',
    dietary: 'Vegetarian (often soy or sunflower)',
    regulatory: 'Approved globally.'
  },
  {
    code: 'E330',
    name: 'Citric Acid',
    category: 'Acidity Regulator & Antioxidant',
    risk: 'Safe',
    description: 'Natural organic acid giving tart citrus flavor and acting as a mild preservative in jams, sodas, and candies.',
    warning: 'Safe for consumption; highly concentrated citric beverages may erode dental enamel over time.',
    dietary: 'Fermented carbohydrate / Vegan',
    regulatory: 'Universally approved.'
  },
  {
    code: 'E407',
    name: 'Carrageenan',
    category: 'Thickener & Stabilizer',
    risk: 'Moderate',
    description: 'Extract from red edible seaweeds used to thicken plant-based milks, ice creams, and deli meats.',
    warning: 'Some gastrointestinal studies suggest degraded carrageenan can trigger intestinal gut inflammation in sensitive individuals.',
    dietary: 'Seaweed / Vegan',
    regulatory: 'Banned in infant formula in the EU.'
  },
  {
    code: 'E412',
    name: 'Guar Gum',
    category: 'Thickener & Dietary Fiber',
    risk: 'Safe',
    description: 'Natural soluble fiber extracted from guar beans, providing creaminess in sauces, dairy, and gluten-free breads.',
    warning: 'Safe; acts as a prebiotic fiber. High quantities can cause mild bloating.',
    dietary: 'Legume seed / Vegan',
    regulatory: 'Approved globally.'
  },
  {
    code: 'E415',
    name: 'Xanthan Gum',
    category: 'Stabilizer & Thickener',
    risk: 'Safe',
    description: 'Polysaccharide produced by fermentation of sugars, essential in gluten-free baking and salad dressings.',
    warning: 'Extremely safe and hypoallergenic.',
    dietary: 'Fermented plant sugar / Vegan',
    regulatory: 'Approved worldwide.'
  },
  {
    code: 'E450',
    name: 'Diphosphates',
    category: 'Emulsifier & Leavening Agent',
    risk: 'Moderate',
    description: 'Mineral salts used in baking powders, processed cheeses, and sausages to retain moisture.',
    warning: 'High dietary intake of inorganic phosphates can burden renal function and impact cardiovascular health.',
    dietary: 'Mineral origin',
    regulatory: 'Acceptable daily intake limits set by EFSA.'
  },
  {
    code: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    category: 'Emulsifier',
    risk: 'Moderate',
    description: 'Food additive used to blend oils and water in bread, margarine, peanut butters, and desserts.',
    warning: 'Often contains small amounts of trans-fatty acids not required to be itemized on standard labels.',
    dietary: 'Can be vegetable or animal fat derived (halal/vegan status varies)',
    regulatory: 'Permitted in US & EU.'
  },
  {
    code: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    category: 'Flavor Enhancer (Umami)',
    risk: 'Safe',
    description: 'Sodium salt of glutamic acid, an amino acid naturally present in tomatoes, aged cheeses, and mushrooms.',
    warning: 'Extensive scientific reviews find it safe for the vast majority; a small subset may experience transient headaches.',
    dietary: 'Fermented molasses / Vegan',
    regulatory: 'Recognized as safe by WHO, FDA, and EFSA.'
  },
  {
    code: 'E950',
    name: 'Acesulfame Potassium (Ace-K)',
    category: 'High-Intensity Artificial Sweetener',
    risk: 'Moderate',
    description: 'Calorie-free sweetener ~200 times sweeter than sucrose, often blended with sucralose or aspartame.',
    warning: 'Some animal studies suggest potential impacts on gut microbiome composition with long-term heavy use.',
    dietary: 'Synthetic / Vegan',
    regulatory: 'Approved with acceptable daily intake (ADI) levels.'
  },
  {
    code: 'E951',
    name: 'Aspartame',
    category: 'Artificial Sweetener',
    risk: 'High',
    description: 'Low-calorie dipeptide sweetener found in diet drinks, sugar-free gums, and yogurts.',
    warning: 'Contains phenylalanine (dangerous for individuals with PKU). Classified by IARC in 2023 as Group 2B (possibly carcinogenic to humans).',
    dietary: 'Synthetic',
    regulatory: 'Requires explicit warning label: "Contains a source of phenylalanine".'
  },
  {
    code: 'E955',
    name: 'Sucralose',
    category: 'Artificial Sweetener (Splenda)',
    risk: 'Moderate',
    description: 'Chlorinated sucrose derivative that is ~600 times sweeter than table sugar.',
    warning: 'Not broken down by heat, but research continues into impacts on gut bacterial diversity and glycemic sensitivity.',
    dietary: 'Synthetic / Vegan',
    regulatory: 'Approved globally.'
  },
  {
    code: 'E960',
    name: 'Steviol Glycosides (Stevia)',
    category: 'Natural Sweetener',
    risk: 'Safe',
    description: 'Zero-calorie natural sweetener extracted from the leaves of the Stevia rebaudiana plant.',
    warning: 'Clean safety record; sweet with slight herbal licorice undertones.',
    dietary: 'Plant-derived / Vegan',
    regulatory: 'Approved worldwide.'
  }
];

export function findAdditive(keyword) {
  const clean = keyword.trim().toUpperCase().replace(/[\s-]/g, '');
  return ADDITIVES_DB.find(add => {
    const codeClean = add.code.replace(/[\s-]/g, '').toUpperCase();
    const nameUpper = add.name.toUpperCase();
    return clean === codeClean || nameUpper.includes(keyword.trim().toUpperCase());
  });
}
