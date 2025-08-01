"use client"

import type React from "react"
import { useEffect, useCallback, useRef } from "react"
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
    imageRef,
    setIsDragging,
    setDragStart,
    updateZoom,
    updatePan,
    setImageLoaded,
    setImageError,
    setImageDimensions,
    onLoad,
    onError,
  } = useFilePreview()

  const lastTouchDistance = useRef(0)
  const lastTouchCenter = useRef({ x: 0, y: 0 })

  // Handles mouse wheel for zooming, centering on cursor
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!allowZoom) return

      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta))

      // Adjust pan to zoom towards cursor position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = e.clientX - rect.left - rect.width / 2
        const centerY = e.clientY - rect.top - rect.height / 2
        const zoomRatio = newZoom / zoom
        updatePan({
          x: pan.x - centerX * (zoomRatio - 1),
          y: pan.y - centerY * (zoomRatio - 1),
        })
      }

      updateZoom(newZoom)
    },
    [allowZoom, zoom, pan, updateZoom, updatePan, containerRef],
  )

  // Handles mouse down to initiate panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!allowPan) return

      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [pan, allowPan, setIsDragging, setDragStart],
  )

  // Handles mouse movement for panning (React event)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !allowPan) return

      e.preventDefault()
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      updatePan(newPan)
    },
    [isDragging, dragStart, updatePan, allowPan],
  )

  // Handles global mouse movement for panning (native event)
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !allowPan) return

      e.preventDefault()
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      updatePan(newPan)
    },
    [isDragging, dragStart, updatePan, allowPan],
  )

  // Handles mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [setIsDragging])

  // Handles touch start for panning or pinch-to-zoom
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!allowPan && !allowZoom) return

      e.preventDefault()

      if (e.touches.length === 1 && allowPan) {
        setIsDragging(true)
        setDragStart({
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        })
      } else if (e.touches.length === 2 && allowZoom) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        )
        lastTouchDistance.current = distance
        lastTouchCenter.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        }
      }
    },
    [allowPan, allowZoom, pan, setIsDragging, setDragStart],
  )

  // Handles touch movement for panning or pinch-to-zoom
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!allowPan && !allowZoom) return

      e.preventDefault()

      if (e.touches.length === 1 && isDragging && allowPan) {
        const newPan = {
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        }
        updatePan(newPan)
      } else if (e.touches.length === 2 && allowZoom) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        )

        if (lastTouchDistance.current > 0 && containerRef.current) {
          const scale = distance / lastTouchDistance.current
          const newZoom = Math.max(0.1, Math.min(5, zoom * scale))
          const rect = containerRef.current.getBoundingClientRect()
          const centerX = lastTouchCenter.current.x - rect.left - rect.width / 2
          const centerY = lastTouchCenter.current.y - rect.top - rect.height / 2
          const zoomRatio = newZoom / zoom
          updatePan({
            x: pan.x - centerX * (zoomRatio - 1),
            y: pan.y - centerY * (zoomRatio - 1),
          })
          updateZoom(newZoom)
        }

        lastTouchDistance.current = distance
      }
    },
    [isDragging, allowPan, allowZoom, pan, zoom, dragStart, updatePan, updateZoom, containerRef],
  )

  // Handles touch end
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    lastTouchDistance.current = 0
  }, [setIsDragging])

  // Handles image load
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      })
      setImageLoaded(true)
      setImageError(null)
      onLoad?.()
    }
  }, [imageRef, setImageDimensions, setImageLoaded, setImageError, onLoad])

  // Handles image error
  const handleImageError = useCallback(() => {
    setImageError("Failed to load image")
    onError?.("Failed to load image")
  }, [setImageError, onError])

  // Sets up global mouse move and up listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleGlobalMouseMove, handleMouseUp])

  // Sets up wheel event listener
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
      return () => container.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel, containerRef])

  return (
    <>
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={className}
        >
          <div style={{ color: "#6b7280" }}>Loading image...</div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={className}
        >
          <div style={{ color: "#ef4444", textAlign: "center" }}>
            <div style={{ marginBottom: "0.5rem" }}>Failed to load image</div>
            <div style={{ fontSize: "0.875rem" }}>{imageError}</div>
          </div>
        </div>
      )}

      {/* Wrapper div with transformations */}
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}
        style={{
          ...style,
          cursor: isDragging ? "grabbing" : allowPan ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={imageRef.current?.src || "/placeholder.svg"}
          alt="Preview"
          className="max-w-none max-h-none object-contain pointer-events-none select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: "transform 150ms ease-out",
            willChange: "transform",
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />
      </div>
    </>
  )
}