import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Icon } from "@phosphor-icons/react"

interface SummaryCardProps {
  title: string
  value: number
  icon: Icon
  trend?: number
  trendLabel?: string
  className?: string
}

export function SummaryCard({ 
  title, 
  value, 
  icon: IconComponent, 
  trend, 
  trendLabel, 
  className 
}: SummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend !== undefined && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1 flex items-center",
            trend > 0 && "text-accent",
            trend < 0 && "text-destructive"
          )}>
            {trend > 0 && "↑"}
            {trend < 0 && "↓"}
            {trend === 0 && "→"}
            {" "}
            {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}