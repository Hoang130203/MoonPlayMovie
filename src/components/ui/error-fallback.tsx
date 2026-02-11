interface ErrorFallbackProps {
  message?: string
  onRetry?: () => void
}

export function ErrorFallback({
  message = 'Đã xảy ra lỗi khi tải dữ liệu.',
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4">⚠</div>
      <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg transition-colors font-medium"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'Không tìm thấy kết quả nào.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">🎬</div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
}
