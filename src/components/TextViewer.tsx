import type { TextViewerProps } from "../types"

export function TextViewer({ content, fileExtension, className = "" }: TextViewerProps) {
  const getLanguage = (ext: string) => {
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      css: "css",
      html: "html",
      xml: "xml",
      sql: "sql",
      md: "markdown",
      yml: "yaml",
      yaml: "yaml",
    }
    return languageMap[ext] || "text"
  }

  return (
    <div
      className={`bg-gray-50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto border max-h-96 ${className}`}
    >
      <pre className="whitespace-pre-wrap break-words">
        <code className={`language-${getLanguage(fileExtension)}`}>{content}</code>
      </pre>
    </div>
  )
}
