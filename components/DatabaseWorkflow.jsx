"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import ClientStep from "./database-dialog-steps/ClientStep"
import CampaignStep from "./database-dialog-steps/CampaignStep"
import RecordsUploadStep from "./database-dialog-steps/RecordsUploadStep"
import FieldMappingStep from "./database-dialog-steps/FieldMappingStep"
import UploadStatusStep from "./database-dialog-steps/UploadStatusStep"
import RunCreationStep from "./database-dialog-steps/RunCreationStep"
import CompletionStep from "./database-dialog-steps/CompletionStep"

const DatabaseWorkflow = () => {
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
    const [requirementsText, setRequirementsText] = useState("")
    const [uploadComplete, setUploadComplete] = useState(false)

    const [uploadedFile, setUploadedFile] = useState(null)
    const [uploadError, setUploadError] = useState("")
    const [createdRunId, setCreatedRunId] = useState("")

    // Add these new state variables inside the DatabaseDialog component
    const [csvHeaders, setCsvHeaders] = useState([])
    const [fieldMappings, setFieldMappings] = useState({})
    const [availableFields] = useState([
        "First Name",
        "Last Name",
        "Email",
        "Job Title",
        "LinkedIn Profile",
        "Company Name",
        "Website",
        "Industry",
        "Company Phone",
        "Company Address",
        "Company City",
        "Company State",
        "Company Zip Code",
        "Company Country"
    ])

    const [clients, setClients] = useState([]) // New state for clients
    const supabase = createClient() // Initialize Supabase client

    const [campaigns, setCampaigns] = useState({}) // New state for campaigns

    // Fetch clients from Supabase
    const fetchClients = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.from("clients").select("id, name")
        if (error) {
            console.error("Error fetching clients:", error)
        } else {
            setClients(data || [])
        }
        setIsLoading(false)
    }

    // Fetch campaigns from Supabase
    const fetchCampaigns = async (clientId) => {
        if (!clientId) return
        setIsLoading(true)
        const { data, error } = await supabase.from("campaigns").select("id, name, client_id").eq("client_id", clientId)
        if (error) {
            console.error("Error fetching campaigns:", error)
        } else {
            setCampaigns((prev) => ({ ...prev, [clientId]: data || [] }))
        }
        setIsLoading(false)
    }

    const resetWorkflow = () => {
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
        setRequirementsText("")
        setUploadComplete(false)
        setUploadedFile(null)
        setUploadError("")
        setCreatedRunId("")
        setCsvHeaders([])
        setFieldMappings({})
        fetchClients() // Fetch clients when component mounts or resets
    }

    // Call resetWorkflow on component mount
    useEffect(() => {
        resetWorkflow()
    }, [])

    const handleClientSelect = (clientId) => {
        const client = clients.find((c) => c.id === clientId)
        if (client) {
            setSelectedClient(clientId)
            setSelectedClientName(client.name)
            setIsCreatingNew(false)
            fetchCampaigns(clientId)
        }
    }

    const handleCampaignSelect = (campaignId) => {
        const clientCampaigns = campaigns[selectedClient] || []
        const campaign = clientCampaigns.find((c) => c.id === campaignId)
        if (campaign) {
            setSelectedCampaign(campaignId)
            setSelectedCampaignName(campaign.name)
            setIsCreatingNew(false)
        }
    }

    const handleCreateClient = async () => { // Make function async
        if (!newClientName.trim()) return

        setIsLoading(true)
        // Simulate API call
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
            console.error("Error getting user:", userError)
            setIsLoading(false)
            return
        }

        const userId = userData?.user?.id

        if (!userId) {
            console.error("User not logged in or user ID not found.")
            setIsLoading(false)
            return
        }

        const { data, error } = await supabase
            .from("clients")
            .insert([{ name: newClientName, user_id: userId }]) // Add user_id
            .select()

        if (error) {
            console.error("Error creating client:", error)
            setIsLoading(false)
            return
        }

        if (data && data.length > 0) {
            const createdClient = data[0]
            setSelectedClient(createdClient.id)
            setSelectedClientName(createdClient.name)
            setIsCreatingNew(false)
            setCurrentStep("campaign")
            fetchClients() // Re-fetch clients to update the list
        }

        setIsLoading(false)
    }

    const handleCreateCampaign = async () => {
        if (!newCampaignName.trim() || !selectedClient) return

        setIsLoading(true)

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
            console.error("Error getting user:", userError)
            setIsLoading(false)
            return
        }

        const userId = userData?.user?.id

        if (!userId) {
            console.error("User not logged in or user ID not found.")
            setIsLoading(false)
            return
        }

        const { data, error } = await supabase
            .from("campaigns")
            .insert([
                {
                    name: newCampaignName,
                    description: newCampaignDescription,
                    client_id: selectedClient,
                    user_id: userId,
                },
            ])
            .select()

        if (error) {
            console.error("Error creating campaign:", error)
            setIsLoading(false)
            return
        }

        if (data && data.length > 0) {
            const createdCampaign = data[0]
            setSelectedCampaign(createdCampaign.id)
            setSelectedCampaignName(createdCampaign.name)
            setIsCreatingNew(false)
            setCurrentStep("records")
            fetchCampaigns(selectedClient) // Re-fetch campaigns to update the list
        }

        setIsLoading(false)
    }

    // Update the handleFileUpload function to parse the CSV data into an array of objects
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
        reader.onload = async (e) => { // Make onload async
            const text = e.target?.result
            const lines = text.split("\n").filter((line) => line.trim())

            if (lines.length === 0) {
                setUploadError("CSV file is empty")
                return
            }

            // Extract headers from first line
            const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
            setCsvHeaders(headers)

            // Skip header row and parse data into an array of objects
            const parsedRecords = lines.slice(1).map((line) => {
                const values = line.split(",").map((col) => col.trim().replace(/"/g, ""))
                const rowData = {}
                headers.forEach((header, index) => {
                    rowData[header] = values[index]
                })
                return rowData
            }).filter(row => Object.values(row).some(value => value !== "")); // Filter out empty rows
            setRecords(parsedRecords)

            // Call Edge Function for auto-mapping
            setIsLoading(true)
            const payload = { csvFields: headers, availableFields: availableFields }; // Define payload
            const { data: automapData, error: automapError } = await supabase.functions.invoke('automap-fields', {
                body: payload,
            })
            setIsLoading(false)

            if (automapError) {
                console.error("Error calling automap-fields function:", automapError)
                setUploadError("Error during auto-mapping. Please map fields manually.")
                setFieldMappings({}) // Initialize with empty mappings on error
            }
            // Only set field mappings if automapData.mapping is valid, otherwise it might be null or undefined.
            if (automapData && automapData.mapping) {
                setFieldMappings(automapData.mapping || {}) // Set mappings from Edge Function
            }
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

    // Add a function to handle auto-mapping
    const handleAutoMap = async () => {
        setIsLoading(true)
        const payload = { csvFields: csvHeaders, availableFields: availableFields };
        const { data: automapData, error: automapError } = await supabase.functions.invoke('automap-fields', {
            body: payload,
        })
        setIsLoading(false)

        if (automapError) {
            console.error("Error calling automap-fields function:", automapError)
            setUploadError("Error during auto-mapping. Please map fields manually.")
            setFieldMappings({}) // Initialize with empty mappings on error
            return
        }
        setFieldMappings(automapData.mapping || {})
    }

    // Update the handleSubmitRecords function to go to mapping step instead of run
    const handleSubmitRecords = () => {
        setCurrentStep("mapping")
    }

    // Add a function to handle mapping submission
    const handleRecordsUpload = async () => {
        setIsLoading(true)

        const recordsToInsert = records.map((record) => {
            const mappedData = {}
            for (const csvHeader in fieldMappings) {
                const dbField = fieldMappings[csvHeader]
                if (dbField && record[csvHeader] !== undefined) {
                    mappedData[dbField] = record[csvHeader]
                }
            }
            return {
                campaign_id: selectedCampaign,
                data: mappedData,
            }
        })

        const { error } = await supabase.from("records").insert(recordsToInsert)

        if (error) {
            console.error("Error inserting records:", error)
            setIsLoading(false)
            setUploadComplete(false) // Ensure it's false on error
            return
        }

        setIsLoading(false)
        setUploadComplete(true) // Set to true on successful upload
        // setCurrentStep("run") // Removed: This step transition will be handled by handleSubmitRecords
        // return data.map(record => record.id) // Removed: No longer returning IDs here
    }

    // Update the handleNext function to include the mapping step
    const handleNext = async () => { // Make async
        switch (currentStep) {
            case "client":
                if (selectedClient || (isCreatingNew && newClientName.trim())) {
                    if (isCreatingNew) {
                        await handleCreateClient()
                    } else {
                        setCurrentStep("campaign")
                    }
                }
                break
            case "campaign":
                if (selectedCampaign || (isCreatingNew && newCampaignName.trim())) {
                    if (isCreatingNew) {
                        await handleCreateCampaign()
                    } else {
                        setCurrentStep("records")
                    }
                }
                break
            case "records":
                handleSubmitRecords()
                break
            case "mapping":
                await handleRecordsUpload()
                setCurrentStep("upload-status")
                break
            case "upload-status":
                // This step's transition is now handled by the "Create Run with Uploaded Records" button
                break
            case "run":
                await handleCreateRun()
                break
            case "complete":
                resetWorkflow() // Use resetWorkflow instead of handleOpenChange(false)
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
            case "upload-status":
                setCurrentStep("mapping") // Go back to mapping from upload-status
                break
            case "run":
                setCurrentStep("upload-status") // Go back to upload-status from run
                break
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case "client":
                return (
                    <ClientStep
                        isCreatingNew={isCreatingNew}
                        setIsCreatingNew={setIsCreatingNew}
                        selectedClient={selectedClient}
                        selectedClientName={selectedClientName}
                        handleClientSelect={handleClientSelect}
                        clients={clients}
                        newClientName={newClientName}
                        setNewClientName={setNewClientName}
                    />
                )

            case "campaign":
                return (
                    <CampaignStep
                        selectedClientName={selectedClientName}
                        isCreatingNew={isCreatingNew}
                        setIsCreatingNew={setIsCreatingNew}
                        selectedCampaign={selectedCampaign}
                        selectedCampaignName={selectedCampaignName}
                        handleCampaignSelect={handleCampaignSelect}
                        campaigns={campaigns}
                        selectedClient={selectedClient}
                        newCampaignName={newCampaignName}
                        setNewCampaignName={setNewCampaignName}
                        newCampaignDescription={newCampaignDescription}
                        setNewCampaignDescription={setNewCampaignDescription}
                    />
                )

            case "records":
                return (
                    <RecordsUploadStep
                        selectedClientName={selectedClientName}
                        selectedCampaignName={selectedCampaignName}
                        uploadedFile={uploadedFile}
                        handleFileUpload={handleFileUpload}
                        handleRemoveFile={handleRemoveFile}
                        uploadError={uploadError}
                        records={records}
                    />
                )

            // Add a new case to renderStepContent for the mapping step
            case "mapping":
                return (
                    <FieldMappingStep
                        selectedClientName={selectedClientName}
                        selectedCampaignName={selectedCampaignName}
                        records={records}
                        csvHeaders={csvHeaders}
                        availableFields={availableFields}
                        fieldMappings={fieldMappings}
                        handleMappingChange={handleMappingChange}
                        handleAutoMap={handleAutoMap}
                        isLoading={isLoading}
                    />
                )

            case "upload-status":
                return (
                    <UploadStatusStep
                        uploadComplete={uploadComplete}
                        records={records}
                        setCurrentStep={setCurrentStep}
                    />
                )

            case "run":
                return (
                    <RunCreationStep
                        selectedClientName={selectedClientName}
                        selectedCampaignName={selectedCampaignName}
                        records={records}
                        runName={runName}
                        setRunName={setRunName}
                        runDescription={runDescription}
                        setRunDescription={setRunDescription}
                        requirementsText={requirementsText}
                        setRequirementsText={setRequirementsText}
                    />
                )

            case "complete":
                return (
                    <CompletionStep
                        runName={runName}
                        records={records}
                        selectedClientName={selectedClientName}
                        selectedCampaignName={selectedCampaignName}
                        createdRunId={createdRunId}
                        handleOpenChange={resetWorkflow} // Use resetWorkflow instead of handleOpenChange
                    />
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
            case "upload-status":
                return "Upload Status"
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
            case "upload-status":
                return "Checking upload status..."
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
                return "Upload Records"
            case "upload-status":
                return "Next"
            case "run":
                return "Create Run"
            case "complete":
                return "Close"
        }
    }

    const getSteps = () => [
        { id: "client", title: "Client" },
        { id: "campaign", title: "Campaign" },
        { id: "records", title: "Records" },
        { id: "mapping", title: "Mapping" },
        { id: "upload-status", title: "Upload Status" },
        { id: "run", title: "Create Run" },
        { id: "complete", title: "Complete" },
    ]

    const handleRemoveFile = () => {
        setUploadedFile(null)
        setCsvHeaders([])
        setFieldMappings({})
        setRecords([])
        setUploadError("")
    }

    const handleCreateRun = async () => {
        setIsLoading(true)

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
            console.error("Error getting user:", userError)
            setIsLoading(false)
            return
        }

        const userId = userData?.user?.id

        if (!userId) {
            console.error("User not logged in or user ID not found.")
            setIsLoading(false)
            return
        }

        const { data, error } = await supabase
            .from("runs")
            .insert([
                {
                    name: runName,
                    campaign_id: selectedCampaign,
                    user_id: userId
                },
            ])
            .select()

        if (error) {
            console.error("Error creating run:", error)
            setIsLoading(false)
            return
        }

        if (data && data.length > 0) {
            const createdRun = data[0]
            setCreatedRunId(createdRun.id)
            setCurrentStep("complete")
        }

        setIsLoading(false)
    }

    // Update the Button disabled condition in the return statement to include the mapping step
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-[800px] mx-auto bg-white p-6 rounded-lg shadow-lg">
                <Tabs value={currentStep} className="mb-6">
                    <TabsList className="flex flex-wrap w-full justify-center gap-2">
                        {getSteps().map((step, index) => (
                            <TabsTrigger key={step.id} value={step.id} disabled={true} className="flex-1 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                                {step.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div>
                    <h2 className="text-2xl font-bold mb-2">{getDialogTitle()}</h2>
                    <p className="text-gray-600 mb-6">{getDialogDescription()}</p>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    <div className="pr-2">{renderStepContent()}</div>
                </div>

                <div className="flex flex-row items-center justify-end space-x-2 mt-6">
                    {currentStep !== "client" && currentStep !== "complete" && currentStep !== "upload-status" && (
                        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                            Back
                        </Button>
                    )}

                    {currentStep !== "complete" && (
                        <Button
                            onClick={handleNext}
                            disabled={
                                isLoading ||
                                (currentStep === "client" && !selectedClient && (!isCreatingNew || !newClientName.trim())) ||
                                (currentStep === "campaign" && !selectedCampaign && (!isCreatingNew || !newCampaignName.trim())) ||
                                (currentStep === "records" && records.length === 0) ||
                                (currentStep === "mapping" && Object.values(fieldMappings).filter(Boolean).length === 0 && records.length > 0 && !uploadedFile) ||
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
                    )}
                    {currentStep === "complete" && (
                        <Button onClick={resetWorkflow}>
                            Close
                        </Button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default DatabaseWorkflow 