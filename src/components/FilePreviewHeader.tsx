"use client"

import { Download } from "lucide-react"
import { Button } from "./ui/Button"
import type { FilePreviewHeaderProps } from "../types"

export function FilePreviewHeader({
  fileName,
  src,
  showDownloadButton = true,
  className = "",
}: FilePreviewHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-2 sm:p-3 bg-gray-50 border-b ${className}`}
      style={{ height: "48px" }}
    >
      <span className="text-xs sm:text-sm font-medium truncate pr-2 flex-1 min-w-0">{fileName}</span>
      {showDownloadButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(src, "_blank")}
          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline ml-1">Download</span>
        </Button>
      )}
    </div>
  )
}
