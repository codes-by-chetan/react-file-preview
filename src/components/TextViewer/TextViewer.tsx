"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import { MarkdownViewer } from "../MarkdownViewer"
import { CodeViewer } from "../CodeViewer"
import type { TextViewerProps } from "../../types"

// Context for Text Viewer
interface TextViewerContextType {
  content: string
  fileExtension: string
  showLineNumbers: boolean
  setShowLineNumbers: (show: boolean) => void
  fontSize: number
  setFontSize: (size: number) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const TextViewerContext = createContext<TextViewerContextType | undefined>(undefined)

export const useTextViewer = () => {
  const context = useContext(TextViewerContext)
  if (!context) {
    throw new Error("useTextViewer must be used within a TextViewerProvider")
  }
  return context
}

// Provider Component
interface TextViewerProviderProps {
  children: ReactNode
  content: string
  fileExtension: string
}

export const TextViewerProvider: React.FC<TextViewerProviderProps> = ({ children, content, fileExtension }) => {
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const contextValue = useMemo(
    () => ({
      content,
      fileExtension,
      showLineNumbers,
      setShowLineNumbers,
      fontSize,
      setFontSize,
      theme,
      setTheme,
    }),
    [content, fileExtension, showLineNumbers, fontSize, theme],
  )

  return <TextViewerContext.Provider value={contextValue}>{children}</TextViewerContext.Provider>
}

// Main TextViewer Component
export const TextViewer: React.FC<TextViewerProps & { children?: ReactNode }> = ({
  content,
  fileExtension,
  className = "",
  height = "100%",
  children,
}) => {
  if (children) {
    return (
      <TextViewerProvider content={content} fileExtension={fileExtension}>
        <div className={`relative ${className}`} style={{ height }}>
          {children}
        </div>
      </TextViewerProvider>
    )
  }

  // Default behavior when no children provided
  if (fileExtension === "md" || fileExtension === "markdown") {
    return <MarkdownViewer content={content} className={className} />
  }

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
    return <CodeViewer content={content} language={fileExtension} className={className} height={height} />
  }

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto border max-h-96 min-w-0 ${className}`}
    >
      <pre className="whitespace-pre overflow-x-auto min-w-0">
        <code>{content}</code>
      </pre>
    </div>
  )
}
