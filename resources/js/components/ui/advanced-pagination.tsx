import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './select';

interface AdvancedPaginationProps {
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
    onPerPageChange?: (perPage: number) => void;
}

export function AdvancedPagination({
    links,
    currentPage,
    lastPage,
    total,
    perPage,
    className,
    onPerPageChange
}: AdvancedPaginationProps) {
    const [isPerPageOpen, setIsPerPageOpen] = useState(false);

    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    const perPageOptions = [5, 10, 25, 50, 100];

    const handlePerPageChange = (newPerPage: string) => {
        const perPageNumber = parseInt(newPerPage);
        if (onPerPageChange) {
            onPerPageChange(perPageNumber);
        } else {
            // Actualizar la URL con el nuevo per_page
            const url = new URL(window.location.href);
            url.searchParams.set('per_page', perPageNumber.toString());
            url.searchParams.delete('page'); // Resetear a la primera página
            router.visit(url.toString());
        }
    };

        // Generar números de página para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 9; // Más páginas para pantallas grandes

        if (lastPage <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas con ellipsis
            if (currentPage <= 5) {
                // Páginas iniciales - mostrar más páginas
                for (let i = 1; i <= 6; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 4) {
                // Páginas finales - mostrar más páginas
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 5; i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                // Páginas intermedias - mostrar más contexto
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 3; i <= currentPage + 3; i++) {
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
        <div className={cn("bg-white border border-slate-200 rounded-lg p-4", className)}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Información de resultados */}
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-600">
                        Mostrando <span className="font-medium text-slate-900">{from}</span> a{' '}
                        <span className="font-medium text-slate-900">{to}</span> de{' '}
                        <span className="font-medium text-slate-900">{total}</span> resultados
                    </div>

                    {/* Selector de elementos por página */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Mostrar:</span>
                        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map(option => (
                                    <SelectItem key={option} value={option.toString()}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-slate-600">por página</span>
                    </div>
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

            {/* Información adicional */}
            <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 text-center">
                    Página {currentPage} de {lastPage} • {total} resultados totales
                </div>
            </div>
        </div>
    );
}
