"use client"

import type React from "react"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import { useFilePreview } from "../../contexts/FilePreviewContext"

export interface ImageViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
}

const buttonSizes = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
}

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

const buttonVariants = {
  default: "bg-white hover:bg-gray-100 border border-gray-200",
  ghost: "hover:bg-gray-100",
  outline: "border border-gray-300 hover:bg-gray-50",
}

export const ImageViewerZoomInButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { zoom, zoomIn } = useFilePreview()
  const isDisabled = disabled || zoom >= 5

  return (
    <button
      onClick={zoomIn}
      disabled={isDisabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title="Zoom In"
    >
      <ZoomIn className={iconSizes[size]} />
    </button>
  )
}

export const ImageViewerZoomOutButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { zoom, zoomOut } = useFilePreview()
  const isDisabled = disabled || zoom <= 0.1

  return (
    <button
      onClick={zoomOut}
      disabled={isDisabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title="Zoom Out"
    >
      <ZoomOut className={iconSizes[size]} />
    </button>
  )
}

export const ImageViewerResetButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { reset } = useFilePreview()

  return (
    <button
      onClick={reset}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title="Reset View"
    >
      <RotateCcw className={iconSizes[size]} />
    </button>
  )
}

export const ImageViewerFitToScreenButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { fitToScreen } = useFilePreview()

  return (
    <button
      onClick={fitToScreen}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title="Fit to Screen"
    >
      <Maximize2 className={iconSizes[size]} />
    </button>
  )
}
