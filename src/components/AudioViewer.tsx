import { Volume2 } from "lucide-react"
import type { AudioViewerProps } from "../types"

export function AudioViewer({ src, fileName, className = "", onError, onLoad }: AudioViewerProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-full space-y-4 p-4 ${className}`}>
      <Volume2 className="w-16 h-16 text-gray-400" />
      <h3 className="text-lg font-semibold text-center">{fileName}</h3>
      <audio
        controls
        src={src}
        className="w-full max-w-md"
        onLoadedData={onLoad}
        onError={() => onError?.("Failed to load audio")}
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  )
}
