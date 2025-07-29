"use client"

import type React from "react"

export interface ImageViewerToolbarProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export const ImageViewerToolbar: React.FC<ImageViewerToolbarProps> = ({
  children,
  className = "",
  style,
  position = "top-right",
}) => {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  return (
    <div
      className={`absolute ${positionClasses[position]} flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-20 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
