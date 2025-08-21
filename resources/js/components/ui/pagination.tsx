import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
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

export function Pagination({ links, currentPage, lastPage, total, perPage, className }: PaginationProps) {
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

        // Generar números de página para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7; // Aumentado para pantallas grandes

        if (lastPage <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas con ellipsis
            if (currentPage <= 4) {
                // Páginas iniciales - mostrar más páginas
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 3) {
                // Páginas finales - mostrar más páginas
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 4; i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                // Páginas intermedias - mostrar más contexto
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
            {/* Información de resultados */}
            <div className="text-sm text-slate-600">
                Mostrando <span className="font-medium text-slate-900">{from}</span> a{' '}
                <span className="font-medium text-slate-900">{to}</span> de{' '}
                <span className="font-medium text-slate-900">{total}</span> resultados
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-1">
                {/* Botón Anterior */}
                <Link
                    href={hasPrevious ? links.find(link => link.label === '&laquo; Previous')?.url || '#' : '#'}
                    className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200",
                        hasPrevious
                            ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                            : "border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <div
                                    key={`ellipsis-${index}`}
                                    className="inline-flex items-center justify-center w-10 h-10 text-slate-400"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </div>
                            );
                        }

                        const isActive = page === currentPage;
                        const pageUrl = links.find(link => link.label === page.toString())?.url;

                        return (
                            <Link
                                key={page}
                                href={pageUrl || '#'}
                                className={cn(
                                    "inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 font-medium",
                                    isActive
                                        ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                                        : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                                )}
                                preserveScroll
                            >
                                {page}
                            </Link>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <Link
                    href={hasNext ? links.find(link => link.label === 'Next &raquo;')?.url || '#' : '#'}
                    className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200",
                        hasNext
                            ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                            : "border-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
