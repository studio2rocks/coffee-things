import { CoffeeEntry, GlobalDistribution } from '../types/coffee';
import { GLOBAL_BENCHMARK, WORLD_COUNTRY_INTAKE } from '../data/worldwideData';

export function getTodayKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${formatDate(isoString)} at ${formatTime(isoString)}`;
  } catch {
    return isoString;
  }
}

export function getEntriesForDate(entries: CoffeeEntry[], dateStr: string): CoffeeEntry[] {
  return entries.filter((e) => e.timestamp.startsWith(dateStr));
}

export function calculateDailyStats(entries: CoffeeEntry[]) {
  const todayStr = getTodayKey();
  const todayEntries = getEntriesForDate(entries, todayStr);
  const todayCount = todayEntries.length;
  const todayCaffeine = todayEntries.reduce((sum, e) => sum + (e.estCaffeineMg || 120), 0);

  // Group by day for active days
  const dayGroups: Record<string, CoffeeEntry[]> = {};
  entries.forEach((e) => {
    const day = e.timestamp.split('T')[0];
    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(e);
  });

  const totalDaysLogged = Object.keys(dayGroups).length || 1;
  const avgCupsPerDay = +(entries.length / totalDaysLogged).toFixed(1);

  // Score averages
  const avgOverall = entries.length
    ? +(entries.reduce((acc, e) => acc + e.scores.overall, 0) / entries.length).toFixed(2)
    : 0;
  const avgTaste = entries.length
    ? +(entries.reduce((acc, e) => acc + e.scores.taste, 0) / entries.length).toFixed(2)
    : 0;
  const avgBarista = entries.length
    ? +(entries.reduce((acc, e) => acc + e.scores.barista, 0) / entries.length).toFixed(2)
    : 0;
  const avgShopLook = entries.length
    ? +(entries.reduce((acc, e) => acc + e.scores.shopLook, 0) / entries.length).toFixed(2)
    : 0;

  return {
    todayCount,
    todayCaffeine,
    todayEntries,
    avgCupsPerDay,
    totalLogs: entries.length,
    avgOverall,
    avgTaste,
    avgBarista,
    avgShopLook,
    dayGroups,
  };
}

/**
 * Calculates user's percentile in the world coffee scoring distribution.
 */
export function calculateWorldwideScorePercentile(score: number, benchmark: GlobalDistribution = GLOBAL_BENCHMARK): number {
  if (score <= benchmark.percentile10) {
    return Math.max(1, Math.round((score / benchmark.percentile10) * 10));
  }
  if (score <= benchmark.percentile25) {
    const fraction = (score - benchmark.percentile10) / (benchmark.percentile25 - benchmark.percentile10);
    return Math.round(10 + fraction * 15);
  }
  if (score <= benchmark.percentile50) {
    const fraction = (score - benchmark.percentile25) / (benchmark.percentile50 - benchmark.percentile25);
    return Math.round(25 + fraction * 25);
  }
  if (score <= benchmark.percentile75) {
    const fraction = (score - benchmark.percentile50) / (benchmark.percentile75 - benchmark.percentile50);
    return Math.round(50 + fraction * 25);
  }
  if (score <= benchmark.percentile90) {
    const fraction = (score - benchmark.percentile75) / (benchmark.percentile90 - benchmark.percentile75);
    return Math.round(75 + fraction * 15);
  }
  if (score <= benchmark.percentile99) {
    const fraction = (score - benchmark.percentile90) / (benchmark.percentile99 - benchmark.percentile90);
    return Math.round(90 + fraction * 9);
  }
  return 99;
}

/**
 * Compares user daily intake against worldwide countries.
 */
export function compareIntakeToWorld(userAvgCupsPerDay: number) {
  const sorted = [...WORLD_COUNTRY_INTAKE].sort((a, b) => b.cupsPerDay - a.cupsPerDay);
  
  // Find closest matching country
  let closest = sorted[0];
  let minDiff = Math.abs(userAvgCupsPerDay - closest.cupsPerDay);
  for (const c of sorted) {
    const diff = Math.abs(userAvgCupsPerDay - c.cupsPerDay);
    if (diff < minDiff) {
      minDiff = diff;
      closest = c;
    }
  }

  // Calculate world ranking / percentile among national averages
  const countriesBelow = sorted.filter((c) => c.cupsPerDay < userAvgCupsPerDay).length;
  const intakePercentile = Math.round((countriesBelow / sorted.length) * 100);

  return {
    sortedCountries: sorted,
    closestCountry: closest,
    intakePercentile,
  };
}

export function getPast7Days(): { dateStr: string; label: string; shortDay: string }[] {
  const days: { dateStr: string; label: string; shortDay: string }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const shortDay = d.toLocaleDateString([], { weekday: 'short' });
    const label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    days.push({ dateStr, label, shortDay });
  }
  return days;
}
