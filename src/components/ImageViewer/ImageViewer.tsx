"use client"

import type React from "react"
import { useEffect } from "react"
import { FilePreviewProvider, useFilePreview } from "../../contexts/FilePreviewContext"
import type { FilePreviewProviderProps } from "../../contexts/FilePreviewContext"

export interface ImageViewerProps extends Omit<FilePreviewProviderProps, "children"> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  fitOnLoad?: boolean
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  children,
  className = "",
  style,
  fitOnLoad = true,
  ...providerProps
}) => {
  return (
    <FilePreviewProvider {...providerProps}>
      <ImageViewerRoot className={className} style={style} fitOnLoad={fitOnLoad}>
        {children}
      </ImageViewerRoot>
    </FilePreviewProvider>
  )
}

interface ImageViewerRootProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  fitOnLoad?: boolean
}

const ImageViewerRoot: React.FC<ImageViewerRootProps> = ({ children, className = "", style, fitOnLoad = true }) => {
  const {
    containerRef,
    hasError,
    imageLoaded,
    imageSrc,
    imageDimensions,
    setSrc,
    setImageElement,
    setImageLoaded,
    setImageError,
    setImageDimensions,
    fitToView,
    isInitialized,
    setIsInitialized,
    onLoad,
    onError,
  } = useFilePreview()

  // Handle different content sources
  useEffect(() => {
    const { src, blob } = (children as any)?.props || {}
    if (src) {
      setSrc(src)
    } else if (blob) {
      const url = URL.createObjectURL(blob)
      setSrc(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [setSrc, children])

  // Handle image load effect with CORS handling
  useEffect(() => {
    if (!imageSrc) return

    console.log("ImageViewer: Loading image", imageSrc)
    const img = new Image()

    const handleLoad = () => {
      console.log("ImageViewer: Image loaded", {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      })

      setImageElement(img)
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
      setImageLoaded(true)
      setImageError(null)
      onLoad?.()
    }

    const handleError = () => {
      console.warn("ImageViewer: Image load failed, trying fallback")
      // Try loading without crossOrigin
      const imgFallback = new Image()

      imgFallback.onload = () => {
        console.log("ImageViewer: Fallback image loaded")
        setImageElement(imgFallback)
        setImageDimensions({
          width: imgFallback.naturalWidth,
          height: imgFallback.naturalHeight,
        })
        setImageLoaded(true)
        setImageError(null)
        onLoad?.()
      }

      imgFallback.onerror = () => {
        console.error("ImageViewer: Both image loads failed")
        setImageError("Failed to load image")
        onError?.("Failed to load image")
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
  }, [imageSrc, setImageElement, setImageLoaded, setImageError, setImageDimensions, onLoad, onError])

  // Apply fit to view when image is loaded and container is ready
  useEffect(() => {
    if (imageLoaded && !isInitialized && fitOnLoad && imageDimensions.width > 0 && imageDimensions.height > 0) {
      console.log("ImageViewer: Attempting to fit to view", { imageDimensions, containerRef: !!containerRef.current })

      // Wait for container to be properly sized
      const attemptFitToView = (attempts = 0) => {
        if (attempts > 10) {
          console.warn("ImageViewer: Failed to fit to view after 10 attempts")
          setIsInitialized(true)
          return
        }

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          console.log("ImageViewer: Container dimensions", { width: rect.width, height: rect.height, attempts })

          if (rect.width > 0 && rect.height > 0) {
            fitToView()
            setIsInitialized(true)
            console.log("ImageViewer: Successfully applied fit to view")
          } else {
            // Container not ready, try again
            setTimeout(() => attemptFitToView(attempts + 1), 50)
          }
        } else {
          setTimeout(() => attemptFitToView(attempts + 1), 50)
        }
      }

      attemptFitToView()
    }
  }, [imageLoaded, isInitialized, fitOnLoad, imageDimensions, fitToView, setIsInitialized, containerRef])

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
