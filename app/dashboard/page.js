"use client"

// import { createClient } from '@/utils/supabase/server'; // Removed as it's a server-side import
// import { redirect } from 'next/navigation'; // Removed as it's not directly used here after async removal
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { AppSidebar } from "@/components/app-sidebar"
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'dashboard';
    const clientId = searchParams.get('clientId');
    const campaignId = searchParams.get('campaignId');

    let mainContent = null;

    switch (view) {
        case 'dashboard':
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Welcome to your Dashboard!</h1>
                    <p>Select an option from the sidebar.</p>
                    {/* Original sign out functionality, can be moved to a client component */}
                    {/* <form>
                        <button type="submit" className="mt-4 p-2 bg-red-500 text-white rounded">Sign Out (Placeholder)</button>
                    </form> */}
                </div>
            );
            break;
        case 'clients':
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>All Clients</h1>
                    <p>List of all clients will appear here.</p>
                </div>
            );
            break;
        case 'client_campaigns':
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Campaigns for Client: {clientId}</h1>
                    <p>List of campaigns for the selected client will appear here.</p>
                </div>
            );
            break;
        case 'campaign_runs':
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Runs for Campaign: {campaignId}</h1>
                    <p>List of runs for the selected campaign will appear here.</p>
                </div>
            );
            break;
        default:
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                </div>
            );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{view.charAt(0).toUpperCase() + view.slice(1).replace('_', ' ')}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {mainContent}
            </SidebarInset>
        </SidebarProvider>
    );
} 