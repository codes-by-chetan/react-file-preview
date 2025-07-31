"use client"

import type React from "react"

interface TextViewerToolbarProps {
  children: React.ReactNode
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  style?: React.CSSProperties
}

export const TextViewerToolbar: React.FC<TextViewerToolbarProps> = ({
  children,
  className = "",
  position = "top-right",
  style,
}) => {
  const positionClasses = {
    "top-left": "absolute top-2 left-2",
    "top-right": "absolute top-2 right-2",
    "bottom-left": "absolute bottom-2 left-2",
    "bottom-right": "absolute bottom-2 right-2",
  }

  return (
    <div
      className={`${positionClasses[position]} flex items-center gap-1 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md shadow-sm border z-10 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
