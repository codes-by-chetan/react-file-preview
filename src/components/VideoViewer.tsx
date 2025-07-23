import type { VideoViewerProps } from "../types"

export function VideoViewer({ src, className = "", onError, onLoad }: VideoViewerProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-black ${className}`}>
      <video
        controls
        src={src}
        className="w-full h-full object-contain"
        onLoadedData={onLoad}
        onError={() => onError?.("Failed to load video")}
        controlsList="nodownload"
        style={{
          maxHeight: "100%",
          maxWidth: "100%",

        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
