import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Shield, Users, Calendar, Eye, Settings } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Gestionar Rol',
        href: '/roles',
    },
];

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    permissions: Permission[];
    filters: {
        search: string;
        per_page: number;
    };
}

export default function RolesIndex({ roles, permissions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
    });
    const [modalPermissions, setModalPermissions] = useState<Record<string, boolean>>({});

    const { flash } = (usePage().props as any) || {};
    const { toast } = useToast();

    // Handle search
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get('/roles', { search: value, per_page: perPage }, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get('/roles', { search, per_page: newPerPage }, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle create role
    const handleCreateRole = () => {
        router.post('/roles', formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({ name: '' });
                toast({
                    title: "Rol creado",
                    description: "El rol se ha creado exitosamente.",
                    variant: "success",
                });
            },
            onError: (errors) => {
                toast({
                    title: "Error",
                    description: "Hubo un error al crear el rol.",
                    variant: "destructive",
                });
            },
        });
    };

    // Handle edit role
    const handleEditRole = () => {
        if (selectedRole) {
            router.put(`/roles/${selectedRole.id}`, formData, {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setSelectedRole(null);
                    setFormData({ name: '' });
                    toast({
                        title: "Rol actualizado",
                        description: "El rol se ha actualizado exitosamente.",
                        variant: "success",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Error",
                        description: "Hubo un error al actualizar el rol.",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    // Handle delete role
    const handleDeleteRole = () => {
        if (selectedRole) {
            router.delete(`/roles/${selectedRole.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedRole(null);
                    toast({
                        title: "Rol desactivado",
                        description: "El rol se ha desactivado exitosamente.",
                        variant: "success",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Error",
                        description: "Hubo un error al desactivar el rol.",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    // Open edit modal
    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setFormData({ name: role.name });
        setIsEditModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
    };

    // Open permissions modal
    const openPermissionsModal = (role: Role) => {
        setSelectedRole(role);

        // Inicializar permisos del modal con los permisos actuales del rol
        const currentPermissions: Record<string, boolean> = {};

        // Mapear permisos existentes del rol
        role.permissions.forEach(permission => {
            currentPermissions[permission.name] = true;
        });

        setModalPermissions(currentPermissions);
        setIsPermissionsModalOpen(true);
    };

    // Get random color for permission badges
    const getPermissionColor = (permissionName: string) => {
        const colors = ['blue', 'green', 'purple', 'orange', 'pink'] as const;
        const index = permissionName.length % colors.length;
        return colors[index];
    };

    // Handle permission checkbox changes
    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        setModalPermissions(prev => ({
            ...prev,
            [permissionName]: checked
        }));
    };

    // Handle save permissions
    const handleSavePermissions = () => {
        if (selectedRole) {
            const selectedPermissions = Object.keys(modalPermissions).filter(
                permission => modalPermissions[permission]
            );

            router.put(`/roles/${selectedRole.id}`, {
                permissions: selectedPermissions
            }, {
                onSuccess: () => {
                    setIsPermissionsModalOpen(false);
                    setSelectedRole(null);
                    setModalPermissions({});
                    toast({
                        title: "Permisos actualizados",
                        description: "Los permisos del rol se han actualizado exitosamente.",
                        variant: "success",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Error",
                        description: "Hubo un error al actualizar los permisos.",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    // Handle close permissions modal
    const handleClosePermissionsModal = () => {
        setIsPermissionsModalOpen(false);
        setSelectedRole(null);
        setModalPermissions({});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestionar Roles</h1>
                        <p className="text-muted-foreground">
                            Administra los roles y permisos del sistema
                        </p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Rol
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Rol</DialogTitle>
                                <DialogDescription>
                                    Define un nuevo rol. Los permisos se pueden asignar después de crear el rol.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre del Rol</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Editor, Moderador, etc."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreateRole}>
                                    Crear Rol
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Success Alert */}
                {flash?.success && (
                    <Alert>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar roles o permisos..."
                                        value={search || ''}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="per-page" className="text-sm whitespace-nowrap">Mostrar:</Label>
                                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Rol</TableHead>
                                        <TableHead>Permisos</TableHead>
                                        <TableHead className="w-[120px]">Fecha Creación</TableHead>
                                        <TableHead className="w-[100px]">Estado</TableHead>
                                        <TableHead className="w-[100px] text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    <div>
                                                        <div className="font-medium">{role.name}</div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {role.permissions.length} permisos
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-md">
                                                    {role.permissions.slice(0, 3).map((permission) => (
                                                        <Badge
                                                            key={permission.id}
                                                            variant={getPermissionColor(permission.name)}
                                                            className="text-xs"
                                                        >
                                                            {permission.name.replace(/_/g, ' ')}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{role.permissions.length - 3} más
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(role.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={role.active ? "green" : "destructive"} 
                                                    className="text-xs"
                                                >
                                                    {role.active ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditModal(role)}
                                                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                                                        title="Editar Rol"
                                                    >
                                                        <Edit className="h-3 w-3 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(role)}
                                                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-600" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openPermissionsModal(role)}
                                                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:border-purple-200"
                                                        title="Gestionar Permisos"
                                                    >
                                                        <Settings className="h-3 w-3 text-purple-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {roles.data.map((role) => (
                        <Card key={role.id}>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{role.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {role.permissions.length} permisos
                                            </Badge>
                                            <Badge 
                                                variant={role.active ? "green" : "destructive"} 
                                                className="text-xs"
                                            >
                                                {role.active ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.slice(0, 4).map((permission) => (
                                            <Badge
                                                key={permission.id}
                                                variant={getPermissionColor(permission.name)}
                                                className="text-xs"
                                            >
                                                {permission.name.replace(/_/g, ' ')}
                                            </Badge>
                                        ))}
                                        {role.permissions.length > 4 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{role.permissions.length - 4} más
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(role.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(role)}
                                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                                                title="Editar Rol"
                                            >
                                                <Edit className="h-3 w-3 text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDeleteModal(role)}
                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                                            >
                                                <Trash2 className="h-3 w-3 text-red-600" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openPermissionsModal(role)}
                                                className="h-8 w-8 p-0 hover:bg-purple-50 hover:border-purple-200"
                                                title="Gestionar Permisos"
                                            >
                                                <Settings className="h-3 w-3 text-purple-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {roles.last_page > 1 && (
                    <div className="space-y-4">
                        <div className="text-center text-sm text-muted-foreground">
                            Mostrando {((roles.current_page - 1) * roles.per_page) + 1} a {Math.min(roles.current_page * roles.per_page, roles.total)} de {roles.total} roles
                        </div>
                        <Pagination
                            currentPage={roles.current_page}
                            totalPages={roles.last_page}
                            onPageChange={(page) => router.get('/roles', { page, search, per_page: perPage })}
                        />
                    </div>
                )}



                                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Editar Rol</DialogTitle>
                            <DialogDescription>
                                Modifica el nombre del rol.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nombre del Rol</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Editor, Moderador, etc."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleEditRole}>
                                Actualizar Rol
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Desactivar Rol</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que quieres desactivar el rol "{selectedRole?.name}"?
                                Esta acción marcará el rol como inactivo.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteRole}>
                                Desactivar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Permissions Modal */}
                <Dialog open={isPermissionsModalOpen} onOpenChange={handleClosePermissionsModal}>
                    <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>Gestionar Permisos - {selectedRole?.name}</DialogTitle>
                            <DialogDescription>
                                Configura los permisos y acceso a menús para este rol.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="menus" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="menus">Menús y Acceso</TabsTrigger>
                                <TabsTrigger value="permissions">Permisos CRUD</TabsTrigger>
                            </TabsList>

                            <TabsContent value="menus" className="space-y-4">
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {permissions.filter(p => p.name.startsWith('view_')).map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={permission.name}
                                                checked={modalPermissions[permission.name] || false}
                                                onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                            />
                                            <Label htmlFor={permission.name} className="text-sm">
                                                {permission.name.replace('view_', 'Ver ').replace(/_/g, ' ')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="permissions" className="space-y-4">
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {permissions.filter(p => !p.name.startsWith('view_')).map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={permission.name}
                                                checked={modalPermissions[permission.name] || false}
                                                onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                            />
                                            <Label htmlFor={permission.name} className="text-sm">
                                                {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClosePermissionsModal}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSavePermissions}>
                                Guardar Permisos
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
