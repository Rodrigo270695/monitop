import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { router } from '@inertiajs/react';
import { AlertTriangle, Shield } from 'lucide-react';

interface ProtectedPageProps {
    children: React.ReactNode;
    permission?: string;
    permissions?: string[];
    requireAll?: boolean;
    redirectTo?: string;
    showAccessDenied?: boolean;
}

export function ProtectedPage({
    children,
    permission,
    permissions = [],
    requireAll = false,
    redirectTo = '/dashboard',
    showAccessDenied = true
}: ProtectedPageProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    // Verificar acceso
    let hasAccess = true;

    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (permissions.length > 0) {
        hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    // Si no tiene acceso
    if (!hasAccess) {
        if (showAccessDenied) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <Shield className="h-8 w-8 text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Acceso Denegado
                        </h1>
                        <p className="text-slate-600 mb-6">
                            No tienes permisos para acceder a esta página.
                        </p>
                        <button
                            onClick={() => router.visit(redirectTo)}
                            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            );
        } else {
            // Redirigir automáticamente
            React.useEffect(() => {
                router.visit(redirectTo);
            }, []);
            return null;
        }
    }

    return <>{children}</>;
}

