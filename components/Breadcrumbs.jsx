'use client'

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function Breadcrumbs({ clients, campaigns, runs }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const breadcrumbItems = []

    const clientId = searchParams.get('clientId')
    const campaignId = searchParams.get('campaignId')
    const runId = searchParams.get('runId')
    const view = searchParams.get('view')

    if (view) {
        if (clientId) {
            const client = clients?.find((c) => c.id == clientId)
            if (client) {
                breadcrumbItems.push({
                    label: client.name,
                    href: `/dashboard?view=client_campaigns&clientId=${clientId}`,
                })
            }
        }

        if (campaignId) {
            const clientCampaigns = campaigns?.[clientId]
            const campaign = clientCampaigns?.find((c) => c.id == campaignId)
            if (campaign) {
                breadcrumbItems.push({
                    label: campaign.name,
                    href: `/dashboard?view=campaign_runs&clientId=${clientId}&campaignId=${campaignId}`,
                })
            }
        }

        if (runId) {
            const campaignRuns = runs?.[campaignId]
            const run = campaignRuns?.find((r) => r.id == runId)
            if (run) {
                breadcrumbItems.push({
                    label: run.name,
                    href: `/dashboard?view=campaign_runs&clientId=${clientId}&campaignId=${campaignId}&runId=${runId}`,
                })
            }
        }
    }

    if (breadcrumbItems.length === 0) {
        let title = 'Dashboard'
        if (pathname.startsWith('/start')) title = 'Start New Run'
        else if (pathname.startsWith('/clients')) title = 'Clients'
        return <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1
                    return (
                        <React.Fragment key={item.href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{item.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
} 