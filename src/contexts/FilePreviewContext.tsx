"use client"

import type React from "react"
import { createContext, useContext, useRef, useState, useCallback, useMemo, type ReactNode, useEffect } from "react"

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
  isInitialized: boolean
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
  setIsInitialized: (initialized: boolean) => void
  zoomIn: () => void
  zoomOut: () => void
  fillView: () => void
  fitToView: () => void
  updateZoom: (newZoom: number) => void
  updatePan: (newPan: { x: number; y: number }) => void
}

export interface ImageViewerMethods {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFillView?: () => void
  onFitToView?: () => void
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
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Internal state
  const [internalZoom, setInternalZoom] = useState(1)
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [imageSrc, setSrc] = useState(src)
  const [isInitialized, setIsInitialized] = useState(false)
  const [methods, setMethods] = useState<ImageViewerMethods>(externalMethods)

  // Update methods when external methods change - use useMemo to prevent infinite loops
  const stableMethods = useMemo(() => {
    if (!externalMethods) return {}

    // Only update if the methods have actually changed
    const hasChanged = Object.keys(externalMethods).some((key) => {
      return methods[key as keyof ImageViewerMethods] !== externalMethods[key as keyof ImageViewerMethods]
    })

    if (hasChanged) {
      return { ...methods, ...externalMethods }
    }

    return methods
  }, [externalMethods, methods])

  // Update methods state only when stableMethods actually changes
  useEffect(() => {
    if (stableMethods !== methods) {
      setMethods(stableMethods)
    }
  }, [stableMethods, methods])

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

  // Fill view - sets zoom to 1 (original size) and centers the image
  const fillView = useCallback(() => {
    methods.onFillView?.()
    updateZoom(1)
    updatePan({ x: 0, y: 0 })
  }, [updateZoom, updatePan, methods])

  // Fit to view - scales the image to fit within the container with proper error handling
  const fitToView = useCallback(() => {
    if (!containerRef.current || !imageDimensions.width || !imageDimensions.height) {
      console.warn("FitToView: Missing container or image dimensions", {
        container: !!containerRef.current,
        imageDimensions,
      })
      return
    }

    methods.onFitToView?.()

    // Get container dimensions with retry logic
    const getContainerDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      return {
        width: rect?.width || 0,
        height: rect?.height || 0,
      }
    }

    const containerDims = getContainerDimensions()

    // If container has no dimensions, wait a bit and try again
    if (containerDims.width === 0 || containerDims.height === 0) {
      console.warn("FitToView: Container has no dimensions, retrying...", containerDims)
      setTimeout(() => {
        const retryDims = getContainerDimensions()
        if (retryDims.width > 0 && retryDims.height > 0) {
          const scaleX = retryDims.width / imageDimensions.width
          const scaleY = retryDims.height / imageDimensions.height
          const scale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond original size

          console.log("FitToView: Applying scale", { scale, containerDims: retryDims, imageDimensions })
          updateZoom(scale)
          updatePan({ x: 0, y: 0 })
        }
      }, 100)
      return
    }

    const scaleX = containerDims.width / imageDimensions.width
    const scaleY = containerDims.height / imageDimensions.height
    const scale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond original size

    console.log("FitToView: Applying scale", { scale, containerDims, imageDimensions })
    updateZoom(scale)
    updatePan({ x: 0, y: 0 })
  }, [imageDimensions, updateZoom, updatePan, methods])

  const setImageElement = useCallback((element: HTMLImageElement | null) => {
    imageRef.current = element
  }, [])

  const contextValue: FilePreviewContextType = useMemo(
    () => ({
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
      isInitialized,
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
      setIsInitialized,
      setMethods,
      zoomIn,
      zoomOut,
      fillView,
      fitToView,
      updateZoom,
      updatePan,
    }),
    [
      currentZoom,
      currentPan,
      isDragging,
      dragStart,
      imageLoaded,
      imageError,
      imageDimensions,
      imageSrc,
      isInitialized,
      methods,
      externalZoom,
      externalPan,
      externalOnZoomChange,
      externalOnPanChange,
      externalOnError,
      externalOnLoad,
      setInternalZoom,
      setInternalPan,
      setIsDragging,
      setDragStart,
      setImageLoaded,
      setImageError,
      setImageDimensions,
      setSrc,
      setImageElement,
      setIsInitialized,
      setMethods,
      zoomIn,
      zoomOut,
      fillView,
      fitToView,
      updateZoom,
      updatePan,
    ],
  )

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
