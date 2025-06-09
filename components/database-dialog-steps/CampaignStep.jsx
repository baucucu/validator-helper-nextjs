"use client"

import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CampaignStep = ({
    selectedClientName,
    isCreatingNew,
    setIsCreatingNew,
    selectedCampaign,
    selectedCampaignName,
    handleCampaignSelect,
    campaigns,
    selectedClient,
    newCampaignName,
    setNewCampaignName,
    newCampaignDescription,
    setNewCampaignDescription,
}) => {
    return (
        <>
            <div className="mb-4 flex flex-wrap gap-2">
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
                                            {(campaigns[selectedClient] || []).map((campaign) => (
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
}

export default CampaignStep 