export interface CodeBlock {
  id: string
  startLine: number
  endLine: number
  type:
    | "function"
    | "class"
    | "interface"
    | "if"
    | "for"
    | "while"
    | "try"
    | "catch"
    | "finally"
    | "switch"
    | "object"
    | "array"
    | "jsx"
    | "hook"
    | "export"
    | "angular"
  name?: string
  indent: number
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
  isPlaceholder?: boolean
}
