import {
  FilePreviewComponent,
  InteractiveImageViewer,
  PDFViewer,
  OfficeViewer,
  VideoViewer,
  FilePreviewHeader,
  FilePreviewContainer,
  JSONViewer,
  CSVViewer,
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
    name: "sample-doc.ppt",
    url: "https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt",
    type: "ppt",
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
  }
}`

const csvContent = `Name,Age,City,Occupation,Salary
John Doe,30,New York,Software Engineer,75000
Jane Smith,25,Los Angeles,Designer,65000
Bob Johnson,35,Chicago,Manager,85000
Alice Brown,28,Seattle,Developer,70000`

function App() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">React File Preview Examples</h1>

      <div className="space-y-8 sm:space-y-12">
        {/* All-in-one FilePreviewComponent */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">All-in-One File Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {sampleFiles.map((file, index) => {
              // Use appropriate heights for different file types
              let height = "300px"
              

              return (
                <div key={index} className="border rounded-lg p-3 sm:p-4 shadow-sm">
                  <h3 className="text-base sm:text-lg font-medium mb-3">{file.name}</h3>
                  <FilePreviewComponent
                    src={file.url}
                    fileName={file.name}
                    height={height}
                    onError={(error:any) => console.error("Error:", error)}
                    onLoad={() => console.log("Loaded:", file.name)}
                  />
                </div>
              )
            })}
          </div>
        </section>

        {/* Modular Components */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Modular Components</h2>

          {/* Custom Image Viewer */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Custom Image Viewer (No Header)</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-64 sm:h-96">
                <InteractiveImageViewer src="https://picsum.photos/1200/800" alt="Sample interactive image" />
              </div>
            </div>
          </div>

          {/* Custom PDF Viewer with Header */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Custom PDF Viewer with Header</h3>
            <FilePreviewContainer height="500px">
              <FilePreviewHeader
                fileName="sample-document.pdf"
                src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                showDownloadButton={true}
              />
              <div style={{ height: "calc(100% - 48px)" }}>
                <PDFViewer src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />
              </div>
            </FilePreviewContainer>
          </div>

          {/* Custom PowerPoint Viewer */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">PowerPoint Viewer (Using OfficeViewer)</h3>
            <FilePreviewContainer height="500px">
              <FilePreviewHeader
                fileName="sample-presentation.ppt"
                src="https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt"
                showDownloadButton={true}
              />
              <div style={{ height: "calc(100% - 48px)" }}>
                <OfficeViewer src="https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt" />
              </div>
            </FilePreviewContainer>
          </div>

          {/* Custom Video Viewer (No Header) */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Video Viewer Only</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 sm:h-64">
                <VideoViewer src="https://www.w3schools.com/html/mov_bbb.mp4" />
              </div>
            </div>
          </div>

          {/* JSON and CSV Viewers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">JSON Viewer</h3>
              <JSONViewer content={jsonContent} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">CSV Viewer</h3>
              <CSVViewer content={csvContent} />
            </div>
          </div>
        </section>

        {/* Document-Focused Examples */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Document Viewers (Optimized Heights)</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF with optimal height */}
            <div>
              <h3 className="text-lg font-medium mb-3">PDF Document (600px height)</h3>
              <FilePreviewComponent
                src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                fileName="optimized-document.pdf"
                height="600px"
              />
            </div>

            {/* PowerPoint with optimal height */}
            <div>
              <h3 className="text-lg font-medium mb-3">PowerPoint Presentation (600px height)</h3>
              <FilePreviewComponent
                src="https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt"
                fileName="optimized-presentation.ppt"
                height="600px"
              />
            </div>
          </div>
        </section>

        {/* Viewer Comparison */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Viewer Comparison</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF using PDFViewer */}
            <div>
              <h3 className="text-lg font-medium mb-3">PDF using PDFViewer (Google Docs)</h3>
              <FilePreviewContainer height="500px">
                <FilePreviewHeader fileName="document.pdf" src="#" />
                <div style={{ height: "calc(100% - 48px)" }}>
                  <PDFViewer src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />
                </div>
              </FilePreviewContainer>
            </div>

            {/* PPT using OfficeViewer */}
            <div>
              <h3 className="text-lg font-medium mb-3">PPT using OfficeViewer (Office Online)</h3>
              <FilePreviewContainer height="500px">
                <FilePreviewHeader fileName="presentation.ppt" src="#" />
                <div style={{ height: "calc(100% - 48px)" }}>
                  <OfficeViewer src="https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt" />
                </div>
              </FilePreviewContainer>
            </div>
          </div>
        </section>

        {/* Custom Composition Example */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Custom Composition</h2>
          <div className="border rounded-lg overflow-hidden">
            {/* Custom header with additional info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 border-b gap-2 sm:gap-0">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium block truncate">custom-image.jpg</span>
                <span className="text-xs text-gray-500">1200x800 • 245KB</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Share
                </button>
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  Download
                </button>
              </div>
            </div>
            {/* Image viewer without built-in controls */}
            <div className="h-64 sm:h-96">
              <InteractiveImageViewer src="https://picsum.photos/1200/800" alt="Custom composition example" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
