import { useEffect, useState } from "react"
import { ExtensionStats, getMockStats } from "@/lib/api"
import { calculateMetricTotals, getLastNDays } from "@/lib/utils"
import { SummaryCard } from "@/components/summary-card"
import { StatsChart } from "@/components/stats-chart"
import { StatsTable } from "@/components/stats-table"
import { ChartLineUp, DownloadSimple, Eye, InstallDesktop, ProhibitInset } from "@phosphor-icons/react"

function App() {
  const [stats, setStats] = useState<ExtensionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        
        // In a real app, we would use fetchExtensionStats()
        // For demo purposes, using mock data to ensure we have data to display
        const data = getMockStats()
        
        setStats(data)
        setError(null)
      } catch (err) {
        setError("Failed to load extension statistics. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
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
          icon={Eye}
          trend={calculateTrend('pageViews')}
          trendLabel="vs previous week"
        />
        <SummaryCard 
          title="Installs" 
          value={totals.installs} 
          icon={InstallDesktop}
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