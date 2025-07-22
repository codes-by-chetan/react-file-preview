"use client"

import { useState, useEffect } from "react"

export function useFileContent(
  src: string,
  shouldFetch: boolean,
  onError?: (error: string) => void,
  onLoad?: () => void,
) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!shouldFetch) return

    const fetchContent = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(src)
        if (!response.ok) throw new Error("Failed to fetch file")
        const text = await response.text()
        setContent(text)
        onLoad?.()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load file"
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [src, shouldFetch, onError, onLoad])

  return { content, loading, error }
}
