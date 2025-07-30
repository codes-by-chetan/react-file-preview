// Main FilePreviewComponent
export { FilePreviewComponent } from "./components/FilePreviewComponent"

// Modular Image Viewer Components
export {
  ImageViewer,
  ImageViewerContent,
  ImageViewerToolbar,
  ImageViewerZoomIndicator,
  ImageViewerZoomInButton,
  ImageViewerZoomOutButton,
  ImageViewerFillViewButton,
  ImageViewerFitToViewButton,
} from "./components/ImageViewer"

// Individual Viewer Components
export { InteractiveImageViewer } from "./components/InteractiveImageViewer"
export { VideoViewer } from "./components/VideoViewer"
export { AudioViewer } from "./components/AudioViewer"
export { JSONViewer } from "./components/JSONViewer"
export { CSVViewer } from "./components/CSVViewer"
export { TextViewer } from "./components/TextViewer"
export { MarkdownViewer } from "./components/MarkdownViewer"
export { PDFViewer } from "./components/PDFViewer"
export { OfficeViewer } from "./components/OfficeViewer"

// Context and Provider
export { FilePreviewProvider, useFilePreview } from "./contexts/FilePreviewContext"

// Types
export type { FilePreviewProps } from "./types"

export type {
  ImageViewerProps,
  ImageViewerContentProps,
  ImageViewerToolbarProps,
  ImageViewerZoomIndicatorProps,
  ImageViewerButtonProps,
} from "./components/ImageViewer"

export type {
  FilePreviewContextType,
  ImageViewerState,
  ImageViewerActions,
  ImageViewerMethods,
  FilePreviewProviderProps,
} from "./contexts/FilePreviewContext"
