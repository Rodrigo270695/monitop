import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { toast } = useToast();

    const handleTestToast = () => {
        toast({
            title: "Test Toast",
            description: "Este es un toast de prueba para verificar que funciona",
            variant: "success",
        });
    };

    const handleTestErrorToast = () => {
        toast({
            title: "Error",
            description: "No se puede eliminar un rol que tiene usuarios asignados.",
            variant: "destructive",
        });
    };

    const handleTestWarningToast = () => {
        toast({
            title: "Advertencia",
            description: "Esta acción no se puede deshacer. ¿Estás seguro?",
            variant: "warning",
        });
    };

    const handleTestInfoToast = () => {
        toast({
            title: "Información",
            description: "Se ha enviado un correo de verificación a tu email.",
            variant: "info",
        });
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleTestToast} variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            ✓ Toast Éxito
                        </Button>
                        <Button onClick={handleTestErrorToast} variant="destructive">
                            ✗ Toast Error
                        </Button>
                        <Button onClick={handleTestWarningToast} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                            ⚠ Toast Advertencia
                        </Button>
                        <Button onClick={handleTestInfoToast} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                            ℹ Toast Info
                        </Button>

                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
