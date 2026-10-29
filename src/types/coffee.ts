export type CoffeeType =
  | 'Espresso'
  | 'Double Espresso'
  | 'Flat White'
  | 'Cortado'
  | 'Cappuccino'
  | 'Latte'
  | 'Macchiato'
  | 'V60 Pourover'
  | 'Chemex'
  | 'Aeropress'
  | 'Cold Brew'
  | 'Nitro Cold Brew'
  | 'Americano'
  | 'Batch Brew'
  | 'Specialty Tonic';

export type MilkType = 'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk' | 'Skim Milk' | 'Black / None';

export type RoastLevel = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';

export interface BaristaLook {
  style: string; // e.g. "Japanese Minimalist Apron", "Canvas & Leather Craft", "Vintage Tailored Vest", "Casual Streetwear"
  presentationScore: number; // 1 to 10
  latteArtFlair: string; // e.g. "12-Tier Rosetta", "Clean Winged Tulip", "Velvety Microfoam Blank", "Swan Silhouette"
  demeanor: string; // e.g. "Warm & Conversational", "Precision Craftsman", "Chill & Welcoming", "Focused & Quiet"
}

export interface CoffeeShopLook {
  aesthetic: string; // e.g. "Scandinavian Minimalist Wood & Concrete", "Industrial Heritage Brick & Iron", "Tokyo Modern Kissaten", "Botanical Sunlit Greenhouse"
  ambienceScore: number; // 1 to 10
  vibeTags: string[]; // e.g. ["Natural Daylight", "Lo-Fi Vinyl", "Quiet Work-Friendly", "Pro Roaster Visible"]
  crowdEnergy: 'Zen / Quiet' | 'Relaxed Ambient' | 'Bustling Neighborhood' | 'High-Energy Tasting Bar';
}

export interface CoffeeScores {
  taste: number; // 1 to 10
  barista: number; // 1 to 10
  shopLook: number; // 1 to 10
  overall: number; // 1 to 10 (1 decimal place)
}

export interface CoffeeEntry {
  id: string;
  timestamp: string; // ISO 8601 string
  brand: string; // roastery or brand
  location: {
    cafeName: string;
    city: string;
    country: string;
    neighborhood?: string;
  };
  coffeeType: CoffeeType;
  milkType: MilkType;
  roastLevel: RoastLevel;
  baristaLook: BaristaLook;
  coffeeShopLook: CoffeeShopLook;
  quickNote: string;
  flavorNotes: string[]; // e.g. ["Bergamot", "Jasmine", "Meyer Lemon", "Stone Fruit"]
  photoUrl: string;
  scores: CoffeeScores;
  price?: {
    amount: number;
    currency: string;
  };
  estCaffeineMg: number; // ~60-180mg depending on type
}

export interface CountryIntake {
  country: string;
  code: string;
  cupsPerDay: number; // average adult coffee consumption
  kgPerCapitaAnnual: number;
  flagEmoji: string;
  coffeeCultureNotes: string;
}

export interface CityBenchmark {
  city: string;
  country: string;
  avgScore: number; // out of 10
  avgTaste: number;
  avgBarista: number;
  avgShopLook: number;
  topRoasters: string[];
  signatureDrink: string;
  latteArtStandard: string;
  shopVibeArchetype: string;
}

export interface GlobalDistribution {
  percentile10: number;
  percentile25: number;
  percentile50: number; // median
  percentile75: number;
  percentile90: number;
  percentile99: number;
  globalAvgScore: number;
  globalAvgTaste: number;
  globalAvgBarista: number;
  globalAvgShopLook: number;
  totalWorldLogsAnalyzed: number;
}
