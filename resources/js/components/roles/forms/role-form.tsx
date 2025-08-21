import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Role {
    id: number;
    name: string;
}

interface Props {
    role?: Role | null;
    onClose: () => void;
}

export function RoleForm({ role, onClose }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (role) {
            put(`/roles/${role.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post('/roles', {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre del Rol <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ej: Administrador, Usuario, Editor"
                    className={`border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.name ? 'border-red-500' : ''}`}
                    style={{
                        backgroundColor: 'white',
                        color: 'var(--monitop-slate-900)'
                    }}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={processing}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:ring-purple-500 cursor-pointer"
                >
                    {processing ? 'Guardando...' : (role ? 'Actualizar' : 'Crear')}
                </Button>
            </div>
        </form>
    );
}
