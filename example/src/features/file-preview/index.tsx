/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import {
  FilePreviewComponent,
  ImageViewer,
  ImageViewerContent,
  ImageViewerToolbar,
  ImageViewerZoomIndicator,
  ImageViewerZoomInButton,
  ImageViewerZoomOutButton,
  ImageViewerResetButton,
  ImageViewerFitToScreenButton,
  VideoViewer,
  AudioViewer,
  JSONViewer,
  CSVViewer,
  TextViewer,
  FilePreviewProvider,
} from '../../../../dist'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

const sampleFiles = [
  {
    name: 'sample-image.jpg',
    url: 'https://picsum.photos/800/600',
    type: 'image',
  },
  {
    name: 'sample-document.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'document',
  },
  {
    name: 'sample-video.mp4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    type: 'video',
  },
  {
    name: 'sample-audio.mp3',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    type: 'audio',
  },
]

const jsonContent = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "React", "Node.js"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "projects": [
    {
      "name": "E-commerce Platform",
      "status": "completed",
      "technologies": ["React", "Node.js", "MongoDB"],
      "startDate": "2023-01-15",
      "endDate": "2023-06-30",
      "budget": 50000
    },
    {
      "name": "Mobile App",
      "status": "in-progress",
      "technologies": ["React Native", "Firebase"],
      "startDate": "2023-07-01",
      "endDate": null,
      "budget": 75000
    }
  ],
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en-US"
  }
}`

const csvContent = `Name,Age,City,Occupation,Salary,Department,Start Date,Performance Rating,Projects Completed,Skills
John Doe,30,New York,Software Engineer,75000,Engineering,2020-01-15,4.5,12,"JavaScript,React,Node.js"
Jane Smith,25,Los Angeles,Designer,65000,Design,2021-03-22,4.8,8,"Figma,Photoshop,Illustrator"
Bob Johnson,35,Chicago,Manager,85000,Management,2019-07-10,4.2,15,"Leadership,Strategy,Communication"
Alice Brown,28,Seattle,Developer,70000,Engineering,2020-11-05,4.7,10,"Python,Django,PostgreSQL"
Charlie Wilson,32,Boston,Analyst,68000,Analytics,2021-01-20,4.3,6,"SQL,Tableau,Excel"
Diana Davis,29,Austin,Product Manager,78000,Product,2020-05-18,4.6,9,"Product Strategy,Agile,Scrum"
Eve Martinez,26,San Francisco,Frontend Developer,72000,Engineering,2021-08-12,4.9,7,"React,Vue.js,TypeScript"
Frank Garcia,33,Miami,Backend Developer,74000,Engineering,2019-12-03,4.4,11,"Java,Spring,MySQL"
Grace Lee,31,Portland,UX Designer,69000,Design,2020-09-14,4.5,5,"User Research,Wireframing,Prototyping"
Henry Kim,27,Denver,DevOps Engineer,76000,Engineering,2021-04-07,4.6,8,"Docker,Kubernetes,AWS"`

const markdownContent = `# React File Preview Package

A comprehensive file preview component library for React applications.

## Features

