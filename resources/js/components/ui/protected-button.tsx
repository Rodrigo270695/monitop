import React from 'react';
import { Button } from './button';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { ButtonProps } from './button';

interface ProtectedButtonProps extends ButtonProps {
    permission: string;
    actionName?: string;
    fallback?: React.ReactNode;
    onAction?: () => void;
}

export function ProtectedButton({
    permission,
    actionName = 'esta acción',
    fallback = null,
    onAction,
    children,
    onClick,
    ...props
}: ProtectedButtonProps) {
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onAction) {
            executeProtectedAction(onAction, permission, actionName);
        } else if (onClick) {
            executeProtectedAction(() => onClick(e), permission, actionName);
        }
    };

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return (
        <Button {...props} onClick={handleClick}>
            {children}
        </Button>
    );
}

