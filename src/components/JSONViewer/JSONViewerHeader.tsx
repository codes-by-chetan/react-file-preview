"use client"

import type React from "react"
import { FileText } from "lucide-react"
import { useJSONViewer } from "./JSONViewer"

interface JSONViewerHeaderProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const JSONViewerHeader: React.FC<JSONViewerHeaderProps> = ({ className = "", style, children }) => {
  const { fileName, jsonBlocks } = useJSONViewer()

  return (
    <div
      className={`flex items-center justify-between p-3 border-b bg-gray-50 dark:bg-gray-800 ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">{fileName || "JSON"}</span>
        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
          {jsonBlocks.length} collapsible blocks
        </span>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}
