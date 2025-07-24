"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import { SyntaxHighlighter } from "./SyntaxHighlighter"
import type { LineInfo, BracketPair } from "./types"

interface LineRendererProps {
  lineInfo: LineInfo
  language: string
  hoveredBracket: number | null
  bracketPairs: BracketPair[]
  onBracketHover: (pos: number | null) => void
  onToggleBlock: (blockId: string) => void
}

export function LineRenderer({
  lineInfo,
  language,
  hoveredBracket,
  bracketPairs,
  onBracketHover,
  onToggleBlock,
}: LineRendererProps) {
  if (!lineInfo.isVisible) return null

  return (
    <div className="flex min-h-[24px]">
      {/* Collapse Icon and Line Number - Swapped positions */}
      <div className="bg-gray-100 px-2 text-xs text-gray-500 font-mono select-none border-r min-w-[60px] flex items-start pt-1 flex-shrink-0">
        {lineInfo.isBlockStart && lineInfo.block && (
          <button
            onClick={() => onToggleBlock(lineInfo.block!.id)}
            className="hover:bg-gray-200 rounded p-0.5 flex-shrink-0 mt-0.5 mr-1"
            title={`${lineInfo.isCollapsed ? "Expand" : "Collapse"} ${lineInfo.block.type}${
              lineInfo.block.name ? ` "${lineInfo.block.name}"` : ""
            }`}
          >
            {lineInfo.isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        <span className="text-right flex-1 leading-6">{lineInfo.originalIndex + 1}</span>
      </div>

      {/* Code Content - Preserve indentation with white-space: pre */}
      <div className="flex-1 px-4 text-sm font-mono py-1">
        <div className="leading-6" style={{ whiteSpace: "pre-wrap" }}>
          <SyntaxHighlighter
            line={lineInfo.content}
            lineIndex={lineInfo.originalIndex}
            language={language}
            hoveredBracket={hoveredBracket}
            bracketPairs={bracketPairs}
            onBracketHover={onBracketHover}
          />
          {lineInfo.isCollapsed && lineInfo.block && (
            <span className="text-gray-400 italic ml-2">
              ... {lineInfo.block.endLine - lineInfo.block.startLine} lines collapsed ({lineInfo.block.type}
              {lineInfo.block.name ? ` "${lineInfo.block.name}"` : ""})
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
