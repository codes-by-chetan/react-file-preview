"use client"
import { FileText, AlertCircle, Download } from "lucide-react"
import {
  ImageViewer,
  ImageViewerContent,
  ImageViewerToolbar,
  ImageViewerZoomIndicator,
  ImageViewerZoomInButton,
  ImageViewerZoomOutButton,
  ImageViewerFillViewButton,
  ImageViewerFitToViewButton,
} from "./ImageViewer"
import { PDFViewer } from "./PDFViewer"
import { VideoViewer } from "./VideoViewer"
import { AudioViewer } from "./AudioViewer"
import { OfficeViewer } from "./OfficeViewer"
import { JSONViewer } from "./JSONViewer"
import { CSVViewer } from "./CSVViewer"
import { TextViewer } from "./TextViewer"
import { FilePreviewHeader } from "./FilePreviewHeader"
import { Button } from "./ui/Button"
import { useFileContent } from "../hooks/useFileContent"
import type { FilePreviewProps } from "../types"

export function FilePreviewComponent({
  src,
  blob,
  content,
  fileName,
  className = "",
  showDownloadButton = true,
  showFileName = true,
  height = "400px",
  onError,
  onLoad,
}: FilePreviewProps) {
  const fileExtension = fileName?.split(".").pop()?.toLowerCase() || ""

  const textExtensions = [
    "txt",
    "md",
    "json",
    "csv",
    "js",
    "jsx",
    "ts",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "css",
    "html",
    "xml",
    "sql",
    "yml",
    "yaml",
    "log",
  ]

  const shouldFetchContent = textExtensions.includes(fileExtension) && !content && !blob
  const { content: fetchedContent, loading, error } = useFileContent(src || "", shouldFetchContent, onError, onLoad)

  // Determine the actual content to use
  const actualContent = content || fetchedContent

  // Calculate content height accounting for header
  const headerHeight = showFileName ? 48 : 0
  const contentHeight = `calc(${height} - ${headerHeight}px)`

  // Get download URL
  const downloadUrl = src || (blob ? URL.createObjectURL(blob) : "")

  // Image files - Using new modular ImageViewer
  if (["svg", "png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"].includes(fileExtension)) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader
            fileName={fileName}
            src={downloadUrl || "/placeholder.svg"}
            showDownloadButton={showDownloadButton}
          />
        )}
        <div style={{ height: contentHeight }}>
          <ImageViewer
            src={src || "/placeholder.svg"}
            blob={blob}
            alt={fileName}
            onError={onError}
            onLoad={onLoad}
            fitOnLoad={true}
          >
            <ImageViewerContent />
            <ImageViewerToolbar position="top-right">
              <ImageViewerZoomInButton />
              <ImageViewerZoomOutButton />
              <ImageViewerFitToViewButton />
              <ImageViewerFillViewButton />
            </ImageViewerToolbar>
            <ImageViewerZoomIndicator position="bottom-right" />
          </ImageViewer>
        </div>
      </div>
    )
  }

  // Video files
  if (["mp4", "webm", "ogg", "avi", "mov"].includes(fileExtension)) {
    return (
      <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
        )}
        <div style={{ height: contentHeight }}>
          <VideoViewer src={src} blob={blob} content={content} onError={onError} onLoad={onLoad} />
        </div>
      </div>
    )
  }

  // Audio files
  if (["mp3", "wav", "ogg", "aac", "m4a"].includes(fileExtension)) {
    return (
      <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
        )}
        <div style={{ height: contentHeight }}>
          <AudioViewer src={src} blob={blob} content={content} fileName={fileName} onError={onError} onLoad={onLoad} />
        </div>
      </div>
    )
  }

  // PDF files
  if (fileExtension === "pdf") {
    return (
      <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
        )}
        <div style={{ height: contentHeight }}>
          <PDFViewer src={src} blob={blob} content={content} onError={onError} onLoad={onLoad} />
        </div>
      </div>
    )
  }

  // Office files
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)) {
    return (
      <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
        )}
        <div style={{ height: contentHeight }}>
          <OfficeViewer src={src} blob={blob} content={content} onError={onError} onLoad={onLoad} />
        </div>
      </div>
    )
  }

  // Text-based files
  if (shouldFetchContent || actualContent) {
    return (
      <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
        {showFileName && (
          <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
        )}

        <div className="overflow-auto" style={{ height: contentHeight }}>
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading file content...</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div className="text-red-500 text-center">Error loading file: {error}</div>
              {showDownloadButton && downloadUrl && (
                <Button variant="outline" onClick={() => window.open(downloadUrl, "_blank")}>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              )}
            </div>
          )}

          {!loading && !error && actualContent && (
            <div className="p-4">
              {fileExtension === "json" && <JSONViewer content={actualContent} />}
              {fileExtension === "csv" && <CSVViewer content={actualContent} />}
              {!["json", "csv"].includes(fileExtension) && (
                <TextViewer content={actualContent} fileExtension={fileExtension} />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback for unsupported files
  return (
    <div className={`w-full border rounded-lg ${className}`} style={{ height }}>
      {showFileName && (
        <FilePreviewHeader fileName={fileName} src={downloadUrl} showDownloadButton={showDownloadButton} />
      )}

      <div className="flex flex-col items-center justify-center space-y-4 p-4" style={{ height: contentHeight }}>
        <FileText className="w-16 h-16 text-gray-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{fileName}</h3>
          <p className="text-gray-500 mb-4">Preview not available for .{fileExtension} files</p>
          {showDownloadButton && downloadUrl && (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => window.open(downloadUrl, "_blank")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => window.open(downloadUrl, "_blank")}>
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
