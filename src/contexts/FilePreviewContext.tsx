"use client"

import type React from "react"
import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react"

// Types for the context
export interface ImageViewerState {
  zoom: number
  pan: { x: number; y: number }
  isDragging: boolean
  dragStart: { x: number; y: number }
  imageLoaded: boolean
  imageError: string | null
  imageDimensions: { width: number; height: number }
  imageSrc: string
  hasError: boolean
  containerRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  imageRef: React.RefObject<HTMLImageElement>
}

export interface ImageViewerActions {
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  setIsDragging: (dragging: boolean) => void
  setDragStart: (start: { x: number; y: number }) => void
  setImageLoaded: (loaded: boolean) => void
  setImageError: (error: string | null) => void
  setImageDimensions: (dimensions: { width: number; height: number }) => void
  setSrc: (src: string) => void
  setImageElement: (element: HTMLImageElement | null) => void
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  fitToScreen: () => void
  updateZoom: (newZoom: number) => void
  updatePan: (newPan: { x: number; y: number }) => void
}

export interface ImageViewerMethods {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onFitToScreen?: () => void
  onZoomChange?: (zoom: number) => void
  onPanChange?: (offset: { x: number; y: number }) => void
  onLoad?: () => void
  onError?: (error: string) => void
}

export interface FilePreviewContextType extends ImageViewerState, ImageViewerActions {
  methods: ImageViewerMethods
  setMethods: (methods: ImageViewerMethods) => void
  externalZoom?: number
  externalPan?: { x: number; y: number }
  onZoomChange?: (zoom: number) => void
  onPanChange?: (pan: { x: number; y: number }) => void
  onError?: (error: string) => void
  onLoad?: () => void
}

const FilePreviewContext = createContext<FilePreviewContextType | undefined>(undefined)

export interface FilePreviewProviderProps {
  children: ReactNode
  src?: string
  blob?: Blob
  content?: string
  alt?: string
  zoom?: number
  onZoomChange?: (zoom: number) => void
  pan?: { x: number; y: number }
  onPanChange?: (pan: { x: number; y: number }) => void
  methods?: ImageViewerMethods
  onError?: (error: string) => void
  onLoad?: () => void
}

export const FilePreviewProvider: React.FC<FilePreviewProviderProps> = ({
  children,
  src = "",
  blob,
  content,
  zoom: externalZoom,
  onZoomChange: externalOnZoomChange,
  pan: externalPan,
  onPanChange: externalOnPanChange,
  methods: externalMethods = {},
  onError: externalOnError,
  onLoad: externalOnLoad,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement|null>(null)

  // Internal state
  const [internalZoom, setInternalZoom] = useState(1)
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [imageSrc, setSrc] = useState(src)
  const [methods, setMethods] = useState<ImageViewerMethods>(externalMethods)

  // Use external state if provided, otherwise use internal state
  const currentZoom = externalZoom !== undefined ? externalZoom : internalZoom
  const currentPan = externalPan !== undefined ? externalPan : internalPan

  const updateZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.max(0.1, Math.min(5, newZoom))

      if (externalZoom !== undefined) {
        externalOnZoomChange?.(clampedZoom)
      } else {
        setInternalZoom(clampedZoom)
      }

      methods.onZoomChange?.(clampedZoom)
    },
    [externalZoom, externalOnZoomChange, methods],
  )

  const updatePan = useCallback(
    (newPan: { x: number; y: number }) => {
      if (externalPan !== undefined) {
        externalOnPanChange?.(newPan)
      } else {
        setInternalPan(newPan)
      }

      methods.onPanChange?.(newPan)
    },
    [externalPan, externalOnPanChange, methods],
  )

  const zoomIn = useCallback(() => {
    methods.onZoomIn?.()
    updateZoom(currentZoom * 1.2)
  }, [currentZoom, updateZoom, methods])

  const zoomOut = useCallback(() => {
    methods.onZoomOut?.()
    updateZoom(currentZoom / 1.2)
  }, [currentZoom, updateZoom, methods])

  const reset = useCallback(() => {
    methods.onReset?.()
    updateZoom(1)
    updatePan({ x: 0, y: 0 })
  }, [updateZoom, updatePan, methods])

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !imageDimensions.width || !imageDimensions.height) return

    methods.onFitToScreen?.()

    const container = containerRef.current.getBoundingClientRect()
    const scaleX = container.width / imageDimensions.width
    const scaleY = container.height / imageDimensions.height
    const scale = Math.min(scaleX, scaleY, 1)

    updateZoom(scale)
    updatePan({ x: 0, y: 0 })
  }, [imageDimensions, updateZoom, updatePan, methods])

  const setImageElement = useCallback((element: HTMLImageElement | null) => {
    if (imageRef.current) {
      imageRef.current = element
    }
  }, [])

  const contextValue: FilePreviewContextType = {
    // State
    zoom: currentZoom,
    pan: currentPan,
    isDragging,
    dragStart,
    imageLoaded,
    imageError,
    imageDimensions,
    imageSrc,
    hasError: !!imageError,
    containerRef,
    canvasRef,
    imageRef,
    methods,
    externalZoom,
    externalPan,
    onZoomChange: externalOnZoomChange,
    onPanChange: externalOnPanChange,
    onError: externalOnError,
    onLoad: externalOnLoad,

    // Actions
    setZoom: setInternalZoom,
    setPan: setInternalPan,
    setIsDragging,
    setDragStart,
    setImageLoaded,
    setImageError,
    setImageDimensions,
    setSrc,
    setImageElement,
    setMethods,
    zoomIn,
    zoomOut,
    reset,
    fitToScreen,
    updateZoom,
    updatePan,
  }

  return <FilePreviewContext.Provider value={contextValue}>{children}</FilePreviewContext.Provider>
}

export const useFilePreview = () => {
  const context = useContext(FilePreviewContext)
  if (context === undefined) {
    throw new Error("useFilePreview must be used within a FilePreviewProvider")
  }
  return context
}

export { FilePreviewContext }
