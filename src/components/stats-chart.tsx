import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyStat } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface StatsChartProps {
  data: DailyStat[]
  className?: string
}

export function StatsChart({ data, className }: StatsChartProps) {
  // Prepare data for the chart
  const labels = data.map(stat => formatDate(stat.statisticDate))

  const datasets = {
    pageViews: {
      label: 'Page Views',
      data: data.map(stat => stat.counts.webPageViews || 0),
      borderColor: 'rgb(59, 130, 246)', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    installs: {
      label: 'Installs',
      data: data.map(stat => stat.counts.installCount || 0),
      borderColor: 'rgb(16, 185, 129)', // Green
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    downloads: {
      label: 'Downloads',
      data: data.map(stat => stat.counts.webDownloadCount || 0),
      borderColor: 'rgb(139, 92, 246)', // Purple
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    uninstalls: {
      label: 'Uninstalls',
      data: data.map(stat => stat.counts.uninstallCount || 0),
      borderColor: 'rgb(239, 68, 68)', // Red
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <Card className={`${className} overflow-hidden overflow-x-scroll`}>
      <CardHeader>
        <CardTitle>Metrics Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Metrics</TabsTrigger>
            <TabsTrigger value="pageViews">Page Views</TabsTrigger>
            <TabsTrigger value="installs">Installs</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="uninstalls">Uninstalls</TabsTrigger>
          </TabsList>

          <div className="h-80 w-full">
            <TabsContent value="all" className="h-full mt-0">
              <Line
                options={options}
                data={{
                  labels,
                  datasets: [
                    datasets.pageViews,
                    datasets.installs,
                    datasets.downloads,
                    datasets.uninstalls
                  ]
                }}
              />
            </TabsContent>

            <TabsContent value="pageViews" className="h-full mt-0">
              <Line
                options={options}
                data={{
                  labels,
                  datasets: [datasets.pageViews]
                }}
              />
            </TabsContent>

            <TabsContent value="installs" className="h-full mt-0">
              <Line
                options={options}
                data={{
                  labels,
                  datasets: [datasets.installs]
                }}
              />
            </TabsContent>

            <TabsContent value="downloads" className="h-full mt-0">
              <Line
                options={options}
                data={{
                  labels,
                  datasets: [datasets.downloads]
                }}
              />
            </TabsContent>

            <TabsContent value="uninstalls" className="h-full mt-0">
              <Line
                options={options}
                data={{
                  labels,
                  datasets: [datasets.uninstalls]
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}