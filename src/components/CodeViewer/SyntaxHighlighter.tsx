"use client"

import type React from "react"

interface SyntaxHighlighterProps {
  line: string
  lineIndex: number
  language: string
  hoveredBracket: number | null
  bracketPairs: Array<{ open: number; close: number; type: string }>
  onBracketHover: (pos: number | null) => void
}

export function SyntaxHighlighter({
  line,
  lineIndex,
  language,
  hoveredBracket,
  bracketPairs,
  onBracketHover,
}: SyntaxHighlighterProps) {
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
  }

  const langKeywords = keywords[language.toLowerCase() as keyof typeof keywords] || keywords.javascript

  const renderHighlightedLine = (): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let remaining = line
    let charIndex = 0
    let partIndex = 0

    while (remaining.length > 0) {
      let matched = false
      const currentPos = lineIndex * 1000 + charIndex

      // Brackets with highlighting
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
            onMouseEnter={() => onBracketHover(currentPos)}
            onMouseLeave={() => onBracketHover(null)}
          >
            {remaining[0]}
          </span>,
        )
        remaining = remaining.slice(1)
        charIndex++
        matched = true
      }

      // Keywords
      if (!matched) {
        for (const keyword of langKeywords) {
          const regex = new RegExp(`^\\b${keyword}\\b`)
          if (regex.test(remaining)) {
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

      // Strings
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

      // Comments
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

      // Numbers
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

      // Operators
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

  return <>{renderHighlightedLine()}</>
}
