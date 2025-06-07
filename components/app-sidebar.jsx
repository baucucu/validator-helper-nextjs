"use client"

import * as React from "react"
import {
    Sidebar as ShadcnAppSidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Settings, Users, Layers, Play, ChevronLeft, Plus, Search } from "lucide-react"
import Link from "next/link"

// Dummy data for demonstration
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
        { id: 'run2_1_2', name: 'Influencer Outreach', campaignId: 'campaign2_1' },
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

// Dummy recent runs (last 5 updated)
const dummyRecentRuns = [
    { id: 'run1_1_2', name: 'Social Media Push', campaignId: 'campaign1_1' },
    { id: 'run3_2_1', name: 'TV Commercial', campaignId: 'campaign3_2' },
    { id: 'run2_1_1', name: 'Press Release', campaignId: 'campaign2_1' },
    { id: 'run1_2_1', name: 'Retargeting Ad', campaignId: 'campaign1_2' },
    { id: 'run3_3_1', name: 'Online Banners', campaignId: 'campaign3_3' },
];

export function AppSidebar() {
    const [currentView, setCurrentView] = React.useState('clients'); // Default to clients view
    const [selectedClient, setSelectedClient] = React.useState(null);
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);

    const handleClientClick = (client) => {
        setSelectedClient(client);
        setCurrentView('client_campaigns');
    };

    const handleCampaignClick = (campaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('campaign_runs');
    };

    const handleBackToClients = () => {
        setSelectedClient(null);
        setSelectedCampaign(null);
        setCurrentView('clients');
    };

    const handleBackToCampaigns = () => {
        setSelectedCampaign(null);
        setCurrentView('client_campaigns');
    };

    const handleRunClick = (run) => {
        // Find the campaign and client associated with this run
        let foundCampaign = null;
        for (const clientId in dummyCampaigns) {
            foundCampaign = dummyCampaigns[clientId].find(c => c.id === run.campaignId);
            if (foundCampaign) {
                const foundClient = dummyClients.find(client => client.id === foundCampaign.clientId);
                setSelectedClient(foundClient);
                setSelectedCampaign(foundCampaign);
                setCurrentView('campaign_runs');
                break;
            }
        }
    };

    const getCampaignsForClient = (clientId) => {
        return dummyCampaigns[clientId] || [];
    };

    const getRunsForCampaign = (campaignId) => {
        return dummyRuns[campaignId] || [];
    };

    return (
        <ShadcnAppSidebar>
            <SidebarHeader>
                <Link href="/dashboard?view=dashboard" onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-lg font-bold">
                    <Users className="h-6 w-6" />
                    Validator
                </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarMenu>
                    {/* Dashboard link always visible at the top */}
                    <SidebarMenuButton asChild>
                        <Link href="/dashboard?view=dashboard" onClick={() => setCurrentView('dashboard')}>
                            <Users className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </SidebarMenuButton>

                    {/* Recent Runs Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Recent Runs</SidebarGroupLabel>
                        {dummyRecentRuns.map(run => (
                            <SidebarMenuButton asChild key={run.id}>
                                <Link href={`/dashboard?view=campaign_runs&campaignId=${run.campaignId}&runId=${run.id}`} onClick={() => handleRunClick(run)}>
                                    <Play className="h-4 w-4" />
                                    {run.name}
                                </Link>
                            </SidebarMenuButton>
                        ))}
                    </SidebarGroup>
                    <Separator />

                    {currentView === 'clients' && (
                        <SidebarGroup>
                            <SidebarGroupLabel>All Clients</SidebarGroupLabel>
                            {dummyClients.map(client => (
                                <SidebarMenuButton asChild key={client.id}>
                                    <Link href={`/dashboard?view=client_campaigns&clientId=${client.id}`} onClick={() => handleClientClick(client)}>
                                        {client.name}
                                    </Link>
                                </SidebarMenuButton>
                            ))}
                        </SidebarGroup>
                    )}

                    {currentView === 'client_campaigns' && selectedClient && (
                        <>
                            <SidebarMenuButton asChild>
                                <Link href="/dashboard?view=clients" onClick={handleBackToClients}>
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Clients
                                </Link>
                            </SidebarMenuButton>
                            <SidebarGroup>
                                <SidebarGroupLabel>{selectedClient.name} Campaigns</SidebarGroupLabel>
                                {getCampaignsForClient(selectedClient.id).map(campaign => (
                                    <SidebarMenuButton asChild key={campaign.id}>
                                        <Link href={`/dashboard?view=campaign_runs&campaignId=${campaign.id}`} onClick={() => handleCampaignClick(campaign)}>
                                            {campaign.name}
                                        </Link>
                                    </SidebarMenuButton>
                                ))}
                            </SidebarGroup>
                        </>
                    )}

                    {currentView === 'campaign_runs' && selectedCampaign && (
                        <>
                            <SidebarMenuButton asChild>
                                <Link href={`/dashboard?view=client_campaigns&clientId=${selectedClient.id}`} onClick={handleBackToCampaigns}>
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Campaigns
                                </Link>
                            </SidebarMenuButton>
                            <SidebarGroup>
                                <SidebarGroupLabel>{selectedCampaign.name} Runs</SidebarGroupLabel>
                                {getRunsForCampaign(selectedCampaign.id).map(run => (
                                    <SidebarMenuButton key={run.id} asChild>
                                        <Link href={`/dashboard?view=campaign_runs&campaignId=${run.campaignId}&runId=${run.id}`}>
                                            {run.name}
                                        </Link>
                                    </SidebarMenuButton>
                                ))}
                            </SidebarGroup>
                        </>
                    )}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton href="/settings" asChild>
                    <Link href="/settings">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </SidebarMenuButton>
            </SidebarFooter>
        </ShadcnAppSidebar>
    )
} 