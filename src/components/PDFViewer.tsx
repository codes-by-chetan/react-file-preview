import type { PDFViewerProps } from "../types"

export function PDFViewer({ src, className = "", onError, onLoad }: PDFViewerProps) {
  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`}
      className={`w-full h-full border-0 ${className}`}
      title="PDF Viewer"
      onLoad={onLoad}
      onError={() => onError?.("Failed to load PDF")}
    />
  )
}
