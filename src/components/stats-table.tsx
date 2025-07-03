import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DailyStat } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface StatsTableProps {
  data: DailyStat[]
  className?: string
}

export function StatsTable({ data, className }: StatsTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Daily Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Page Views</TableHead>
                <TableHead>Installs</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Uninstalls</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {formatDate(stat.statisticDate)}
                  </TableCell>
                  <TableCell>{stat.counts.webPageViews || 0}</TableCell>
                  <TableCell>{stat.counts.installCount || 0}</TableCell>
                  <TableCell>{stat.counts.webDownloadCount || 0}</TableCell>
                  <TableCell>{stat.counts.uninstallCount || 0}</TableCell>
                  <TableCell>{stat.counts.averageRating || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}