### Modular Image Viewer
- **Compound Components**: Use individual components like \`ImageViewerToolbar\`, \`ImageViewerContent\`
- **Customizable Styling**: Pass className and style props to each component
- **Context-based State**: Efficient state management without prop drilling
- **Interactive Controls**: Zoom in/out, pan, reset view
- **Touch Support**: Pinch to zoom, drag to pan

### Video & Audio Players
- **Custom Controls**: Show/hide player controls
- **Event Callbacks**: Handle play, pause, time updates
- **Multiple Formats**: Support for various media formats

### Document Viewers
- **PDF Support**: Embedded PDF viewing
- **Office Documents**: Word, Excel, PowerPoint support
- **Text Files**: Syntax highlighting for code files

## Installation

\`\`\`bash
npm install react-file-preview
# or
yarn add react-file-preview
\`\`\`

## Usage

### Modular Image Viewer

\`\`\`jsx
import {
  ImageViewer,
  ImageViewerContent,
  ImageViewerToolbar,
  ImageViewerZoomIndicator,
  ImageViewerZoomInButton,
  ImageViewerZoomOutButton,
  ImageViewerResetButton,
} from 'react-file-preview'

function CustomImageViewer() {
  return (
    <ImageViewer src="https://example.com/image.jpg" alt="Sample image">
      <ImageViewerContent allowPan={true} allowZoom={true} />
      
      <ImageViewerToolbar position="top-right" className="bg-blue-100">
        <ImageViewerZoomInButton size="lg" variant="outline" />
        <ImageViewerZoomOutButton size="lg" variant="outline" />
        <ImageViewerResetButton size="lg" variant="outline" />
      </ImageViewerToolbar>
      
      <ImageViewerZoomIndicator 
        position="bottom-left" 
        className="bg-green-600 text-white"
        format={(zoom) => \`\${Math.round(zoom * 100)}% zoom\`}
      />
    </ImageViewer>
  )
}
\`\`\`

### Controlled Image Viewer

\`\`\`jsx
import { useState } from 'react'
import { ImageViewer, ImageViewerContent } from 'react-file-preview'

function ControlledViewer() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  return (
    <ImageViewer
      src="image.jpg"
      zoom={zoom}
      onZoomChange={setZoom}
      pan={pan}
      onPanChange={setPan}
      methods={{
        onZoomIn: () => console.log('Zoomed in'),
        onZoomOut: () => console.log('Zoomed out')
      }}
    >
      <ImageViewerContent />
    </ImageViewer>
  )
}
\`\`\`

## API Reference

### ImageViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`src\` | string | - | Image URL |
| \`zoom\` | number | - | External zoom control |
| \`onZoomChange\` | function | - | Zoom change callback |
| \`methods\` | object | \`{}\` | Method callbacks |

### ImageViewerToolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`position\` | string | 'top-right' | Toolbar position |
| \`className\` | string | '' | Custom CSS classes |
| \`style\` | object | - | Inline styles |

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> **Note**: This package is actively maintained and we welcome contributions!
`

const javascriptCode = `// React File Preview - Modular Image Viewer
import React from 'react'
import {
  ImageViewer,
  ImageViewerContent,
  ImageViewerToolbar,
  ImageViewerZoomIndicator,
  ImageViewerZoomInButton,
  ImageViewerZoomOutButton,
  ImageViewerResetButton,
} from 'react-file-preview'

const ModularImageViewer = ({ src, alt = "Image" }) => {
  return (
    <ImageViewer 
      src={src || "/placeholder.svg"} 
      alt={alt}
      methods={{
        onZoomIn: () => console.log('🔍 Zoom In'),
        onZoomOut: () => console.log('🔍 Zoom Out'),
        onReset: () => console.log('🔄 Reset'),
        onZoomChange: (zoom) => console.log('📏 Zoom:', zoom),
        onPanChange: (pan) => console.log('👆 Pan:', pan),
      }}
    >
      {/* Main image content with interaction */}
      <ImageViewerContent 
        allowPan={true} 
        allowZoom={true}
        className="rounded-lg"
      />
      
      {/* Customizable toolbar */}
      <ImageViewerToolbar 
        position="top-right"
        className="bg-white/95 backdrop-blur-md shadow-xl"
      >
        <ImageViewerZoomInButton 
          size="lg" 
          variant="outline"
          className="hover:bg-blue-50"
        />
        <ImageViewerZoomOutButton 
          size="lg" 
          variant="outline"
          className="hover:bg-blue-50"
        />
        <ImageViewerResetButton 
          size="lg" 
          variant="outline"
          className="hover:bg-red-50"
        />
      </ImageViewerToolbar>
      
      {/* Custom zoom indicator */}
      <ImageViewerZoomIndicator 
        position="bottom-right"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
        format={(zoom) => \`\${Math.round(zoom * 100)}% zoom\`}
      />
    </ImageViewer>
  )
}

export default ModularImageViewer`

