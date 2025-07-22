import { Volume2 } from "lucide-react"
import type { AudioViewerProps } from "../types"

export function AudioViewer({ src, fileName, className = "", onError, onLoad }: AudioViewerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full min-h-[200px] space-y-3 sm:space-y-4 p-3 sm:p-4 ${className}`}
    >
      <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
      <h3 className="text-base sm:text-lg font-semibold text-center px-2 break-words">{fileName}</h3>
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
