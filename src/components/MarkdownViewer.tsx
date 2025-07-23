"use client"

import { useState } from "react"
import { Eye, Code, FileText } from "lucide-react"
import { Button } from "./ui/Button"
import type { BaseViewerProps } from "../types"

interface MarkdownViewerProps extends BaseViewerProps {
  content: string
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  const [viewMode, setViewMode] = useState<"preview" | "source" | "split">("preview")

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string): string => {
    let html = markdown

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 rounded p-3 my-3 overflow-x-auto"><code class="text-sm font-mono">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')

    // Links
    html = html.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Lists
    html = html.replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>')
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')

    // Blockquotes
    html = html.replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>',
    )

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-3">')
    html = html.replace(/\n/g, "<br>")

    // Wrap in paragraphs
    html = `<p class="mb-3">${html}</p>`

    return html
  }

  const renderPreview = () => (
    <div
      className="prose prose-sm max-w-none p-4 overflow-auto max-h-96"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  )

  const renderSource = () => (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto max-h-96">
      <pre className="whitespace-pre-wrap break-words">
        <code>{content}</code>
      </pre>
    </div>
  )

  const renderSplit = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96">
      <div className="border rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <span className="text-sm font-medium flex items-center gap-2">
            <Code className="w-4 h-4" />
            Source
          </span>
        </div>
        <div className="bg-gray-50 p-3 font-mono text-xs overflow-auto max-h-80">
          <pre className="whitespace-pre-wrap break-words">
            <code>{content}</code>
          </pre>
        </div>
      </div>
      <div className="border rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <span className="text-sm font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </span>
        </div>
        <div className="prose prose-sm max-w-none p-3 overflow-auto max-h-80">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* View Mode Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Markdown</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={viewMode === "source" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("source")}
            className="flex items-center gap-1"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">Source</span>
          </Button>
          <Button
            variant={viewMode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("split")}
            className="flex items-center gap-1"
          >
            <div className="w-3 h-3 border border-current"></div>
            <span className="hidden sm:inline">Split</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div>
        {viewMode === "preview" && renderPreview()}
        {viewMode === "source" && renderSource()}
        {viewMode === "split" && renderSplit()}
      </div>
    </div>
  )
}
