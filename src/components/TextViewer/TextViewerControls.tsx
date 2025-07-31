"use client"

import type React from "react"
import { Hash, Sun, Moon, Plus, Minus } from "lucide-react"
import { useTextViewer } from "./TextViewer"

interface TextViewerButtonProps {
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
}

const buttonSizes = {
  xs: "p-0.5 w-6 h-6",
  sm: "p-1 w-8 h-8",
  md: "p-1 w-9 h-9",
  lg: "p-2 w-10 h-10",
}

const buttonVariants = {
  default: "bg-white hover:bg-gray-100 border border-gray-200",
  ghost: "hover:bg-gray-100",
  outline: "border border-gray-300 hover:bg-gray-50",
}

const sizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
}

export const TextViewerLineNumbersButton: React.FC<TextViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { showLineNumbers, setShowLineNumbers } = useTextViewer()

  return (
    <button
      onClick={() => setShowLineNumbers(!showLineNumbers)}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${showLineNumbers ? "bg-blue-100 text-blue-600" : ""} ${className}`}
      style={style}
      title="Toggle Line Numbers"
    >
      <Hash size={sizes[size]} />
    </button>
  )
}

export const TextViewerFontSizeButton: React.FC<TextViewerButtonProps & { action: "increase" | "decrease" }> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
  action,
}) => {
  const { fontSize, setFontSize } = useTextViewer()

  const handleClick = () => {
    if (action === "increase") {
      setFontSize(Math.min(fontSize + 2, 24))
    } else {
      setFontSize(Math.max(fontSize - 2, 10))
    }
  }

  const isDisabled = disabled || (action === "increase" && fontSize >= 24) || (action === "decrease" && fontSize <= 10)

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title={action === "increase" ? "Increase Font Size" : "Decrease Font Size"}
    >
      {action === "increase" ? <Plus size={sizes[size]} /> : <Minus size={sizes[size]} />}
    </button>
  )
}

export const TextViewerThemeButton: React.FC<TextViewerButtonProps> = ({
  className = "",
  style,
  disabled,
  size = "md",
  variant = "default",
}) => {
  const { theme, setTheme } = useTextViewer()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      disabled={disabled}
      className={`${buttonSizes[size]} ${buttonVariants[variant]} flex items-center justify-center rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={style}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Theme`}
    >
      {theme === "light" ? <Moon size={sizes[size]} /> : <Sun size={sizes[size]} />}
    </button>
  )
}
