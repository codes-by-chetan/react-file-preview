"use client"

import { X } from "lucide-react"
import { Label } from "@/components/ui/label"
import type { CSVViewerColumnFiltersProps } from "../../types"

export function CSVViewerColumnFilters({ headers, columnFilters, onColumnFilterChange }: CSVViewerColumnFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {headers.map((header, index) => (
        <div key={index} className="relative">
          <Label htmlFor={`filter-${index}`} className="sr-only">
            {`Filter ${header}`}
          </Label>
          <input
            id={`filter-${index}`}
            type="text"
            placeholder={`Filter ${header}...`}
            value={columnFilters[index] || ""}
            onChange={(e) => onColumnFilterChange(index, e.target.value)}
            className="w-full px-3 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {columnFilters[index] && (
            <button
              onClick={() => onColumnFilterChange(index, "")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
