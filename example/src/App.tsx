"use client"

import { useState } from "react"
import {
  FilePreviewComponent,
  InteractiveImageViewer,
  VideoViewer,
  AudioViewer,
  JSONViewer,
  CSVViewer,
  TextViewer,
} from "../../dist"

const sampleFiles = [
  {
    name: "sample-image.jpg",
    url: "https://picsum.photos/800/600",
    type: "image",
  },
  {
    name: "sample-document.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "document",
  },
  {
    name: "sample-video.mp4",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video",
  },
  {
    name: "sample-audio.mp3",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    type: "audio",
  },
  {
    name: "sample-doc.ppt",
    url: "https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt",
    type: "ppt",
  },
  {
    name: "sample-excel.xlsx",
    url: "https://file-examples.com/storage/fe68c8a7c7c38d9b8c1b4b8/2017/10/file_example_XLSX_10.xlsx",
    type: "excel",
  },
  {
    name: "sample-word.docx",
    url: "https://file-examples.com/storage/fe68c8a7c7c38d9b8c1b4b8/2017/10/file-sample_100kB.docx",
    type: "word",
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
      "technologies": ["React", "Node.js", "MongoDB"]
    },
    {
      "name": "Mobile App",
      "status": "in-progress",
      "technologies": ["React Native", "Firebase"]
    }
  ]
}`

const csvContent = `Name,Age,City,Occupation,Salary,Department,Start Date
John Doe,30,New York,Software Engineer,75000,Engineering,2020-01-15
Jane Smith,25,Los Angeles,Designer,65000,Design,2021-03-22
Bob Johnson,35,Chicago,Manager,85000,Management,2019-07-10
Alice Brown,28,Seattle,Developer,70000,Engineering,2020-11-05
Charlie Wilson,32,Boston,Analyst,68000,Analytics,2021-01-20
Diana Davis,29,Austin,Product Manager,78000,Product,2020-05-18`

const textContent = `# Sample Markdown File

This is a **sample markdown** file to demonstrate text viewing capabilities.

## Features

- Syntax highlighting
- Code blocks
- Lists and formatting

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Code Example

Here's some Python code:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Bullet point 1
- Bullet point 2
- Bullet point 3

> This is a blockquote example.

