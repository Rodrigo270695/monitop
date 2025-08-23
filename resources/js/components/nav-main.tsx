import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    // Función para verificar si un menú debe estar expandido basado en la URL actual
    const shouldMenuBeExpanded = (item: NavItem) => {
        if (!item.children) return false;
        return item.children.some(child => page.url.startsWith(child.href));
    };

    // Función para verificar si un item está activo
    const isItemActive = (item: NavItem) => {
        if (item.children) {
            // Para menús con submenús, verificar si algún submenú está activo
            return item.children.some(child => page.url.startsWith(child.href));
        }
        return page.url.startsWith(item.href);
    };

    // Inicializar y mantener menús expandidos basado en la URL actual
    useEffect(() => {
        const initialExpanded: Record<string, boolean> = {};
        items.forEach(item => {
            if (item.children) {
                const shouldExpand = shouldMenuBeExpanded(item);
                initialExpanded[item.title] = shouldExpand;
                // Si el menú debe estar expandido, mantenerlo expandido
                if (shouldExpand && !expandedMenus[item.title]) {
                    setExpandedMenus(prev => ({ ...prev, [item.title]: true }));
                }
            }
        });
        setExpandedMenus(prev => ({ ...prev, ...initialExpanded }));
    }, [items, page.url]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.children ? (
                            <>
                                <SidebarMenuButton
                                    onClick={() => {
                                        // Si el menú está activo, mantenerlo expandido
                                        if (isItemActive(item)) {
                                            setExpandedMenus(prev => ({
                                                ...prev,
                                                [item.title]: true
                                            }));
                                        } else {
                                            // Si no está activo, alternar el estado
                                            setExpandedMenus(prev => ({
                                                ...prev,
                                                [item.title]: !prev[item.title]
                                            }));
                                        }
                                    }}
                                    isActive={isItemActive(item)}
                                    className={isItemActive(item) ? 'bg-slate-100 text-slate-900' : ''}
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
                                        expandedMenus[item.title] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {item.children.map((child) => (
                                        <SidebarMenuButton
                                            key={child.title}
                                            asChild
                                            isActive={page.url.startsWith(child.href)}
                                            className={page.url.startsWith(child.href) ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' : ''}
                                        >
                                            <Link href={child.href} prefetch>
                                                {child.icon && <child.icon />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(item.href)}
                                tooltip={{ children: item.title }}
                                className={page.url.startsWith(item.href) ? 'bg-slate-100 text-slate-900' : ''}
                            >
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
