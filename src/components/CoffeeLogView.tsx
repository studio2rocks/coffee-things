import React, { useState } from 'react';
import { CoffeeEntry, CoffeeType } from '../types/coffee';
import { formatDate, formatTime, calculateWorldwideScorePercentile } from '../utils/coffeeStats';
import { Search, Plus, MapPin, Store, UserCheck, Calendar, SlidersHorizontal } from 'lucide-react';

interface CoffeeLogViewProps {
  entries: CoffeeEntry[];
  onOpenLogModal: () => void;
  onSelectEntry: (entry: CoffeeEntry) => void;
}

export const CoffeeLogView: React.FC<CoffeeLogViewProps> = ({
  entries,
  onOpenLogModal,
  onSelectEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Filter types
  const coffeeTypes = ['All', 'Flat White', 'Espresso', 'Double Espresso', 'V60 Pourover', 'Cortado', 'Cold Brew', 'Cappuccino'];

  // Filter and sort entries
  const filtered = entries.filter((entry) => {
    const matchesType = selectedType === 'All' || entry.coffeeType === selectedType;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesType;

    const matchesSearch =
      entry.brand.toLowerCase().includes(q) ||
      entry.location.cafeName.toLowerCase().includes(q) ||
      entry.location.city.toLowerCase().includes(q) ||
      entry.location.country.toLowerCase().includes(q) ||
      entry.quickNote.toLowerCase().includes(q) ||
      entry.baristaLook.style.toLowerCase().includes(q) ||
      entry.coffeeShopLook.aesthetic.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'highest') {
      return b.scores.overall - a.scores.overall;
    }
    if (sortBy === 'lowest') {
      return a.scores.overall - b.scores.overall;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Coffee Journal ({entries.length} logged)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Every cup recorded with barista look, shop aesthetic, tasting notes, and worldwide scores
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Coffee</span>
        </button>
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roasters, cafes, cities, barista notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Coffee Type Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {coffeeTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedType === type
                  ? 'bg-amber-800 dark:bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Grid of Coffee Cards */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            No coffees match your search or filter
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Try adjusting your search query or reset the filter
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
            }}
            className="mt-3 px-3 py-1.5 text-xs text-amber-800 dark:text-amber-400 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((entry) => {
            const percentile = calculateWorldwideScorePercentile(entry.scores.overall);
            const topPercent = Math.max(1, 100 - percentile);

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="group flex flex-col bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Photo & Badge */}
                <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={entry.photoUrl}
                    alt={entry.brand}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

                  {/* Date and Time Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/70 backdrop-blur-xs text-[11px] text-stone-200">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{formatDate(entry.timestamp)} · {formatTime(entry.timestamp)}</span>
                  </div>

                  {/* Score Tag */}
                  <div className="absolute top-3 right-3 flex items-baseline gap-1 px-2.5 py-1 rounded-md bg-amber-800/90 backdrop-blur-xs text-white">
                    <span className="text-sm font-extrabold font-mono tabular-nums">
                      {entry.scores.overall.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-amber-200">/10</span>
                  </div>

                  {/* Beverage Type & Milk on Photo */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-semibold text-amber-300 block">
                      {entry.coffeeType}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-white leading-tight">
                      {entry.brand}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{entry.location.cafeName}, {entry.location.city}</span>
                  </div>

                  {/* Barista Look & Shop Look Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-100 dark:border-stone-800">
                    <div className="space-y-0.5">
                      <span className="text-stone-400 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-amber-600" /> Barista
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 font-medium truncate">
                        {entry.baristaLook.style}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Store className="w-3 h-3 text-amber-600" /> Shop Look
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 font-medium truncate">
                        {entry.coffeeShopLook.aesthetic}
                      </p>
                    </div>
                  </div>

                  {/* Quick Note */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic bg-stone-50 dark:bg-stone-800/40 p-2 rounded-lg">
                    &ldquo;{entry.quickNote}&rdquo;
                  </p>

                  {/* Worldwide Standing Footer */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>World Rank: <strong className="text-amber-800 dark:text-amber-300 font-mono">Top {topPercent}%</strong></span>
                    <span className="font-mono">{percentile}th percentile</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
