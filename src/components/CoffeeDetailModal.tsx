import React from 'react';
import { CoffeeEntry } from '../types/coffee';
import { WorldwideBellCurve } from './WorldwideBellCurve';
import { calculateWorldwideScorePercentile, formatDateTime } from '../utils/coffeeStats';
import { X, MapPin, Coffee, Store, UserCheck, Trash2, Edit3, Calendar } from 'lucide-react';

interface CoffeeDetailModalProps {
  entry: CoffeeEntry | null;
  onClose: () => void;
  onEdit: (entry: CoffeeEntry) => void;
  onDelete: (id: string) => void;
}

export const CoffeeDetailModal: React.FC<CoffeeDetailModalProps> = ({
  entry,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!entry) return null;

  const percentile = calculateWorldwideScorePercentile(entry.scores.overall);
  const topPercent = Math.max(1, 100 - percentile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden">
        {/* Photo Header */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900">
          <img
            src={entry.photoUrl}
            alt={entry.brand}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors"
              title="Edit Entry"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete this coffee log?')) {
                  onDelete(entry.id);
                  onClose();
                }
              }}
              className="p-2 rounded-full bg-stone-900/70 hover:bg-red-600 text-white backdrop-blur-xs transition-colors"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Overlay Details */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-amber-200 mb-1">
              <span>{entry.coffeeType}</span>
              <span>·</span>
              <span>{entry.milkType}</span>
              <span>·</span>
              <span>{entry.roastLevel} Roast</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{entry.brand}</h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{entry.location.cafeName}, {entry.location.city}, {entry.location.country}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Metadata Row: Date/Time, Price, Caffeine */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>{formatDateTime(entry.timestamp)}</span>
            </div>
            <div className="flex items-center gap-4 font-mono tabular-nums">
              <span>{entry.estCaffeineMg} mg Caffeine</span>
              {entry.price && (
                <span>${entry.price.amount.toFixed(2)} {entry.price.currency}</span>
              )}
            </div>
          </div>

          {/* Quick Tasting Note */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Tasting Note & Flavors
            </h3>
            <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed italic bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-200/60 dark:border-stone-700/60">
              &ldquo;{entry.quickNote}&rdquo;
            </p>
            {entry.flavorNotes && entry.flavorNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.flavorNotes.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Barista & Shop Look Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Barista Look */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600" /> Barista Look
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  {entry.scores.barista.toFixed(1)}/10
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                {entry.baristaLook.style}
              </p>
              <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
                <div>Latte Art: <span className="text-stone-800 dark:text-stone-200">{entry.baristaLook.latteArtFlair}</span></div>
                <div>Demeanor: <span className="text-stone-800 dark:text-stone-200">{entry.baristaLook.demeanor}</span></div>
              </div>
            </div>

            {/* Coffee Shop Look */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-600" /> Coffee Shop Look
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  {entry.scores.shopLook.toFixed(1)}/10
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                {entry.coffeeShopLook.aesthetic}
              </p>
              <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
                <div>Energy: <span className="text-stone-800 dark:text-stone-200">{entry.coffeeShopLook.crowdEnergy}</span></div>
                {entry.coffeeShopLook.vibeTags.length > 0 && (
                  <div>Vibes: <span className="text-stone-800 dark:text-stone-200">{entry.coffeeShopLook.vibeTags.join(', ')}</span></div>
                )}
              </div>
            </div>
          </div>

          {/* Worldwide Comparison Section for this Cup */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Worldwide Benchmark Placement
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  Scored <strong className="font-mono text-stone-900 dark:text-stone-100">{entry.scores.overall.toFixed(1)}/10</strong> overall · Ranks in the <strong className="font-mono text-amber-800 dark:text-amber-300">{percentile}th percentile</strong> (Top {topPercent}% globally).
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {entry.scores.overall.toFixed(1)}
                </span>
              </div>
            </div>

            <WorldwideBellCurve userScore={entry.scores.overall} label="This Cup" />
          </div>
        </div>
      </div>
    </div>
  );
};
