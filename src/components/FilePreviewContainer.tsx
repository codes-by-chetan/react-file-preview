import type { FilePreviewContainerProps } from "../types"

export function FilePreviewContainer({ children, height = "400px", className = "" }: FilePreviewContainerProps) {
  return (
    <div
      className={`w-full border rounded-lg overflow-hidden ${className}`}
      style={{
        height,
        minHeight: "200px",
        maxHeight: "90vh", // Prevent overflow on small screens
      }}
    >
      {children}
    </div>
  )
}
