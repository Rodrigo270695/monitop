import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProtectedButton } from '@/components/ui/protected-button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, Key } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Role {
    id: number;
    name: string;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface Filters {
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    onEdit: (role: Role) => void;
    onPermissions: (role: Role) => void;
    filters: Filters;
}

export function RolesTable({ roles, onEdit, onPermissions, filters }: Props) {
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDelete = (role: Role) => {
        executeProtectedAction(() => {
            setDeleteRole(role);
            setShowConfirmDialog(true);
        }, 'roles.delete', 'eliminar roles');
    };

    const confirmDelete = () => {
        if (deleteRole) {
            router.delete(`/roles/${deleteRole.id}`);
        }
    };

    const closeConfirmDialog = () => {
        setShowConfirmDialog(false);
        setDeleteRole(null);
    };

    const filteredRoles = roles.data.filter(role =>
        role.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Usuarios</TableHead>
                            <TableHead>Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No se encontraron roles
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRoles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                style={{
                                                    backgroundColor: 'var(--monitop-purple-100)',
                                                    color: 'var(--monitop-purple-700)',
                                                    borderColor: 'var(--monitop-purple-200)'
                                                }}
                                            >
                                                {role.name}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" style={{ color: 'var(--monitop-slate-400)' }} />
                                            <span className="font-medium">{role.users_count}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {format(new Date(role.created_at), 'dd/MM/yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <ProtectedButton
                                                permission="roles.assign-permissions"
                                                actionName="asignar permisos"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => onPermissions(role)}
                                                className="border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                                                title="Asignar Permisos"
                                            >
                                                <Key className="h-4 w-4" style={{ color: 'var(--monitop-purple-600)' }} />
                                            </ProtectedButton>
                                            <ProtectedButton
                                                permission="roles.edit"
                                                actionName="editar roles"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => onEdit(role)}
                                                className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                                title="Editar Rol"
                                            >
                                                <Edit className="h-4 w-4" style={{ color: 'var(--monitop-blue-600)' }} />
                                            </ProtectedButton>
                                            <ProtectedButton
                                                permission="roles.delete"
                                                actionName="eliminar roles"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => handleDelete(role)}
                                                className="border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 cursor-pointer"
                                                title="Eliminar Rol"
                                            >
                                                <Trash2 className="h-4 w-4" style={{ color: 'var(--monitop-red-600)' }} />
                                            </ProtectedButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {filteredRoles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron roles
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {filteredRoles.map((role) => (
                            <div key={role.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Header with role info */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                                                backgroundColor: 'var(--monitop-purple-100)',
                                                color: 'var(--monitop-purple-600)'
                                            }}>
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="h-4 w-4" />
                                                <span>{role.users_count} usuarios</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Creado: {format(new Date(role.created_at), 'dd/MM/yyyy', { locale: es })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="px-4 py-3 bg-gray-50 flex items-center justify-end gap-2">
                                    <ProtectedButton
                                        permission="roles.assign-permissions"
                                        actionName="asignar permisos"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => onPermissions(role)}
                                        className="border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                                        title="Asignar Permisos"
                                    >
                                        <Key className="h-4 w-4" style={{ color: 'var(--monitop-purple-600)' }} />
                                    </ProtectedButton>
                                    <ProtectedButton
                                        permission="roles.edit"
                                        actionName="editar roles"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => onEdit(role)}
                                        className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                        title="Editar Rol"
                                    >
                                        <Edit className="h-4 w-4" style={{ color: 'var(--monitop-blue-600)' }} />
                                    </ProtectedButton>
                                    <ProtectedButton
                                        permission="roles.delete"
                                        actionName="eliminar roles"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => handleDelete(role)}
                                        className="border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 cursor-pointer"
                                        title="Eliminar Rol"
                                    >
                                        <Trash2 className="h-4 w-4" style={{ color: 'var(--monitop-red-600)' }} />
                                    </ProtectedButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={closeConfirmDialog}
                onConfirm={confirmDelete}
                title="Eliminar Rol"
                description={`¿Estás seguro de que quieres eliminar el rol "${deleteRole?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
