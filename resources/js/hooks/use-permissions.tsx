import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props as any;

    const hasPermission = (permission: string): boolean => {
        if (!auth?.user) return false;

        // Verificar permisos específicos del usuario
        const hasSpecificPermission = auth.user.permissions?.some((perm: any) => perm.name === permission) || false;

        // Si el usuario es administrador Y tiene el permiso específico, entonces sí tiene acceso
        if (auth.user.roles?.some((role: any) => role.name === 'Administrador')) {
            return hasSpecificPermission;
        }

        // Para usuarios no administradores, solo verificar permisos específicos
        return hasSpecificPermission;
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        user: auth?.user
    };
}
