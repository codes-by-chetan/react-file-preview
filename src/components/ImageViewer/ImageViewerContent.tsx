"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { useFilePreview } from "../../contexts/FilePreviewContext"

export interface ImageViewerContentProps {
  className?: string
  style?: React.CSSProperties
  allowPan?: boolean
  allowZoom?: boolean
}

export const ImageViewerContent: React.FC<ImageViewerContentProps> = ({
  className = "",
  style,
  allowPan = true,
  allowZoom = true,
}) => {
  const {
    zoom,
    pan,
    isDragging,
    dragStart,
    imageLoaded,
    imageError,
    imageDimensions,
    containerRef,
    canvasRef,
    imageRef,
    setIsDragging,
    setDragStart,
    updateZoom,
    updatePan,
  } = useFilePreview()

  // Render image on canvas
  const renderImage = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const image = imageRef.current

    if (!ctx) return

    // Set canvas size to container size
    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate image position and size
    const scaledWidth = image.naturalWidth * zoom
    const scaledHeight = image.naturalHeight * zoom
    const x = (canvas.width - scaledWidth) / 2 + pan.x
    const y = (canvas.height - scaledHeight) / 2 + pan.y

    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight)
  }, [imageLoaded, zoom, pan, imageRef, canvasRef])

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!allowZoom) return

      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      updateZoom(zoom * delta)
    },
    [zoom, updateZoom, allowZoom],
  )

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!allowPan) return

      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [pan, allowPan, setIsDragging, setDragStart],
  )

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !allowPan) return

      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      updatePan(newPan)
    },
    [isDragging, dragStart, updatePan, allowPan],
  )

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [setIsDragging])

  // Render image when state changes
  useEffect(() => {
    renderImage()
  }, [renderImage])

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("wheel", handleWheel, { passive: false })
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      canvas.removeEventListener("wheel", handleWheel)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleWheel, handleMouseMove, handleMouseUp])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Small delay to ensure container has updated dimensions
      setTimeout(() => {
        renderImage()
      }, 10)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [renderImage])

  return (
    <>
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
          <div className="text-gray-500">Loading image...</div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
          <div className="text-red-500 text-center">
            <div className="mb-2">Failed to load image</div>
            <div className="text-sm">{imageError}</div>
          </div>
        </div>
      )}

      {/* Canvas for rendering */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${className}`}
        style={{
          cursor: isDragging ? "grabbing" : allowPan ? "grab" : "default",
          ...style,
        }}
        onMouseDown={handleMouseDown}
      />
    </>
  )
}
  