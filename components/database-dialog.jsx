"use client"

import React from "react"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Mock data
const mockClients = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "Globex Industries" },
    { id: "3", name: "Stark Enterprises" },
]

const mockCampaigns = {
    "1": [
        { id: "101", name: "Q1 Marketing" },
        { id: "102", name: "Summer Promotion" },
    ],
    "2": [
        { id: "201", name: "Product Launch" },
        { id: "202", name: "Brand Awareness" },
    ],
    "3": [{ id: "301", name: "Holiday Campaign" }],
}

// First, update the Step type to include the new "mapping" step
const DatabaseDialog = () => {
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState("client")
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // State for selections
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedClientName, setSelectedClientName] = useState("")
    const [newClientName, setNewClientName] = useState("")

    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [selectedCampaignName, setSelectedCampaignName] = useState("")
    const [newCampaignName, setNewCampaignName] = useState("")
    const [newCampaignDescription, setNewCampaignDescription] = useState("")

    const [records, setRecords] = useState([])
    const [newRecord, setNewRecord] = useState("")

    const [runName, setRunName] = useState("")
    const [runDescription, setRunDescription] = useState("")

    const [uploadedFile, setUploadedFile] = useState(null)
    const [uploadError, setUploadError] = useState("")
    const [createdRunId, setCreatedRunId] = useState("")

    // Add these new state variables inside the DatabaseDialog component
    const [csvHeaders, setCsvHeaders] = useState([])
    const [fieldMappings, setFieldMappings] = useState({})
    const [availableFields] = useState([
        "firstName",
        "lastName",
        "email",
        "phone",
        "company",
        "jobTitle",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "notes",
    ])

    // Reset all state when dialog closes
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
            // Reset state
            setCurrentStep("client")
            setIsCreatingNew(false)
            setSelectedClient(null)
            setSelectedClientName("")
            setNewClientName("")
            setSelectedCampaign(null)
            setSelectedCampaignName("")
            setNewCampaignName("")
            setNewCampaignDescription("")
            setRecords([])
            setNewRecord("")
            setRunName("")
            setRunDescription("")
            setUploadedFile(null)
            setUploadError("")
            setCreatedRunId("")
        }
    }

    const handleClientSelect = (clientId) => {
        const client = mockClients.find((c) => c.id === clientId)
        if (client) {
            setSelectedClient(clientId)
            setSelectedClientName(client.name)
            setIsCreatingNew(false)
        }
    }

    const handleCampaignSelect = (campaignId) => {
        const campaigns = mockCampaigns[selectedClient] || []
        const campaign = campaigns.find((c) => c.id === campaignId)
        if (campaign) {
            setSelectedCampaign(campaignId)
            setSelectedCampaignName(campaign.name)
            setIsCreatingNew(false)
        }
    }

    const handleCreateClient = () => {
        if (!newClientName.trim()) return

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setSelectedClient("new-client-id")
            setSelectedClientName(newClientName)
            setIsLoading(false)
            setIsCreatingNew(false)
            setCurrentStep("campaign")
        }, 1000)
    }

    const handleCreateCampaign = () => {
        if (!newCampaignName.trim()) return

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setSelectedCampaign("new-campaign-id")
            setSelectedCampaignName(newCampaignName)
            setIsLoading(false)
            setIsCreatingNew(false)
            setCurrentStep("records")
        }, 1000)
    }

    // Update the handleFileUpload function to extract headers
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setUploadError("Please select a CSV file")
            return
        }

        setUploadedFile(file)
        setUploadError("")

        // Parse CSV file
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result
            const lines = text.split("\n").filter((line) => line.trim())

            if (lines.length === 0) {
                setUploadError("CSV file is empty")
                return
            }

            // Extract headers from first line
            const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
            setCsvHeaders(headers)

            // Initialize field mappings with best-guess matches
            const initialMappings = {}
            headers.forEach((header) => {
                // Try to find a matching field name (case-insensitive)
                const normalizedHeader = header.toLowerCase()
                const matchedField = availableFields.find(
                    (field) => field.toLowerCase() === normalizedHeader || normalizedHeader.includes(field.toLowerCase()),
                )

                if (matchedField) {
                    initialMappings[header] = matchedField
                } else {
                    initialMappings[header] = "" // Empty string means unmapped
                }
            })
            setFieldMappings(initialMappings)

            // Skip header row and parse data
            const dataLines = lines.slice(1).filter((line) => line.trim())
            const parsedRecords = dataLines.map((line, index) => {
                const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))
                return `Record ${index + 1}: ${columns.join(" | ")}`
            })

            setRecords(parsedRecords)
        }

        reader.onerror = () => {
            setUploadError("Error reading file")
        }

        reader.readAsText(file)
    }
    // Add a function to handle mapping changes
    const handleMappingChange = (csvHeader, dbField) => {
        setFieldMappings((prev) => ({
            ...prev,
            [csvHeader]: dbField,
        }))
    }

    // Update the handleSubmitRecords function to go to mapping step instead of run
    const handleSubmitRecords = () => {
        setCurrentStep("mapping")
    }

    // Add a function to handle mapping submission
    const handleSubmitMapping = () => {
        setCurrentStep("run")
    }

    // Update the handleNext function to include the mapping step
    const handleNext = () => {
        switch (currentStep) {
            case "client":
                if (selectedClient || (isCreatingNew && newClientName.trim())) {
                    if (isCreatingNew) {
                        handleCreateClient()
                    } else {
                        setCurrentStep("campaign")
                    }
                }
                break
            case "campaign":
                if (selectedCampaign || (isCreatingNew && newCampaignName.trim())) {
                    if (isCreatingNew) {
                        handleCreateCampaign()
                    } else {
                        setCurrentStep("records")
                    }
                }
                break
            case "records":
                handleSubmitRecords()
                break
            case "mapping":
                handleSubmitMapping()
                break
            case "run":
                handleCreateRun()
                break
            case "complete":
                handleOpenChange(false)
                break
        }
    }

    // Update the handleBack function to include the mapping step
    const handleBack = () => {
        switch (currentStep) {
            case "campaign":
                setCurrentStep("client")
                break
            case "records":
                setCurrentStep("campaign")
                break
            case "mapping":
                setCurrentStep("records")
                break
            case "run":
                setCurrentStep("mapping")
                break
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case "client":
                return (
                    <Tabs
                        defaultValue={isCreatingNew ? "create" : "select"}
                        onValueChange={(v) => setIsCreatingNew(v === "create")}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="select">Select Existing</TabsTrigger>
                            <TabsTrigger value="create">Create New</TabsTrigger>
                        </TabsList>
                        <TabsContent value="select" className="mt-4">
                            <div className="space-y-4">
                                <Label>Select Client</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedClientName || "Select client..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search clients..." />
                                            <CommandList>
                                                <CommandEmpty>No client found.</CommandEmpty>
                                                <CommandGroup>
                                                    {mockClients.map((client) => (
                                                        <CommandItem
                                                            key={client.id}
                                                            value={client.name}
                                                            onSelect={() => handleClientSelect(client.id)}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedClient === client.id ? "opacity-100" : "opacity-0",
                                                                )}
                                                            />
                                                            {client.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </TabsContent>
                        <TabsContent value="create" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client-name">Client Name</Label>
                                    <Input
                                        id="client-name"
                                        placeholder="Enter client name"
                                        value={newClientName}
                                        onChange={(e) => setNewClientName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )

            case "campaign":
                return (
                    <>
                        <div className="mb-4">
                            <Badge variant="outline" className="text-sm">
                                Client: {selectedClientName}
                            </Badge>
                        </div>
                        <Tabs
                            defaultValue={isCreatingNew ? "create" : "select"}
                            onValueChange={(v) => setIsCreatingNew(v === "create")}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="select">Select Existing</TabsTrigger>
                                <TabsTrigger value="create">Create New</TabsTrigger>
                            </TabsList>
                            <TabsContent value="select" className="mt-4">
                                <div className="space-y-4">
                                    <Label>Select Campaign</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {selectedCampaignName || "Select campaign..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search campaigns..." />
                                                <CommandList>
                                                    <CommandEmpty>No campaign found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {(mockCampaigns[selectedClient] || []).map((campaign) => (
                                                            <CommandItem
                                                                key={campaign.id}
                                                                value={campaign.name}
                                                                onSelect={() => handleCampaignSelect(campaign.id)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCampaign === campaign.id ? "opacity-100" : "opacity-0",
                                                                    )}
                                                                />
                                                                {campaign.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </TabsContent>
                            <TabsContent value="create" className="mt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="campaign-name">Campaign Name</Label>
                                        <Input
                                            id="campaign-name"
                                            placeholder="Enter campaign name"
                                            value={newCampaignName}
                                            onChange={(e) => setNewCampaignName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="campaign-description">Description (Optional)</Label>
                                        <Textarea
                                            id="campaign-description"
                                            placeholder="Enter campaign description"
                                            value={newCampaignDescription}
                                            onChange={(e) => setNewCampaignDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )

            case "records":
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
                                    <div className="flex items-center justify-between">
                                        <Label>Uploaded File</Label>
                                        <Badge variant="secondary" className="text-xs">
                                            {records.length} records
                                        </Badge>
                                    </div>
                                    <div className="bg-muted p-3 rounded-md">
                                        <div className="flex items-center justify-between">
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
                                    <Label>Preview (First 5 records)</Label>
                                    <div className="max-h-[120px] overflow-y-auto space-y-1 bg-muted/50 p-2 rounded-md">
                                        {records.slice(0, 5).map((record, index) => (
                                            <div key={index} className="text-xs p-1 bg-background rounded border">
                                                {record}
                                            </div>
                                        ))}
                                        {records.length > 5 && (
                                            <div className="text-xs text-muted-foreground text-center py-1">
                                                ... and {records.length - 5} more records
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )

            // Add a new case to renderStepContent for the mapping step
            case "mapping":
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
                                    onClick={() => {
                                        // Auto-map based on name similarity
                                        const autoMappings = {}
                                        csvHeaders.forEach((header) => {
                                            const normalizedHeader = header.toLowerCase()
                                            const matchedField = availableFields.find(
                                                (field) =>
                                                    field.toLowerCase() === normalizedHeader || normalizedHeader.includes(field.toLowerCase()),
                                            )

                                            if (matchedField) {
                                                autoMappings[header] = matchedField
                                            } else {
                                                autoMappings[header] = fieldMappings[header] || ""
                                            }
                                        })
                                        setFieldMappings(autoMappings)
                                    }}
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

            case "run":
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
                        </div>
                    </>
                )

            case "complete":
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
    }

    // Update the getDialogTitle function to include the mapping step
    const getDialogTitle = () => {
        switch (currentStep) {
            case "client":
                return "Select or Create Client"
            case "campaign":
                return "Select or Create Campaign"
            case "records":
                return "Upload Records"
            case "mapping":
                return "Map CSV Columns"
            case "run":
                return "Create Run"
            case "complete":
                return "Operation Complete"
        }
    }

    // Update the getDialogDescription function to include the mapping step
    const getDialogDescription = () => {
        switch (currentStep) {
            case "client":
                return "Choose an existing client or create a new one."
            case "campaign":
                return "Choose an existing campaign or create a new one."
            case "records":
                return "Upload a CSV file with your records."
            case "mapping":
                return "Map CSV columns to database fields."
            case "run":
                return "Create a run from the added records."
            case "complete":
                return "Your data has been successfully added."
        }
    }

    // Update the getNextButtonText function to include the mapping step
    const getNextButtonText = () => {
        switch (currentStep) {
            case "client":
                return isCreatingNew ? "Create & Continue" : "Continue"
            case "campaign":
                return isCreatingNew ? "Create & Continue" : "Continue"
            case "records":
                return `Continue with ${records.length} Records`
            case "mapping":
                return "Apply Mapping & Continue"
            case "run":
                return "Create Run"
            case "complete":
                return "Close"
        }
    }

    const handleRemoveFile = () => {
        setUploadedFile(null)
        setCsvHeaders([])
        setFieldMappings({})
        setRecords([])
        setUploadError("")
    }

    const handleCreateRun = () => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setCreatedRunId("new-run-id")
            setIsLoading(false)
            setCurrentStep("complete")
        }, 1000)
    }

    // Update the Button disabled condition in the return statement to include the mapping step
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Add Data</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[67vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                    <DialogDescription>{getDialogDescription()}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    <div className="pr-2">{renderStepContent()}</div>
                </div>

                <DialogFooter className="flex items-center justify-between">
                    {currentStep !== "client" && currentStep !== "complete" ? (
                        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                            Back
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    <Button
                        onClick={handleNext}
                        disabled={
                            isLoading ||
                            (currentStep === "client" && !selectedClient && (!isCreatingNew || !newClientName.trim())) ||
                            (currentStep === "campaign" && !selectedCampaign && (!isCreatingNew || !newCampaignName.trim())) ||
                            (currentStep === "records" && records.length === 0) ||
                            (currentStep === "mapping" && Object.values(fieldMappings).filter(Boolean).length === 0) ||
                            (currentStep === "run" && !runName.trim())
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            getNextButtonText()
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DatabaseDialog