**Bold text** and *italic text* examples.`

function App() {
  // State for controlled image viewer
  const [imageZoom, setImageZoom] = useState<number>(1)
  const [imagePan, setImagePan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">React File Preview Examples</h1>

      <div className="space-y-8 sm:space-y-12">
        {/* Enhanced Image Viewer Controls Demo */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Enhanced Image Viewer Controls</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controlled Image Viewer */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Controlled Image Viewer</h3>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Zoom: {Math.round(imageZoom * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={imageZoom}
                    onChange={(e) => setImageZoom(Number.parseFloat(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageZoom(1)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Reset Zoom
                  </button>
                  <button
                    onClick={() => setImagePan({ x: 0, y: 0 })}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Reset Pan
                  </button>
                </div>
              </div>
              <div className="h-64">
                <InteractiveImageViewer
                  src="https://picsum.photos/1200/800"
                  alt="Controlled image"
                  zoom={imageZoom}
                  onZoomChange={setImageZoom}
                  pan={imagePan}
                  onPanChange={setImagePan}
                  controls={{
                    showControls: true,
                    showZoomIn: true,
                    showZoomOut: true,
                    showReset: true,
                    showFitToScreen: true,
                    allowPan: true,
                    allowZoom: true,
                  }}
                  methods={{
                    onZoomIn: () => console.log("Zoom in clicked"),
                    onZoomOut: () => console.log("Zoom out clicked"),
                    onReset: () => console.log("Reset clicked"),
                    onFitToScreen: () => console.log("Fit to screen clicked"),
                    onZoomChange: (zoom) => console.log("Zoom changed:", zoom),
                    onPanChange: (pan) => console.log("Pan changed:", pan),
                  }}
                />
              </div>
            </div>

            {/* Custom Controls Image Viewer */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Custom Controls (Zoom Only)</h3>
              <div className="h-64">
                <InteractiveImageViewer
                  src="https://picsum.photos/800/600"
                  alt="Custom controls image"
                  controls={{
                    showControls: true,
                    showZoomIn: true,
                    showZoomOut: true,
                    showReset: false,
                    showFitToScreen: false,
                    allowPan: true,
                    allowZoom: true,
                  }}
                />
              </div>
            </div>

            {/* No Controls Image Viewer */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">No Controls (View Only)</h3>
              <div className="h-64">
                <InteractiveImageViewer
                  src="https://picsum.photos/600/400"
                  alt="No controls image"
                  controls={{
                    showControls: false,
                    allowPan: false,
                    allowZoom: false,
                  }}
                />
              </div>
            </div>

            {/* Pan Disabled Image Viewer */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Zoom Only (No Pan)</h3>
              <div className="h-64">
                <InteractiveImageViewer
                  src="https://picsum.photos/900/600"
                  alt="Zoom only image"
                  controls={{
                    showControls: true,
                    showZoomIn: true,
                    showZoomOut: true,
                    showReset: true,
                    showFitToScreen: true,
                    allowPan: false,
                    allowZoom: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Video Viewer */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Enhanced Video Viewer</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Full Controls Video</h3>
              <div className="h-64">
                <VideoViewer
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  controls={{
                    showControls: true,
                    autoPlay: false,
                    loop: false,
                    muted: false,
                  }}
                  methods={{
                    onPlay: () => console.log("Video started playing"),
                    onPause: () => console.log("Video paused"),
                    onTimeUpdate: (time) => console.log("Time update:", time),
                    onVolumeChange: (volume) => console.log("Volume changed:", volume),
                  }}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Auto-play Muted Video</h3>
              <div className="h-64">
                <VideoViewer
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  controls={{
                    showControls: true,
                    autoPlay: true,
                    loop: true,
                    muted: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Audio Viewer */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Enhanced Audio Viewer</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Full Controls Audio</h3>
              <div className="h-48">
                <AudioViewer
                  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                  fileName="sample-audio.wav"
                  controls={{
                    showControls: true,
                    autoPlay: false,
                    loop: false,
                  }}
                  methods={{
                    onPlay: () => console.log("Audio started playing"),
                    onPause: () => console.log("Audio paused"),
                    onTimeUpdate: (time) => console.log("Audio time:", time),
                  }}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Loop Audio</h3>
              <div className="h-48">
                <AudioViewer
                  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                  fileName="loop-audio.wav"
                  controls={{
                    showControls: true,
                    loop: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* All File Types Demo */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">All File Types Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {sampleFiles.map((file, index) => (
              <div key={index} className="border rounded-lg p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-medium mb-3">{file.name}</h3>
                <FilePreviewComponent
                  src={file.url}
                  fileName={file.name}
                  height="300px"
                  onError={(error: any) => console.error("Error:", error)}
                  onLoad={() => console.log("Loaded:", file.name)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Text-based Content Demo */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Text-based Content</h2>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">JSON Viewer</h3>
              <JSONViewer content={jsonContent} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">CSV Viewer</h3>
              <CSVViewer content={csvContent} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Markdown Text</h3>
              <TextViewer content={textContent} fileExtension="md" />
            </div>
          </div>
        </section>

        {/* Content Source Demo */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Content Source Examples</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Base64 Image */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Base64 Image</h3>
              <div className="h-64">
                <InteractiveImageViewer
                  content="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4yMDB4MjAwPC90ZXh0Pgo8L3N2Zz4="
                  alt="Base64 SVG"
                />
              </div>
            </div>

            {/* Direct JSON Content */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Direct JSON Content</h3>
              <JSONViewer content='{"message": "Hello from direct content!", "timestamp": "2024-01-01T00:00:00Z", "data": [1, 2, 3, 4, 5]}' />
            </div>
          </div>
        </section>

        {/* Method Callbacks Demo */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Method Callbacks Demo</h2>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Image with All Callbacks</h3>
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <p>Check the browser console to see callback logs when interacting with the image.</p>
            </div>
            <div className="h-64">
              <InteractiveImageViewer
                src="https://picsum.photos/800/600"
                alt="Callback demo image"
                methods={{
                  onZoomIn: () => console.log("🔍 Zoom In button clicked"),
                  onZoomOut: () => console.log("🔍 Zoom Out button clicked"),
                  onReset: () => console.log("🔄 Reset button clicked"),
                  onFitToScreen: () => console.log("📐 Fit to Screen button clicked"),
                  onZoomChange: (zoom) => console.log("📏 Zoom changed to:", Math.round(zoom * 100) + "%"),
                  onPanChange: (pan) => console.log("👆 Pan changed to:", pan),
                }}
                onLoad={() => console.log("✅ Image loaded successfully")}
                onError={(error) => console.error("❌ Image error:", error)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
