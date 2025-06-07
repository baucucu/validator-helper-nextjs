"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

export function SearchCommandDialog() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen} className="">
            <CommandInput placeholder="Type a command or search..." className="" />
            <CommandList className="">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Companies" className="">
                    <CommandItem>Company A</CommandItem>
                    <CommandItem>Company B</CommandItem>
                    <CommandItem>Company C</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Campaigns" className="">
                    <CommandItem>Campaign X</CommandItem>
                    <CommandItem>Campaign Y</CommandItem>
                    <CommandItem>Campaign Z</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Runs" className="">
                    <CommandItem>Run 1</CommandItem>
                    <CommandItem>Run 2</CommandItem>
                    <CommandItem>Run 3</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
} 