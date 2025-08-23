import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UsersIndex } from '@/components/users/index';
import { type BreadcrumbItem } from '@/types';

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

export default function UsersPage({ users }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gestión de Usuarios', href: '/users' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <UsersIndex users={users} />
        </AppLayout>
    );
}

