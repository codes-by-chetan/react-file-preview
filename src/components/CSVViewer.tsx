"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/Button"
import type { CSVViewerProps } from "../types"

interface CSVData {
  headers: string[]
  rows: string[][]
}

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

  const hasActiveFilters = searchTerm || Object.values(columnFilters).some((v) => v) || sortColumn !== null

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Search and Filter Controls */}
      <div className="p-3 border-b bg-gray-50 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Global Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Column Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {csvData.headers.map((header, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  placeholder={`Filter ${header}...`}
                  value={columnFilters[index] || ""}
                  onChange={(e) => handleColumnFilter(index, e.target.value)}
                  className="w-full px-3 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {columnFilters[index] && (
                  <button
                    onClick={() => handleColumnFilter(index, "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Info */}
        <div className="text-xs text-gray-500">
          Showing {filteredAndSortedData.length} of {csvData.rows.length} rows
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-96">
        <div className="min-w-full">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead className="sticky top-0 bg-white">
              {csvData.headers.length > 0 && (
                <tr className="bg-gray-100">
                  {csvData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="border p-2 text-left font-semibold min-w-[80px] cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort(index)}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="truncate" title={header}>
                          {header}
                        </div>
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`w-3 h-3 ${
                              sortColumn === index && sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
                            }`}
                          />
                          <ChevronDown
                            className={`w-3 h-3 -mt-1 ${
                              sortColumn === index && sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {filteredAndSortedData.map((row, rowIndex) => (
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

      {/* Empty State */}
      {filteredAndSortedData.length === 0 && csvData.rows.length > 0 && (
        <div className="p-8 text-center text-gray-500">
          <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No rows match your filters</p>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2 bg-transparent">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
