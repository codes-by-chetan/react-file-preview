"use client"

import type React from "react"
import { ZoomIn, ZoomOut, Maximize2, Expand } from "lucide-react"
import { useFilePreview } from "../../contexts/FilePreviewContext"
import { Children, cloneElement } from "react"

export interface ImageViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  showTitle?: boolean
  children?: React.ReactNode // Added to allow custom icons
}

const buttonSizes = {
  xs: "p-0.5 w-6 h-6",
  sm: "p-1 w-8 h-8",
  md: "p-1 w-9 h-9",
  lg: "p-2 w-10 h-10",
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

// Generic ImageViewerButton component for modularity
export const ImageViewerZoomInButton: React.FC<ImageViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
  showTitle = true,
  children,
}) => {
  const { zoom, zoomIn } = useFilePreview()
  const isDisabled = disabled || zoom >= 5

  const btnClass = `${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded-md text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  const iconClass = iconSizes[size]

  // Render children if provided, else default icon
  const renderedIcon = children ? (
    cloneElement(Children.only(children) as React.ReactElement, {
      className: `${iconClass} ${(children as any).props.className || ""}`,
    })
  ) : (
    <ZoomIn size={sizes[size]} className={iconClass} />
  )

  return (
    <button
      className={btnClass}
      style={style}
      disabled={isDisabled}
      onClick={zoomIn}
      title={showTitle ? "Zoom In" : undefined}
      aria-label="Zoom In"
    >
      {renderedIcon}
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
  children,
}) => {
  const { zoom, zoomOut } = useFilePreview()
  const isDisabled = disabled || zoom <= 0.1

  const btnClass = `${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded-md text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  const iconClass = iconSizes[size]

  // Render children if provided, else default icon
  const renderedIcon = children ? (
    cloneElement(Children.only(children) as React.ReactElement, {
      className: `${iconClass} ${(children as any).props.className || ""}`,
    })
  ) : (
    <ZoomOut size={sizes[size]} className={iconClass} />
  )

  return (
    <button
      className={btnClass}
      style={style}
      disabled={isDisabled}
      onClick={zoomOut}
      title={showTitle ? "Zoom Out" : undefined}
      aria-label="Zoom Out"
    >
      {renderedIcon}
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
  children,
}) => {
  const { fillView } = useFilePreview()

  const btnClass = `${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded-md text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  const iconClass = iconSizes[size]

  // Render children if provided, else default icon
  const renderedIcon = children ? (
    cloneElement(Children.only(children) as React.ReactElement, {
      className: `${iconClass} ${(children as any).props.className || ""}`,
    })
  ) : (
    <Maximize2 size={sizes[size]} className={iconClass} />
  )

  return (
    <button
      className={btnClass}
      style={style}
      disabled={disabled}
      onClick={fillView}
      title={showTitle ? "Fill View" : undefined}
      aria-label="Fill View"
    >
      {renderedIcon}
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
  children,
}) => {
  const { fitToView } = useFilePreview()

  const btnClass = `${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded-md text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  const iconClass = iconSizes[size]

  // Render children if provided, else default icon
  const renderedIcon = children ? (
    cloneElement(Children.only(children) as React.ReactElement, {
      className: `${iconClass} ${(children as any).props.className || ""}`,
    })
  ) : (
    <Expand size={sizes[size]} className={iconClass} />
  )

  return (
    <button
      className={btnClass}
      style={style}
      disabled={disabled}
      onClick={fitToView}
      title={showTitle ? "Fit to View" : undefined}
      aria-label="Fit to View"
    >
      {renderedIcon}
    </button>
  )
}
