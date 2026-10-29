import React, { useState } from 'react';
import { CoffeeEntry } from '../types/coffee';
import { IntakeBarChart } from './IntakeBarChart';
import { calculateDailyStats, formatTime, getTodayKey, compareIntakeToWorld } from '../utils/coffeeStats';
import { Coffee, Plus, Clock, Zap, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface DailyTrackerViewProps {
  entries: CoffeeEntry[];
  onOpenLogModal: () => void;
  onSelectEntry: (entry: CoffeeEntry) => void;
  onSelectTab: (tab: 'daily' | 'journal' | 'worldwide') => void;
}

export const DailyTrackerView: React.FC<DailyTrackerViewProps> = ({
  entries,
  onOpenLogModal,
  onSelectEntry,
  onSelectTab,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const stats = calculateDailyStats(entries);
  const intakeComparison = compareIntakeToWorld(stats.avgCupsPerDay);

  // Selected date entries
  const selectedEntries = entries.filter((e) => e.timestamp.startsWith(selectedDate));
  const selectedCount = selectedEntries.length;
  const selectedCaffeine = selectedEntries.reduce((sum, e) => sum + (e.estCaffeineMg || 120), 0);

  const isToday = selectedDate === getTodayKey();
  const safeDailyMaxCaffeine = 400; // mg (FDA / EFSA daily standard)
  const caffeinePercent = Math.min(100, Math.round((selectedCaffeine / safeDailyMaxCaffeine) * 100));

  return (
    <div className="space-y-8">
      {/* Top Banner Hero Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Intake */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Today&apos;s Intake</span>
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">Target: $\le$ 4</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {stats.todayCount}
            </span>
            <span className="text-xs text-stone-500">coffees consumed</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{stats.todayCount === 0 ? 'No coffee logged today yet' : `${stats.todayCount} cups logged today`}</span>
          </div>
        </div>

        {/* Metric 2: Estimated Caffeine */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Active Day Caffeine</span>
            <span className="font-mono text-[11px] text-stone-400">Cap: 400mg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {selectedCaffeine}
            </span>
            <span className="text-xs text-stone-500">mg caffeine est.</span>
          </div>
          <div className="mt-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                caffeinePercent > 85 ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${caffeinePercent}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Daily Average */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Daily Intake Pace</span>
            <span className="font-mono text-[11px]">All-Time Avg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {stats.avgCupsPerDay}
            </span>
            <span className="text-xs text-stone-500">cups / active day</span>
          </div>
          <p className="mt-3 text-xs text-stone-600 dark:text-stone-400 truncate">
            Closest country: <strong className="text-stone-800 dark:text-stone-200">{intakeComparison.closestCountry.country}</strong> ({intakeComparison.closestCountry.cupsPerDay}/day)
          </p>
        </div>

        {/* Metric 4: Average Score */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>Avg Cup Score</span>
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">World: 7.8</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-800 dark:text-amber-400 font-mono tabular-nums">
              {stats.avgOverall.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">/ 10 quality index</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <button
              onClick={() => onSelectTab('worldwide')}
              className="text-amber-700 dark:text-amber-400 hover:underline font-medium flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>See World Benchmark $\rightarrow$</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split: 7-Day Trend Chart + Daily Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Consumption Chart & Worldwide Intake Comparison Callout */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Intake Timeline & Trend
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Select a day to inspect entries and caffeine load
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenLogModal}
                className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Log For Today
              </button>
            </div>

            <IntakeBarChart
              entries={entries}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              targetLimit={4}
            />
          </div>

          {/* Worldwide Intake Comparison Snapshot */}
          <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Global Consumption Index
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  How your {stats.avgCupsPerDay} cups/day compares to coffee drinkers worldwide
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('worldwide')}
                className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
              >
                Full Global Benchmark
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Finland', cups: 3.8, flag: '🇫🇮' },
                { name: 'Norway', cups: 3.2, flag: '🇳🇴' },
                { name: 'Italy', cups: 2.5, flag: '🇮🇹' },
                { name: 'Your Average', cups: stats.avgCupsPerDay, flag: '☕', highlight: true },
                { name: 'United States', cups: 2.1, flag: '🇺🇸' },
                { name: 'Australia', cups: 1.9, flag: '🇦🇺' },
                { name: 'Japan', cups: 1.6, flag: '🇯🇵' },
              ]
                .sort((a, b) => b.cups - a.cups)
                .map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                      item.highlight
                        ? 'bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 sm:w-32 bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.highlight ? 'bg-amber-700 dark:bg-amber-400' : 'bg-stone-400 dark:bg-stone-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.cups / 4.0) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums w-12 text-right">
                        {item.cups} / day
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Entries Timeline for Selected Date */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isToday ? "Today's Coffees" : `Coffees on ${selectedDate}`}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedCount} {selectedCount === 1 ? 'cup' : 'cups'} logged ({selectedCaffeine} mg caffeine)
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenLogModal}
                className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                title="Add coffee for today"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedEntries.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    No coffee logged for this day
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Tap below to log brand, location, barista look & taste
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenLogModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Log First Coffee
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                {selectedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="py-3.5 flex items-start gap-3 cursor-pointer group hover:bg-stone-50 dark:hover:bg-stone-800/40 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 border border-stone-200/80 dark:border-stone-700/80">
                      <img
                        src={entry.photoUrl}
                        alt={entry.brand}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Entry Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {entry.brand}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 tabular-nums shrink-0">
                          {entry.scores.overall.toFixed(1)}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                        <span className="font-medium text-stone-700 dark:text-stone-300">{entry.coffeeType}</span>
                        <span>·</span>
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span className="font-mono text-[11px]">{formatTime(entry.timestamp)}</span>
                      </div>

                      <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{entry.location.cafeName}, {entry.location.city}</span>
                      </div>

                      <p className="text-[11px] text-stone-600 dark:text-stone-300 italic line-clamp-1 mt-1">
                        &ldquo;{entry.quickNote}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
