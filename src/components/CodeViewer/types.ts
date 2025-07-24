export interface CodeBlock {
  id: string
  startLine: number
  endLine: number | null // Allow null for unclosed blocks
  type:
    | "function"
    | "class"
    | "interface"
    | "if"
    | "for"
    | "while"
    | "try"
    | "object"
    | "array"
    | "block"
    | "switch"
    | "jsx"
    | "hook"
    | "export" // Added for export statements
  name?: string
  indent: number
}

export interface BracketPair {
  open: number
  close: number | null // Allow null for unclosed brackets
  type: "()" | "[]" | "{}"
  line: number
  depth: number // Added to track nesting level
}

export interface SyntaxToken {
  type: "keyword" | "string" | "number" | "comment" | "operator" | "bracket" | "identifier" | "jsxTag" // Added jsxTag for JSX
  value: string
  start: number
  end: number
}

export interface LineInfo {
  originalIndex: number
  content: string
  isVisible: boolean
  block?: CodeBlock
  isBlockStart: boolean
  isCollapsed: boolean
  tokens?: SyntaxToken[] // Added for token-based analysis
}