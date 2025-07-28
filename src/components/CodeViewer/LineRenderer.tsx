"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SyntaxHighlighter } from "./SyntaxHighlighter";
import type { LineInfo, BracketPair } from "./types";

interface LineRendererProps {
  lineInfo: LineInfo;
  language: string;
  hoveredBracket: number | null;
  bracketPairs: BracketPair[];
  onBracketHover: (pos: number | null) => void;
  onToggleBlock: (blockId: string) => void;
}

export function LineRenderer({
  lineInfo,
  language,
  hoveredBracket,
  bracketPairs,
  onBracketHover,
  onToggleBlock,
}: LineRendererProps) {
  if (!lineInfo.isVisible) return null;

  return (
    <div className="flex min-h-[24px] min-w-max">
      {/* Line Number and Collapse Icon */}
      <div className="bg-gray-100 px-2 text-xs text-gray-500 font-mono select-none border-r !min-w-[500px] flex items-start !pt-28 flex-shrink-0">
        {lineInfo.isBlockStart && lineInfo.block && (
          <button
            onClick={() => onToggleBlock(lineInfo.block!.id)}
            className="hover:bg-gray-200 rounded p-0.5 flex-shrink-0 mt-0.5 mr-1"
            title={`${lineInfo.isCollapsed ? "Expand" : "Collapse"} ${
              lineInfo.block.type
            }${lineInfo.block.name ? ` "${lineInfo.block.name}"` : ""}`}
          >
            {lineInfo.isCollapsed ? (
              <ChevronRight size={15} className="w-2 h-2" />
            ) : (
              <ChevronDown size={15} className="w-2 h-2" />
            )}
          </button>
        )}
        <div className="pt-5">
          <span className="text-right  flex-1 leading-6">
            {lineInfo.originalIndex + 1}
          </span>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 px-4 text-sm font-mono min-w-0">
        <div className="leading-6 whitespace-pre min-w-max">
          <SyntaxHighlighter
            line={lineInfo.content}
            lineIndex={lineInfo.originalIndex}
            language={language}
            hoveredBracket={hoveredBracket}
            bracketPairs={bracketPairs}
            onBracketHover={onBracketHover}
          />
          {lineInfo.isCollapsed && lineInfo.block && (
            <span className="text-gray-400 italic ml-2 whitespace-nowrap">
              ... {lineInfo.block.endLine || 0 - lineInfo.block.startLine} lines
              collapsed ({lineInfo.block.type}
              {lineInfo.block.name ? ` "${lineInfo.block.name}"` : ""})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
