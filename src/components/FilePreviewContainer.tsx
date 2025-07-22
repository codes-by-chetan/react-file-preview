import type { FilePreviewContainerProps } from "../types"

export function FilePreviewContainer({ children, height = "100%", className = "" }: FilePreviewContainerProps) {
  return (
    <div className={`w-full border rounded-lg overflow-hidden ${className}`} style={{ height }}>
      {children}
    </div>
  )
}
