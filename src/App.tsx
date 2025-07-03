import { useEffect, useState } from "react"
import { ExtensionStats, fetchExtensionStats, getMockStats } from "@/lib/api"
import { calculateMetricTotals, getLastNDays } from "@/lib/utils"
import { SummaryCard } from "@/components/summary-card"
import { StatsChart } from "@/components/stats-chart"
import { StatsTable } from "@/components/stats-table"
import { ChartLineUp, DownloadSimple, Eye, Desktop, ProhibitInset } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "sonner"

function App() {
  const [stats, setStats] = useState<ExtensionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patToken, setPatToken, deletePatToken] = useState<string>("vscode-marketplace-pat", "")
  const [tokenInput, setTokenInput] = useState("")
  const [useMockData, setUseMockData] = useState<boolean>("use-mock-data", true)

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
          data = await fetchExtensionStats(patToken)
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
  }, [useMockData, patToken])

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
  const recentStats = getLastNDays(stats, 14) // Last 2 weeks

  // For trend calculation, compare last 7 days to previous 7 days
  const last7Days = getLastNDays(stats, 7)
  const previous7Days = getLastNDays(stats, 14).slice(7)

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

    // Avoid division by zero
    if (previousSum === 0) return currentSum > 0 ? 100 : 0

    return Math.round(((currentSum - previousSum) / previousSum) * 100)
  }

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      setPatToken(tokenInput.trim())
      setTokenInput("")
      setUseMockData(false)
      toast.success("PAT token saved")
    } else {
      toast.error("Please enter a valid PAT token")
    }
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
        <div className="mt-4 p-4 bg-card rounded-lg border border-border">
          <h2 className="text-sm font-medium mb-2">Data Source: {useMockData ? "Mock Data" : "VS Code Marketplace API"}</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                type="password"
                placeholder="Enter your VS Code Marketplace PAT token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleTokenSubmit} disabled={!tokenInput.trim()}>
              Save Token
            </Button>
            <Button variant="outline" onClick={handleToggleMockData}>
              {useMockData ? "Use API Data" : "Use Mock Data"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {patToken ? "Token saved! Using real data when possible." : "No token saved. Using mock data."}
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          title="Page Views"
          value={totals.pageViews}
          icon={Eye}
          trend={calculateTrend('pageViews')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Installs"
          value={totals.installs}
          icon={Desktop}
          trend={calculateTrend('installs')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Downloads"
          value={totals.downloads}
          icon={DownloadSimple}
          trend={calculateTrend('downloads')}
          trendLabel="vs previous week"
        />
        <SummaryCard
          title="Uninstalls"
          value={totals.uninstalls}
          icon={ProhibitInset}
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