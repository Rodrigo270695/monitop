import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.children ? (
                            <>
                                <SidebarMenuButton
                                    onClick={() => setExpandedMenus(prev => ({
                                        ...prev,
                                        [item.title]: !prev[item.title]
                                    }))}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronDown
                                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                            expandedMenus[item.title] ? 'rotate-180' : ''
                                        }`}
                                    />
                                </SidebarMenuButton>
                                <div
                                    className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedMenus[item.title] ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {item.children.map((child) => (
                                        <SidebarMenuButton key={child.title} asChild isActive={page.url.startsWith(child.href)}>
                                            <Link href={child.href} prefetch>
                                                {child.icon && <child.icon />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
