"use client"

import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CSVViewerHeaderProps } from "../../types"

export function CSVViewerHeader({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onClearAllFilters,
  hasActiveFilters,
  resultsInfo,
}: CSVViewerHeaderProps) {
  return (
    <div className="p-3 border-b bg-gray-50 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Global Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
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
          onClick={onToggleFilters}
          className="flex items-center gap-2 bg-transparent"
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
            onClick={onClearAllFilters}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Results Info */}
      <div className="text-xs text-gray-500">{resultsInfo}</div>
    </div>
  )
}
