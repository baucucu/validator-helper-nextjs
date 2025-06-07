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
import { Settings, Users, Layers, Play, ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"

// Dummy data for demonstration
const dummyClients = [
    { id: 'client1', name: 'Acme Corp' },
    { id: 'client2', name: 'Globex Inc.' },
    { id: 'client3', name: 'Soylent Corp' },
];

const dummyCampaigns = {
    client1: [
        { id: 'campaign1_1', name: 'Summer Sale 2024' },
        { id: 'campaign1_2', name: 'Winter Campaign' },
    ],
    client2: [
        { id: 'campaign2_1', name: 'New Product Launch' },
    ],
    client3: [
        { id: 'campaign3_1', name: 'Q3 Marketing' },
        { id: 'campaign3_2', name: 'Holiday Special' },
        { id: 'campaign3_3', name: 'Spring Promo' },
    ],
};

const dummyRuns = {
    campaign1_1: [
        { id: 'run1_1_1', name: 'Email Blast 1' },
        { id: 'run1_1_2', name: 'Social Media Push' },
    ],
    campaign1_2: [
        { id: 'run1_2_1', name: 'Retargeting Ad' },
    ],
    campaign2_1: [
        { id: 'run2_1_1', name: 'Press Release' },
        { id: 'run2_1_2', name: 'Influencer Outreach' },
    ],
    campaign3_1: [
        { id: 'run3_1_1', name: 'SEO Audit' },
    ],
    campaign3_2: [
        { id: 'run3_2_1', name: 'TV Commercial' },
        { id: 'run3_2_2', name: 'Radio Ad' },
    ],
    campaign3_3: [
        { id: 'run3_3_1', name: 'Online Banners' },
    ],
};

export function AppSidebar() {
    const [currentView, setCurrentView] = React.useState('dashboard'); // 'dashboard', 'clients', 'client_campaigns', 'campaign_runs'
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

    const handleGoToClients = () => {
        setSelectedClient(null);
        setSelectedCampaign(null);
        setCurrentView('clients');
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
                <p className="text-lg font-bold">My App</p>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarMenu>
                    {currentView === 'dashboard' && (
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard?view=dashboard">
                                <Users className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    )}

                    {/* Clients link from dashboard view */}
                    {currentView === 'dashboard' && (
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard?view=clients" onClick={handleGoToClients}>
                                <Users className="h-4 w-4" />
                                Clients
                            </Link>
                        </SidebarMenuButton>
                    )}

                    {currentView === 'clients' && (
                        <>
                            <SidebarMenuButton asChild>
                                <Link href="/dashboard?view=dashboard">
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <Plus className="h-4 w-4" />
                                Add Client
                            </SidebarMenuButton>
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
                        </>
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
                                <SidebarMenuButton>
                                    <Plus className="h-4 w-4" />
                                    Add Campaign
                                </SidebarMenuButton>
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
                                        <Link href={`/dashboard?view=campaign_runs&campaignId=${run.id}`}>
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