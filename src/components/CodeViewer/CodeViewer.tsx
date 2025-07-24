"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Copy, Check, Code, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "../ui/Button"
import type { BaseViewerProps } from "../../types"

interface CodeViewerProps extends BaseViewerProps {
  content: string
  language: string
  fileName?: string
}

interface CodeBlock {
  startLine: number
  endLine: number
  type: "function" | "class" | "interface" | "if" | "for" | "while" | "try" | "object" | "array" | "block"
  name?: string
  collapsed: boolean
  id: string
}

interface BracketPair {
  open: number
  close: number
  type: "()" | "[]" | "{}"
  line: number
}

export function CodeViewer({ content, language, fileName, className = "" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [hoveredBracket, setHoveredBracket] = useState<number | null>(null)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())

  const lines = useMemo(() => content.split("\n"), [content])

  // Find collapsible code blocks with better detection
  const codeBlocks = useMemo(() => {
    const blocks: CodeBlock[] = []
    const stack: Array<{ line: number; type: string; name?: string; indent?: number; braceCount: number }> = []

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      const indent = line.length - line.trimStart().length

      // Skip empty lines and comments for block detection
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("*")) {
        return
      }

      // Count braces in this line
      const openBraces = (line.match(/{/g) || []).length
      const closeBraces = (line.match(/}/g) || []).length

      // JavaScript/TypeScript patterns
      if (
        language.toLowerCase().includes("javascript") ||
        language.toLowerCase().includes("typescript") ||
        language.toLowerCase() === "js" ||
        language.toLowerCase() === "ts" ||
        language.toLowerCase() === "jsx" ||
        language.toLowerCase() === "tsx"
      ) {
        // Function declarations - look for opening brace on same line or next line
        if (
          (trimmed.includes("function ") && (trimmed.includes("{") || !trimmed.endsWith(";"))) ||
          (trimmed.match(/^\s*(const|let|var)\s+\w+\s*=\s*(\w+\s*=>|function)/) && !trimmed.endsWith(";")) ||
          (trimmed.match(/^\s*\w+\s*$$[^)]*$$\s*{/) && !trimmed.includes("if") && !trimmed.includes("for"))
        ) {
          const nameMatch =
            trimmed.match(/function\s+(\w+)/) ||
            trimmed.match(/^\s*(const|let|var)\s+(\w+)\s*=/) ||
            trimmed.match(/^\s*(\w+)\s*\(/)
          const name = nameMatch ? nameMatch[1] || nameMatch[2] || nameMatch[3] : "function"

          stack.push({
            line: index,
            type: "function",
            name,
            braceCount: openBraces > 0 ? openBraces : 1,
          })
        }

        // Interface/Type declarations
        else if (trimmed.match(/^(export\s+)?(interface|type)\s+\w+.*{/)) {
          const nameMatch = trimmed.match(/(interface|type)\s+(\w+)/)
          stack.push({
            line: index,
            type: "interface",
            name: nameMatch?.[2],
            braceCount: openBraces > 0 ? openBraces : 1,
          })
        }

        // Class declarations
        else if (trimmed.match(/^(export\s+)?class\s+\w+.*{/)) {
          const nameMatch = trimmed.match(/class\s+(\w+)/)
          stack.push({
            line: index,
            type: "class",
            name: nameMatch?.[1],
            braceCount: openBraces > 0 ? openBraces : 1,
          })
        }

        // Control structures with braces
        else if (trimmed.match(/^(if|for|while|try|switch)\s*$$[^)]*$$\s*{/)) {
          const type = trimmed.match(/^(\w+)/)?.[1]
          stack.push({
            line: index,
            type: type || "block",
            braceCount: openBraces > 0 ? openBraces : 1,
          })
        }

        // Handle closing braces
        if (closeBraces > 0 && stack.length > 0) {
          let remainingCloseBraces = closeBraces

          while (remainingCloseBraces > 0 && stack.length > 0) {
            const block = stack[stack.length - 1]

            if (block.braceCount <= remainingCloseBraces) {
              // This block is complete
              remainingCloseBraces -= block.braceCount
              stack.pop()

              // Only create block if it spans multiple lines
              if (index > block.line + 1) {
                blocks.push({
                  startLine: block.line,
                  endLine: index,
                  type: block.type as CodeBlock["type"],
                  name: block.name,
                  collapsed: false,
                  id: `${block.line}-${index}-${block.type}`,
                })
              }
            } else {
              // Partial close
              block.braceCount -= remainingCloseBraces
              remainingCloseBraces = 0
            }
          }
        }
      }

      // Python patterns - indentation based
      else if (language.toLowerCase() === "python" || language.toLowerCase() === "py") {
        if (trimmed.match(/^(def|class|if|for|while|try|with|elif|else|except|finally)\s/)) {
          const typeMatch = trimmed.match(/^(\w+)/)
          const nameMatch = trimmed.match(/^(?:def|class)\s+(\w+)/)

          // Close any blocks that are at same or higher indentation level
          while (stack.length > 0) {
            const lastBlock = stack[stack.length - 1]
            if (lastBlock.indent !== undefined && indent <= lastBlock.indent) {
              const block = stack.pop()!
              if (index > block.line + 1) {
                blocks.push({
                  startLine: block.line,
                  endLine: index - 1,
                  type: block.type as CodeBlock["type"],
                  name: block.name,
                  collapsed: false,
                  id: `${block.line}-${index - 1}-${block.type}`,
                })
              }
            } else {
              break
            }
          }

          // Add new block
          stack.push({
            line: index,
            type: typeMatch?.[1] || "block",
            name: nameMatch?.[1],
            indent,
            braceCount: 0,
          })
        }
      }
    })

    // Close any remaining blocks at the end
    while (stack.length > 0) {
      const block = stack.pop()!
      if (lines.length - 1 > block.line + 1) {
        blocks.push({
          startLine: block.line,
          endLine: lines.length - 1,
          type: block.type as CodeBlock["type"],
          name: block.name,
          collapsed: false,
          id: `${block.line}-${lines.length - 1}-${block.type}`,
        })
      }
    }

    return blocks.sort((a, b) => a.startLine - b.startLine)
  }, [lines, language])

  // Find bracket pairs for highlighting
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

  const isLineInCollapsedBlock = (lineIndex: number) => {
    return codeBlocks.some(
      (block) => collapsedBlocks.has(block.id) && lineIndex > block.startLine && lineIndex <= block.endLine,
    )
  }

  const getBlockForLine = (lineIndex: number) => {
    return codeBlocks.find((block) => block.startLine === lineIndex)
  }

  const renderHighlightedLine = (line: string, lineIndex: number) => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let charIndex = 0
    let partIndex = 0

    // Language-specific keywords
    const keywords = {
      javascript: [
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "import",
        "export",
        "from",
        "class",
        "extends",
        "async",
        "await",
        "true",
        "false",
        "null",
        "undefined",
        "try",
        "catch",
        "finally",
        "throw",
        "new",
        "this",
        "super",
        "static",
        "get",
        "set",
        "typeof",
        "instanceof",
        "break",
        "continue",
        "switch",
        "case",
        "default",
        "do",
      ],
      typescript: [
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "import",
        "export",
        "from",
        "class",
        "extends",
        "async",
        "await",
        "true",
        "false",
        "null",
        "undefined",
        "interface",
        "type",
        "enum",
        "public",
        "private",
        "protected",
        "readonly",
        "abstract",
        "implements",
        "keyof",
        "infer",
        "never",
        "unknown",
        "any",
        "string",
        "number",
        "boolean",
        "object",
        "void",
        "try",
        "catch",
        "finally",
      ],
      python: [
        "def",
        "class",
        "if",
        "elif",
        "else",
        "for",
        "while",
        "import",
        "from",
        "return",
        "True",
        "False",
        "None",
        "and",
        "or",
        "not",
        "try",
        "except",
        "finally",
        "with",
        "as",
        "pass",
        "break",
        "continue",
        "yield",
        "lambda",
        "global",
        "nonlocal",
        "assert",
        "del",
        "raise",
        "in",
        "is",
      ],
      json: ["true", "false", "null"],
    }

    const langKeywords = keywords[language.toLowerCase() as keyof typeof keywords] || keywords.javascript

    while (remaining.length > 0) {
      let matched = false
      const currentPos = lineIndex * 1000 + charIndex

      // Check for brackets with highlighting
      const bracketChars = ["(", ")", "[", "]", "{", "}"]
      if (bracketChars.includes(remaining[0])) {
        const isHovered =
          hoveredBracket !== null &&
          bracketPairs.some(
            (pair) =>
              (pair.open === currentPos || pair.close === currentPos) &&
              (pair.open === hoveredBracket || pair.close === hoveredBracket),
          )

        parts.push(
          <span
            key={partIndex++}
            style={{
              color: isHovered ? "#dc2626" : "#f97316",
              fontWeight: "600",
              backgroundColor: isHovered ? "#fef3c7" : "transparent",
              cursor: "pointer",
              borderRadius: "2px",
              padding: "0 1px",
            }}
            onMouseEnter={() => setHoveredBracket(currentPos)}
            onMouseLeave={() => setHoveredBracket(null)}
          >
            {remaining[0]}
          </span>,
        )
        remaining = remaining.slice(1)
        charIndex++
        matched = true
      }

      // Check for keywords
      if (!matched) {
        for (const keyword of langKeywords) {
          const regex = new RegExp(`^\\b${keyword}\\b`)
          const match = remaining.match(regex)
          if (match) {
            parts.push(
              <span key={partIndex++} style={{ color: "#0066cc", fontWeight: "600" }}>
                {keyword}
              </span>,
            )
            remaining = remaining.slice(keyword.length)
            charIndex += keyword.length
            matched = true
            break
          }
        }
      }

      // Check for strings
      if (!matched) {
        const stringMatch = remaining.match(/^(["'`])((?:\\.|(?!\1)[^\\])*?)\1/)
        if (stringMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#22c55e" }}>
              {stringMatch[0]}
            </span>,
          )
          remaining = remaining.slice(stringMatch[0].length)
          charIndex += stringMatch[0].length
          matched = true
        }
      }

      // Check for comments
      if (!matched) {
        const commentMatch = remaining.match(/^(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/)
        if (commentMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#6b7280", fontStyle: "italic" }}>
              {commentMatch[0]}
            </span>,
          )
          remaining = remaining.slice(commentMatch[0].length)
          charIndex += commentMatch[0].length
          matched = true
        }
      }

      // Check for numbers
      if (!matched) {
        const numberMatch = remaining.match(/^\d+\.?\d*/)
        if (numberMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#a855f7" }}>
              {numberMatch[0]}
            </span>,
          )
          remaining = remaining.slice(numberMatch[0].length)
          charIndex += numberMatch[0].length
          matched = true
        }
      }

      // Check for operators
      if (!matched) {
        const operatorMatch = remaining.match(/^[+\-*/%=<>!&|^~?:;,.]/)
        if (operatorMatch) {
          parts.push(
            <span key={partIndex++} style={{ color: "#f97316" }}>
              {operatorMatch[0]}
            </span>,
          )
          remaining = remaining.slice(1)
          charIndex++
          matched = true
        }
      }

      if (!matched) {
        parts.push(remaining[0])
        remaining = remaining.slice(1)
        charIndex++
      }
    }

    return parts.length > 0 ? parts : ["\u00A0"]
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
        <div className="flex">
          {/* Line Numbers - FIXED: Show all lines with correct numbering */}
          <div className="bg-gray-100 px-2 py-4 text-xs text-gray-500 font-mono select-none border-r min-w-[60px]">
            {lines.map((_, originalIndex) => {
              // Skip lines that are inside collapsed blocks
              if (isLineInCollapsedBlock(originalIndex)) return null

              const block = getBlockForLine(originalIndex)
              const isCollapsed = block && collapsedBlocks.has(block.id)

              return (
                <div key={originalIndex} className="flex items-center h-6 leading-6">
                  <span className="text-right flex-1 pr-2">{originalIndex + 1}</span>
                  {block && (
                    <button
                      onClick={() => toggleCodeBlock(block.id)}
                      className="hover:bg-gray-200 rounded p-0.5 flex-shrink-0"
                      title={`${isCollapsed ? "Expand" : "Collapse"} ${block.type}${block.name ? ` "${block.name}"` : ""}`}
                    >
                      {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Code Content - FIXED: Show all lines with correct mapping */}
          <pre
            className="flex-1 p-4 text-sm leading-6 whitespace-pre-wrap"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
          >
            <code>
              {lines.map((line, originalIndex) => {
                // Skip lines that are inside collapsed blocks
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
