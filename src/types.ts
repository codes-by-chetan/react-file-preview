import type React from "react"
export interface FilePreviewProps {
  src: string
  fileName: string
  className?: string
  showDownloadButton?: boolean
  showFileName?: boolean
  height?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

export interface InteractiveImageViewerProps {
  src: string
  alt?: string
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
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

export interface PDFViewerProps {
  src: string
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

export interface VideoViewerProps {
  src: string
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

export interface AudioViewerProps {
  src: string
  fileName: string
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

export interface OfficeViewerProps {
  src: string
  className?: string
  onError?: (error: string) => void
  onLoad?: () => void
}

export interface TextViewerProps {
  content: string
  fileExtension: string
  className?: string
}

export interface JSONViewerProps {
  content: string
  className?: string
}

export interface CSVViewerProps {
  content: string
  className?: string
}
