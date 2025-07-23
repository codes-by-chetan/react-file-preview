"use client"

import { useState } from "react"
import { Copy, Check, Code } from "lucide-react"
import { Button } from "./ui/Button"
import type { BaseViewerProps } from "../types"

interface CodeViewerProps extends BaseViewerProps {
  content: string
  language: string
  fileName?: string
}

export function CodeViewer({ content, language, fileName, className = "" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  // Simple syntax highlighting for common languages
  const highlightCode = (code: string, lang: string): string => {
    let highlighted = code

    // Escape HTML
    highlighted = highlighted.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    switch (lang.toLowerCase()) {
      case "javascript":
      case "js":
      case "jsx":
        // Keywords
        highlighted = highlighted.replace(
          /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|class|extends|import|export|from|async|await|yield|typeof|instanceof|new|this|super|static|get|set|true|false|null|undefined)\b/g,
          '<span class="text-blue-600 font-semibold">$1</span>',
        )
        // Strings
        highlighted = highlighted.replace(
          /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
          '<span class="text-green-600">$1$2$1</span>',
        )
        // Comments
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
        // Numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-purple-600">$&</span>')
        break

      case "typescript":
      case "ts":
      case "tsx":
        // TypeScript keywords (includes JS keywords)
        highlighted = highlighted.replace(
          /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|class|extends|import|export|from|async|await|yield|typeof|instanceof|new|this|super|static|get|set|true|false|null|undefined|interface|type|enum|namespace|module|declare|public|private|protected|readonly|abstract|implements|keyof|infer|never|unknown|any|string|number|boolean|object|void)\b/g,
          '<span class="text-blue-600 font-semibold">$1</span>',
        )
        // Strings
        highlighted = highlighted.replace(
          /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
          '<span class="text-green-600">$1$2$1</span>',
        )
        // Comments
        highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
        // Numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-purple-600">$&</span>')
        break

      case "python":
      case "py":
        // Keywords
        highlighted = highlighted.replace(
          /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|raise|assert|del|global|nonlocal|lambda|and|or|not|in|is|True|False|None)\b/g,
          '<span class="text-blue-600 font-semibold">$1</span>',
        )
        // Strings
        highlighted = highlighted.replace(
          /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
          '<span class="text-green-600">$1$2$1</span>',
        )
        // Comments
        highlighted = highlighted.replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')
        // Numbers
        highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-purple-600">$&</span>')
        break

      case "css":
        // Properties
        highlighted = highlighted.replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="text-blue-600">$1</span>$2')
        // Values
        highlighted = highlighted.replace(/(:\s*)([^;{}]+)(;?)/g, '$1<span class="text-green-600">$2</span>$3')
        // Selectors
        highlighted = highlighted.replace(
          /([.#]?[a-zA-Z][a-zA-Z0-9-_]*)\s*{/g,
          '<span class="text-purple-600 font-semibold">$1</span> {',
        )
        // Comments
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
        break

      case "html":
      case "xml":
        // Tags
        highlighted = highlighted.replace(
          /(&lt;\/?)([\w-]+)([^&]*?)(&gt;)/g,
          '$1<span class="text-blue-600 font-semibold">$2</span><span class="text-purple-600">$3</span>$4',
        )
        // Comments
        highlighted = highlighted.replace(/&lt;!--[\s\S]*?--&gt;/g, '<span class="text-gray-500 italic">$&</span>')
        break

      case "json":
        // Keys
        highlighted = highlighted.replace(/"([^"]+)"(\s*:)/g, '<span class="text-blue-600">"$1"</span>$2')
        // String values
        highlighted = highlighted.replace(/(:\s*)"([^"]*)"(?=\s*[,}])/g, '$1<span class="text-green-600">"$2"</span>')
        // Numbers
        highlighted = highlighted.replace(/(:\s*)(\d+\.?\d*)(?=\s*[,}])/g, '$1<span class="text-purple-600">$2</span>')
        // Booleans and null
        highlighted = highlighted.replace(
          /(:\s*)(true|false|null)(?=\s*[,}])/g,
          '$1<span class="text-orange-600 font-semibold">$2</span>',
        )
        break

      default:
        // No highlighting for unknown languages
        break
    }

    return highlighted
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
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(content, language),
            }}
          />
        </pre>
      </div>

      {/* Line count info */}
      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500">
        {content.split("\n").length} lines • {content.length} characters
      </div>
    </div>
  )
}