const typescriptCode = `// TypeScript interfaces for Modular Image Viewer
interface ImageViewerProps {
  src?: string
  blob?: Blob
  content?: string
  alt?: string
  className?: string
  zoom?: number
  onZoomChange?: (zoom: number) => void
  pan?: { x: number; y: number }
  onPanChange?: (pan: { x: number; y: number }) => void
  methods?: ImageViewerMethods
  onError?: (error: string) => void
  onLoad?: () => void
  children: React.ReactNode
}

interface ImageViewerContentProps {
  className?: string
  allowPan?: boolean
  allowZoom?: boolean
  style?: React.CSSProperties
}

interface ImageViewerToolbarProps {
  children: React.ReactNode
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  style?: React.CSSProperties
}

interface ImageViewerZoomIndicatorProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  style?: React.CSSProperties
  format?: (zoom: number) => string
}

interface ImageViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

interface ImageViewerMethods {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onFitToScreen?: () => void
  onZoomChange?: (zoom: number) => void
  onPanChange?: (offset: { x: number; y: number }) => void
}

// Usage example with full customization
const CustomImageViewer: React.FC<{ src: string }> = ({ src }) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  return (
    <ImageViewer
      src={src || "/placeholder.svg"}
      zoom={zoom}
      onZoomChange={setZoom}
      pan={pan}
      onPanChange={setPan}
      methods={{
        onZoomIn: () => console.log('Zoom in triggered'),
        onZoomOut: () => console.log('Zoom out triggered'),
        onReset: () => console.log('Reset triggered'),
      }}
    >
      <ImageViewerContent 
        allowPan={true} 
        allowZoom={true}
        className="border-2 border-blue-200"
      />
      
      <ImageViewerToolbar 
        position="top-left"
        className="bg-black/80 text-white"
      >
        <ImageViewerZoomInButton size="sm" variant="ghost" />
        <ImageViewerZoomOutButton size="sm" variant="ghost" />
        <ImageViewerResetButton size="sm" variant="ghost" />
      </ImageViewerToolbar>
      
      <ImageViewerZoomIndicator 
        position="bottom-left"
        className="bg-green-500 text-white font-bold"
        format={(zoom) => \`\${(zoom * 100).toFixed(1)}%\`}
      />
    </ImageViewer>
  )
}

export type {
  ImageViewerProps,
  ImageViewerContentProps,
  ImageViewerToolbarProps,
  ImageViewerZoomIndicatorProps,
  ImageViewerButtonProps,
  ImageViewerMethods
}`

const pythonCode = `# Python data processing example
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DataProcessor:
    """A class for processing CSV data with filtering and analysis."""
    
    def __init__(self, csv_content: str):
        self.df = self._parse_csv(csv_content)
        self.original_shape = self.df.shape
    
    def _parse_csv(self, content: str) -> pd.DataFrame:
        """Parse CSV content into a pandas DataFrame."""
        from io import StringIO
        return pd.read_csv(StringIO(content))
    
    def filter_by_column(self, column: str, value: str) -> 'DataProcessor':
        """Filter data by column value."""
        if column in self.df.columns:
            mask = self.df[column].astype(str).str.contains(value, case=False, na=False)
            self.df = self.df[mask]
        return self
    
    def sort_by_column(self, column: str, ascending: bool = True) -> 'DataProcessor':
        """Sort data by specified column."""
        if column in self.df.columns:
            self.df = self.df.sort_values(by=column, ascending=ascending)
        return self
    
    def get_summary_stats(self) -> dict:
        """Get summary statistics for numeric columns."""
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        return {
            'total_rows': len(self.df),
            'numeric_columns': len(numeric_cols),
            'summary': self.df[numeric_cols].describe().to_dict() if len(numeric_cols) > 0 else {}
        }
    
    def search_all_columns(self, search_term: str) -> 'DataProcessor':
        """Search for term across all columns."""
        mask = self.df.astype(str).apply(
            lambda x: x.str.contains(search_term, case=False, na=False)
        ).any(axis=1)
        self.df = self.df[mask]
        return self
    
    def to_json(self) -> str:
        """Convert filtered data to JSON."""
        return self.df.to_json(orient='records', indent=2)

# Usage example
if __name__ == "__main__":
    csv_data = """Name,Age,City,Salary
    John,30,New York,75000
    Jane,25,Los Angeles,65000
    Bob,35,Chicago,85000"""
    
    processor = DataProcessor(csv_data)
    result = (processor
              .filter_by_column('City', 'New')
              .sort_by_column('Salary', ascending=False)
              .get_summary_stats())
    
    print(f"Processed {result['total_rows']} rows")
    print(f"Summary: {result['summary']}")`

