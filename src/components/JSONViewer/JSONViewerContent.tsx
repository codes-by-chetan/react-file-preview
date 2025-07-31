"use client"

import type React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { useJSONViewer } from "./JSONViewer"

interface JSONViewerContentProps {
  className?: string
  style?: React.CSSProperties
  height?: string
}

export const JSONViewerContent: React.FC<JSONViewerContentProps> = ({ className = "", style, height = "400px" }) => {
  const { lines, collapsedBlocks, jsonBlocks, toggleBlock } = useJSONViewer()

  const isLineInCollapsedBlock = (lineIndex: number) => {
    return jsonBlocks.some(
      (block) => collapsedBlocks.has(block.id) && lineIndex > block.startLine && lineIndex <= block.endLine,
    )
  }

  const getBlockForLine = (lineIndex: number) => {
    return jsonBlocks.find((block) => block.startLine === lineIndex)
  }

  const renderHighlightedLine = (line: string) => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let partIndex = 0

    while (remaining.length > 0) {
      let matched = false

      // Match JSON keys
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

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 ${className}`} style={{ height, ...style }}>
      <ScrollArea className="h-full w-full">
        <div className="flex min-w-max">
          {/* Line Numbers */}
          <div className="bg-gray-100 dark:bg-gray-700 px-2 py-4 text-xs text-gray-500 dark:text-gray-300 font-mono select-none border-r min-w-[60px] flex-shrink-0">
            {lines.map((_, originalIndex) => {
              if (isLineInCollapsedBlock(originalIndex)) return null

              const block = getBlockForLine(originalIndex)
              const isCollapsed = block && collapsedBlocks.has(block.id)

              return (
                <div key={originalIndex} className="flex items-center h-6 leading-6">
                  {block && (
                    <button
                      onClick={() => toggleBlock(block.id)}
                      className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5 flex-shrink-0 mr-1"
                      title={`${isCollapsed ? "Expand" : "Collapse"} ${
                        block.type
                      }${block.name ? ` "${block.name}"` : ""}`}
                    >
                      {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  <span className="text-right flex-1 pr-2 min-w-[40px]">{originalIndex + 1}</span>
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
                      {renderHighlightedLine(line)}
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
  )
}
