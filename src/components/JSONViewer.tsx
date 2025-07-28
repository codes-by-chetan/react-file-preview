"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Copy, Check, FileText, ChevronDown, ChevronRight, Wand2 } from "lucide-react"
import { Button } from "./ui/Button"
import { ScrollArea } from "./ui/scroll-area"
import type { BaseViewerProps } from "../types"

interface JSONViewerProps extends BaseViewerProps {
  content: string
  fileName?: string
}

interface JSONBlock {
  startLine: number
  endLine: number
  type: "object" | "array"
  name?: string
  collapsed: boolean
  id: string
  level: number
}

export function JSONViewer({ content, fileName, className = "" }: JSONViewerProps) {
  const [copied, setCopied] = useState(false)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const [isFormatted, setIsFormatted] = useState(false)

  // Format JSON content
  const formattedContent = useMemo(() => {
    try {
      const parsed = JSON.parse(content)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return content
    }
  }, [content])

  // Use formatted or original content based on state
  const displayContent = isFormatted ? formattedContent : content
  const lines = useMemo(() => displayContent.split("\n"), [displayContent])

  // Detect JSON blocks (objects and arrays)
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

      // Detect object start
      if (trimmed.includes("{")) {
        const nameMatch = line.match(/"([^"]+)"\s*:\s*\{/) || line.match(/^\s*\{/)
        const name = nameMatch?.[1] || (stack.length === 0 ? "root" : undefined)

        stack.push({
          line: index,
          type: "object",
          level,
          name,
        })
      }

      // Detect array start
      if (trimmed.includes("[")) {
        const nameMatch = line.match(/"([^"]+)"\s*:\s*\[/)
        const name = nameMatch?.[1]

        stack.push({
          line: index,
          type: "array",
          level,
          name,
        })
      }

      // Detect closing braces/brackets
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
    setCollapsedBlocks(new Set()) // Reset collapsed blocks when toggling format
  }

  const isLineInCollapsedBlock = (lineIndex: number) => {
    return jsonBlocks.some(
      (block) => collapsedBlocks.has(block.id) && lineIndex > block.startLine && lineIndex <= block.endLine,
    )
  }

  const getBlockForLine = (lineIndex: number) => {
    return jsonBlocks.find((block) => block.startLine === lineIndex)
  }

  const renderHighlightedLine = (line: string, lineIndex: number) => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let partIndex = 0

    while (remaining.length > 0) {
      let matched = false

      // Match JSON keys (quoted strings followed by colon)
      const keyMatch = remaining.match(/^(\s*)"([^"]+)"\s*:\s*/)
      if (keyMatch) {
        const [fullMatch, whitespace, key] = keyMatch
        parts.push(
          <span key={partIndex++}>
            {whitespace}
            <span style={{ color: "#0066cc", fontWeight: "600" }}>"{key}"</span>
            <span style={{ color: "#f97316" }}>:</span>{" "}
          </span>,
        )
        remaining = remaining.slice(fullMatch.length)
        matched = true
      }

      // Match string values
      if (!matched) {
        const stringMatch = remaining.match(/^"([^"]*)"/)
        if (stringMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#22c55e" }}>
              "{stringMatch[1]}"
            </span>,
          )
          remaining = remaining.slice(stringMatch[0].length)
          matched = true
        }
      }

      // Match numbers
      if (!matched) {
        const numberMatch = remaining.match(/^-?\d+\.?\d*/)
        if (numberMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#a855f7" }}>
              {numberMatch[0]}
            </span>,
          )
          remaining = remaining.slice(numberMatch[0].length)
          matched = true
        }
      }

      // Match booleans and null
      if (!matched) {
        const booleanMatch = remaining.match(/^(true|false|null)/)
        if (booleanMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#dc2626", fontWeight: "600" }}>
              {booleanMatch[0]}
            </span>,
          )
          remaining = remaining.slice(booleanMatch[0].length)
          matched = true
        }
      }

      // Match brackets and braces
      if (!matched) {
        const bracketMatch = remaining.match(/^[{}[\],]/)
        if (bracketMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#f97316", fontWeight: "600" }}>
              {bracketMatch[0]}
            </span>,
          )
          remaining = remaining.slice(1)
          matched = true
        }
      }

      if (!matched) {
        parts.push(remaining[0])
        remaining = remaining.slice(1)
      }
    }

    return parts.length > 0 ? parts : ["\u00A0"]
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

  // Validate JSON
  const isValidJSON = useMemo(() => {
    try {
      JSON.parse(content)
      return true
    } catch {
      return false
    }
  }, [content])

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{fileName || "JSON"}</span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {jsonBlocks.length} collapsible blocks
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isValidJSON && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFormat}
              className="flex items-center gap-1"
              title={isFormatted ? "Show original format" : "Format JSON"}
            >
              <Wand2 className="w-3 h-3" />
              <span className="text-xs">{isFormatted ? "Original" : "Format"}</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="flex items-center gap-1">
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* JSON Content */}
      <div className="bg-gray-50" style={{ height: "400px" }}>
        <ScrollArea className="h-full w-full">
          <div className="flex min-w-max">
            {/* Line Numbers */}
            <div className="bg-gray-100 px-2 py-4 text-xs text-gray-500 font-mono select-none border-r min-w-[60px] flex-shrink-0">
              {lines.map((_, originalIndex) => {
                if (isLineInCollapsedBlock(originalIndex)) return null

                const block = getBlockForLine(originalIndex)
                const isCollapsed = block && collapsedBlocks.has(block.id)

                return (
                  <div key={originalIndex} className="flex items-center h-6 leading-6">
                    {block && (
                      <button
                        onClick={() => toggleBlock(block.id)}
                        className="hover:bg-gray-200 rounded p-0.5 flex-shrink-0"
                        title={`${isCollapsed ? "Expand" : "Collapse"} ${
                          block.type
                        }${block.name ? ` "${block.name}"` : ""}`}
                      >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                    <span className="text-right flex-1 pr-2">{originalIndex + 1}</span>
                  </div>
                )
              })}
            </div>

            {/* JSON Content */}
            <div className="flex-1 p-4">
              <pre
                className="text-sm leading-6 whitespace-pre min-w-max"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                }}
              >
                <code>
                  {lines.map((line, originalIndex) => {
                    if (isLineInCollapsedBlock(originalIndex)) return null

                    const block = getBlockForLine(originalIndex)
                    const isCollapsed = block && collapsedBlocks.has(block.id)

                    return (
                      <div key={originalIndex} className="min-h-6 leading-6">
                        {renderHighlightedLine(line, originalIndex)}
                        {isCollapsed && (
                          <span className="text-gray-400 italic ml-2">
                            ... {block.endLine - block.startLine} lines collapsed ({block.type}
                            {block.name ? ` "${block.name}"` : ""})
                          </span>
                        )}
                      </div>
                    )
                  })}
                </code>
              </pre>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>
          {lines.length} lines • {displayContent.length} characters
        </span>
        <span className={isValidJSON ? "text-green-600" : "text-red-600"}>
          {isValidJSON ? "Valid JSON" : "Invalid JSON"}
        </span>
      </div>
    </div>
  )
}
