'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
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
    const segments = pathname.split('/').filter(Boolean)

    const breadcrumbItems = []

    if (segments[0] === 'clients' && segments.length >= 2) {
        const clientId = segments[1]
        const client = clients?.find((c) => c.id == clientId)
        breadcrumbItems.push({
            label: client?.name || 'Client',
            href: `/clients/${clientId}`,
        })

        if (segments[2] === 'campaigns' && segments.length >= 4) {
            const campaignId = segments[3]
            const campaign = campaigns?.[clientId]?.find((c) => c.id == campaignId)
            breadcrumbItems.push({
                label: campaign?.name || 'Campaign',
                href: `/clients/${clientId}/campaigns/${campaignId}`,
            })

            if (segments[4] === 'runs' && segments.length >= 6) {
                const runId = segments[5]
                const run = runs?.[campaignId]?.find((r) => r.id == runId)
                breadcrumbItems.push({
                    label: run?.name || 'Run',
                    href: `/clients/${clientId}/campaigns/${campaignId}/runs/${runId}`,
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