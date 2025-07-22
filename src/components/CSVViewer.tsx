"use client"

import { useState, useEffect } from "react"
import type { CSVViewerProps } from "../types"

export function CSVViewer({ content, className = "" }: CSVViewerProps) {
  const [csvData, setCsvData] = useState<string[][]>([])

  useEffect(() => {
    const lines = content.split("\n").filter((line) => line.trim())
    const data = lines.map((line) => {
      const result = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    })
    setCsvData(data)
  }, [content])

  return (
    <div className={`overflow-auto border rounded-lg max-h-96 ${className}`}>
      <div className="min-w-full">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            {csvData[0] && (
              <tr className="bg-gray-100">
                {csvData[0].map((header, index) => (
                  <th key={index} className="border p-2 text-left font-semibold min-w-[80px]">
                    <div className="truncate" title={header}>
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {csvData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border p-2 min-w-[80px]">
                    <div className="truncate" title={cell}>
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
