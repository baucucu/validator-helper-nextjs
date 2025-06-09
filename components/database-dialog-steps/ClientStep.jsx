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
import { cn } from "@/lib/utils"

const ClientStep = ({
    isCreatingNew,
    setIsCreatingNew,
    selectedClient,
    selectedClientName,
    handleClientSelect,
    clients,
    newClientName,
    setNewClientName,
}) => {
    return (
        <Tabs
            defaultValue={isCreatingNew ? "create" : "select"}
            onValueChange={(v) => setIsCreatingNew(v === "create")}
        >
            <TabsList className="flex flex-wrap w-full justify-center gap-2">
                <TabsTrigger value="select" className="flex-1 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">Select Existing</TabsTrigger>
                <TabsTrigger value="create" className="flex-1 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">Create New</TabsTrigger>
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
                                        {clients.map((client) => (
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
}

export default ClientStep 