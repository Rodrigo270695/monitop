import { usePermissions } from './use-permissions';
import { type NavItem } from '@/types';
import { LayoutGrid, Users, Shield, Folder, BookOpen } from 'lucide-react';

export function useNavigation() {
    const { hasPermission } = usePermissions();

    const mainNavItems: NavItem[] = [
        // Dashboard - siempre visible si tiene permiso
        ...(hasPermission('dashboard.view') ? [{
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        }] : []),

        // Menú de Administración - solo si tiene permisos de administración
        ...(hasPermission('usuarios.view') || hasPermission('roles.view') ? [{
            title: 'Administración',
            href: '#',
            icon: Shield,
            children: [
                // Submenú de Gestión de Usuarios - solo si tiene permiso
                ...(hasPermission('usuarios.view') ? [{
                    title: 'Gestión de Usuarios',
                    href: '/users',
                    icon: Users,
                }] : []),
                // Submenú de Gestión de Roles - solo si tiene permiso
                ...(hasPermission('roles.view') ? [{
                    title: 'Gestión de Roles',
                    href: '/roles',
                    icon: Shield,
                }] : []),
            ].filter(child => child), // Filtrar elementos vacíos
        }] : []),
    ].filter(item => item); // Filtrar elementos vacíos

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return {
        mainNavItems,
        footerNavItems,
    };
}

