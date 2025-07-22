# React File Preview

A comprehensive React component library for previewing various file types including images, videos, documents, and text files.

## Features

- 🖼️ **Interactive Image Viewer** with zoom, pan, and touch support
- 📄 **Multiple File Type Support**: Images, Videos, Audio, PDFs, Office documents, Text files
- 📱 **Mobile Friendly** with touch gestures and responsive design
- 🎨 **Customizable** styling and behavior
- 📦 **TypeScript Support** with full type definitions
- 🚀 **Lightweight** with minimal dependencies

## Installation

\`\`\`bash
npm install react-file-preview
\`\`\`

## Quick Start

\`\`\`tsx
import { FilePreviewComponent } from 'react-file-preview'

function App() {
  return (
    <FilePreviewComponent
      src="https://example.com/document.pdf"
      fileName="document.pdf"
      height="500px"
    />
  )
}
\`\`\`

## Supported File Types

### Images
- PNG, JPG, JPEG, GIF, WebP, BMP, ICO, SVG
- Interactive viewer with zoom, pan, and fit-to-screen

### Videos
- MP4, WebM, OGG, AVI, MOV
- Native HTML5 video player with controls

### Audio
- MP3, WAV, OGG, AAC, M4A
- Native HTML5 audio player with controls

### Documents
- **PDF**: Embedded viewer using Google Docs Viewer
- **Office**: Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX)

### Text Files
- **Code**: JS, JSX, TS, TSX, Python, Java, C++, CSS, HTML, SQL, YAML
- **Data**: JSON (with syntax highlighting), CSV (table view)
- **Plain Text**: TXT, MD, LOG files

## API Reference

### FilePreviewComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | URL of the file to preview |
| `fileName` | `string` | **required** | Name of the file (used for extension detection) |
| `className` | `string` | `""` | Additional CSS classes |
| `showDownloadButton` | `boolean` | `true` | Show/hide download button |
| `showFileName` | `boolean` | `true` | Show/hide file name header |
| `height` | `string` | `"400px"` | Height of the preview container |
| `onError` | `(error: string) => void` | `undefined` | Error callback |
| `onLoad` | `() => void` | `undefined` | Load success callback |

### InteractiveImageViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | URL of the image |
| `alt` | `string` | `"Image"` | Alt text for the image |
| `className` | `string` | `""` | Additional CSS classes |

## Development

### Setup

\`\`\`bash
# Install dependencies
npm install

# Build the library
npm run build

# Run the example
npm run example
\`\`\`

### Scripts

- \`npm run build\` - Build the library
- \`npm run dev\` - Build in watch mode
- \`npm run example\` - Run the example app
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## License

MIT License - see the [LICENSE](LICENSE) file for details.
