"use client"

import { useState, useMemo, useRef } from "react"
import { Copy, Check, Code, Wand } from "lucide-react"
import { Button } from "../ui/Button"
import { BlockDetector } from "./BlockDetector"
import { LineRenderer } from "./LineRenderer"
import type { BaseViewerProps } from "../../types"
import type { BracketPair, LineInfo } from "./types"

interface CodeViewerProps extends BaseViewerProps {
  content: string
  language: string
  fileName?: string
  height?: string
}

export function CodeViewer({ content, language, fileName, className = "", height = "100%" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [hoveredBracket, setHoveredBracket] = useState<number | null>(null)
  const [remainingHeight, setRemainingHeight] = useState<number>(0)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())
  const contentRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const lines = useMemo(() => content.split("\n"), [content])

  // Detect code blocks
  const codeBlocks = useMemo(() => {
    const detector = new BlockDetector(lines, language)
    return detector.detectBlocks()
  }, [lines, language])

  // Find bracket pairs
  const bracketPairs = useMemo(() => {
    const pairs: BracketPair[] = []
    const stack: Array<{ char: string; pos: number; line: number }> = []

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const pos = lineIndex * 1000 + i

        if (["(", "[", "{"].includes(char)) {
          stack.push({ char, pos, line: lineIndex })
        } else if ([")", "]", "}"].includes(char)) {
          const expectedOpen = char === ")" ? "(" : char === "]" ? "[" : "{"
          for (let j = stack.length - 1; j >= 0; j--) {
            if (stack[j].char === expectedOpen) {
              const openBracket = stack.splice(j, 1)[0]
              const type = (expectedOpen + char) as BracketPair["type"]
              pairs.push({
                open: openBracket.pos,
                close: pos,
                type,
                line: lineIndex,
                depth: stack.length,
              })
              break
            }
          }
        }
      }
    })

    return pairs
  }, [lines])

  // Create line info with visibility and block information
  const lineInfos = useMemo(() => {
    const infos: LineInfo[] = []

    lines.forEach((line, index) => {
      const isInCollapsedBlock = codeBlocks.some(
        (block) => collapsedBlocks.has(block.id) && index > block.startLine && block.endLine && index <= block.endLine,
      )

      const block = codeBlocks.find((b) => b.startLine === index)
      const isBlockStart = !!block
      const isCollapsed = block ? collapsedBlocks.has(block.id) : false

      infos.push({
        originalIndex: index,
        content: line,
        isVisible: !isInCollapsedBlock,
        block,
        isBlockStart,
        isCollapsed,
      })
    })

    return infos
  }, [lines, codeBlocks, collapsedBlocks])

  const toggleCodeBlock = (blockId: string) => {
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const formatCode = () => {
    // Simple formatting logic: Add 2-space indentation for each level
    const formattedLines: any[] = [];
    let indentLevel = 0;
    const indentSize = 2;

    lines.forEach((line) => {
      line = line.trim();
      if (!line) {
        formattedLines.push("");
        return;
      }

      const closeBraces = (line.match(/}/g) || []).length;
      indentLevel = Math.max(0, indentLevel - closeBraces);

      formattedLines.push(" ".repeat(indentLevel * indentSize) + line);

      const openBraces = (line.match(/{/g) || []).length;
      indentLevel += openBraces;
    });

    // Update content with formatted version
    const formattedContent = formattedLines.join("\n");
    // Note: This is a simple demo. For production, use Prettier or a proper formatter
    return formattedContent;
  };

  const getLanguageDisplayName = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      js: "JavaScript",
      jsx: "JavaScript (JSX)",
      ts: "TypeScript",
      tsx: "TypeScript (TSX)",
      py: "Python",
      css: "CSS",
      html: "HTML",
      xml: "XML",
      json: "JSON",
      md: "Markdown",
      yml: "YAML",
      yaml: "YAML",
      sql: "SQL",
      java: "Java",
      cpp: "C++",
      c: "C",
    }
    return languageMap[lang.toLowerCase()] || lang.toUpperCase()
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Code className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{fileName || getLanguageDisplayName(language)}</span>
          {fileName && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded flex-shrink-0">
              {getLanguageDisplayName(language)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="flex items-center gap-1 flex-shrink-0">
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
          <Button variant="ghost" size="sm" onClick={() => { const formatted = formatCode(); /* Replace content with formatted version here if state management is added */ console.log(formatted); }} className="flex items-center gap-1 flex-shrink-0">
            <Wand className="w-3 h-3" />
            <span className="text-xs">Format Code</span>
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div
        className="bg-gray-50 overflow-auto max-h-96 min-w-0"
        style={{
          maxHeight: height === "100%" ? "24rem" : height,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        }}
      >
        <div className="min-w-max">
          {lineInfos.map((lineInfo) => (
            <LineRenderer
              key={lineInfo.originalIndex}
              lineInfo={lineInfo}
              language={language}
              hoveredBracket={hoveredBracket}
              bracketPairs={bracketPairs}
              onBracketHover={setHoveredBracket}
              onToggleBlock={toggleCodeBlock}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between flex-shrink-0">
        <span>
          {lines.length} lines • {content.length} characters
        </span>
        <span>{codeBlocks.length} collapsible blocks</span>
      </div>
    </div>
  )
}