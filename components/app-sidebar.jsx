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
import { Settings, Users, Layers, Play, ChevronLeft, Plus, Search, Store, Target } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils'; // Assuming cn utility for conditional classnames
import { useMemo } from 'react';
import { Logo } from "./Logo";

export function AppSidebar({ clients, campaigns, runs, recentRuns }) {
    const searchParams = useSearchParams();
    const urlView = searchParams.get('view') || 'dashboard';
    const urlClientId = searchParams.get('clientId');
    const urlCampaignId = searchParams.get('campaignId');
    const urlRunId = searchParams.get('runId');

    const currentView = React.useMemo(() => {
        if (urlRunId || urlCampaignId) return 'campaign_runs';
        if (urlClientId) return 'client_campaigns';
        return 'clients';
    }, [urlClientId, urlCampaignId, urlRunId]);

    const selectedClient = React.useMemo(() => {
        if (urlClientId) {
            return clients.find(client => client.id === urlClientId);
        }
        return null;
    }, [urlClientId, clients]);

    const selectedCampaign = useMemo(() => {
        if (urlCampaignId && urlClientId && campaigns && campaigns[urlClientId]) {
            return campaigns[urlClientId].find(c => c.id === urlCampaignId);
        } else if (urlCampaignId) { // Fallback for when clientId is not in URL
            if (!campaigns) return null;
            for (const clientId in campaigns) {
                const campaign = campaigns[clientId]?.find(c => c.id === urlCampaignId);
                if (campaign) return campaign;
            }
        }
        return null;
    }, [urlCampaignId, urlClientId, campaigns]);

    const getClientIdForCampaign = (campaignId) => {
        if (!campaigns) return null;
        for (const clientId in campaigns) {
            if (campaigns[clientId] && campaigns[clientId].some(c => c.id === campaignId)) {
                return clientId;
            }
        }
        return null;
    };

    const getCampaignsForClient = (clientId) => {
        return campaigns[clientId] || [];
    };

    const getRunsForCampaign = (campaignId) => {
        return runs[campaignId] || [];
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
            <SidebarHeader className="h-16">
                <Logo name="Validator" icon={Users} />
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarMenu>
                    {/* Recent Runs Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Recent Runs</SidebarGroupLabel>
                        {recentRuns.length > 0 ? (recentRuns.map(run => {
                            const clientId = getClientIdForCampaign(run.campaignId);
                            return (
                                <SidebarMenuButton asChild key={run.id}>
                                    <Link
                                        href={`/dashboard?view=campaign_runs&clientId=${clientId}&campaignId=${run.campaignId}&runId=${run.id}`}
                                        className={cn(
                                            getHighlightClass('campaign_runs', clientId, run.campaignId, run.id),
                                        )}
                                    >
                                        <Play className="h-4 w-4" />
                                        {run.name}
                                    </Link>
                                </SidebarMenuButton>
                            )
                        })) : (
                            <p className="p-2 text-sm text-gray-500 dark:text-gray-400">No recent runs</p>
                        )}
                    </SidebarGroup>
                    <Separator />

                    {currentView === 'clients' && (
                        <SidebarGroup>
                            <SidebarGroupLabel>All Clients</SidebarGroupLabel>
                            {clients.map(client => (
                                <SidebarMenuButton asChild key={client.id}>
                                    <Link
                                        href={`/dashboard?view=client_campaigns&clientId=${client.id}`}
                                        className={cn(
                                            getHighlightClass('client_campaigns', client.id, undefined, undefined),
                                        )}
                                    >
                                        <Store className="h-4 w-4" />
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
                                <SidebarGroupLabel>{selectedClient?.name} Campaigns</SidebarGroupLabel>
                                {getCampaignsForClient(selectedClient?.id).map(campaign => (
                                    <SidebarMenuButton asChild key={campaign.id}>
                                        <Link
                                            href={`/dashboard?view=campaign_runs&clientId=${selectedClient.id}&campaignId=${campaign.id}`}
                                            className={cn(
                                                getHighlightClass('campaign_runs', selectedClient.id, campaign.id, undefined),
                                            )}
                                        >
                                            <Target className="h-4 w-4" />
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
                                    href={`/dashboard?view=client_campaigns&clientId=${selectedClient?.id}`}
                                    className={cn(
                                        getHighlightClass('client_campaigns', selectedClient?.id, undefined, undefined),
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Campaigns
                                </Link>
                            </SidebarMenuButton>
                            <SidebarGroup>
                                <SidebarGroupLabel>{selectedCampaign?.name} Runs</SidebarGroupLabel>
                                {getRunsForCampaign(selectedCampaign?.id).map(run => (
                                    <SidebarMenuButton key={run.id} asChild>
                                        <Link
                                            href={`/dashboard?view=campaign_runs&clientId=${selectedClient?.id}&campaignId=${run.campaignId}&runId=${run.id}`}
                                            className={cn(
                                                getHighlightClass('campaign_runs', selectedClient?.id, run.campaignId, run.id),
                                            )}
                                        >
                                            <Play className="h-4 w-4" />
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