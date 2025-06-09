"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const FieldMappingStep = ({
    selectedClientName,
    selectedCampaignName,
    records,
    csvHeaders,
    availableFields,
    fieldMappings,
    handleMappingChange,
    handleAutoMap,
    isLoading,
}) => {
    return (
        <>
            <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                    Client: {selectedClientName}
                </Badge>
                <Badge variant="outline" className="text-sm">
                    Campaign: {selectedCampaignName}
                </Badge>
                <Badge variant="outline" className="text-sm">
                    Records: {records.length}
                </Badge>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Map CSV Columns to Database Fields</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAutoMap}
                        disabled={isLoading}
                    >
                        Auto-Map
                    </Button>
                </div>

                <div className="border rounded-md">
                    <div className="grid grid-cols-2 gap-2 p-2 bg-muted text-xs font-medium">
                        <div>CSV Column</div>
                        <div>Database Field</div>
                    </div>
                    <div className="divide-y max-h-[180px] overflow-y-auto">
                        {csvHeaders.map((header, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2 p-2 items-center">
                                <div className="text-sm truncate" title={header}>
                                    {header}
                                </div>
                                <div>
                                    <select
                                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                        value={fieldMappings[header] || ""}
                                        onChange={(e) => handleMappingChange(header, e.target.value)}
                                    >
                                        <option value="">-- Ignore this column --</option>
                                        {availableFields.map((field) => (
                                            <option key={field} value={field}>
                                                {field}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Mapping Preview</h4>
                    <div className="text-xs space-y-1">
                        {Object.entries(fieldMappings)
                            .filter(([_, dbField]) => dbField)
                            .map(([csvHeader, dbField], index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-muted-foreground">{csvHeader}</span>
                                    <span className="font-medium">→ {dbField}</span>
                                </div>
                            ))}
                        {Object.values(fieldMappings).filter(Boolean).length === 0 && (
                            <p className="text-muted-foreground italic">No fields mapped yet</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FieldMappingStep 