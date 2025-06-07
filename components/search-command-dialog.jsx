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
import { useSearchDialog } from "@/components/search-dialog-context";

export function SearchCommandDialog() {
    const { open, setOpen } = useSearchDialog();

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [setOpen])

    return (
        <CommandDialog
            open={open}
            onOpenChange={(newOpenState) => {
                console.log("CommandDialog onOpenChange called with:", newOpenState);
                setOpen(newOpenState);
            }}
            className=""
        >
            <CommandInput placeholder="Type a command or search..." className="" />
            <CommandList className="">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Companies" className="">
                    <CommandItem className="">Company A</CommandItem>
                    <CommandItem className="">Company B</CommandItem>
                    <CommandItem className="">Company C</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Campaigns" className="">
                    <CommandItem className="">Campaign X</CommandItem>
                    <CommandItem className="">Campaign Y</CommandItem>
                    <CommandItem className="">Campaign Z</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Runs" className="">
                    <CommandItem className="">Run 1</CommandItem>
                    <CommandItem className="">Run 2</CommandItem>
                    <CommandItem className="">Run 3</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
} 