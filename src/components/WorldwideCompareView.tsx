import React, { useState } from 'react';
import { CoffeeEntry } from '../types/coffee';
import {
  WORLD_CITY_BENCHMARKS,
  WORLD_COUNTRY_INTAKE,
  GLOBAL_BENCHMARK,
} from '../data/worldwideData';
import {
  calculateDailyStats,
  calculateWorldwideScorePercentile,
  compareIntakeToWorld,
} from '../utils/coffeeStats';
import { RadarChart } from './RadarChart';
import { WorldwideBellCurve } from './WorldwideBellCurve';
import { Globe, Award, Trophy, Compass, Sparkles, MapPin, Coffee, ArrowUpRight } from 'lucide-react';

interface WorldwideCompareViewProps {
  entries: CoffeeEntry[];
  onSelectEntry: (entry: CoffeeEntry) => void;
}

export const WorldwideCompareView: React.FC<WorldwideCompareViewProps> = ({
  entries,
  onSelectEntry,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Melbourne');
  const [compareCategory, setCompareCategory] = useState<'overall' | 'intake' | 'cities'>('overall');

  const stats = calculateDailyStats(entries);
  const intakeComparison = compareIntakeToWorld(stats.avgCupsPerDay);
  const overallPercentile = calculateWorldwideScorePercentile(stats.avgOverall);
  const topPercent = Math.max(1, 100 - overallPercentile);

  const cityData = WORLD_CITY_BENCHMARKS.find((c) => c.city === selectedCity) || WORLD_CITY_BENCHMARKS[0];

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <span>Worldwide Coffee Benchmark</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Compare your daily consumption volume and sensory scores against 142,000+ specialty coffee logs worldwide
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
          <button
            type="button"
            onClick={() => setCompareCategory('overall')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              compareCategory === 'overall'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Score & Quality Index
          </button>
          <button
            type="button"
            onClick={() => setCompareCategory('intake')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              compareCategory === 'intake'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Daily Intake vs Nations
          </button>
          <button
            type="button"
            onClick={() => setCompareCategory('cities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              compareCategory === 'cities'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            World Coffee Capitals
          </button>
        </div>
      </div>

      {/* Hero Benchmark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Global Score Percentile */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Global Score Percentile
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-800 dark:text-amber-400 font-mono tabular-nums">
              Top {topPercent}%
            </span>
            <span className="text-xs text-stone-500">({overallPercentile}th percentile)</span>
          </div>
          <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
            Your coffee quality average ({stats.avgOverall.toFixed(1)}/10) surpasses {overallPercentile}% of coffees cataloged worldwide.
          </p>
        </div>

        {/* Card 2: Per-Capita Intake Alignment */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            National Consumption Twin
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>{intakeComparison.closestCountry.flagEmoji}</span>
              <span>{intakeComparison.closestCountry.country}</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
            Your {stats.avgCupsPerDay} cups/day pace matches {intakeComparison.closestCountry.country}&apos;s national average ({intakeComparison.closestCountry.cupsPerDay} cups/day).
          </p>
        </div>

        {/* Card 3: Taste Delta */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Sensory Taste Premium
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
              +{(stats.avgTaste - GLOBAL_BENCHMARK.globalAvgTaste).toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">above world avg (7.9)</span>
          </div>
          <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
            You rate extraction clarity and roast terroir significantly higher than mainstream specialty averages.
          </p>
        </div>
      </div>

      {/* Section 1: Quality Index / Radar & Distribution */}
      {compareCategory === 'overall' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Radar Chart Comparison */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Sensory & Aesthetic Radar Comparison</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Your average ratings plotted against the Global Specialty Coffee standard
              </p>
            </div>

            <div className="pt-2">
              <RadarChart
                userScores={{
                  taste: stats.avgTaste,
                  barista: stats.avgBarista,
                  shopLook: stats.avgShopLook,
                  overall: stats.avgOverall,
                }}
                worldScores={{
                  taste: GLOBAL_BENCHMARK.globalAvgTaste,
                  barista: GLOBAL_BENCHMARK.globalAvgBarista,
                  shopLook: GLOBAL_BENCHMARK.globalAvgShopLook,
                  overall: GLOBAL_BENCHMARK.globalAvgScore,
                }}
                size={320}
              />
            </div>

            {/* Metric Comparisons Table */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Taste Index</span>
                <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-400">
                  {stats.avgTaste.toFixed(1)}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">vs 7.9 global</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Barista Craft</span>
                <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-400">
                  {stats.avgBarista.toFixed(1)}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">vs 7.8 global</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Shop Vibe</span>
                <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-400">
                  {stats.avgShopLook.toFixed(1)}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">vs 7.9 global</span>
              </div>
            </div>
          </div>

          {/* Worldwide Bell Curve Distribution */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-700" />
                <span>Global Score Distribution Curve</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Where your logged cups land across 142,000+ evaluated coffees
              </p>
            </div>

            <WorldwideBellCurve userScore={stats.avgOverall} label="Your Overall Average" />

            {/* Top Logged Cups Highlight */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Your Highest-Scoring Cups
              </h4>
              <div className="space-y-2">
                {entries
                  .slice()
                  .sort((a, b) => b.scores.overall - a.scores.overall)
                  .slice(0, 3)
                  .map((cup) => (
                    <div
                      key={cup.id}
                      onClick={() => onSelectEntry(cup)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cup.photoUrl}
                          alt={cup.brand}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{cup.brand}</p>
                          <p className="text-[11px] text-stone-500">{cup.coffeeType} · {cup.location.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-400">
                          {cup.scores.overall.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          Top {Math.max(1, 100 - calculateWorldwideScorePercentile(cup.scores.overall))}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Intake vs World Nations */}
      {compareCategory === 'intake' && (
        <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Daily Cups Per Person: International Leaderboard
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Official International Coffee Organization (ICO) per-capita intake benchmarks
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-md">
              Your Daily Average: <strong>{stats.avgCupsPerDay} cups/day</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORLD_COUNTRY_INTAKE.map((c, idx) => {
              const diff = +(stats.avgCupsPerDay - c.cupsPerDay).toFixed(1);
              const isMatch = Math.abs(diff) <= 0.3;

              return (
                <div
                  key={c.code}
                  className={`p-4 rounded-xl border transition-all ${
                    isMatch
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-xs'
                      : 'bg-stone-50/40 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.flagEmoji}</span>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        #{idx + 1} {c.country}
                      </span>
                      {isMatch && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded font-semibold">
                          Your Closest Match
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold font-mono text-stone-900 dark:text-stone-100">
                        {c.cupsPerDay}
                      </span>
                      <span className="text-[10px] text-stone-400 ml-1">cups / day</span>
                    </div>
                  </div>

                  <div className="mt-2.5 w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isMatch ? 'bg-amber-600' : 'bg-stone-400 dark:bg-stone-500'}`}
                      style={{ width: `${Math.min(100, (c.cupsPerDay / 4.0) * 100)}%` }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {c.coffeeCultureNotes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: World Coffee Capitals */}
      {compareCategory === 'cities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* City Selector List (4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 mb-2">
              Select World City
            </h3>
            <div className="space-y-1">
              {WORLD_CITY_BENCHMARKS.map((item) => (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => setSelectedCity(item.city)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    selectedCity === item.city
                      ? 'bg-amber-800 text-white font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.city}, {item.country}</span>
                  </span>
                  <span className="font-mono text-[11px]">{item.avgScore.toFixed(1)}/10</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected City Benchmark Profile (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Specialty City Dossier
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {cityData.city}, {cityData.country}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                  {cityData.avgScore.toFixed(1)}
                </span>
                <span className="text-xs text-stone-500 block">/ 10 City Index</span>
              </div>
            </div>

            {/* City Scores Breakdown vs Your Scores */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Taste Standard</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {cityData.avgTaste.toFixed(1)}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-mono">
                  You: {stats.avgTaste.toFixed(1)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Barista Craft</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {cityData.avgBarista.toFixed(1)}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-mono">
                  You: {stats.avgBarista.toFixed(1)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[11px] text-stone-500 block">Shop Atmosphere</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {cityData.avgShopLook.toFixed(1)}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-mono">
                  You: {stats.avgShopLook.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Distinctive Features */}
            <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                  Signature Drink:
                </span>
                <p className="text-stone-600 dark:text-stone-300 font-medium">{cityData.signatureDrink}</p>
              </div>

              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                  Latte Art & Barista Look Standard:
                </span>
                <p className="text-stone-600 dark:text-stone-300">{cityData.latteArtStandard}</p>
              </div>

              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                  Coffee Shop Look Archetype:
                </span>
                <p className="text-stone-600 dark:text-stone-300">{cityData.shopVibeArchetype}</p>
              </div>

              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                  Notable Benchmark Roasters:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cityData.topRoasters.map((r) => (
                    <span
                      key={r}
                      className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-medium text-[11px]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
