"use client"

import { useEffect, useRef, useState } from "react"
import type { VideoViewerProps } from "../types"

export function VideoViewer({
  src,
  blob,
  content,
  className = "",
  controls = {},
  methods = {},
  onError,
  onLoad,
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState<string>("")

  // Default control configuration
  const controlConfig = {
    showControls: true,
    showPlayPause: true,
    showProgress: true,
    showVolume: true,
    showFullscreen: true,
    autoPlay: false,
    loop: false,
    muted: false,
    ...controls,
  }

  // Handle different content sources
  useEffect(() => {
    if (src) {
      setVideoSrc(src)
    } else if (blob) {
      const url = URL.createObjectURL(blob)
      setVideoSrc(url)
      return () => URL.revokeObjectURL(url)
    } else if (content) {
      // Assume content is base64 or data URL
      setVideoSrc(content)
    }
  }, [src, blob, content])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => methods.onPlay?.()
    const handlePause = () => methods.onPause?.()
    const handleTimeUpdate = () => methods.onTimeUpdate?.(video.currentTime)
    const handleVolumeChange = () => methods.onVolumeChange?.(video.volume)
    const handleLoadedData = () => onLoad?.()
    const handleError = () => onError?.("Failed to load video")

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("volumechange", handleVolumeChange)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("volumechange", handleVolumeChange)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [methods, onLoad, onError])

  const handleFullscreen = () => {
    const video = videoRef.current
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
        methods.onFullscreen?.()
      }
    }
  }

  return (
    <div className={`w-full h-full flex items-center justify-center bg-black ${className}`}>
      <video
        ref={videoRef}
        controls={controlConfig.showControls}
        src={videoSrc}
        autoPlay={controlConfig.autoPlay}
        loop={controlConfig.loop}
        muted={controlConfig.muted}
        className="w-full h-full object-contain"
        controlsList={`
          ${!controlConfig.showPlayPause ? "noplaybackrate" : ""}
          ${!controlConfig.showVolume ? "novolume" : ""}
          ${!controlConfig.showFullscreen ? "nofullscreen" : ""}
        `.trim()}
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
