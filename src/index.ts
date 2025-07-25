// Main wrapper component
export { FilePreviewComponent } from "./components/FilePreviewComponent"

// Individual file type viewers
export { InteractiveImageViewer } from "./components/InteractiveImageViewer"
export { PDFViewer } from "./components/PDFViewer"
export { VideoViewer } from "./components/VideoViewer"
export { AudioViewer } from "./components/AudioViewer"
export { OfficeViewer } from "./components/OfficeViewer"
export { TextViewer } from "./components/TextViewer"
export { JSONViewer } from "./components/JSONViewer"
export { CSVViewer } from "./components/CSVViewer"
export { MarkdownViewer } from "./components/MarkdownViewer"
export { CodeViewer } from "./components/CodeViewer"

// Layout components
export { FilePreviewHeader } from "./components/FilePreviewHeader"
export { FilePreviewContainer } from "./components/FilePreviewContainer"

// Utility components
export { Button } from "./components/ui/Button"

// Hooks
export { useFileContent } from "./hooks/useFileContent"

// Types
export type {
  FilePreviewProps,
  InteractiveImageViewerProps,
  ImageControlsConfig,
  ImageViewerMethods,
  VideoViewerProps,
  VideoControlsConfig,
  VideoViewerMethods,
  AudioViewerProps,
  AudioControlsConfig,
  AudioViewerMethods,
  FilePreviewHeaderProps,
  FilePreviewContainerProps,
  PDFViewerProps,
  OfficeViewerProps,
  TextViewerProps,
  JSONViewerProps,
  CSVViewerProps,
  ContentSource,
  BaseViewerProps,
} from "./types"
