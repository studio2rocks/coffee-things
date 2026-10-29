import React from 'react';
import { CoffeeEntry } from '../types/coffee';
import { getPast7Days } from '../utils/coffeeStats';

interface IntakeBarChartProps {
  entries: CoffeeEntry[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  targetLimit?: number; // e.g. 4 cups
}

export const IntakeBarChart: React.FC<IntakeBarChartProps> = ({
  entries,
  selectedDate,
  onSelectDate,
  targetLimit = 4,
}) => {
  const past7Days = getPast7Days();

  // Map each day to count and caffeine
  const dayStats = past7Days.map((d) => {
    const dayEntries = entries.filter((e) => e.timestamp.startsWith(d.dateStr));
    const count = dayEntries.length;
    const caffeine = dayEntries.reduce((sum, e) => sum + (e.estCaffeineMg || 120), 0);
    return {
      ...d,
      count,
      caffeine,
      entries: dayEntries,
    };
  });

  const maxCount = Math.max(5, ...dayStats.map((d) => d.count), targetLimit);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs text-stone-500 dark:text-stone-400">
        <span>Daily Coffee Consumption (Last 7 Days)</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-0.5 bg-amber-500"></span> Recommended Max ({targetLimit} cups)
        </span>
      </div>

      <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-stone-200 dark:border-stone-800 relative">
        {/* Recommended max guide line */}
        <div
          className="absolute w-full border-b border-dashed border-amber-500/60 pointer-events-none z-0"
          style={{ bottom: `${(targetLimit / maxCount) * 100}%` }}
        >
          <span className="absolute right-0 -top-4 font-mono text-[10px] text-amber-600 dark:text-amber-400">
            {targetLimit} cups/day limit
          </span>
        </div>

        {dayStats.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          const isToday = item.dateStr === new Date().toISOString().split('T')[0];
          const heightPercent = Math.max(8, (item.count / maxCount) * 100);

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
            >
              <div className="w-full max-w-[48px] flex flex-col items-center justify-end h-full">
                {/* Count badge above bar */}
                <span
                  className={`text-xs font-mono tabular-nums mb-1 font-semibold transition-colors ${
                    isSelected
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200'
                  }`}
                >
                  {item.count}
                </span>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-700 dark:bg-amber-500 shadow-sm'
                      : isToday
                      ? 'bg-amber-600/80 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500'
                      : item.count > 0
                      ? 'bg-stone-300 hover:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600'
                      : 'bg-stone-100 dark:bg-stone-800/60'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    isSelected
                      ? 'text-amber-800 dark:text-amber-300 font-bold'
                      : isToday
                      ? 'text-stone-900 dark:text-stone-100 font-semibold'
                      : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {item.shortDay}
                </p>
                <p className="text-[10px] text-stone-400 font-mono">{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
