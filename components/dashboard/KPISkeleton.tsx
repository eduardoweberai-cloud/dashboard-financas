/**
 * KPISkeleton - Loading state com shimmer animation
 * Mostra 3 cards em skeleton enquanto dados carregam
 */
export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Header shimmer */}
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-200" />

          {/* Valor realizado shimmer */}
          <div className="mb-4 h-8 w-32 animate-pulse rounded bg-gray-200" />

          {/* Linha 2 shimmer */}
          <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />

          {/* Linha 3 shimmer */}
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
