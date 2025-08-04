"use client"

import { useState, useEffect, useMemo } from "react"
import { CSVViewerHeader } from "./CSVViewerHeader"
import { CSVViewerColumnFilters } from "./CSVViewerColumnFilters"
import { CSVViewerTable } from "./CSVViewerTable"
import { CSVViewerEmptyState } from "./CSVViewerEmptyState"
import type { CSVData, CSVViewerProps } from "../../types"

export function CSVViewer({ content, className = "" }: CSVViewerProps) {
  const [csvData, setCsvData] = useState<CSVData>({ headers: [], rows: [] })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [columnFilters, setColumnFilters] = useState<{ [key: number]: string }>({})
  const [showFilters, setShowFilters] = useState(false)

  // Parse CSV content
  useEffect(() => {
    const lines = content.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return

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

    setCsvData({
      headers: data[0] || [],
      rows: data.slice(1),
    })
  }, [content])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = csvData.rows

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((row) => row.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnIndex, filterValue]) => {
      if (filterValue) {
        const colIndex = Number.parseInt(columnIndex)
        filtered = filtered.filter((row) => row[colIndex]?.toLowerCase().includes(filterValue.toLowerCase()))
      }
    })

    // Apply sorting
    if (sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn] || ""
        const bVal = b[sortColumn] || ""

        // Try to parse as numbers for numeric sorting
        const aNum = Number.parseFloat(aVal)
        const bNum = Number.parseFloat(bVal)

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum
        }

        // String sorting
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }

    return filtered
  }, [csvData.rows, searchTerm, columnFilters, sortColumn, sortDirection])

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnIndex)
      setSortDirection("asc")
    }
  }

  const handleColumnFilter = (columnIndex: number, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnIndex]: value,
    }))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setColumnFilters({})
    setSortColumn(null)
    setSortDirection("asc")
  }

  const hasActiveFilters = !!(searchTerm || Object.values(columnFilters).some((v) => v) || sortColumn !== null)
  const resultsInfo = `Showing ${filteredAndSortedData.length} of ${csvData.rows.length} rows${hasActiveFilters ? " (filtered)" : ""}`

  return (
    <div className={`border rounded-lg ${className}`}>
      <CSVViewerHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        resultsInfo={resultsInfo}
      />

      {showFilters && (
        <div className="p-3 border-b bg-gray-50">
          <CSVViewerColumnFilters
            headers={csvData.headers}
            columnFilters={columnFilters}
            onColumnFilterChange={handleColumnFilter}
          />
        </div>
      )}

      <CSVViewerTable
        headers={csvData.headers}
        data={filteredAndSortedData}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {filteredAndSortedData.length === 0 && csvData.rows.length > 0 && (
        <CSVViewerEmptyState onClearFilters={clearAllFilters} />
      )}
    </div>
  )
}
