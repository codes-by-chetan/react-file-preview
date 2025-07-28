import type { FilePreviewContainerProps } from "../types"

export function FilePreviewContainer({ children, height = "400px", className = "" }: FilePreviewContainerProps) {
  return (
    <div
      className={`w-full border rounded-lg overflow-hidden min-w-0 ${className}`}
      style={{
        height,
        minHeight: "200px",
        maxHeight: "90vh",
      }}
    >
      {children}
    </div>
  )
}
