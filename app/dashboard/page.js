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
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';

// Dummy data for mapping IDs to names
const dummyClients = [
    { id: 'client1', name: 'Acme Corp' },
    { id: 'client2', name: 'Globex Inc.' },
    { id: 'client3', name: 'Soylent Corp' },
];

const dummyCampaigns = {
    client1: [
        { id: 'campaign1_1', name: 'Summer Sale 2024', clientId: 'client1' },
        { id: 'campaign1_2', name: 'Winter Campaign', clientId: 'client1' },
    ],
    client2: [
        { id: 'campaign2_1', name: 'New Product Launch', clientId: 'client2' },
    ],
    client3: [
        { id: 'campaign3_1', name: 'Q3 Marketing', clientId: 'client3' },
        { id: 'campaign3_2', name: 'Holiday Special', clientId: 'client3' },
        { id: 'campaign3_3', name: 'Spring Promo', clientId: 'client3' },
    ],
};

const dummyRuns = {
    campaign1_1: [
        { id: 'run1_1_1', name: 'Email Blast 1', campaignId: 'campaign1_1' },
        { id: 'run1_1_2', name: 'Social Media Push', campaignId: 'campaign1_1' },
    ],
    campaign1_2: [
        { id: 'run1_2_1', name: 'Retargeting Ad', campaignId: 'campaign1_2' },
    ],
    campaign2_1: [
        { id: 'run2_1_1', name: 'Press Release', campaignId: 'campaign2_1' },
        { id: 'run2_1_2', name: 'Influencer Outreach', campaignId: 'run2_1_2' },
    ],
    campaign3_1: [
        { id: 'run3_1_1', name: 'SEO Audit', campaignId: 'campaign3_1' },
    ],
    campaign3_2: [
        { id: 'run3_2_1', name: 'TV Commercial', campaignId: 'campaign3_2' },
        { id: 'run3_2_2', name: 'Radio Ad', campaignId: 'campaign3_2' },
    ],
    campaign3_3: [
        { id: 'run3_3_1', name: 'Online Banners', campaignId: 'campaign3_3' },
    ],
};

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'dashboard';
    const clientId = searchParams.get('clientId');
    const campaignId = searchParams.get('campaignId');
    const runId = searchParams.get('runId');

    let mainContent = null;
    let pageTitle = "Dashboard"; // Default title

    switch (view) {
        case 'dashboard':
            pageTitle = "Dashboard";
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Welcome to your Dashboard!</h1>
                    <p>Select an option from the sidebar.</p>
                </div>
            );
            break;
        case 'clients':
            pageTitle = "All Clients";
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>All Clients</h1>
                    <p>List of all clients will appear here.</p>
                </div>
            );
            break;
        case 'client_campaigns':
            const clientName = dummyClients.find(c => c.id === clientId)?.name || 'Unknown Client';
            pageTitle = clientName;
            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Campaigns for Client: {clientName}</h1>
                    <p>List of campaigns for the selected client will appear here.</p>
                </div>
            );
            break;
        case 'campaign_runs':
            let campaignName = 'Unknown Campaign';
            let clientOfCampaign = 'Unknown Client';
            // Find campaign name
            for (const cId in dummyCampaigns) {
                const campaign = dummyCampaigns[cId].find(c => c.id === campaignId);
                if (campaign) {
                    campaignName = campaign.name;
                    clientOfCampaign = dummyClients.find(c => c.id === campaign.clientId)?.name || 'Unknown Client';
                    break;
                }
            }
            pageTitle = campaignName;

            let runName = 'Unknown Run';
            if (runId) {
                // Find run name
                for (const camId in dummyRuns) {
                    const run = dummyRuns[camId].find(r => r.id === runId);
                    if (run) {
                        runName = run.name;
                        pageTitle = runName; // If a run is selected, that's the main title
                        break;
                    }
                }
            }

            mainContent = (
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1>Runs for Campaign: {campaignName} {runId && ` - ${runName}`}</h1>
                    <p>List of runs for the selected campaign will appear here.</p>
                </div>
            );
            break;
        default:
            pageTitle = "Page Not Found";
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
                    <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
                    <div className="ml-auto flex items-center gap-2">
                        {/* Search Icon Placeholder */}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4" />
                        </Button>

                        <Button variant="outline" size="icon" className="md:h-9 md:px-4 md:py-2 md:gap-1">
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:inline">Add New Item</span>
                        </Button>
                    </div>
                </header>
                {mainContent}
            </SidebarInset>
        </SidebarProvider>
    );
} 