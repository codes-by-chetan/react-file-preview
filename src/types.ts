import type React from "react"

// Base interface for common viewer props
export interface BaseViewerProps {
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

// Content source can be URL, blob, or direct content
export interface ContentSource {
  src?: string
  blob?: Blob
  content?: string
}

export interface FilePreviewProps extends BaseViewerProps, ContentSource {
  fileName: string
  showDownloadButton?: boolean
  showFileName?: boolean
  height?: string
}

// Image viewer control configuration
export interface ImageControlsConfig {
  showControls?: boolean
  showZoomIn?: boolean
  showZoomOut?: boolean
  showReset?: boolean
  showFitToScreen?: boolean
  allowPan?: boolean
  allowZoom?: boolean
}

// Image viewer methods
export interface ImageViewerMethods {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onFitToScreen?: () => void
  onZoomChange?: (zoom: number) => void
  onPanChange?: (offset: { x: number; y: number }) => void
}

export interface InteractiveImageViewerProps extends BaseViewerProps, ContentSource {
  alt?: string
  // Control configuration
  controls?: ImageControlsConfig
  // External zoom control
  zoom?: number
  onZoomChange?: (zoom: number) => void
  // External pan control
  pan?: { x: number; y: number }
  onPanChange?: (offset: { x: number; y: number }) => void
  // Method callbacks
  methods?: ImageViewerMethods
}

// Video viewer control configuration
export interface VideoControlsConfig {
  showControls?: boolean
  showPlayPause?: boolean
  showProgress?: boolean
  showVolume?: boolean
  showFullscreen?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

// Video viewer methods
export interface VideoViewerMethods {
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onVolumeChange?: (volume: number) => void
  onFullscreen?: () => void
}

export interface VideoViewerProps extends BaseViewerProps, ContentSource {
  controls?: VideoControlsConfig
  methods?: VideoViewerMethods
}

// Audio viewer control configuration
export interface AudioControlsConfig {
  showControls?: boolean
  showPlayPause?: boolean
  showProgress?: boolean
  showVolume?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface AudioViewerMethods {
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onVolumeChange?: (volume: number) => void
}

export interface AudioViewerProps extends BaseViewerProps, ContentSource {
  fileName: string
  controls?: AudioControlsConfig
  methods?: AudioViewerMethods
}

export interface FilePreviewHeaderProps {
  fileName: string
  src: string
  showDownloadButton?: boolean
  className?: string
}

export interface FilePreviewContainerProps {
  children: React.ReactNode
  height?: string
  className?: string
}

export interface PDFViewerProps extends BaseViewerProps, ContentSource {}

export interface OfficeViewerProps extends BaseViewerProps, ContentSource {}

export interface TextViewerProps extends BaseViewerProps {
  content: string
  fileExtension: string
}

export interface JSONViewerProps extends BaseViewerProps {
  content: string
}

export interface CSVViewerProps extends BaseViewerProps {
  content: string
}
