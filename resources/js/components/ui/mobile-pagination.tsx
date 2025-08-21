import React from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface MobilePaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    className?: string;
}

export function MobilePagination({ links, currentPage, lastPage, total, perPage, className }: MobilePaginationProps) {
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

        // Función para encontrar el enlace anterior
    const getPreviousUrl = () => {
        // Buscar por diferentes patrones
        const previousLink = links.find(link => {
            const label = link.label.toLowerCase();
            return label.includes('previous') ||
                    label.includes('anterior') ||
                    label.includes('«') ||
                    label.includes('&laquo;');
        });
        return previousLink?.url;
    };

        // Función para encontrar el enlace siguiente
    const getNextUrl = () => {
        // Buscar por diferentes patrones
        const nextLink = links.find(link => {
            const label = link.label.toLowerCase();
            return label.includes('next') ||
                    label.includes('siguiente') ||
                    label.includes('»') ||
                    label.includes('&raquo;');
        });
        return nextLink?.url;
    };



    return (
        <div className={cn("bg-white border-t border-slate-200 px-4 py-3", className)}>
            {/* Información de resultados - Móvil optimizada */}
            <div className="text-xs text-slate-500 text-center mb-3">
                {from}-{to} de {total} resultados
            </div>

            {/* Controles de paginación - Móvil optimizados */}
            <div className="flex items-center justify-between">
                {/* Botón Anterior */}
                {hasPrevious ? (
                    <Button
                        onClick={() => {
                            const previousUrl = getPreviousUrl();
                            if (previousUrl) {
                                try {
                                    router.visit(previousUrl, { preserveScroll: true });
                                } catch (error) {
                                    window.location.href = previousUrl;
                                }
                            }
                        }}
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all duration-200 active:scale-95"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                ) : (
                    <Button
                        disabled
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                )}

                {/* Información de página - Móvil optimizada */}
                <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-slate-900">
                        {currentPage}
                    </div>
                    <div className="text-sm text-slate-400">
                        de {lastPage}
                    </div>
                </div>

                {/* Botón Siguiente */}
                {hasNext ? (
                    <Button
                        onClick={() => {
                            const nextUrl = getNextUrl();
                            if (nextUrl) {
                                try {
                                    router.visit(nextUrl, { preserveScroll: true });
                                } catch (error) {
                                    window.location.href = nextUrl;
                                }
                            }
                        }}
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all duration-200 active:scale-95"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                ) : (
                    <Button
                        disabled
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                )}
            </div>

            {/* Indicador de progreso */}
            <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${(currentPage / lastPage) * 100}%` }}
                    />
                </div>
                <div className="text-xs text-slate-400 text-center mt-1">
                    {Math.round((currentPage / lastPage) * 100)}% completado
                </div>
            </div>
        </div>
    );
}
