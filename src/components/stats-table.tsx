import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DailyStat } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { useState, useMemo } from "react"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"

type SortField = 'date' | 'pageViews' | 'installs' | 'downloads' | 'uninstalls' | 'rating'
type SortDirection = 'asc' | 'desc'

interface StatsTableProps {
  data: DailyStat[]
  className?: string
}

export function StatsTable({ data, className }: StatsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortField) {
        case 'date':
          aValue = new Date(a.statisticDate).getTime()
          bValue = new Date(b.statisticDate).getTime()
          break
        case 'pageViews':
          aValue = a.counts.webPageViews || 0
          bValue = b.counts.webPageViews || 0
          break
        case 'installs':
          aValue = a.counts.installCount || 0
          bValue = b.counts.installCount || 0
          break
        case 'downloads':
          aValue = a.counts.webDownloadCount || 0
          bValue = b.counts.webDownloadCount || 0
          break
        case 'uninstalls':
          aValue = a.counts.uninstallCount || 0
          bValue = b.counts.uninstallCount || 0
          break
        case 'rating':
          aValue = a.counts.averageRating || 0
          bValue = b.counts.averageRating || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortField, sortDirection])

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUpIcon 
            className={`h-3 w-3 ${
              sortField === field && sortDirection === 'asc' 
                ? 'text-foreground' 
                : 'text-muted-foreground/50'
            }`} 
          />
          <ChevronDownIcon 
            className={`h-3 w-3 -mt-1 ${
              sortField === field && sortDirection === 'desc' 
                ? 'text-foreground' 
                : 'text-muted-foreground/50'
            }`} 
          />
        </div>
      </div>
    </TableHead>
  )
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Daily Statistics</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="rounded-md border">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <SortableHeader field="date">Date</SortableHeader>
                <SortableHeader field="pageViews">Page Views</SortableHeader>
                <SortableHeader field="installs">Installs</SortableHeader>
                <SortableHeader field="downloads">Downloads</SortableHeader>
                <SortableHeader field="uninstalls">Uninstalls</SortableHeader>
                <SortableHeader field="rating">Rating</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((stat, index) => (
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