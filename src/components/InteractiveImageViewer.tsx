"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import { Button } from "./ui/Button"
import type { InteractiveImageViewerProps } from "../types"

export function InteractiveImageViewer({
  src,
  alt = "Image",
  className = "",
  onError,
  onLoad,
}: InteractiveImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const animationRef = useRef<number>(null)

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [baseZoom, setBaseZoom] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPinchDistance, setLastPinchDistance] = useState(0)

  // Constants
  const MIN_ZOOM = 0.1
  const MAX_ZOOM = 5
  const ZOOM_STEP = 0.2

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const img = imgRef.current

    if (!ctx || !canvas || !img || !imageLoaded || !canvasReady) {
      return
    }

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set a light background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    try {
      // Calculate scaled dimensions
      const scaledWidth = img.width * zoom
      const scaledHeight = img.height * zoom

      // Calculate position (center the image and apply offset)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const x = centerX - scaledWidth / 2 + offset.x
      const y = centerY - scaledHeight / 2 + offset.y

      // Ensure smooth rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Draw the image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
    } catch (error) {
      console.error("Error drawing image (possibly CORS-tainted):", error)
      onError?.("Failed to render image due to CORS restrictions")

      // If canvas drawing fails due to CORS, show a message
      ctx.fillStyle = "#666"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Image loaded but cannot be manipulated", canvas.width / 2, canvas.height / 2 - 10)
      ctx.fillText("due to CORS restrictions", canvas.width / 2, canvas.height / 2 + 10)
    }
  }, [zoom, offset, imageLoaded, canvasReady, onError])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()

    // Set canvas size with proper scaling for high DPI displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    setCanvasReady(true)

    // Calculate fit-to-screen zoom if image is loaded
    const img = imgRef.current
    if (img && imageLoaded && img.width > 0 && img.height > 0) {
      const scaleX = rect.width / img.width
      const scaleY = rect.height / img.height
      const fitScale = Math.min(scaleX, scaleY, 1)

      setBaseZoom(fitScale)
      setZoom(fitScale)
      setOffset({ x: 0, y: 0 })
    }
  }, [imageLoaded])

  // Load image effect with CORS handling
  useEffect(() => {
    const img = new Image()

    const handleLoad = () => {
      imgRef.current = img
      setImageLoaded(true)
      setImageError(false)
      setupCanvas()
      onLoad?.()
    }

    const handleError = () => {
      // Try loading without crossOrigin
      const imgFallback = new Image()

      imgFallback.onload = () => {
        imgRef.current = imgFallback
        setImageLoaded(true)
        setImageError(false)
        setupCanvas()
        onLoad?.()
      }

      imgFallback.onerror = () => {
        setImageError(true)
        setImageLoaded(false)
        onError?.("Failed to load image")
      }

      imgFallback.src = src
    }

    // Only set crossOrigin for same-origin images
    const isExternalImage = src.includes("http") && !src.startsWith(window.location.origin)
    if (!isExternalImage) {
      img.crossOrigin = "anonymous"
    }

    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.src = src

    return () => {
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [src, setupCanvas, onError, onLoad])

  // Setup canvas on mount and resize
  useEffect(() => {
    setupCanvas()

    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      animationRef.current = requestAnimationFrame(setupCanvas)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [setupCanvas])

  // Draw when state changes
  useEffect(() => {
    if (imageLoaded && canvasReady) {
      draw()
    }
  }, [draw, imageLoaded, canvasReady])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setDragStart({ x: e.clientX, y: e.clientY })
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor))

    if (newZoom !== zoom) {
      const zoomRatio = newZoom / zoom
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      setOffset((prev) => ({
        x: prev.x - (mouseX - centerX - prev.x) * (zoomRatio - 1),
        y: prev.y - (mouseY - centerY - prev.y) * (zoomRatio - 1),
      }))

      setZoom(newZoom)
    }
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX, y: touch.clientY })
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      )
      setLastPinchDistance(distance)
      setIsDragging(false)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0]
      const dx = touch.clientX - dragStart.x
      const dy = touch.clientY - dragStart.y

      setDragStart({ x: touch.clientX, y: touch.clientY })
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      )

      if (lastPinchDistance > 0) {
        const zoomFactor = distance / lastPinchDistance
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor))
        setZoom(newZoom)
      }

      setLastPinchDistance(distance)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setLastPinchDistance(0)
  }

  // Control functions
  const zoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP))
  }

  const resetView = () => {
    setZoom(baseZoom)
    setOffset({ x: 0, y: 0 })
  }

  const fitToScreen = () => {
    setZoom(baseZoom)
    setOffset({ x: 0, y: 0 })
  }

  if (imageError) {
    return (
      <div
        className={`relative w-full h-full min-h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500 p-4">
          <p className="text-sm">Failed to load image</p>
          <p className="text-xs mt-1 break-all">{src}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden bg-gray-50 ${className}`}>
      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading image...</div>
        </div>
      )}

      {/* Zoom Controls - Responsive positioning */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm p-1 sm:p-2 rounded-lg shadow-lg">
        <Button
          size="icon"
          variant="ghost"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          title="Zoom In"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          title="Zoom Out"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={fitToScreen}
          title="Fit to Screen"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={resetView} title="Reset View" className="h-8 w-8 sm:h-10 sm:w-10">
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>

      {/* Zoom level indicator - Responsive positioning and sizing */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm">
        {Math.round(zoom * 100)}%
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"} touch-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      />
    </div>
  )
}
