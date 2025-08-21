import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

interface Props {
    onCreate: () => void;
}

export function RoleActions({ onCreate }: Props) {
    const { hasPermission } = usePermissions();

    return (
        <div className="flex items-center gap-3">
            {hasPermission('roles.create') && (
                <Button
                    onClick={onCreate}
                    className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, var(--monitop-purple-600), var(--monitop-purple-700))`,
                        color: 'var(--monitop-white)',
                        '--tw-focus-ring-color': 'var(--monitop-purple-500)',
                        '--tw-focus-ring-offset-color': 'var(--monitop-white)'
                    } as React.CSSProperties}
                >
                    <Plus className="h-4 w-4" />
                    Crear Rol
                </Button>
            )}
        </div>
    );
}
