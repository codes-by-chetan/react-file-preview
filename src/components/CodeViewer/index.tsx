"use client"

import { useState, useMemo } from "react"
import { Copy, Check, Code } from "lucide-react"
import { Button } from "../ui/Button"
import { BlockDetector } from "./BlockDetector"
import { LineRenderer } from "./LineRenderer"
import type { BaseViewerProps } from "../../types"
import type { BracketPair, LineInfo } from "./types"

interface CodeViewerProps extends BaseViewerProps {
  content: string
  language: string
  fileName?: string
}

export function CodeViewer({ content, language, fileName, className = "" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [hoveredBracket, setHoveredBracket] = useState<number | null>(null)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())

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
      // Check if this line is inside a collapsed block
      const isInCollapsedBlock = codeBlocks.some(
        (block) => collapsedBlocks.has(block.id) && index > block.startLine && index <= block.endLine,
      )

      // Check if this line starts a block
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
    <div className={`border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{fileName || getLanguageDisplayName(language)}</span>
          {fileName && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {getLanguageDisplayName(language)}
            </span>
          )}
        </div>
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

      {/* Code Content */}
      <div className="bg-gray-50 overflow-auto max-h-96">
        <div
          className="py-4"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        >
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
      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>
          {lines.length} lines • {content.length} characters
        </span>
        <span>{codeBlocks.length} collapsible blocks</span>
      </div>
    </div>
  )
}
