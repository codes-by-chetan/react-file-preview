import type { VideoViewerProps } from "../types"

export function VideoViewer({ src, className = "", onError, onLoad }: VideoViewerProps) {
  return (
    <video
      controls
      src={src}
      className={`w-full h-full object-contain bg-black ${className}`}
      onLoadedData={onLoad}
      onError={() => onError?.("Failed to load video")}
    >
      Your browser does not support the video tag.
    </video>
  )
}
