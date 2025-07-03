import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { type DailyStat, type ExtensionStats } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy')
}

export function sumStatsMetric(stats: ExtensionStats, metric: keyof DailyStat['counts']): number {
  return stats.dailyStats.reduce((total, stat) => {
    return total + (stat.counts[metric] || 0)
  }, 0)
}

export function calculateMetricTotals(stats: ExtensionStats) {
  return {
    pageViews: sumStatsMetric(stats, 'webPageViews'),
    installs: sumStatsMetric(stats, 'installCount'),
    downloads: sumStatsMetric(stats, 'webDownloadCount'),
    uninstalls: sumStatsMetric(stats, 'uninstallCount')
  }
}

export function getLastNDays(stats: ExtensionStats, days: number): DailyStat[] {
  return stats.dailyStats.slice(0, days).reverse()
}
