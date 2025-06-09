"use client"

import React from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const CompletionStep = ({
    runName,
    records,
    selectedClientName,
    selectedCampaignName,
    createdRunId,
    handleOpenChange,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Success!</h3>
            <p className="text-center text-muted-foreground mt-2">
                Your run "{runName}" has been created successfully with {records.length} records.
            </p>
            <div className="mt-6 w-full space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Client:</span>
                                <span className="text-sm font-medium">{selectedClientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Campaign:</span>
                                <span className="text-sm font-medium">{selectedCampaignName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Records:</span>
                                <span className="text-sm font-medium">{records.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Run:</span>
                                <span className="text-sm font-medium">{runName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Run ID:</span>
                                <span className="text-sm font-mono text-xs">{createdRunId}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex space-x-2">
                    <Button
                        className="flex-1"
                        onClick={() => {
                            // Navigate to run - replace with your actual navigation logic
                            console.log(`Navigating to run: ${createdRunId}`)
                            alert(`Would navigate to run: ${createdRunId}`)
                        }}
                    >
                        View Run
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CompletionStep 