import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { User, Mail, UserCheck, Lock, Save, X, Eye, EyeOff } from 'lucide-react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles?: Array<{ id: number; name: string }>;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export function UserFormModal({ isOpen, onClose, user }: Props) {
    const { toast } = useToast();
    const { hasPermission } = usePermissions();
    const { executeProtectedAction } = useProtectedAction();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Actualizar formulario cuando cambie el usuario
    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                username: user.username,
                email: user.email,
                password: '',
                password_confirmation: '',
            });
        } else {
            reset();
        }
    }, [user, setData, reset]);

    // Limpiar formulario cuando se cierre el modal
    useEffect(() => {
        if (!isOpen) {
            reset();
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen, reset]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        executeProtectedAction(() => {
            if (user) {
                // Actualizar usuario existente
                put(route('users.update', user.id), {
                    onSuccess: () => {
                        toast({
                            title: "Usuario actualizado",
                            description: "El usuario ha sido actualizado exitosamente. Puedes asignar roles usando el botón 'Asignar Roles'.",
                            variant: "success",
                        });
                        reset();
                        onClose();
                    },
                    onError: () => {
                        toast({
                            title: "Error",
                            description: "No se pudo actualizar el usuario.",
                            variant: "destructive",
                        });
                    }
                });
            } else {
                // Crear nuevo usuario
                post(route('users.store'), {
                    onSuccess: () => {
                        toast({
                            title: "Usuario creado",
                            description: "El usuario ha sido creado exitosamente. Puedes asignar roles usando el botón 'Asignar Roles'.",
                            variant: "success",
                        });
                        reset();
                        onClose();
                    },
                    onError: () => {
                        toast({
                            title: "Error",
                            description: "No se pudo crear el usuario.",
                            variant: "destructive",
                        });
                    }
                });
            }
        }, user ? 'usuarios.edit' : 'usuarios.create', user ? 'editar usuarios' : 'crear usuarios');
    };

    const getTitle = () => user ? 'Editar Usuario' : 'Crear Usuario';
    const getDescription = () => user
        ? 'Modifica la información del usuario seleccionado.'
        : 'Crea un nuevo usuario en el sistema.';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <User className="h-5 w-5" style={{ color: 'var(--monitop-blue-600)' }} />
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600">
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                            <UserCheck className="h-5 w-5" style={{ color: 'var(--monitop-blue-600)' }} />
                            Información Básica
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                    Nombre Completo <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Ingresa el nombre completo"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                                    Nombre de Usuario <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''}`}
                                    placeholder="Ingresa el nombre de usuario"
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                            <Lock className="h-5 w-5" style={{ color: 'var(--monitop-purple-600)' }} />
                            Contraseña {user && '(Opcional para actualizar)'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Contraseña {!user && <span className="text-red-500">*</span>}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                                        placeholder={user ? 'Dejar vacío para mantener' : 'Mínimo 8 caracteres'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                    Confirmar Contraseña {!user && <span className="text-red-500">*</span>}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                        placeholder="Repite la contraseña"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>
                    </div>

                                        {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="text-sm text-slate-600">
                            <span>Los roles se pueden asignar después de crear/editar el usuario</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Guardando...' : (user ? 'Actualizar Usuario' : 'Crear Usuario')}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
