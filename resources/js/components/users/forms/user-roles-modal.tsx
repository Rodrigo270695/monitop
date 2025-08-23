import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    User,
    Shield,
    Save,
    X,
    Crown,
    UserCheck,
    Users,
    Settings,
    Eye,
    Mail
} from 'lucide-react';

interface Role {
    id: number;
    name: string;
    description?: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles?: Role[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

// Datos de roles disponibles (en un proyecto real esto vendría del backend)
const availableRoles: Role[] = [
    { id: 1, name: 'Administrador', description: 'Acceso completo al sistema' },
    { id: 2, name: 'Editor', description: 'Puede editar contenido' },
    { id: 3, name: 'Moderador', description: 'Puede moderar contenido' },
    { id: 4, name: 'Usuario', description: 'Usuario estándar' },
    { id: 5, name: 'Invitado', description: 'Acceso limitado' },
    { id: 6, name: 'Supervisor', description: 'Supervisa actividades' },
    { id: 7, name: 'Analista', description: 'Analiza datos' },
    { id: 8, name: 'Desarrollador', description: 'Acceso de desarrollo' },
    { id: 9, name: 'Tester', description: 'Prueba funcionalidades' },
    { id: 10, name: 'Manager', description: 'Gestiona equipos' },
];

export function UserRolesModal({ isOpen, onClose, user }: Props) {
    const { toast } = useToast();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Actualizar roles cuando cambie el usuario
    useEffect(() => {
        if (user) {
            // Usar siempre los roles reales del usuario desde la base de datos
            const defaultRoles = user.roles?.map(r => r.name) || [];
            setSelectedRoles(defaultRoles);
        }
    }, [user]);

    const handleRoleToggle = (roleName: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        );
    };

    const handleSelectAll = () => {
        const allRoles = availableRoles.map(r => r.name);
        const allSelected = allRoles.every(r => selectedRoles.includes(r));

        if (allSelected) {
            setSelectedRoles([]);
        } else {
            setSelectedRoles(allRoles);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Enviar los roles al backend
            router.post(route('users.roles.update', user.id), {
                roles: selectedRoles
            }, {
                onSuccess: () => {
                    // Cerrar el modal después de guardar exitosamente
                    // El toast se mostrará automáticamente desde el flash message
                    onClose();
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Error al actualizar los roles",
                        variant: "destructive",
                    });
                }
            });
        } catch {
            toast({
                title: "Error",
                description: "Error inesperado al guardar roles",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleIcon = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'administrador':
                return Crown;
            case 'editor':
                return UserCheck;
            case 'moderador':
                return Shield;
            case 'supervisor':
                return Eye;
            case 'manager':
                return Users;
            case 'desarrollador':
                return Settings;
            default:
                return User;
        }
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'administrador':
                return 'text-red-600 bg-red-100 border-red-200';
            case 'editor':
                return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'moderador':
                return 'text-green-600 bg-green-100 border-green-200';
            case 'supervisor':
                return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'manager':
                return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'desarrollador':
                return 'text-indigo-600 bg-indigo-100 border-indigo-200';
            default:
                return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <Shield className="h-5 w-5" style={{ color: 'var(--monitop-blue-600)' }} />
                        Asignar Roles - {user?.name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600">
                        Gestiona los roles del usuario seleccionado. Selecciona los roles que deseas asignar.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    {/* Información del usuario */}
                    {user && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-600 flex items-center gap-2">
                                        <User className="h-3 w-3" />
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-slate-600 flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de roles */}
                    <div
                        className="flex-1 overflow-y-auto custom-scrollbar"
                        style={{ maxHeight: '400px' }}
                    >
                        <div className="space-y-4 pr-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                                    <Shield className="h-5 w-5" style={{ color: 'var(--monitop-purple-600)' }} />
                                    Roles Disponibles
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                                        {selectedRoles.length}/{availableRoles.length}
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="text-xs transition-all duration-200 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 cursor-pointer"
                                    >
                                        {selectedRoles.length === availableRoles.length ? 'Deseleccionar' : 'Seleccionar'} Todo
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {availableRoles.map((role) => {
                                    const RoleIcon = getRoleIcon(role.name);
                                    const roleColor = getRoleColor(role.name);

                                    return (
                                        <div
                                            key={role.id}
                                            className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer"
                                            onClick={() => handleRoleToggle(role.name)}
                                        >
                                            <Checkbox
                                                id={role.name}
                                                checked={selectedRoles.includes(role.name)}
                                                onCheckedChange={() => handleRoleToggle(role.name)}
                                                className="border-purple-500 data-[state=checked]:bg-purple-600"
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <RoleIcon className="h-5 w-5" style={{ color: 'var(--monitop-purple-600)' }} />
                                                <div>
                                                    <label
                                                        htmlFor={role.name}
                                                        className="text-sm font-medium cursor-pointer text-slate-900"
                                                    >
                                                        {role.name}
                                                    </label>
                                                    {role.description && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {role.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`text-xs ${roleColor}`}>
                                                Rol
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer con estadísticas y botones */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
                        <div className="text-sm text-slate-600">
                            <span>Roles seleccionados: <strong className="text-slate-900">{selectedRoles.length}</strong> de <strong className="text-slate-900">{availableRoles.length}</strong></span>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Guardando...' : 'Guardar Roles'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
