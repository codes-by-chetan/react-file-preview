"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2 } from "lucide-react"
import type { AudioViewerProps } from "../types"

export function AudioViewer({
  src,
  blob,
  content,
  fileName,
  className = "",
  controls = {},
  methods = {},
  onError,
  onLoad,
}: AudioViewerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioSrc, setAudioSrc] = useState<string>("")

  // Default control configuration
  const controlConfig = {
    showControls: true,
    showPlayPause: true,
    showProgress: true,
    showVolume: true,
    autoPlay: false,
    loop: false,
    muted: false,
    ...controls,
  }

  // Handle different content sources
  useEffect(() => {
    if (src) {
      setAudioSrc(src)
    } else if (blob) {
      const url = URL.createObjectURL(blob)
      setAudioSrc(url)
      return () => URL.revokeObjectURL(url)
    } else if (content) {
      // Assume content is base64 or data URL
      setAudioSrc(content)
    }
  }, [src, blob, content])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => methods.onPlay?.()
    const handlePause = () => methods.onPause?.()
    const handleTimeUpdate = () => methods.onTimeUpdate?.(audio.currentTime)
    const handleVolumeChange = () => methods.onVolumeChange?.(audio.volume)
    const handleLoadedData = () => onLoad?.()
    const handleError = () => onError?.("Failed to load audio")

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("volumechange", handleVolumeChange)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("volumechange", handleVolumeChange)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("error", handleError)
    }
  }, [methods, onLoad, onError])

  return (
    <div
      className={`flex-1 min-h-0 flex flex-col items-center justify-center space-y-3 sm:space-y-4 p-3 sm:p-4 ${className}`}
    >
      <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
      <h3 className="text-base sm:text-lg font-semibold text-center px-2 break-words">{fileName}</h3>
      <audio
        ref={audioRef}
        controls={controlConfig.showControls}
        src={audioSrc}
        autoPlay={controlConfig.autoPlay}
        loop={controlConfig.loop}
        muted={controlConfig.muted}
        className="w-full max-w-md"
        controlsList={`
          ${!controlConfig.showPlayPause ? "noplaybackrate" : ""}
          ${!controlConfig.showVolume ? "novolume" : ""}
        `.trim()}
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  )
}
