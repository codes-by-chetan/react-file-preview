export interface CodeBlock {
  startLine: number
  endLine?: number
  type: "function" | "class" | "interface" | "if" | "for" | "while" | "try" | "object" | "array" | "block"
  name?: string
  id: string
}

export interface BracketPair {
  open: number
  close: number
  type: "()" | "[]" | "{}"
  line: number
  depth: number
}

export interface LineInfo {
  originalIndex: number
  content: string
  isVisible: boolean
  block?: CodeBlock
  isBlockStart: boolean
  isCollapsed: boolean
}
