import {
  FilePreviewComponent,
  InteractiveImageViewer,
  PDFViewer,
  VideoViewer,
  FilePreviewHeader,
  FilePreviewContainer,
  JSONViewer,
  CSVViewer,
  OfficeViewer,
} from "../../dist";

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
];

const jsonContent = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "React", "Node.js"]
}`;

const csvContent = `Name,Age,City
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`;

function App() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        React File Preview Examples
      </h1>

      <div className="space-y-12">
        {/* All-in-one FilePreviewComponent */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            All-in-One File Preview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sampleFiles.map((file, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium mb-3">{file.name}</h3>
                <FilePreviewComponent
                  src={file.url}
                  fileName={file.name}
                  height="300px"
                  onError={(error) => console.error("Error:", error)}
                  onLoad={() => console.log("Loaded:", file.name)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Modular Components */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Modular Components</h2>

          {/* Custom Image Viewer */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              Custom Image Viewer (No Header)
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <InteractiveImageViewer
                src="https://picsum.photos/1200/800"
                alt="Sample interactive image"
                className="h-96"
              />
            </div>
          </div>

          {/* Custom Image Viewer */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              Custom Image Viewer (No Header)
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <OfficeViewer src="https://s3.us-east-1.amazonaws.com/dev-insurance-suite/muzz-corp-67c966ebc0d07a8e61fa753f/task-attachments/file-example-ppt-250kb-1752141006535.ppt" />
            </div>
          </div>

          {/* Custom PDF Viewer with Header */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              Custom PDF Viewer with Header
            </h3>
            <FilePreviewContainer height="400px">
              <FilePreviewHeader
                fileName="sample-document.pdf"
                src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                showDownloadButton={true}
              />
              <PDFViewer src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />
            </FilePreviewContainer>
          </div>

          {/* Custom Video Viewer (No Header) */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Video Viewer Only</h3>
            <div className="border rounded-lg overflow-hidden h-64">
              <VideoViewer src="https://www.w3schools.com/html/mov_bbb.mp4" />
            </div>
          </div>

          {/* JSON and CSV Viewers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-4">JSON Viewer</h3>
              <JSONViewer content={jsonContent} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4">CSV Viewer</h3>
              <CSVViewer content={csvContent} />
            </div>
          </div>
        </section>

        {/* Custom Composition Example */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Custom Composition</h2>
          <div className="border rounded-lg overflow-hidden">
            {/* Custom header with additional info */}
            <div className="flex items-center justify-between p-3 bg-blue-50 border-b">
              <div>
                <span className="text-sm font-medium">custom-image.jpg</span>
                <span className="text-xs text-gray-500 ml-2">
                  1200x800 • 245KB
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Share
                </button>
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                  Download
                </button>
              </div>
            </div>
            {/* Image viewer without built-in controls */}
            <div className="h-96">
              <InteractiveImageViewer
                src="https://picsum.photos/1200/800"
                alt="Custom composition example"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
