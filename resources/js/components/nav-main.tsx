import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem, NavGroup } from '@/types';

export function NavMain({ items = [], groups }: { items?: NavItem[]; groups?: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    if (groups) {
        return (
            <>
                {groups.map((group) => (
                    <Collapsible key={group.label} defaultOpen className="group/collapsible">
                        <SidebarGroup className="px-2 py-0">
                            <CollapsibleTrigger asChild>
                                <SidebarGroupLabel className="flex w-full cursor-pointer items-center gap-2 text-sm font-semibold text-stone-500">
                                    {group.icon && <group.icon className="h-4 w-4" />}
                                    <span className="flex-1">{group.label}</span>
                                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarGroupLabel>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isCurrentUrl(item.href)}
                                                tooltip={{ children: item.title }}
                                            >
                                                <Link href={item.href} prefetch>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </>
        );
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}