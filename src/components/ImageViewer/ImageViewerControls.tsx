"use client"

import type React from "react"
import { ZoomIn, ZoomOut, Maximize2, Expand } from "lucide-react"
import { useFilePreview } from "../../contexts/FilePreviewContext"

export interface ImageViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: "sm" | "md" | "lg" |"xs"
  variant?: "default" | "ghost" | "outline"
  showTitle?: boolean
}

const buttonSizes = {
  xs: "p-0.5 w-6 h-6",
  sm: "p-1.5 w-7 h-7",
  md: "p-2 w-8 h-8",
  lg: "p-2.5 w-9 h-9",
}

const iconSizes = {
  xs: "!w-1 !h-1",
  sm: "!w-2 !h-2",
  md: "!w-3 !h-3",
  lg: "!w-4 !h-4",
}

const sizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
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
  showTitle = false,
}) => {
  const { zoom, zoomIn } = useFilePreview()
  const isDisabled = disabled || zoom >= 5
// console.log(iconSizes[size]);

  return (
    <button
      onClick={zoomIn}
      disabled={isDisabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className} `}
      style={style}
      title={showTitle ? "Zoom In" : undefined}
    >
      <ZoomIn size={sizes[size]} />
    </button>
  )
}

export const ImageViewerZoomOutButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
  showTitle = false,
}) => {
  const { zoom, zoomOut } = useFilePreview()
  const isDisabled = disabled || zoom <= 0.1

  return (
    <button
      onClick={zoomOut}
      disabled={isDisabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title={showTitle ? "Zoom Out" : undefined}
    >
      <ZoomOut size={sizes[size]} />
    </button>
  )
}

export const ImageViewerFillViewButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
  showTitle = false,
}) => {
  const { fillView } = useFilePreview()

  return (
    <button
      onClick={fillView}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title={showTitle ? "Fill View (1:1)" : undefined}
    >
      <Expand size={sizes[size]} />
    </button>
  )
}

export const ImageViewerFitToViewButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
  showTitle = false,
}) => {
  const { fitToView } = useFilePreview()

  return (
    <button
      onClick={fitToView}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title={showTitle ? "Fit to View" : undefined}
    >
      <Maximize2 size={sizes[size]} />
    </button>
  )
}
