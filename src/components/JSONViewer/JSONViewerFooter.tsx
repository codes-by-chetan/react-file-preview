"use client"

import type React from "react"
import { useJSONViewer } from "./JSONViewer"

interface JSONViewerFooterProps {
  className?: string
  style?: React.CSSProperties
}

export const JSONViewerFooter: React.FC<JSONViewerFooterProps> = ({ className = "", style }) => {
  const { lines, displayContent, isValidJSON } = useJSONViewer()

  return (
    <div
      className={`px-3 py-2 border-t bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 flex justify-between ${className}`}
      style={style}
    >
      <span>
        {lines.length} lines • {displayContent.length} characters
      </span>
      <span className={isValidJSON ? "text-green-600" : "text-red-600"}>
        {isValidJSON ? "Valid JSON" : "Invalid JSON"}
      </span>
    </div>
  )
}
