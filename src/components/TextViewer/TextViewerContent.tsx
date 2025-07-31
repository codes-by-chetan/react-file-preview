"use client"

import type React from "react"
import { useTextViewer } from "./TextViewer"
import { MarkdownViewer } from "../MarkdownViewer"
import { CodeViewer } from "../CodeViewer"

interface TextViewerContentProps {
  className?: string
  style?: React.CSSProperties
}

export const TextViewerContent: React.FC<TextViewerContentProps> = ({ className = "", style }) => {
  const { content, fileExtension, fontSize, theme } = useTextViewer()

  const contentStyle = {
    fontSize: `${fontSize}px`,
    ...style,
  }

  // Use MarkdownViewer for markdown files
  if (fileExtension === "md" || fileExtension === "markdown") {
    return (
      <div className={className} style={contentStyle}>
        <MarkdownViewer content={content} />
      </div>
    )
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
  ]

  if (codeExtensions.includes(fileExtension)) {
    return (
      <div className={className} style={contentStyle}>
        <CodeViewer content={content} language={fileExtension} className={`${theme === "dark" ? "dark" : ""}`} />
      </div>
    )
  }

  // Fallback to simple text viewer
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto border min-w-0 ${className}`}
      style={contentStyle}
    >
      <pre className="whitespace-pre overflow-x-auto min-w-0">
        <code>{content}</code>
      </pre>
    </div>
  )
}
