import { useEffect, useState } from "react"
import { ExtensionStats, fetchExtensionStats, getMockStats } from "@/lib/api"
import { calculateMetricTotals, getLastNDays } from "@/lib/utils"
import { SummaryCard } from "@/components/summary-card"
import { StatsChart } from "@/components/stats-chart"
import { StatsTable } from "@/components/stats-table"
import { DownloadSimpleIcon, EyeIcon, DesktopIcon, ProhibitInsetIcon } from "@phosphor-icons/react"
import { toast, Toaster } from "sonner"

export const NR_OF_DAYS = 30 // Default to 30 days for stats

function App() {
  const [stats, setStats] = useState<ExtensionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState<boolean>(
    () => import.meta.env.VITE_USE_MOCK_DATA === "true"
  )

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)

        let data: ExtensionStats;

        if (useMockData) {
          // Use mock data when no token is provided or mock mode is enabled
          data = getMockStats()
          toast.info("Using mock data. Provide a PAT token to fetch real data.")
        } else {
          // Use real API when token is provided
          data = await fetchExtensionStats()
          toast.success("Loaded real extension statistics")
        }

        setStats(data)
        setError(null)
      } catch (err) {
        setError("Failed to load extension statistics. Please try again later.")
        console.error(err)
        setUseMockData(true) // Fall back to mock data on error
        toast.error("API call failed. Using mock data instead.")
        setStats(getMockStats())
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [useMockData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error}
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const totals = calculateMetricTotals(stats)
  const recentStats = getLastNDays(stats, NR_OF_DAYS) // Last 30 days

  // For trend calculation, compare last 7 days to previous 7 days
  // Get last 14 days of data (most recent first after reverse)
  const last14DaysData = stats.dailyStats.slice(0, 14).reverse()
  const last7Days = last14DaysData.slice(0, 7)  // Most recent 7 days
  const previous7Days = last14DaysData.slice(7, 14)  // Previous 7 days

  const calculateTrend = (metric: keyof ReturnType<typeof calculateMetricTotals>) => {
    const currentSum = last7Days.reduce((sum, stat) => {
      return sum + (
        metric === 'pageViews' ? (stat.counts.webPageViews || 0) :
          metric === 'installs' ? (stat.counts.installCount || 0) :
            metric === 'downloads' ? (stat.counts.webDownloadCount || 0) :
              (stat.counts.uninstallCount || 0)
      )
    }, 0)

    const previousSum = previous7Days.reduce((sum, stat) => {
      return sum + (
        metric === 'pageViews' ? (stat.counts.webPageViews || 0) :
          metric === 'installs' ? (stat.counts.installCount || 0) :
            metric === 'downloads' ? (stat.counts.webDownloadCount || 0) :
              (stat.counts.uninstallCount || 0)
      )
    }, 0)

    // Debug logging
    console.log(`${metric} - Current: ${currentSum}, Previous: ${previousSum}`)
    console.log(`Last 7 days length: ${last7Days.length}, Previous 7 days length: ${previous7Days.length}`)

    // Avoid division by zero
    if (previousSum === 0) return currentSum > 0 ? 100 : 0

    return Math.round(((currentSum - previousSum) / previousSum) * 100)
  }

  const handleToggleMockData = () => {
    setUseMockData(!useMockData)
    toast.info(useMockData ? "Switching to API data" : "Switching to mock data")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Toaster position="top-right" />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{stats.extensionName}</h1>
        <p className="text-muted-foreground">
          By {stats.publisherName} • {stats.statCount} days of statistics
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          title="Page Views"
          value={totals.pageViews}
          icon={EyeIcon}
          trend={calculateTrend('pageViews')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Installs"
          value={totals.installs}
          icon={DesktopIcon}
          trend={calculateTrend('installs')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Downloads"
          value={totals.downloads}
          icon={DownloadSimpleIcon}
          trend={calculateTrend('downloads')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Uninstalls"
          value={totals.uninstalls}
          icon={ProhibitInsetIcon}
          trend={calculateTrend('uninstalls')}
          trendLabel="vs previous week"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 mb-8">
        <StatsChart data={recentStats} />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <StatsTable data={recentStats} />
      </div>
    </div>
  )
}

export default App