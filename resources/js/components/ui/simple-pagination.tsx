import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimplePaginationProps {
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

export function SimplePagination({ links, currentPage, lastPage, total, perPage, className }: SimplePaginationProps) {
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
            {/* Información de resultados */}
            <div className="text-sm text-slate-600 text-center sm:text-left">
                Mostrando <span className="font-medium text-slate-900">{from}</span> a{' '}
                <span className="font-medium text-slate-900">{to}</span> de{' '}
                <span className="font-medium text-slate-900">{total}</span> resultados
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Botón Anterior */}
                <Link
                    href={hasPrevious ? links.find(link => link.label === '&laquo; Previous')?.url || '#' : '#'}
                    className={cn(
                        "inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[80px] sm:min-w-[100px] justify-center",
                        hasPrevious
                            ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                            : "border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </Link>

                {/* Información de página */}
                <div className="text-sm text-slate-600 px-2 sm:px-3 py-2 text-center">
                    <span className="hidden sm:inline">Página </span>
                    <span className="font-medium text-slate-900">{currentPage}</span>
                    <span className="hidden sm:inline"> de </span>
                    <span className="sm:hidden">/</span>
                    <span className="font-medium text-slate-900">{lastPage}</span>
                </div>

                {/* Botón Siguiente */}
                <Link
                    href={hasNext ? links.find(link => link.label === 'Next &raquo;')?.url || '#' : '#'}
                    className={cn(
                        "inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[80px] sm:min-w-[100px] justify-center",
                        hasNext
                            ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                            : "border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                    preserveScroll
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
