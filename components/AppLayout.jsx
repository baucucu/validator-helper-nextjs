"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Search, FastForward } from 'lucide-react'
import { useSearchDialog } from "@/components/search-dialog-context"
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from "@/utils/supabase/client"
import Breadcrumbs from "./Breadcrumbs"

const AppLayout = ({ children }) => {
    const { setOpen: setSearchDialogOpen } = useSearchDialog()
    const router = useRouter()

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
            console.error("Error fetching clients:", JSON.stringify(clientsError, null, 2));
        }
        setClients(clientsData || []);

        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id, name, client_id');
        if (campaignsError) {
            console.error("Error fetching campaigns:", JSON.stringify(campaignsError, null, 2));
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
            console.error("Error fetching runs:", JSON.stringify(runsError, null, 2));
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
            console.error("Error fetching recent runs:", JSON.stringify(recentRunsError, null, 2));
        }
        setRecentRuns(recentRunsData || []);

    }, [supabase]);

    useEffect(() => {
        fetchClientsAndCampaigns();
    }, [fetchClientsAndCampaigns]);

    return (
        <SidebarProvider>
            <AppSidebar clients={clients} campaigns={campaigns} runs={runs} recentRuns={recentRuns} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumbs clients={clients} campaigns={campaigns} runs={runs} />
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:size-9"
                            onClick={() => {
                                setSearchDialogOpen(true)
                            }}
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        <Button variant="outline" size="icon" className="md:size-9" onClick={() => router.push('/start')}>
                            <FastForward className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout 