"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import type { CSVViewerTableProps } from "../../types"

export function CSVViewerTable({ headers, data, sortColumn, sortDirection, onSort }: CSVViewerTableProps) {
  return (
    <div className="overflow-auto max-h-96">
      <div className="min-w-full">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 bg-white">
            {headers.length > 0 && (
              <tr className="bg-gray-100">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border p-2 text-left font-semibold min-w-[80px] cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => onSort(index)}
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
            {data.map((row, rowIndex) => (
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
