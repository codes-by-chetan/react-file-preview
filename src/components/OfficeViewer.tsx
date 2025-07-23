import type { OfficeViewerProps } from "../types"

export function OfficeViewer({ src, blob, content, className = "", onError, onLoad }: OfficeViewerProps) {
  // For now, Office viewer only works with URLs
  // TODO: Implement blob/content support with alternative Office libraries
  const officeSrc = src || (blob ? URL.createObjectURL(blob) : content)

  if (!officeSrc) {
    onError?.("No valid Office document source provided")
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No Office document source provided</p>
      </div>
    )
  }

  return (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(officeSrc)}`}
      className={`w-full h-full border-0 ${className}`}
      title="Office Document Viewer"
      onLoad={onLoad}
      onError={() => onError?.("Failed to load Office document")}
      allow="fullscreen"
      loading="lazy"
      style={{
        minHeight: "200px",
      }}
    />
  )
}
