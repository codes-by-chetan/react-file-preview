"use client"

import type React from "react"
import { Copy, Check, Wand2 } from "lucide-react"
import { Button } from "../ui/Button"
import { useJSONViewer } from "./JSONViewer"

interface JSONViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
}

export const JSONViewerFormatButton: React.FC<JSONViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "sm",
  variant = "ghost",
}) => {
  const { isFormatted, toggleFormat, isValidJSON } = useJSONViewer()

  if (!isValidJSON) return null

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFormat}
      disabled={disabled}
      className={`flex items-center gap-1 ${className}`}
      style={style}
      title={isFormatted ? "Show original format" : "Format JSON"}
    >
      <Wand2 className="w-3 h-3" />
      <span className="text-xs">{isFormatted ? "Original" : "Format"}</span>
    </Button>
  )
}

export const JSONViewerCopyButton: React.FC<JSONViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "sm",
  variant = "ghost",
}) => {
  const { copyToClipboard, copied } = useJSONViewer()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      disabled={disabled}
      className={`flex items-center gap-1 ${className}`}
      style={style}
    >
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
  )
}