function FilePreview() {
  // State for controlled image viewer
  const [imageZoom, setImageZoom] = useState<number>(1)
  const [imagePan, setImagePan] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  return (
    <div className='container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>
      <h1 className='mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl'>
        React File Preview Examples - Modular Components
      </h1>

      <div className='space-y-8 sm:space-y-12'>
        {/* NEW: Modular Image Viewer Showcase */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            🎨 Modular Image Viewer Components
          </h2>
          <p className='mb-6 text-gray-600'>
            Build custom image viewers using compound components with full
            styling control.
          </p>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Custom Styled Toolbar */}
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>
                Custom Styled Toolbar (Top-Left)
              </h3>
              <div className='h-64'>
                <FilePreviewProvider>
                  <ImageViewer
                    src='https://picsum.photos/800/600'
                    alt='Custom toolbar image'
                    methods={{
                      onZoomIn: () => console.log('🔍 Custom Zoom In'),
                      onZoomOut: () => console.log('🔍 Custom Zoom Out'),
                      onReset: () => console.log('🔄 Custom Reset'),
                    }}
                  >
                    <ImageViewerContent allowPan={true} allowZoom={true} />
                    <ImageViewerToolbar
                      position='top-left'
                      className='bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl'
                    >
                      <ImageViewerZoomInButton
                        size='lg'
                        variant='ghost'
                        className='text-white hover:bg-white/20'
                      />
                      <ImageViewerZoomOutButton
                        size='lg'
                        variant='ghost'
                        className='text-white hover:bg-white/20'
                      />
                      <ImageViewerResetButton
                        size='lg'
                        variant='ghost'
                        className='text-white hover:bg-white/20'
                      />
                    </ImageViewerToolbar>
                    <ImageViewerZoomIndicator
                      position='bottom-left'
                      className='bg-purple-600 font-bold text-white'
                    />
                  </ImageViewer>
                </FilePreviewProvider>
              </div>
            </div>

            {/* Minimal Controls */}
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>
                Minimal Controls (Bottom-Right)
              </h3>
              <div className='h-64'>
                <FilePreviewProvider>
                  <ImageViewer
                    src='https://picsum.photos/600/400'
                    alt='Minimal controls image'
                  >
                    <ImageViewerContent allowPan={true} allowZoom={true} />
                    <ImageViewerToolbar
                      position='bottom-right'
                      className='bg-black/80 backdrop-blur-sm'
                    >
                      <ImageViewerZoomInButton
                        size='sm'
                        variant='ghost'
                        className='text-white hover:bg-white/20'
                      />
                      <ImageViewerZoomOutButton
                        size='sm'
                        variant='ghost'
                        className='text-white hover:bg-white/20'
                      />
                    </ImageViewerToolbar>
                    <ImageViewerZoomIndicator
                      position='top-right'
                      className='bg-green-500 text-xs text-white'
                      format={(zoom) => `${Math.round(zoom * 100)}%`}
                    />
                  </ImageViewer>
                </FilePreviewProvider>
              </div>
            </div>

            {/* All Controls with Custom Styling */}
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>
                All Controls with Custom Styling
              </h3>
              <div className='h-64'>
                <FilePreviewProvider>
                  <ImageViewer
                    src='https://picsum.photos/900/600'
                    alt='All controls image'
                  >
                    <ImageViewerContent
                      allowPan={true}
                      allowZoom={true}
                      className='rounded-lg'
                    />
                    <ImageViewerToolbar
                      position='top-right'
                      className='border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md'
                    >
                      <ImageViewerZoomInButton
                        size='md'
                        variant='outline'
                        className='border-blue-200 hover:bg-blue-50'
                      />
                      <ImageViewerZoomOutButton
                        size='md'
                        variant='outline'
                        className='border-blue-200 hover:bg-blue-50'
                      />
                      <ImageViewerResetButton
                        size='md'
                        variant='outline'
                        className='border-red-200 hover:bg-red-50'
                      />
                      <ImageViewerFitToScreenButton
                        size='md'
                        variant='outline'
                        className='border-green-200 hover:bg-green-50'
                      />
                    </ImageViewerToolbar>
                    <ImageViewerZoomIndicator
                      position='bottom-right'
                      className='bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-white shadow-lg'
                      format={(zoom) => `${Math.round(zoom * 100)}% zoom`}
                    />
                  </ImageViewer>
                </FilePreviewProvider>
              </div>
            </div>

            {/* Controlled Image Viewer */}
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>
                Controlled Image Viewer
              </h3>
              <FilePreviewProvider>
                <div className='mb-4 space-y-2'>
                  <div className='flex items-center gap-4'>
                    <label className='text-sm font-medium'>
                      Zoom: {Math.round(imageZoom * 100)}%
                    </label>
                    <input
                      type='range'
                      min='0.1'
                      max='3'
                      step='0.1'
                      value={imageZoom}
                      onChange={(e) =>
                        setImageZoom(Number.parseFloat(e.target.value))
                      }
                      className='flex-1'
                    />
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setImageZoom(1)}
                      className='rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700'
                    >
                      Reset Zoom
                    </button>
                    <button
                      onClick={() => setImagePan({ x: 0, y: 0 })}
                      className='rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700'
                    >
                      Reset Pan
                    </button>
                  </div>
                </div>
                <div className='h-64'>
                  <ImageViewer
                    src='https://picsum.photos/1200/800'
                    alt='Controlled image'
                    zoom={imageZoom}
                    onZoomChange={setImageZoom}
                    pan={imagePan}
                    onPanChange={setImagePan}
                    methods={{
                      onZoomIn: () => console.log('External: Zoom in clicked'),
                      onZoomOut: () =>
                        console.log('External: Zoom out clicked'),
                      onReset: () => console.log('External: Reset clicked'),
                      onZoomChange: (zoom) =>
                        console.log('External: Zoom changed:', zoom),
                      onPanChange: (pan) =>
                        console.log('External: Pan changed:', pan),
                    }}
                  >
                    <ImageViewerContent allowPan={true} allowZoom={true} />
                    <ImageViewerToolbar position='top-right'>
                      <ImageViewerZoomInButton />
                      <ImageViewerZoomOutButton />
                      <ImageViewerResetButton />
                    </ImageViewerToolbar>
                    <ImageViewerZoomIndicator position='bottom-right' />
                  </ImageViewer>
                </div>
              </FilePreviewProvider>
            </div>
          </div>
        </section>

        {/* Enhanced CSV Viewer with Filtering */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            Enhanced CSV Viewer with Filtering & Search
          </h2>

          <div className='rounded-lg border p-4'>
            <h3 className='mb-3 text-lg font-medium'>
              Interactive CSV Data Table
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              Try searching, filtering by columns, and sorting by clicking
              column headers.
            </p>
            <FilePreviewProvider>
              <CSVViewer content={csvContent} />
            </FilePreviewProvider>
          </div>
        </section>

        {/* Enhanced Text Viewers with Syntax Highlighting */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            Enhanced Text Viewers
          </h2>

          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            {/* Markdown with Preview */}
            <div>
              <h3 className='mb-3 text-lg font-medium'>
                Markdown with Live Preview
              </h3>
              <FilePreviewProvider>
                <TextViewer content={markdownContent} fileExtension='md' />
              </FilePreviewProvider>
            </div>

            {/* JavaScript with Syntax Highlighting */}
            <div>
              <h3 className='mb-3 text-lg font-medium'>
                JavaScript with Syntax Highlighting
              </h3>
              <FilePreviewProvider>
                <TextViewer
                  className='!max-h-[450px]'
                  content={javascriptCode}
                  fileExtension='js'
                />
              </FilePreviewProvider>
            </div>

            {/* TypeScript with Syntax Highlighting */}
            <div>
              <h3 className='mb-3 text-lg font-medium'>
                TypeScript with Syntax Highlighting
              </h3>
              <FilePreviewProvider>
                <TextViewer content={typescriptCode} fileExtension='ts' />
              </FilePreviewProvider>
            </div>

            {/* Python with Syntax Highlighting */}
            <div>
              <h3 className='mb-3 text-lg font-medium'>
                Python with Syntax Highlighting
              </h3>
              <FilePreviewProvider>
                <TextViewer content={pythonCode} fileExtension='py' />
              </FilePreviewProvider>
            </div>
          </div>
        </section>

        {/* Enhanced JSON Viewer */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            Enhanced JSON Viewer
          </h2>

          <div className='rounded-lg border p-4'>
            <h3 className='mb-3 text-lg font-medium'>
              Formatted JSON with Syntax Highlighting
            </h3>
            <FilePreviewProvider>
              <JSONViewer content={jsonContent} />
            </FilePreviewProvider>
          </div>
        </section>

        {/* Enhanced Video Viewer */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            Enhanced Video Viewer
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>Full Controls Video</h3>
              <div className='h-64'>
                <FilePreviewProvider>
                  <VideoViewer
                    src='https://www.w3schools.com/html/mov_bbb.mp4'
                    controls={{
                      showControls: true,
                      autoPlay: false,
                      loop: false,
                      muted: false,
                    }}
                    methods={{
                      onPlay: () => console.log('Video started playing'),
                      onPause: () => console.log('Video paused'),
                      onTimeUpdate: (time) => console.log('Time update:', time),
                      onVolumeChange: (volume) =>
                        console.log('Volume changed:', volume),
                    }}
                  />
                </FilePreviewProvider>
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>
                Auto-play Muted Video
              </h3>
              <div className='h-64'>
                <FilePreviewProvider>
                  <VideoViewer
                    src='https://www.w3schools.com/html/mov_bbb.mp4'
                    controls={{
                      showControls: true,
                      autoPlay: true,
                      loop: true,
                      muted: true,
                    }}
                  />
                </FilePreviewProvider>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Audio Viewer */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            Enhanced Audio Viewer
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>Full Controls Audio</h3>
              <div className='h-48'>
                <FilePreviewProvider>
                  <AudioViewer
                    src='https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                    fileName='sample-audio.wav'
                    controls={{
                      showControls: true,
                      autoPlay: false,
                      loop: false,
                    }}
                    methods={{
                      onPlay: () => console.log('Audio started playing'),
                      onPause: () => console.log('Audio paused'),
                      onTimeUpdate: (time) => console.log('Audio time:', time),
                    }}
                  />
                </FilePreviewProvider>
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <h3 className='mb-3 text-lg font-medium'>Loop Audio</h3>
              <div className='h-48'>
                <FilePreviewProvider>
                  <AudioViewer
                    src='https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                    fileName='loop-audio.wav'
                    controls={{
                      showControls: true,
                      loop: true,
                    }}
                  />
                </FilePreviewProvider>
              </div>
            </div>
          </div>
        </section>

        {/* All File Types Demo */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            All File Types Preview (Using FilePreviewComponent)
          </h2>
          <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2'>
            {sampleFiles.map((file, index) => (
              <div
                key={index}
                className='rounded-lg border p-3 shadow-sm sm:p-4'
              >
                <h3 className='mb-3 text-base font-medium sm:text-lg'>
                  {file.name}
                </h3>
                <FilePreviewProvider>
                  <FilePreviewComponent
                    src={file.url}
                    fileName={file.name}
                    height='300px'
                    onError={(error: any) => console.error('Error:', error)}
                    onLoad={() => console.log('Loaded:', file.name)}
                  />
                </FilePreviewProvider>
              </div>
            ))}
          </div>
        </section>

        {/* Context Usage Demo */}
        <section>
          <h2 className='mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl'>
            🎯 Context-Based State Management
          </h2>

          <div className='rounded-lg border p-4'>
            <h3 className='mb-3 text-lg font-medium'>
              Efficient State Management with FilePreviewContext
            </h3>
            <div className='mb-4 rounded bg-gray-100 p-3 text-sm'>
              <p>
                The modular components use a central context for state
                management, eliminating prop drilling and enabling efficient
                component communication. Check the browser console to see method
                callbacks in action.
              </p>
            </div>
            <div className='h-64'>
              <FilePreviewProvider>
                <ImageViewer
                  src='https://picsum.photos/800/600'
                  alt='Context demo image'
                  methods={{
                    onZoomIn: () => console.log('🎯 Context: Zoom In'),
                    onZoomOut: () => console.log('🎯 Context: Zoom Out'),
                    onReset: () => console.log('🎯 Context: Reset'),
                    onZoomChange: (zoom) =>
                      console.log(
                        '🎯 Context: Zoom changed to:',
                        Math.round(zoom * 100) + '%'
                      ),
                    onPanChange: (pan) =>
                      console.log('🎯 Context: Pan changed to:', pan),
                  }}
                  onLoad={() =>
                    console.log('🎯 Context: Image loaded successfully')
                  }
                  onError={(error) =>
                    console.error('🎯 Context: Image error:', error)
                  }
                >
                  <ImageViewerContent allowPan={true} allowZoom={true} />
                  <ImageViewerToolbar position='top-right'>
                    <ImageViewerZoomInButton />
                    <ImageViewerZoomOutButton />
                    <ImageViewerResetButton />
                  </ImageViewerToolbar>
                  <ImageViewerZoomIndicator position='bottom-right' />
                </ImageViewer>
              </FilePreviewProvider>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FilePreview
