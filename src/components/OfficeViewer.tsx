import type { OfficeViewerProps } from "../types"

export function OfficeViewer({ src, className = "", onError, onLoad }: OfficeViewerProps) {
  return (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`}
      className={`w-full h-full ${className}`}
      title="Office Document Viewer"
      onLoad={onLoad}
      onError={() => onError?.("Failed to load Office document")}
    />
  )
}
