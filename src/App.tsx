import React, { useState, useEffect } from 'react';
import { CoffeeEntry } from './types/coffee';
import { INITIAL_COFFEE_ENTRIES } from './data/initialEntries';
import { Navbar } from './components/Navbar';
import { DailyTrackerView } from './components/DailyTrackerView';
import { CoffeeLogView } from './components/CoffeeLogView';
import { WorldwideCompareView } from './components/WorldwideCompareView';
import { LogCoffeeModal } from './components/LogCoffeeModal';
import { CoffeeDetailModal } from './components/CoffeeDetailModal';
import { calculateDailyStats } from './utils/coffeeStats';
import { Download, RefreshCw, Coffee } from 'lucide-react';

const STORAGE_KEY = 'caffemetrics_entries_v1';
const THEME_KEY = 'caffemetrics_theme_v1';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  // Entries state
  const [entries, setEntries] = useState<CoffeeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Error loading saved entries:', err);
      }
    }
    return INITIAL_COFFEE_ENTRIES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error('Error storing entries:', err);
    }
  }, [entries]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'daily' | 'journal' | 'worldwide'>('daily');

  // Modal states
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CoffeeEntry | null>(null);
  const [detailEntry, setDetailEntry] = useState<CoffeeEntry | null>(null);

  const stats = calculateDailyStats(entries);

  // Handlers
  const handleSaveEntry = (newOrUpdated: CoffeeEntry) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === newOrUpdated.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newOrUpdated;
        return updated;
      }
      return [newOrUpdated, ...prev];
    });

    if (detailEntry && detailEntry.id === newOrUpdated.id) {
      setDetailEntry(newOrUpdated);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEditEntry = (entry: CoffeeEntry) => {
    setDetailEntry(null);
    setEditingEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset all entries back to default specialty coffee sample data?')) {
      setEntries(INITIAL_COFFEE_ENTRIES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coffee-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLogModal={() => {
          setEditingEntry(null);
          setIsLogModalOpen(true);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        todayCount={stats.todayCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'daily' && (
          <DailyTrackerView
            entries={entries}
            onOpenLogModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
            onSelectEntry={(entry) => setDetailEntry(entry)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'journal' && (
          <CoffeeLogView
            entries={entries}
            onOpenLogModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
            onSelectEntry={(entry) => setDetailEntry(entry)}
          />
        )}

        {activeTab === 'worldwide' && (
          <WorldwideCompareView
            entries={entries}
            onSelectEntry={(entry) => setDetailEntry(entry)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>CaffèMetrics · Daily Intake, Barista Craft & Worldwide Coffee Benchmarking</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetSampleData}
              className="flex items-center gap-1.5 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LogCoffeeModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
      />

      <CoffeeDetailModal
        entry={detailEntry}
        onClose={() => setDetailEntry(null)}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />
    </div>
  );
}
