"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SearchDialogContext = createContext(null)

export function SearchDialogProvider({ children }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log("SearchDialogProvider - open state (from useEffect):", open);
    }, [open]);

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <SearchDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </SearchDialogContext.Provider>
    )
}

export function useSearchDialog() {
    const context = useContext(SearchDialogContext)
    if (!context) {
        throw new Error("useSearchDialog must be used within a SearchDialogProvider")
    }
    return context
} 