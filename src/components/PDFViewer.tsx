import type { PDFViewerProps } from "../types"

export function PDFViewer({ src, blob, content, className = "", onError, onLoad }: PDFViewerProps) {
  // For now, PDF viewer only works with URLs
  // TODO: Implement blob/content support with alternative PDF libraries
  const pdfSrc = src || (blob ? URL.createObjectURL(blob) : content)

  if (!pdfSrc) {
    onError?.("No valid PDF source provided")
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No PDF source provided</p>
      </div>
    )
  }

  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfSrc)}&embedded=true`}
      className={`w-full h-full border-0 ${className}`}
      title="PDF Viewer"
      onLoad={onLoad}
      onError={() => onError?.("Failed to load PDF")}
      allow="fullscreen"
      loading="lazy"
      style={{
        minHeight: "200px",
      }}
    />
  )
}
