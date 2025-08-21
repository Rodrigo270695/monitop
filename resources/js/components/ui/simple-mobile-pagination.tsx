import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SimpleMobilePaginationProps {
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

export function SimpleMobilePagination({ links, currentPage, lastPage, total, perPage, className }: SimpleMobilePaginationProps) {
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    // Encontrar enlaces por posición en el array (más confiable)
    const previousLink = links[0]; // El primer enlace suele ser "Previous"
    const nextLink = links[links.length - 1]; // El último enlace suele ser "Next"



    return (
        <div className={cn("bg-white border-t border-slate-200 px-4 py-3", className)}>
            {/* Información de resultados - Móvil optimizada */}
            <div className="text-xs text-slate-500 text-center mb-3">
                {from}-{to} de {total} resultados
            </div>

            {/* Controles de paginación - Móvil optimizados */}
            <div className="flex items-center justify-between">
                {/* Botón Anterior */}
                {hasPrevious && previousLink?.url ? (
                    <Link
                        href={previousLink.url}
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all duration-200 active:scale-95"
                        preserveScroll
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
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
                {hasNext && nextLink?.url ? (
                    <Link
                        href={nextLink.url}
                        className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all duration-200 active:scale-95"
                        preserveScroll
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Link>
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
