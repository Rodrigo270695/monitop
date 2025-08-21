import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactPaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    currentPage: number;
    lastPage: number;
    className?: string;
}

export function CompactPagination({ links, currentPage, lastPage, className }: CompactPaginationProps) {
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    // Generar números de página para mostrar (máximo 3)
    const getPageNumbers = () => {
        if (lastPage <= 3) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [1, 2, '...', lastPage];
        }

        if (currentPage === lastPage) {
            return [1, '...', lastPage - 1, lastPage];
        }

        return [1, '...', currentPage, '...', lastPage];
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={cn("flex items-center justify-center gap-1", className)}>
            {/* Botón Anterior */}
            <Link
                href={hasPrevious ? links.find(link => link.label === '&laquo; Previous')?.url || '#' : '#'}
                className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200",
                    hasPrevious
                        ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                        : "border-slate-200 text-slate-400 cursor-not-allowed"
                )}
                preserveScroll
            >
                <ChevronLeft className="h-3 w-3" />
            </Link>

            {/* Números de página */}
            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return (
                        <div
                            key={`ellipsis-${index}`}
                            className="inline-flex items-center justify-center w-8 h-8 text-slate-400"
                        >
                            <MoreHorizontal className="h-3 w-3" />
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
                            "inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 text-xs font-medium",
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

            {/* Botón Siguiente */}
            <Link
                href={hasNext ? links.find(link => link.label === 'Next &raquo;')?.url || '#' : '#'}
                className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200",
                    hasNext
                        ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                        : "border-slate-200 text-slate-400 cursor-not-allowed"
                )}
                preserveScroll
            >
                <ChevronRight className="h-3 w-3" />
            </Link>
        </div>
    );
}

