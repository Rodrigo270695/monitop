import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProtectedButton } from '@/components/ui/protected-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Trash2, Shield, User, Mail, Calendar, Key } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles_count: number;
    roles?: Array<{ id: number; name: string }>;
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
    onEdit: (user: User) => void;
    onRoles: (user: User) => void;
    filters: {
        search: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    };
}

export function UsersTable({ users, onEdit, onRoles, filters }: Props) {
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDelete = (user: User) => {
        executeProtectedAction(() => {
            setDeleteUser(user);
            setShowConfirmDialog(true);
        }, 'usuarios.delete', 'eliminar usuarios');
    };

    const confirmDelete = () => {
        if (deleteUser) {
            router.delete(`/users/${deleteUser.id}`);
        }
    };

    const closeConfirmDialog = () => {
        setShowConfirmDialog(false);
        setDeleteUser(null);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (filteredUsers.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No se encontraron usuarios
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" style={{ color: 'var(--monitop-slate-400)' }} />
                                            <span className="font-medium">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" style={{ color: 'var(--monitop-slate-400)' }} />
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <Badge key={role.id} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                            {role.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">Sin roles</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <ProtectedButton
                                                permission="usuarios.assign-roles"
                                                actionName="asignar roles"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => onRoles(user)}
                                                className="border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                                                title="Asignar Roles"
                                            >
                                                <Key className="h-4 w-4" style={{ color: 'var(--monitop-purple-600)' }} />
                                            </ProtectedButton>
                                            <ProtectedButton
                                                permission="usuarios.edit"
                                                actionName="editar usuarios"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => onEdit(user)}
                                                className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                                title="Editar Usuario"
                                            >
                                                <Edit className="h-4 w-4" style={{ color: 'var(--monitop-blue-600)' }} />
                                            </ProtectedButton>
                                            <ProtectedButton
                                                permission="usuarios.delete"
                                                actionName="eliminar usuarios"
                                                variant="outline"
                                                size="sm"
                                                onAction={() => handleDelete(user)}
                                                className="border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 cursor-pointer"
                                                title="Eliminar Usuario"
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
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron usuarios
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Header with user info */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                                <p className="text-sm text-gray-500">{user.username}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Shield className="h-4 w-4" />
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role) => (
                                                            <Badge key={role.id} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                                {role.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-500">Sin roles</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Creado: {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: es })}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="px-4 py-3 bg-gray-50 flex items-center justify-end gap-2">
                                    <ProtectedButton
                                        permission="usuarios.assign-roles"
                                        actionName="asignar roles"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => onRoles(user)}
                                        className="border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                                        title="Asignar Roles"
                                    >
                                        <Key className="h-4 w-4" style={{ color: 'var(--monitop-purple-600)' }} />
                                    </ProtectedButton>
                                    <ProtectedButton
                                        permission="usuarios.edit"
                                        actionName="editar usuarios"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => onEdit(user)}
                                        className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                        title="Editar Usuario"
                                    >
                                        <Edit className="h-4 w-4" style={{ color: 'var(--monitop-blue-600)' }} />
                                    </ProtectedButton>
                                    <ProtectedButton
                                        permission="usuarios.delete"
                                        actionName="eliminar usuarios"
                                        variant="outline"
                                        size="sm"
                                        onAction={() => handleDelete(user)}
                                        className="border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 cursor-pointer"
                                        title="Eliminar Usuario"
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
                title="Eliminar Usuario"
                description={`¿Estás seguro de que quieres eliminar al usuario "${deleteUser?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
