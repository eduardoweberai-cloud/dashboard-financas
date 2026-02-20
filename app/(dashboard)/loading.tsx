import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-md w-48" />
        <div className="h-4 bg-muted rounded-md w-96" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded-md w-24" />
              <div className="h-6 bg-muted rounded-full w-12" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-8 bg-muted rounded-md w-32" />
              <div className="h-3 bg-muted rounded-md w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded-md w-32" />
          <div className="h-4 bg-muted rounded-md w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded-md w-24" />
                <div className="h-4 bg-muted rounded-md w-12" />
              </div>
              <div className="h-2 bg-muted rounded-full w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded-md w-40" />
          <div className="h-4 bg-muted rounded-md w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="h-4 bg-muted rounded-md w-32" />
              <div className="h-4 bg-muted rounded-md w-16" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Buttons Skeleton */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="h-10 bg-muted rounded-md w-32" />
        <div className="h-10 bg-muted rounded-md w-40" />
        <div className="h-10 bg-muted rounded-md w-32" />
      </div>
    </div>
  )
}
