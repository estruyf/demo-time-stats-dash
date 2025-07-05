import * as React from "react"
import { useEffect, useState } from "react"
import { ExtensionStats, fetchExtensionStats, getMockStats, fetchPublisherExtensions, getMockExtensions, Extension } from "@/lib/api"
import { calculateMetricTotals, getLastNDays } from "@/lib/utils"
import { SummaryCard } from "@/components/summary-card"
import { StatsChart } from "@/components/stats-chart"
import { StatsTable } from "@/components/stats-table"
import { ExtensionSelector } from "@/components/extension-selector"
import { DownloadSimpleIcon, EyeIcon, DesktopIcon, ProhibitInsetIcon } from "@phosphor-icons/react"
import { toast, Toaster } from "sonner"

export const NR_OF_DAYS = 30 // Default to 30 days for stats

function App() {
  const [stats, setStats] = useState<ExtensionStats | null>(null)
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExtension, setSelectedExtension] = useState<string>("vscode-demo-time")
  const [useMockData, setUseMockData] = useState<boolean>(
    () => import.meta.env.VITE_USE_MOCK_DATA === "true"
  )

  // Fetch extensions on component mount
  useEffect(() => {
    async function loadExtensions() {
      try {
        let extensionsList: Extension[];

        if (useMockData) {
          extensionsList = getMockExtensions()
        } else {
          try {
            extensionsList = await fetchPublisherExtensions()
          } catch (err) {
            console.warn("Failed to fetch real extensions, using mock data:", err)
            extensionsList = getMockExtensions()
          }
        }

        setExtensions(extensionsList)
      } catch (err) {
        console.error("Error loading extensions:", err)
        setExtensions(getMockExtensions())
      }
    }

    loadExtensions()
  }, [useMockData])

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)

        let data: ExtensionStats;

        if (useMockData) {
          // Use mock data when no token is provided or mock mode is enabled
          data = getMockStats(selectedExtension)
          toast.info("Using mock data. Provide a PAT token to fetch real data.")
        } else {
          // Use real API when token is provided
          data = await fetchExtensionStats(selectedExtension)
          toast.success("Loaded real extension statistics")
        }

        setStats(data)
        setError(null)
      } catch (err) {
        setError("Failed to load extension statistics. Please try again later.")
        console.error(err)
        setUseMockData(true) // Fall back to mock data on error
        toast.error("API call failed. Using mock data instead.")
        setStats(getMockStats(selectedExtension))
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [useMockData, selectedExtension])

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
  // Stats are ordered from most recent to oldest
  const last14DaysData = stats.dailyStats.slice(0, 14)
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
    if (previousSum === 0) {
      if (currentSum === 0) return 0
      return metric === 'uninstalls' ? -100 : 100
    }

    const diff = Math.round(((currentSum - previousSum) / previousSum) * 100)
    return metric === 'uninstalls' ? -diff : diff
  }

  const handleToggleMockData = () => {
    setUseMockData(!useMockData)
    toast.info(useMockData ? "Switching to API data" : "Switching to mock data")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Toaster position="top-right" />
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{stats.extensionName}</h1>
            <p className="text-muted-foreground">
              By {stats.publisherName} • {stats.statCount} days of statistics
            </p>
            <div className="mt-2 flex items-center gap-3">
              <img
                src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fstats.demotime.show"
                alt="Visitor Badge"
                className="inline-block"
              />
              <a
                href="https://github.com/estruyf/demo-time-stats-dash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <span>View Source</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          {extensions.length > 0 && (
            <ExtensionSelector
              extensions={extensions}
              selectedExtension={selectedExtension}
              onSelectionChange={setSelectedExtension}
              disabled={loading}
            />
          )}
        </div>
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