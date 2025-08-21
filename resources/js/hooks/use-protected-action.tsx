import { usePermissions } from './use-permissions';
import { useToast } from './use-toast';
import { router } from '@inertiajs/react';

export function useProtectedAction() {
    const { hasPermission } = usePermissions();
    const { toast } = useToast();

    const executeProtectedAction = (
        action: () => void,
        permission: string,
        actionName: string = 'esta acción'
    ) => {
        if (!hasPermission(permission)) {
            toast({
                title: "Acceso Denegado",
                description: `No tienes permisos para realizar ${actionName}`,
                variant: "destructive",
            });
            return false;
        }

        action();
        return true;
    };

    const navigateWithPermission = (
        url: string,
        permission: string,
        actionName: string = 'acceder a esta página'
    ) => {
        if (!hasPermission(permission)) {
            toast({
                title: "Acceso Denegado",
                description: `No tienes permisos para ${actionName}`,
                variant: "destructive",
            });
            return false;
        }

        router.visit(url);
        return true;
    };

    return {
        executeProtectedAction,
        navigateWithPermission,
        hasPermission
    };
}

