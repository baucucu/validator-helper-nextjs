import DatabaseWorkflow from "@/components/DatabaseWorkflow"
import AppLayout from "@/components/AppLayout"

export default function StartPage() {
    return (
        <AppLayout pageTitle="New Run Workflow">
            <DatabaseWorkflow />
        </AppLayout>
    )
} 