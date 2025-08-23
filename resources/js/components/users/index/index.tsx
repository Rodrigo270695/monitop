import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { UsersTable } from './users-table';
import { UserFilters } from './user-filters';
import { UserActions } from './user-actions';
import { UserFormModal } from '../forms/user-form-modal';
import { UserRolesModal } from '../forms/user-roles-modal';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { ProtectedPage } from '@/components/auth/protected-page';
import { SmartPagination } from '@/components/ui/smart-pagination';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export function UsersIndex({ users }: Props) {
    const { toast } = useToast();
    const { flash } = usePage().props as any;
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
            setEditingUser(null);
            setIsModalOpen(true);
        }, 'usuarios.create', 'crear usuarios');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleCloseRolesModal = () => {
        setIsRolesModalOpen(false);
        setSelectedUser(null);
    };

    const handleEdit = (user: User) => {
        executeProtectedAction(() => {
            setEditingUser(user);
            setIsModalOpen(true);
        }, 'usuarios.edit', 'editar usuarios');
    };

    const handleRoles = (user: User) => {
        executeProtectedAction(() => {
            setSelectedUser(user);
            setIsRolesModalOpen(true);
        }, 'usuarios.assign-roles', 'asignar roles');
    };

    return (
        <ProtectedPage permission="usuarios.view">
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--monitop-slate-800)' }}>Gestión de Usuarios</h1>
                        <p style={{ color: 'var(--monitop-slate-600)' }}>Administra los usuarios y sus roles del sistema</p>
                    </div>
                    {/* Desktop button */}
                    <div className="hidden md:block">
                        <UserActions onCreate={handleCreate} />
                    </div>
                </div>

            {/* Mobile floating button */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                {hasPermission('usuarios.create') && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:ring-4 focus:ring-offset-2 cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, var(--monitop-blue-600), var(--monitop-blue-700))`,
                            color: 'var(--monitop-white)',
                            '--tw-focus-ring-color': 'var(--monitop-blue-500)',
                            '--tw-focus-ring-offset-color': 'var(--monitop-white)'
                        } as React.CSSProperties}
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Filters */}
            <UserFilters filters={filters} onFiltersChange={setFilters} />

            {/* Table */}
            <UsersTable
                users={users}
                onEdit={handleEdit}
                onRoles={handleRoles}
                filters={filters}
            />

            {/* Pagination */}
            {users.data && users.data.length > 0 && (
                <SmartPagination
                    links={users.links}
                    currentPage={users.current_page}
                    lastPage={users.last_page}
                    total={users.total}
                    perPage={users.per_page}
                    className="mt-6"
                    variant="auto"
                />
            )}

            {/* Modals */}
            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={editingUser}
            />
            <UserRolesModal
                isOpen={isRolesModalOpen}
                onClose={handleCloseRolesModal}
                user={selectedUser}
            />
        </div>
        </ProtectedPage>
    );
}
