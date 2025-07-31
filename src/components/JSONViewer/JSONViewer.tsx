"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import type { BaseViewerProps } from "../../types"

interface JSONBlock {
  startLine: number
  endLine: number
  type: "object" | "array"
  name?: string
  collapsed: boolean
  id: string
  level: number
}

interface JSONViewerContextType {
  content: string
  fileName?: string
  isFormatted: boolean
  setIsFormatted: (formatted: boolean) => void
  collapsedBlocks: Set<string>
  setCollapsedBlocks: React.Dispatch<React.SetStateAction<Set<string>>>
  jsonBlocks: JSONBlock[]
  lines: string[]
  displayContent: string
  isValidJSON: boolean
  toggleBlock: (blockId: string) => void
  toggleFormat: () => void
  copyToClipboard: () => Promise<void>
  copied: boolean
}

const JSONViewerContext = createContext<JSONViewerContextType | undefined>(undefined)

export const useJSONViewer = () => {
  const context = useContext(JSONViewerContext)
  if (!context) {
    throw new Error("useJSONViewer must be used within a JSONViewerProvider")
  }
  return context
}

interface JSONViewerProviderProps {
  children: ReactNode
  content: string
  fileName?: string
}

export const JSONViewerProvider: React.FC<JSONViewerProviderProps> = ({ children, content, fileName }) => {
  const [isFormatted, setIsFormatted] = useState(false)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  // Format JSON content
  const formattedContent = useMemo(() => {
    try {
      const parsed = JSON.parse(content)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return content
    }
  }, [content])

  const displayContent = isFormatted ? formattedContent : content
  const lines = useMemo(() => displayContent.split("\n"), [displayContent])

  // Detect JSON blocks
  const jsonBlocks = useMemo(() => {
    const blocks: JSONBlock[] = []
    const stack: Array<{
      line: number
      type: "object" | "array"
      level: number
      name?: string
    }> = []

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      const level = stack.length

      if (trimmed.includes("{")) {
        const nameMatch = line.match(/"([^"]+)"\s*:\s*\{/) || line.match(/^\s*\{/)
        const name = nameMatch?.[1] || (stack.length === 0 ? "root" : undefined)
        stack.push({ line: index, type: "object", level, name })
      }

      if (trimmed.includes("[")) {
        const nameMatch = line.match(/"([^"]+)"\s*:\s*\[/)
        const name = nameMatch?.[1]
        stack.push({ line: index, type: "array", level, name })
      }

      if (trimmed.includes("}") && stack.length > 0) {
        const lastBlock = stack[stack.length - 1]
        if (lastBlock.type === "object") {
          const block = stack.pop()!
          if (index > block.line) {
            blocks.push({
              startLine: block.line,
              endLine: index,
              type: block.type,
              name: block.name,
              collapsed: false,
              id: `${block.line}-${index}-${block.type}`,
              level: block.level,
            })
          }
        }
      }

      if (trimmed.includes("]") && stack.length > 0) {
        const lastBlock = stack[stack.length - 1]
        if (lastBlock.type === "array") {
          const block = stack.pop()!
          if (index > block.line) {
            blocks.push({
              startLine: block.line,
              endLine: index,
              type: block.type,
              name: block.name,
              collapsed: false,
              id: `${block.line}-${index}-${block.type}`,
              level: block.level,
            })
          }
        }
      }
    })

    return blocks.sort((a, b) => a.startLine - b.startLine)
  }, [lines])

  const isValidJSON = useMemo(() => {
    try {
      JSON.parse(content)
      return true
    } catch {
      return false
    }
  }, [content])

  const toggleBlock = (blockId: string) => {
    setCollapsedBlocks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(blockId)) {
        newSet.delete(blockId)
      } else {
        newSet.add(blockId)
      }
      return newSet
    })
  }

  const toggleFormat = () => {
    setIsFormatted(!isFormatted)
    setCollapsedBlocks(new Set())
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy JSON:", err)
    }
  }

  const contextValue = useMemo(
    () => ({
      content,
      fileName,
      isFormatted,
      setIsFormatted,
      collapsedBlocks,
      setCollapsedBlocks,
      jsonBlocks,
      lines,
      displayContent,
      isValidJSON,
      toggleBlock,
      toggleFormat,
      copyToClipboard,
      copied,
    }),
    [content, fileName, isFormatted, collapsedBlocks, jsonBlocks, lines, displayContent, isValidJSON, copied],
  )

  return <JSONViewerContext.Provider value={contextValue}>{children}</JSONViewerContext.Provider>
}

interface JSONViewerProps extends BaseViewerProps {
  content: string
  fileName?: string
  children?: ReactNode
}

export const JSONViewer: React.FC<JSONViewerProps> = ({ content, fileName, className = "", children }) => {
  if (children) {
    return (
      <JSONViewerProvider content={content} fileName={fileName}>
        <div className={`border rounded-lg overflow-hidden ${className}`}>{children}</div>
      </JSONViewerProvider>
    )
  }

  // Default behavior - render the original JSONViewer component
  return (
    <JSONViewerProvider content={content} fileName={fileName}>
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        {/* This would include the default header, content, and footer */}
      </div>
    </JSONViewerProvider>
  )
}
