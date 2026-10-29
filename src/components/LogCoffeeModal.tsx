import React, { useState, useRef } from 'react';
import {
  CoffeeEntry,
  CoffeeType,
  MilkType,
  RoastLevel,
} from '../types/coffee';
import {
  COMMON_BRANDS,
  BARISTA_STYLES,
  LATTE_ART_PRESETS,
  SHOP_AESTHETICS,
  FLAVOR_TAGS,
} from '../data/worldwideData';
import { calculateWorldwideScorePercentile } from '../utils/coffeeStats';
import { X, Camera, Upload, Sparkles, MapPin, Coffee, Store, UserCheck, Clock } from 'lucide-react';

interface LogCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CoffeeEntry) => void;
  initialEntry?: CoffeeEntry | null;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Artisan Latte Art',
    url: '/src/assets/images/coffee_flatwhite_art_1793303419455.jpg',
  },
  {
    name: 'Barista Pourover Craft',
    url: '/src/assets/images/barista_craft_action_1793303420419.jpg',
  },
  {
    name: 'Modern Cafe Space',
    url: '/src/assets/images/coffee_shop_interior_1793303420766.jpg',
  },
];

export const LogCoffeeModal: React.FC<LogCoffeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [brand, setBrand] = useState(initialEntry?.brand || 'Onyx Coffee Lab');
  const [cafeName, setCafeName] = useState(initialEntry?.location.cafeName || 'Onyx Coffee Hub');
  const [city, setCity] = useState(initialEntry?.location.city || 'Rogers, AR');
  const [country, setCountry] = useState(initialEntry?.location.country || 'United States');
  const [neighborhood, setNeighborhood] = useState(initialEntry?.location.neighborhood || 'Historic Downtown');

  const [coffeeType, setCoffeeType] = useState<CoffeeType>(initialEntry?.coffeeType || 'Flat White');
  const [milkType, setMilkType] = useState<MilkType>(initialEntry?.milkType || 'Whole Milk');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(initialEntry?.roastLevel || 'Light');

  // Date and Time
  const now = new Date();
  const defaultIso = initialEntry?.timestamp || now.toISOString();
  const [dateVal, setDateVal] = useState(defaultIso.slice(0, 10));
  const [timeVal, setTimeVal] = useState(
    initialEntry
      ? new Date(initialEntry.timestamp).toTimeString().slice(0, 5)
      : now.toTimeString().slice(0, 5)
  );

  // Barista Look
  const [baristaStyle, setBaristaStyle] = useState(initialEntry?.baristaLook.style || BARISTA_STYLES[0]);
  const [baristaScore, setBaristaScore] = useState<number>(initialEntry?.baristaLook.presentationScore || 9.2);
  const [latteArtFlair, setLatteArtFlair] = useState(initialEntry?.baristaLook.latteArtFlair || LATTE_ART_PRESETS[1]);
  const [baristaDemeanor, setBaristaDemeanor] = useState(initialEntry?.baristaLook.demeanor || 'Warm & Conversational');

  // Coffee Shop Look
  const [shopAesthetic, setShopAesthetic] = useState(initialEntry?.coffeeShopLook.aesthetic || SHOP_AESTHETICS[0]);
  const [shopScore, setShopScore] = useState<number>(initialEntry?.coffeeShopLook.ambienceScore || 9.0);
  const [crowdEnergy, setCrowdEnergy] = useState(initialEntry?.coffeeShopLook.crowdEnergy || 'Relaxed Ambient');
  const [vibeTags, setVibeTags] = useState<string[]>(
    initialEntry?.coffeeShopLook.vibeTags || ['Natural Daylight', 'Spacious Seating']
  );

  // Sensory & Taste
  const [tasteScore, setTasteScore] = useState<number>(initialEntry?.scores.taste || 9.0);
  const [quickNote, setQuickNote] = useState(
    initialEntry?.quickNote ||
      'Bright, creamy extraction with sweet stone fruit acidity and rich milk chocolate finish.'
  );
  const [flavorNotes, setFlavorNotes] = useState<string[]>(initialEntry?.flavorNotes || ['Peach', 'Dark Chocolate']);

  // Photo
  const [photoUrl, setPhotoUrl] = useState<string>(
    initialEntry?.photoUrl || SAMPLE_PHOTO_PRESETS[0].url
  );
  const [priceAmount, setPriceAmount] = useState<string>(initialEntry?.price?.amount?.toString() || '5.50');

  if (!isOpen) return null;

  // Live calculated overall score: 50% taste, 25% barista craft & presentation, 25% shop look & ambience
  const computedOverall = +(tasteScore * 0.5 + baristaScore * 0.25 + shopScore * 0.25).toFixed(1);
  const livePercentile = calculateWorldwideScorePercentile(computedOverall);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetNow = () => {
    const d = new Date();
    setDateVal(d.toISOString().slice(0, 10));
    setTimeVal(d.toTimeString().slice(0, 5));
  };

  const toggleFlavorTag = (tag: string) => {
    if (flavorNotes.includes(tag)) {
      setFlavorNotes(flavorNotes.filter((t) => t !== tag));
    } else {
      if (flavorNotes.length < 5) {
        setFlavorNotes([...flavorNotes, tag]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct ISO string with timezone
    const combinedDate = new Date(`${dateVal}T${timeVal}:00`);
    const timestamp = isNaN(combinedDate.getTime()) ? new Date().toISOString() : combinedDate.toISOString();

    let estCaffeine = 120;
    if (coffeeType.includes('Espresso')) estCaffeine = 140;
    else if (coffeeType === 'Cold Brew') estCaffeine = 180;
    else if (coffeeType === 'Cortado') estCaffeine = 110;
    else if (coffeeType === 'V60 Pourover') estCaffeine = 150;

    const newEntry: CoffeeEntry = {
      id: initialEntry ? initialEntry.id : `entry-${Date.now()}`,
      timestamp,
      brand: brand.trim() || 'Specialty Roaster',
      location: {
        cafeName: cafeName.trim() || 'Neighborhood Cafe',
        city: city.trim() || 'Local',
        country: country.trim() || 'Worldwide',
        neighborhood: neighborhood.trim() || undefined,
      },
      coffeeType,
      milkType,
      roastLevel,
      baristaLook: {
        style: baristaStyle,
        presentationScore: baristaScore,
        latteArtFlair,
        demeanor: baristaDemeanor,
      },
      coffeeShopLook: {
        aesthetic: shopAesthetic,
        ambienceScore: shopScore,
        vibeTags,
        crowdEnergy: crowdEnergy as any,
      },
      quickNote: quickNote.trim(),
      flavorNotes,
      photoUrl,
      scores: {
        taste: tasteScore,
        barista: baristaScore,
        shopLook: shopScore,
        overall: computedOverall,
      },
      price: priceAmount ? { amount: parseFloat(priceAmount) || 0, currency: 'USD' } : undefined,
      estCaffeineMg: estCaffeine,
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {initialEntry ? 'Edit Coffee Entry' : 'Log New Coffee'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Record drink details, barista presentation, shop aesthetic & worldwide score
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Date & Time Stamping */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Date & Time Stamp
              </label>
              <button
                type="button"
                onClick={handleSetNow}
                className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
              >
                Set to Right Now
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-500 mb-1 block">Date</span>
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 mb-1 block">Time</span>
                <input
                  type="time"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Brand, Location & Coffee Type */}
          <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Coffee & Roaster Details
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Brand / Roaster
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Onyx, Tim Wendelboe, % Arabica"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {COMMON_BRANDS.slice(0, 4).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className="text-[10px] px-1.5 py-0.5 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 bg-stone-100 dark:bg-stone-800 rounded transition-colors"
                    >
                      +{b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Coffee Type
                </label>
                <select
                  value={coffeeType}
                  onChange={(e) => setCoffeeType(e.target.value as CoffeeType)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Espresso">Espresso</option>
                  <option value="Double Espresso">Double Espresso</option>
                  <option value="Flat White">Flat White</option>
                  <option value="Cortado">Cortado</option>
                  <option value="Cappuccino">Cappuccino</option>
                  <option value="Latte">Latte</option>
                  <option value="Macchiato">Macchiato</option>
                  <option value="V60 Pourover">V60 Pourover</option>
                  <option value="Chemex">Chemex</option>
                  <option value="Aeropress">Aeropress</option>
                  <option value="Cold Brew">Cold Brew</option>
                  <option value="Nitro Cold Brew">Nitro Cold Brew</option>
                  <option value="Americano">Americano</option>
                  <option value="Specialty Tonic">Specialty Tonic</option>
                </select>
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Café Name
                </label>
                <input
                  type="text"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                  placeholder="e.g. St. Ali Cafe"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Melbourne"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Australia"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Milk Base
                </label>
                <select
                  value={milkType}
                  onChange={(e) => setMilkType(e.target.value as MilkType)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Whole Milk">Whole Milk</option>
                  <option value="Oat Milk">Oat Milk</option>
                  <option value="Almond Milk">Almond Milk</option>
                  <option value="Soy Milk">Soy Milk</option>
                  <option value="Black / None">Black / None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Roast Profile
                </label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Light">Light (Nordic/Floral)</option>
                  <option value="Medium-Light">Medium-Light</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="Medium-Dark">Medium-Dark</option>
                  <option value="Dark">Dark (Traditional)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                  placeholder="5.50"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Barista Look & Presentation */}
          <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Barista Look & Presentation
              </label>
              <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                Score: {baristaScore.toFixed(1)}/10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Barista Style & Apparel
                </label>
                <select
                  value={baristaStyle}
                  onChange={(e) => setBaristaStyle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {BARISTA_STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Latte Art / Extraction Flair
                </label>
                <select
                  value={latteArtFlair}
                  onChange={(e) => setLatteArtFlair(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {LATTE_ART_PRESETS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Barista Demeanor
                </label>
                <select
                  value={baristaDemeanor}
                  onChange={(e) => setBaristaDemeanor(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Warm & Conversational">Warm & Conversational</option>
                  <option value="Precision Craftsman">Precision Craftsman</option>
                  <option value="Chill & Welcoming">Chill & Welcoming</option>
                  <option value="Focused & Quiet">Focused & Quiet</option>
                </select>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-stone-500 mb-1 flex justify-between">
                <span>Barista Presentation Score</span>
                <span className="font-mono">{baristaScore.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min="5"
                max="10"
                step="0.1"
                value={baristaScore}
                onChange={(e) => setBaristaScore(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Coffee Shop Look & Ambience */}
          <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Coffee Shop Look & Vibe
              </label>
              <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                Score: {shopScore.toFixed(1)}/10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Shop Aesthetic & Architectural Style
                </label>
                <select
                  value={shopAesthetic}
                  onChange={(e) => setShopAesthetic(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {SHOP_AESTHETICS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Crowd & Space Energy
                </label>
                <select
                  value={crowdEnergy}
                  onChange={(e) => setCrowdEnergy(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Zen / Quiet">Zen / Quiet</option>
                  <option value="Relaxed Ambient">Relaxed Ambient</option>
                  <option value="Bustling Neighborhood">Bustling Neighborhood</option>
                  <option value="High-Energy Tasting Bar">High-Energy Tasting Bar</option>
                </select>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-stone-500 mb-1 flex justify-between">
                <span>Shop Ambience & Aesthetic Score</span>
                <span className="font-mono">{shopScore.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min="5"
                max="10"
                step="0.1"
                value={shopScore}
                onChange={(e) => setShopScore(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 5: Taste Score & Quick Note */}
          <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Taste Score & Quick Note
              </label>
              <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                Taste: {tasteScore.toFixed(1)}/10
              </span>
            </div>

            <div>
              <span className="text-[11px] text-stone-500 mb-1 flex justify-between">
                <span>Cup Taste & Sensory Extraction</span>
                <span className="font-mono">{tasteScore.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min="5"
                max="10"
                step="0.1"
                value={tasteScore}
                onChange={(e) => setTasteScore(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Quick Tasting Note
              </label>
              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                rows={2}
                placeholder="Aroma, acidity, mouthfeel, sweetness notes..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            {/* Flavor chips */}
            <div>
              <span className="text-[11px] text-stone-500 mb-1.5 block">Flavor Highlights (Select up to 5)</span>
              <div className="flex flex-wrap gap-1.5">
                {FLAVOR_TAGS.map((tag) => {
                  const isSelected = flavorNotes.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleFlavorTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-amber-700 text-white font-medium'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 6: Photo Upload */}
          <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Photo Upload
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Photo Preview Container */}
              <div className="w-36 h-28 shrink-0 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Coffee Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                    <Coffee className="w-6 h-6 mb-1 opacity-50" />
                    <span>No image</span>
                  </div>
                )}
              </div>

              {/* Upload Controls & Presets */}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-md transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-stone-400 block mb-1">Or choose photo preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setPhotoUrl(preset.url)}
                        className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                          photoUrl === preset.url
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-medium'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Live Worldwide Score Comparison Card */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Calculated Score & Worldwide Standing
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                  {computedOverall.toFixed(1)}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">/ 10 Overall Score</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                This cup ranks in the <strong className="text-amber-800 dark:text-amber-300 font-mono">{livePercentile}th percentile</strong> worldwide (Top {Math.max(1, 100 - livePercentile)}% of evaluated specialty coffees).
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors"
              >
                {initialEntry ? 'Save Changes' : 'Log Coffee Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
