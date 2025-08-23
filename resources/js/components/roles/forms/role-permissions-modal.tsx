import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    LayoutDashboard,
    Users,
    Shield,
    Plus,
    Edit,
    Trash2,
    Key,
    Save,
    X
} from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    description: string;
    category: 'menu' | 'submenu' | 'action';
}

interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
}

// Datos de permisos organizados por categorías
const permissionsData = {
    menus: [
        { id: 1, name: 'dashboard.view', description: 'Ver Dashboard', icon: LayoutDashboard, category: 'menu' as const },
    ],
    submenus: [
        { id: 3, name: 'roles.view', description: 'Ver Gestión de Roles', icon: Shield, category: 'submenu' as const },
        { id: 4, name: 'usuarios.view', description: 'Ver Gestión de Usuarios', icon: Users, category: 'submenu' as const },
    ],
    actions: [
        { id: 5, name: 'roles.create', description: 'Crear Roles', icon: Plus, category: 'action' as const },
        { id: 6, name: 'roles.edit', description: 'Editar Roles', icon: Edit, category: 'action' as const },
        { id: 7, name: 'roles.delete', description: 'Eliminar Roles', icon: Trash2, category: 'action' as const },
        { id: 8, name: 'roles.assign-permissions', description: 'Asignar Permisos a Roles', icon: Key, category: 'action' as const },
        { id: 9, name: 'usuarios.create', description: 'Crear Usuarios', icon: Plus, category: 'action' as const },
        { id: 10, name: 'usuarios.edit', description: 'Editar Usuarios', icon: Edit, category: 'action' as const },
        { id: 11, name: 'usuarios.delete', description: 'Eliminar Usuarios', icon: Trash2, category: 'action' as const },
        { id: 12, name: 'usuarios.assign-roles', description: 'Asignar Roles a Usuarios', icon: Key, category: 'action' as const },
    ]
};

