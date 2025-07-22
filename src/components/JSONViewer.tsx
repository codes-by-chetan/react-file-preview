"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import type { JSONViewerProps } from "../types"

export function JSONViewer({ content, className = "" }: JSONViewerProps) {
  const [jsonData, setJsonData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    try {
      const parsed = JSON.parse(content)
      setJsonData(parsed)
      setError("")
    } catch (err) {
      setError("Invalid JSON format")
    }
  }, [content])

  if (error) {
    return (
      <div className={`p-3 sm:p-4 text-red-500 bg-red-50 rounded border ${className}`}>
        <AlertCircle className="inline w-4 h-4 mr-2" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  return (
    <div
      className={`bg-gray-50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto border max-h-96 ${className}`}
    >
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  )
}
