"use client"

import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const RecordsUploadStep = ({
    selectedClientName,
    selectedCampaignName,
    uploadedFile,
    handleFileUpload,
    handleRemoveFile,
    uploadError,
    records,
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
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="csv-upload">Upload CSV File</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                        {uploadedFile && (
                            <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
                </div>

                {uploadedFile && (
                    <div className="space-y-2">

                        <div className="bg-muted p-3 rounded-md">
                            <Label>Uploaded File</Label>
                            <div className="flex items-center justify-between mt-2">
                                <div>
                                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{records.length} records</p>
                                    <p className="text-xs text-muted-foreground">Ready to process</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {records.length > 0 && (
                    <div className="space-y-2">
                        <Label>Preview (First 1 record)</Label>
                        <div className="max-h-[120px] overflow-y-auto space-y-1 bg-muted/50 p-2 rounded-md">
                            {records.slice(0, 1).map((record, index) => (
                                <div key={index} className="text-xs p-1 bg-background rounded border">
                                    {JSON.stringify(record)}
                                </div>
                            ))}
                            {records.length > 1 && (
                                <div className="text-xs text-muted-foreground text-center py-1">
                                    ... and {records.length - 1} more record{records.length - 1 > 1 ? "s" : ""}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default RecordsUploadStep 