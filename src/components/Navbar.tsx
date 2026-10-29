import React from 'react';
import { Coffee, Plus, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'daily' | 'journal' | 'worldwide';
  onSelectTab: (tab: 'daily' | 'journal' | 'worldwide') => void;
  onOpenLogModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  todayCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenLogModal,
  darkMode,
  onToggleDarkMode,
  todayCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
            <Coffee className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('daily')}
            className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            CaffèMetrics
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'daily'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Daily Tracker ({todayCount} today)
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('journal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'journal'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Coffee Journal
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('worldwide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'worldwide'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Worldwide Compare
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onOpenLogModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Coffee</span>
          </button>
        </div>
      </div>
    </header>
  );
};
