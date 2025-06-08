"use client"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { useSearchDialog } from "@/components/search-dialog-context";
import { useState, useEffect, useCallback } from 'react';
import { createClient } from "@/utils/supabase/client";
import DatabaseDialog from "@/components/database-dialog";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const { setOpen: setSearchDialogOpen } = useSearchDialog();
    const [isAddDataDialogOpen, setIsAddDataDialogOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [campaigns, setCampaigns] = useState({});
    const [runs, setRuns] = useState({});
    const [recentRuns, setRecentRuns] = useState([]);

    const supabase = createClient();

    const fetchClientsAndCampaigns = useCallback(async () => {
        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('id, name');
        if (clientsError) {
            console.error("Error fetching clients:", clientsError);
        }
        setClients(clientsData || []);

        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id, name, client_id');
        if (campaignsError) {
            console.error("Error fetching campaigns:", campaignsError);
        }

        // Group campaigns by client_id
        const groupedCampaigns = (campaignsData || []).reduce((acc, campaign) => {
            acc[campaign.client_id] = acc[campaign.client_id] || [];
            acc[campaign.client_id].push(campaign);
            return acc;
        }, {});
        setCampaigns(groupedCampaigns);

        // Fetch runs
        const { data: runsData, error: runsError } = await supabase
            .from('runs')
            .select('id, name, campaign_id, created_at');
        if (runsError) {
            console.error("Error fetching runs:", runsError);
        }

        // Group runs by campaign_id
        const groupedRuns = (runsData || []).reduce((acc, run) => {
            acc[run.campaign_id] = acc[run.campaign_id] || [];
            acc[run.campaign_id].push(run);
            return acc;
        }, {});
        setRuns(groupedRuns);

        // Fetch recent runs (last 5, ordered by created_at)
        const { data: recentRunsData, error: recentRunsError } = await supabase
            .from('runs')
            .select('id, name, campaign_id')
            .order('created_at', { ascending: false })
            .limit(5);
        if (recentRunsError) {
            console.error("Error fetching recent runs:", recentRunsError);
        }
        setRecentRuns(recentRunsData || []);

    }, [supabase]);

    useEffect(() => {
        fetchClientsAndCampaigns();
    }, [fetchClientsAndCampaigns]);

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
            const clientName = clients.find(c => c.id === clientId)?.name || 'Unknown Client';
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
            // Find campaign name
            // Note: campaigns is now an object, so iterate through its values
            let selectedCampaign = null;
            for (const key in campaigns) {
                const found = campaigns[key].find(c => c.id === campaignId);
                if (found) {
                    selectedCampaign = found;
                    break;
                }
            }

            if (selectedCampaign) {
                campaignName = selectedCampaign.name;
            }
            pageTitle = campaignName;

            let runName = 'Unknown Run';
            if (runId) {
                // Find run name
                // Note: runs is now an object, so iterate through its values
                let selectedRun = null;
                for (const key in runs) {
                    const found = runs[key].find(r => r.id === runId);
                    if (found) {
                        selectedRun = found;
                        break;
                    }
                }
                if (selectedRun) {
                    runName = selectedRun.name;
                }
                pageTitle = runName;
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
            <AppSidebar clients={clients} campaigns={campaigns} runs={runs} recentRuns={recentRuns} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="icon" className="md:size-9" onClick={() => {
                            setSearchDialogOpen(true);
                        }}>
                            <Search className="h-4 w-4" />
                        </Button>

                        <DatabaseDialog open={isAddDataDialogOpen} onOpenChange={setIsAddDataDialogOpen} />

                    </div>
                </header>
                {mainContent}
            </SidebarInset>
        </SidebarProvider>
    );
} 