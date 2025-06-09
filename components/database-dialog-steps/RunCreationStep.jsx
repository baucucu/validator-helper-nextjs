"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const RunCreationStep = ({
    selectedClientName,
    selectedCampaignName,
    records,
    runName,
    setRunName,
    runDescription,
    setRunDescription,
    requirementsText,
    setRequirementsText,
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
                <div className="space-y-2">
                    <Label htmlFor="run-name">Run Name</Label>
                    <Input
                        id="run-name"
                        placeholder="Enter run name"
                        value={runName}
                        onChange={(e) => setRunName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="run-description">Description (Optional)</Label>
                    <Textarea
                        id="run-description"
                        placeholder="Enter run description"
                        value={runDescription}
                        onChange={(e) => setRunDescription(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="requirements-text">Requirements Text (Optional)</Label>
                    <Textarea
                        id="requirements-text"
                        placeholder="Enter any specific requirements or notes for this run."
                        value={requirementsText}
                        onChange={(e) => setRequirementsText(e.target.value)}
                    />
                </div>
            </div>
        </>
    )
}

export default RunCreationStep 