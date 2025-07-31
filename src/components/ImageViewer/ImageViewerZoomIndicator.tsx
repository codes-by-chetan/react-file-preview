"use client"

import type React from "react"
import { useFilePreview } from "../../contexts/FilePreviewContext"

export interface ImageViewerZoomIndicatorProps {
  className?: string
  style?: React.CSSProperties
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  format?: (zoom: number) => string
}

export const ImageViewerZoomIndicator: React.FC<ImageViewerZoomIndicatorProps> = ({
  className = "",
  style,
  position = "bottom-right",
  format = (zoom) => `${Math.round(zoom * 100)}%`,
}) => {
  const { zoom, imageLoaded } = useFilePreview()

  if (!imageLoaded) return null

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  return (
    <div
      className={`absolute flex justify-center items-center ${positionClasses[position]} bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10 ${className}`}
      style={style}
    >
      <span className="text-center">{format(zoom)}</span>
    </div>
  )
}
