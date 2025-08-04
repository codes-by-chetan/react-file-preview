"use client"

import { Filter } from "lucide-react"
import type { CSVViewerEmptyStateProps } from "../../types"
import { Button } from "../ui/Button"


export function CSVViewerEmptyState({ onClearFilters }: CSVViewerEmptyStateProps) {
  return (
    <div className="p-8 text-center text-gray-500">
      <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p className="text-sm">No rows match your filters</p>
      <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2 bg-transparent">
        Clear Filters
      </Button>
    </div>
  )
}
