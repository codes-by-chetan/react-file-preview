import { MarkdownViewer } from "./MarkdownViewer";
import type { TextViewerProps } from "../types";
import { CodeViewer } from "./CodeViewer";

export function TextViewer({
  content,
  fileExtension,
  className = "",
  height = "100%",
}: TextViewerProps) {
  // Use MarkdownViewer for markdown files
  if (fileExtension === "md" || fileExtension === "markdown") {
    return <MarkdownViewer content={content} className={className} />;
  }

  // Use CodeViewer for code files
  const codeExtensions = [
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
  ];
  if (codeExtensions.includes(fileExtension)) {
    return (
      <CodeViewer
        content={content}
        language={fileExtension}
        className={className}
        height={height}
      />
    );
  }

  // Fallback to simple text viewer
  return (
    <div
      className={`bg-gray-50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto border max-h-96 ${className}`}
    >
      <pre className="whitespace-pre-wrap break-words">
        <code>{content}</code>
      </pre>
    </div>
  );
}
