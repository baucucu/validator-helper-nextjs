"use client"

import React from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const UploadStatusStep = ({
    uploadComplete,
    records,
    setCurrentStep,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-6">
            {uploadComplete ? (
                <>
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Upload Complete!</h3>
                    <p className="text-center text-muted-foreground mt-2">
                        Successfully uploaded {records.length} records.
                    </p>
                    <div className="mt-6 w-full">
                        <Button
                            className="w-full"
                            onClick={() => setCurrentStep("run")}
                        >
                            Create Run with Uploaded Records
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-medium">Uploading Records...</h3>
                    <p className="text-center text-muted-foreground mt-2">
                        Your records are being uploaded to the database. This may take a moment.
                    </p>
                </>
            )}
        </div>
    )
}

export default UploadStatusStep 