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
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils'; // Assuming cn utility for conditional classnames

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

// Dummy recent runs (last 5 updated)
const dummyRecentRuns = [
    { id: 'run1_1_2', name: 'Social Media Push', campaignId: 'campaign1_1' },
    { id: 'run3_2_1', name: 'TV Commercial', campaignId: 'campaign3_2' },
    { id: 'run2_1_1', name: 'Press Release', campaignId: 'campaign2_1' },
    { id: 'run1_2_1', name: 'Retargeting Ad', campaignId: 'campaign1_2' },
    { id: 'run3_3_1', name: 'Online Banners', campaignId: 'campaign3_3' },
];

export function AppSidebar() {
    const searchParams = useSearchParams();
    const urlView = searchParams.get('view') || 'dashboard';
    const urlClientId = searchParams.get('clientId');
    const urlCampaignId = searchParams.get('campaignId');
    const urlRunId = searchParams.get('runId');

    // Derive currentView, selectedClient, and selectedCampaign directly from URL
    const currentView = React.useMemo(() => {
        if (urlRunId) return 'campaign_runs';
        if (urlCampaignId) return 'campaign_runs'; // Campaign view also shows runs
        if (urlClientId) return 'client_campaigns';
        if (urlView === 'clients') return 'clients';
        return 'clients'; // Default to clients view if no specific view is in URL
    }, [urlView, urlClientId, urlCampaignId, urlRunId]);

    const selectedClient = React.useMemo(() => {
        if (urlClientId) {
            return dummyClients.find(client => client.id === urlClientId);
        } else if (urlCampaignId) {
            for (const clientId in dummyCampaigns) {
                const campaign = dummyCampaigns[clientId].find(c => c.id === urlCampaignId);
                if (campaign) {
                    return dummyClients.find(client => client.id === campaign.clientId);
                }
            }
        } else if (urlRunId) {
            let foundCampaign = null;
            for (const campaignId in dummyRuns) {
                const run = dummyRuns[campaignId].find(r => r.id === urlRunId);
                if (run) {
                    for (const cId in dummyCampaigns) {
                        const campaign = dummyCampaigns[cId].find(camp => camp.id === run.campaignId);
                        if (campaign) {
                            return dummyClients.find(client => client.id === campaign.clientId);
                        }
                    }
                }
            }
        }
        return null;
    }, [urlClientId, urlCampaignId, urlRunId]);

    const selectedCampaign = React.useMemo(() => {
        if (urlCampaignId) {
            // Ensure the campaign belongs to the selectedClient if available
            if (selectedClient) {
                return dummyCampaigns[selectedClient.id]?.find(c => c.id === urlCampaignId);
            } else {
                // If selectedClient is not yet set (e.g., direct run link), try to find campaign globally
                for (const clientId in dummyCampaigns) {
                    const campaign = dummyCampaigns[clientId].find(c => c.id === urlCampaignId);
                    if (campaign) return campaign;
                }
            }
        } else if (urlRunId) {
            for (const campaignId in dummyRuns) {
                const run = dummyRuns[campaignId].find(r => r.id === urlRunId);
                if (run) {
                    // Ensure the campaign belongs to the selectedClient if available
                    if (selectedClient) {
                        return dummyCampaigns[selectedClient.id]?.find(c => c.id === run.campaignId);
                    } else {
                        // Fallback if selectedClient not ready: find campaign globally
                        for (const cId in dummyCampaigns) {
                            const campaign = dummyCampaigns[cId].find(camp => camp.id === run.campaignId);
                            if (campaign) return campaign;
                        }
                    }
                }
            }
        }
        return null;
    }, [urlCampaignId, urlRunId, selectedClient]); // Depend on selectedClient as well

    const getCampaignsForClient = (clientId) => {
        return dummyCampaigns[clientId] || [];
    };

    const getRunsForCampaign = (campaignId) => {
        return dummyRuns[campaignId] || [];
    };

    // Helper function to check if a link is active
    const isActive = (targetView, targetClientId = undefined, targetCampaignId = undefined, targetRunId = undefined) => {
        // Handle settings link separately (if it ever has complex params)
        if (targetView === 'settings') {
            return urlView === 'settings';
        }

        // Default dashboard/clients view (no specific IDs)
        if (targetView === 'dashboard' && !targetClientId && !targetCampaignId && !targetRunId) {
            return urlView === 'dashboard' && !urlClientId && !urlCampaignId && !urlRunId;
        }
        if (targetView === 'clients' && !targetClientId && !targetCampaignId && !targetRunId) {
            return urlView === 'clients' && !urlClientId && !urlCampaignId && !urlRunId;
        }

        // Standard view comparison
        if (urlView !== targetView) return false;

        // Robust comparison for optional parameters
        const compareParam = (targetParam, urlParam) => {
            // Normalize URL param to undefined if it's null
            const normalizedUrlParam = urlParam === null ? undefined : urlParam;

            // If targetParam is undefined, it means this parameter is optional for the target link.
            // In this case, we consider it a match regardless of what urlParam is.
            if (targetParam === undefined) {
                return true; // We don't care about this parameter for highlighting
            }
            // If targetParam is defined, it must strictly match the normalized URL param.
            return targetParam === normalizedUrlParam;
        };

        const isMatch = compareParam(targetClientId, urlClientId) &&
            compareParam(targetCampaignId, urlCampaignId) &&
            compareParam(targetRunId, urlRunId);

        return isMatch;
    };

    const getHighlightClass = (targetView, targetClientId = undefined, targetCampaignId = undefined, targetRunId = undefined) => {
        return isActive(targetView, targetClientId, targetCampaignId, targetRunId)
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            : '';
    };

    return (
        <ShadcnAppSidebar>
            <SidebarHeader>
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
                    <Users className="h-6 w-6" />
                    Validator
                </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarMenu>
                    {/* Recent Runs Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Recent Runs</SidebarGroupLabel>
                        {dummyRecentRuns.map(run => (
                            <SidebarMenuButton asChild key={run.id}>
                                <Link
                                    href={`/dashboard?view=campaign_runs&campaignId=${run.campaignId}&runId=${run.id}`}
                                    className={cn(
                                        getHighlightClass('campaign_runs', undefined, run.campaignId, run.id),
                                    )}
                                >
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
                                    <Link
                                        href={`/dashboard?view=client_campaigns&clientId=${client.id}`}
                                        className={cn(
                                            getHighlightClass('client_campaigns', client.id, undefined, undefined),
                                        )}
                                    >
                                        {client.name}
                                    </Link>
                                </SidebarMenuButton>
                            ))}
                        </SidebarGroup>
                    )}

                    {currentView === 'client_campaigns' && selectedClient && (
                        <>
                            <SidebarMenuButton asChild>
                                <Link
                                    href="/dashboard?view=clients"
                                    className={cn(
                                        getHighlightClass('clients', undefined, undefined, undefined),
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Clients
                                </Link>
                            </SidebarMenuButton>
                            <SidebarGroup>
                                <SidebarGroupLabel>{selectedClient.name} Campaigns</SidebarGroupLabel>
                                {getCampaignsForClient(selectedClient.id).map(campaign => (
                                    <SidebarMenuButton asChild key={campaign.id}>
                                        <Link
                                            href={`/dashboard?view=campaign_runs&campaignId=${campaign.id}`}
                                            className={cn(
                                                getHighlightClass('campaign_runs', undefined, campaign.id, undefined),
                                            )}
                                        >
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
                                <Link
                                    href={`/dashboard?view=client_campaigns&clientId=${selectedClient.id}`}
                                    className={cn(
                                        getHighlightClass('client_campaigns', selectedClient.id, undefined, undefined),
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Campaigns
                                </Link>
                            </SidebarMenuButton>
                            <SidebarGroup>
                                <SidebarGroupLabel>{selectedCampaign.name} Runs</SidebarGroupLabel>
                                {getRunsForCampaign(selectedCampaign.id).map(run => (
                                    <SidebarMenuButton key={run.id} asChild>
                                        <Link
                                            href={`/dashboard?view=campaign_runs&campaignId=${run.campaignId}&runId=${run.id}`}
                                            className={cn(
                                                getHighlightClass('campaign_runs', undefined, run.campaignId, run.id),
                                            )}
                                        >
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
                    <Link
                        href="/settings"
                        className={cn(
                            getHighlightClass('settings'),
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </SidebarMenuButton>
            </SidebarFooter>
        </ShadcnAppSidebar>
    )
}