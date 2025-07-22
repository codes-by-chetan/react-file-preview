"use client"
import { FileText, AlertCircle, Download } from "lucide-react"
import { InteractiveImageViewer } from "./InteractiveImageViewer"
import { PDFViewer } from "./PDFViewer"
import { VideoViewer } from "./VideoViewer"
import { AudioViewer } from "./AudioViewer"
import { OfficeViewer } from "./OfficeViewer"
import { JSONViewer } from "./JSONViewer"
import { CSVViewer } from "./CSVViewer"
import { TextViewer } from "./TextViewer"
import { FilePreviewHeader } from "./FilePreviewHeader"
import { FilePreviewContainer } from "./FilePreviewContainer"
import { Button } from "./ui/Button"
import type { FilePreviewProps } from "../types"
import { useFileContent } from "../hooks/useFileContent"

export function FilePreviewComponent({
  src,
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

  const shouldFetchContent = textExtensions.includes(fileExtension)
  const { content, loading, error } = useFileContent(src, shouldFetchContent, onError, onLoad)

  // Image files
  if (["svg", "png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"].includes(fileExtension)) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}
        <div className="h-full">
          <InteractiveImageViewer src={src} alt={fileName} onError={onError} onLoad={onLoad}/>
        </div>
      </div>
    )
  }

  // Video files
  if (["mp4", "webm", "ogg", "avi", "mov"].includes(fileExtension)) {
    return (
      <FilePreviewContainer height={height} className={className}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}
        <VideoViewer src={src} onError={onError} onLoad={onLoad} />
      </FilePreviewContainer>
    )
  }

  // Audio files
  if (["mp3", "wav", "ogg", "aac", "m4a"].includes(fileExtension)) {
    return (
      <FilePreviewContainer height={height} className={className}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}
        <AudioViewer src={src} fileName={fileName} onError={onError} onLoad={onLoad} />
      </FilePreviewContainer>
    )
  }

  // PDF files
  if (fileExtension === "pdf") {
    return (
      <FilePreviewContainer height={height} className={className}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}
        <PDFViewer src={src} onError={onError} onLoad={onLoad} />
      </FilePreviewContainer>
    )
  }

  // Office files
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)) {
    return (
      <FilePreviewContainer height={height} className={className}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}
        <OfficeViewer src={src} onError={onError} onLoad={onLoad} />
      </FilePreviewContainer>
    )
  }

  // Text-based files
  if (shouldFetchContent) {
    return (
      <FilePreviewContainer height={height} className={className}>
        {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}

        <div className="p-4 h-full overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading file content...</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div className="text-red-500 text-center">Error loading file: {error}</div>
              {showDownloadButton && (
                <Button variant="outline" onClick={() => window.open(src, "_blank")}>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              )}
            </div>
          )}

          {!loading && !error && content && (
            <>
              {fileExtension === "json" && <JSONViewer content={content} />}
              {fileExtension === "csv" && <CSVViewer content={content} />}
              {!["json", "csv"].includes(fileExtension) && (
                <TextViewer content={content} fileExtension={fileExtension} />
              )}
            </>
          )}
        </div>
      </FilePreviewContainer>
    )
  }

  // Fallback for unsupported files
  return (
    <FilePreviewContainer height={height} className={className}>
      {showFileName && <FilePreviewHeader fileName={fileName} src={src} showDownloadButton={showDownloadButton} />}

      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <FileText className="w-16 h-16 text-gray-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{fileName}</h3>
          <p className="text-gray-500 mb-4">Preview not available for .{fileExtension} files</p>
          {showDownloadButton && (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => window.open(src, "_blank")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => window.open(src, "_blank")}>
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      </div>
    </FilePreviewContainer>
  )
}
