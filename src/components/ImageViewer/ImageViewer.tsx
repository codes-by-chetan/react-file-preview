"use client"

import React from "react"
import { useFilePreview, type FilePreviewProviderProps } from "../../contexts/FilePreviewContext"

export interface ImageViewerProps extends Omit<FilePreviewProviderProps, "children"> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ children, className = "", style, ...providerProps }) => {
  const { containerRef, hasError, imageLoaded, imageSrc, setSrc, setImageElement, setImageLoaded, setImageError } =
    useFilePreview()

  // Handle different content sources
  React.useEffect(() => {
    if (providerProps.src) {
      setSrc(providerProps.src)
    } else if (providerProps.blob) {
      const url = URL.createObjectURL(providerProps.blob)
      setSrc(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [providerProps.src, providerProps.blob, setSrc])

  // Load image effect with CORS handling
  React.useEffect(() => {
    if (!imageSrc) return

    
    const img = new Image()

    const handleLoad = () => {
      setImageElement(img)
      setImageLoaded(true)
      setImageError(null)
      if (providerProps.onLoad) providerProps.onLoad()
    }

    const handleError = () => {
      // Try loading without crossOrigin
      const imgFallback = new Image()

      imgFallback.onload = () => {
        setImageElement(imgFallback)
        setImageLoaded(true)
        setImageError(null)
        if (providerProps.onLoad) providerProps.onLoad()
      }

      imgFallback.onerror = () => {
        setImageError("Failed to load image")
        if (providerProps.onError) providerProps.onError("Failed to load image")
      }

      imgFallback.src = imageSrc
    }

    // Only set crossOrigin for same-origin images or data URLs
    if (imageSrc.startsWith("data:") || !imageSrc.includes("http") || imageSrc.startsWith(window.location.origin)) {
      img.crossOrigin = "anonymous"
    }

    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.src = imageSrc

    return () => {
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [imageSrc, setImageElement, setImageLoaded, setImageError, providerProps.onLoad, providerProps.onError])

  if (hasError) {
    return (
      <div
        className={`relative w-full h-full min-h-[200px] overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-center text-gray-500 p-4">
          <p className="text-sm">Failed to load image</p>
          <p className="text-xs mt-1 break-all">{imageSrc}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