export function RolePermissionsModal({ isOpen, onClose, role }: Props) {
    const { toast } = useToast();
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Actualizar permisos cuando cambie el rol
    useEffect(() => {
        if (role) {
            // Usar siempre los permisos reales del rol desde la base de datos
            const defaultPermissions = role.permissions?.map(p => p.name) || [];
            setSelectedPermissions(defaultPermissions);
        }
    }, [role]);

    const handlePermissionToggle = (permissionName: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionName)
                ? prev.filter(p => p !== permissionName)
                : [...prev, permissionName]
        );
    };

    const handleSelectAll = (category: 'menus' | 'submenus' | 'actions') => {
        const categoryPermissions = permissionsData[category].map(p => p.name);
        const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(p => !categoryPermissions.includes(p)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
        }
    };

    const handleSave = async () => {
        if (!role) return;

        setIsLoading(true);
        try {
            // Enviar los permisos al backend
            router.post(route('roles.permissions.update', role.id), {
                permissions: selectedPermissions
            }, {
                onSuccess: () => {
                    // Cerrar el modal después de guardar exitosamente
                    // El toast se mostrará automáticamente desde el flash message
                    onClose();
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Error al actualizar los permisos",
                        variant: "destructive",
                    });
                }
            });
        } catch {
            toast({
                title: "Error",
                description: "Error inesperado al guardar permisos",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryStats = (category: 'menus' | 'submenus' | 'actions') => {
        const categoryPermissions = permissionsData[category].map(p => p.name);
        const selected = categoryPermissions.filter(p => selectedPermissions.includes(p)).length;
        const total = categoryPermissions.length;
        return { selected, total };
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <Shield className="h-5 w-5" style={{ color: 'var(--monitop-purple-600)' }} />
                        Asignar Permisos - {role?.name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600">
                        Gestiona los permisos del rol seleccionado. Organiza los permisos por menús, submenús y acciones específicas.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    <Tabs defaultValue="navigation" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 border border-slate-200">
                            <TabsTrigger
                                value="navigation"
                                className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Navegación
                            </TabsTrigger>
                            <TabsTrigger
                                value="actions"
                                className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                <Key className="h-4 w-4" />
                                Acciones
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="navigation" className="flex-1 overflow-y-auto">
                            <div className="space-y-6">
                                {/* Menús Principales */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                                            <LayoutDashboard className="h-5 w-5" style={{ color: 'var(--monitop-blue-600)' }} />
                                            Menús Principales
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                                {getCategoryStats('menus').selected}/{getCategoryStats('menus').total}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSelectAll('menus')}
                                                className="text-xs transition-all duration-200 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"
                                            >
                                                {getCategoryStats('menus').selected === getCategoryStats('menus').total ? 'Deseleccionar' : 'Seleccionar'} Todo
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        {permissionsData.menus.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 cursor-pointer"
                                                onClick={() => handlePermissionToggle(permission.name)}
                                            >
                                                <Checkbox
                                                    id={permission.name}
                                                    checked={selectedPermissions.includes(permission.name)}
                                                    onCheckedChange={() => handlePermissionToggle(permission.name)}
                                                    className="border-blue-500 data-[state=checked]:bg-blue-600"
                                                />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <permission.icon className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <label
                                                            htmlFor={permission.name}
                                                            className="text-sm font-medium cursor-pointer text-slate-900"
                                                        >
                                                            {permission.description}
                                                        </label>
                                                        <p className="text-xs text-slate-500">
                                                            {permission.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                                    Menú
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-slate-200" />

                                {/* Submenús */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                                            <Shield className="h-5 w-5" style={{ color: 'var(--monitop-green-600)' }} />
                                            Submenús
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                                {getCategoryStats('submenus').selected}/{getCategoryStats('submenus').total}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSelectAll('submenus')}
                                                className="text-xs transition-all duration-200 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 cursor-pointer"
                                            >
                                                {getCategoryStats('submenus').selected === getCategoryStats('submenus').total ? 'Deseleccionar' : 'Seleccionar'} Todo
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        {permissionsData.submenus.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-green-50 hover:border-green-200 transition-all duration-200 cursor-pointer"
                                                onClick={() => handlePermissionToggle(permission.name)}
                                            >
                                                <Checkbox
                                                    id={permission.name}
                                                    checked={selectedPermissions.includes(permission.name)}
                                                    onCheckedChange={() => handlePermissionToggle(permission.name)}
                                                    className="border-green-500 data-[state=checked]:bg-green-600"
                                                />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <permission.icon className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <label
                                                            htmlFor={permission.name}
                                                            className="text-sm font-medium cursor-pointer text-slate-900"
                                                        >
                                                            {permission.description}
                                                        </label>
                                                        <p className="text-xs text-slate-500">
                                                            {permission.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                                                    Submenú
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="actions" className="flex-1 overflow-y-auto">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                                        <Key className="h-5 w-5" style={{ color: 'var(--monitop-purple-600)' }} />
                                        Acciones Específicas
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                                            {getCategoryStats('actions').selected}/{getCategoryStats('actions').total}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSelectAll('actions')}
                                            className="text-xs transition-all duration-200 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 cursor-pointer"
                                        >
                                            {getCategoryStats('actions').selected === getCategoryStats('actions').total ? 'Deseleccionar' : 'Seleccionar'} Todo
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {permissionsData.actions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer"
                                            onClick={() => handlePermissionToggle(permission.name)}
                                        >
                                            <Checkbox
                                                id={permission.name}
                                                checked={selectedPermissions.includes(permission.name)}
                                                onCheckedChange={() => handlePermissionToggle(permission.name)}
                                                className="border-purple-500 data-[state=checked]:bg-purple-600"
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <permission.icon className="h-5 w-5 text-purple-600" />
                                                <div>
                                                    <label
                                                        htmlFor={permission.name}
                                                        className="text-sm font-medium cursor-pointer text-slate-900"
                                                    >
                                                        {permission.description}
                                                    </label>
                                                    <p className="text-xs text-slate-500">
                                                        {permission.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                                Acción
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Footer con estadísticas y botones */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>Total seleccionados: <strong className="text-slate-900">{selectedPermissions.length}</strong></span>
                            <span>•</span>
                            <span>Menús: <strong className="text-slate-900">{getCategoryStats('menus').selected}</strong></span>
                            <span>•</span>
                            <span>Submenús: <strong className="text-slate-900">{getCategoryStats('submenus').selected}</strong></span>
                            <span>•</span>
                            <span>Acciones: <strong className="text-slate-900">{getCategoryStats('actions').selected}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Guardando...' : 'Guardar Permisos'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
