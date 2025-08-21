import { ProtectedPage } from '@/components/auth/protected-page';

export default function UsersIndex() {
    return (
        <ProtectedPage permission="usuarios.view">
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
                    <p className="text-slate-600">Administra los usuarios del sistema</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-slate-600">
                        Esta es la página de gestión de usuarios. Aquí puedes administrar todos los usuarios del sistema.
                    </p>
                </div>
            </div>
        </ProtectedPage>
    );
}

