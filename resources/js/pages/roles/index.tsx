import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { RolesIndex } from '@/components/roles/index';

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

export default function RolesPage({ roles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gestión de Roles', href: '/roles' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Roles" />
            <RolesIndex roles={roles} />
        </AppLayout>
    );
}
