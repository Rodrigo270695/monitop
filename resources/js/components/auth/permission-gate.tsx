import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGateProps {
    children: React.ReactNode;
    permission?: string;
    permissions?: string[];
    fallback?: React.ReactNode;
    requireAll?: boolean;
}

export function PermissionGate({
    children,
    permission,
    permissions = [],
    fallback = null,
    requireAll = false
}: PermissionGateProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    // Si se especifica un permiso individual
    if (permission) {
        return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
    }

    // Si se especifican múltiples permisos
    if (permissions.length > 0) {
        const hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);

        return hasAccess ? <>{children}</> : <>{fallback}</>;
    }

    // Si no se especifican permisos, mostrar el contenido
    return <>{children}</>;
}

