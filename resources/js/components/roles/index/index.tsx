import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { RolesTable } from './roles-table';
import { RoleFilters } from './role-filters';
import { RoleActions } from './role-actions';
import { RoleFormModal } from '../forms/role-form-modal';
import { RolePermissionsModal } from '../forms/role-permissions-modal';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { ProtectedPage } from '@/components/auth/protected-page';
import { SmartPagination } from '@/components/ui/smart-pagination';

interface Role {
    id: number;
    name: string;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export function RolesIndex({ roles }: Props) {
    const { toast } = useToast();
    const { flash } = usePage().props as any;
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'name',
        sortOrder: 'asc' as 'asc' | 'desc',
    });

    // Mostrar toasts cuando hay mensajes flash
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Éxito",
                description: flash.success,
                variant: "success",
            });
        }

        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash, toast]);

    const handleCreate = () => {
        executeProtectedAction(() => {
            setEditingRole(null);
            setIsModalOpen(true);
        }, 'roles.create', 'crear roles');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const handleClosePermissionsModal = () => {
        setIsPermissionsModalOpen(false);
        setSelectedRole(null);
    };

    const handleEdit = (role: Role) => {
        executeProtectedAction(() => {
            setEditingRole(role);
            setIsModalOpen(true);
        }, 'roles.edit', 'editar roles');
    };

    const handlePermissions = (role: Role) => {
        executeProtectedAction(() => {
            setSelectedRole(role);
            setIsPermissionsModalOpen(true);
        }, 'roles.assign-permissions', 'asignar permisos');
    };

    return (
        <ProtectedPage permission="roles.view">
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--monitop-slate-800)' }}>Gestión de Roles</h1>
                        <p style={{ color: 'var(--monitop-slate-600)' }}>Administra los roles y permisos del sistema</p>
                    </div>
                    {/* Desktop button */}
                    <div className="hidden md:block">
                        <RoleActions onCreate={handleCreate} />
                    </div>
                </div>

            {/* Mobile floating button */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                {hasPermission('roles.create') && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:ring-4 focus:ring-offset-2 cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, var(--monitop-purple-600), var(--monitop-purple-700))`,
                            color: 'var(--monitop-white)',
                            '--tw-focus-ring-color': 'var(--monitop-purple-500)',
                            '--tw-focus-ring-offset-color': 'var(--monitop-white)'
                        } as React.CSSProperties}
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Filters */}
            <RoleFilters filters={filters} onFiltersChange={setFilters} />

            {/* Table */}
            <RolesTable
                roles={roles}
                onEdit={handleEdit}
                onPermissions={handlePermissions}
                filters={filters}
            />

            {/* Pagination */}
            {roles.data && roles.data.length > 0 && (
                <SmartPagination
                    links={roles.links}
                    currentPage={roles.current_page}
                    lastPage={roles.last_page}
                    total={roles.total}
                    perPage={roles.per_page}
                    className="mt-6"
                    variant="auto"
                />
            )}

            {/* Modals */}
            <RoleFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                role={editingRole}
            />
            <RolePermissionsModal
                isOpen={isPermissionsModalOpen}
                onClose={handleClosePermissionsModal}
                role={selectedRole}
            />
        </div>
        </ProtectedPage>
    );
}
