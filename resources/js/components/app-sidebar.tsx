import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, FolderGit2, LayoutGrid, Map, Package, Receipt, ScrollText, ShoppingCart, Sprout, SquareStack, Users, Wallet, Tractor, Building2, Warehouse } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'التشغيل الزراعي',
        icon: Tractor,
        items: [
            { title: 'الأراضي', href: '/lands', icon: Map },
            { title: 'المحاصيل', href: '/crops', icon: Sprout },
            { title: 'التكاليف', href: '/costs', icon: Receipt },
            { title: 'المبيعات', href: '/sales', icon: DollarSign },
        ],
    },
    {
        label: 'المخزون',
        icon: Warehouse,
        items: [
            { title: 'المنتجات', href: '/products', icon: Package },
            { title: 'الحركات', href: '/stock', icon: SquareStack },
        ],
    },
    {
        label: 'الحسابات',
        icon: Building2,
        items: [
            { title: 'الأطراف', href: '/parties', icon: Users },
            { title: 'المشتريات', href: '/purchases', icon: ShoppingCart },
            { title: 'المدفوعات', href: '/payments', icon: Wallet },
            { title: 'السجل المالي', href: '/ledger', icon: ScrollText },
        ],
    },
];

const footerNavItems = [
    {
        title: 'المستودع',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'الوثائق',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" side="right">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <NavMain
                    groups={[
                        {
                            label: 'الرئيسية',
                            icon: LayoutGrid,
                            items: [
                                { title: 'لوحة التحكم', href: dashboard(), icon: LayoutGrid },
                            ],
                        },
                        ...navGroups,
                    ]}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}