import React from 'react';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Pagination } from './pagination';
import { SimplePagination } from './simple-pagination';
import { MobilePagination } from './mobile-pagination';
import { SimpleMobilePagination } from './simple-mobile-pagination';
import { AdvancedPagination } from './advanced-pagination';
import { LargePagination } from './large-pagination';

interface SmartPaginationProps {
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
    variant?: 'auto' | 'basic' | 'simple' | 'mobile' | 'advanced';
    onPerPageChange?: (perPage: number) => void;
}

export function SmartPagination({
    links,
    currentPage,
    lastPage,
    total,
    perPage,
    className,
    variant = 'auto',
    onPerPageChange
}: SmartPaginationProps) {
    const { isMobile, isLargeScreen, screenSize } = useScreenSize();

    // Si es auto, determinar automáticamente basado en el dispositivo
    if (variant === 'auto') {
        if (isMobile) {
            return (
                <SimpleMobilePagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                />
            );
        }

        // Para pantallas extra grandes (2xl), usar el paginador con máximo de páginas
        if (screenSize === '2xl') {
            return (
                <LargePagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                    onPerPageChange={onPerPageChange}
                />
            );
        }

        // Para pantallas grandes (xl), usar el paginador avanzado
        if (isLargeScreen) {
            return (
                <AdvancedPagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                    onPerPageChange={onPerPageChange}
                />
            );
        }

        // Para pantallas medianas, usar el paginador básico
        return (
            <Pagination
                links={links}
                currentPage={currentPage}
                lastPage={lastPage}
                total={total}
                perPage={perPage}
                className={className}
            />
        );
    }

    // Renderizar según la variante especificada
    switch (variant) {
        case 'basic':
            return (
                <Pagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                />
            );

        case 'simple':
            return (
                <SimplePagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                />
            );

        case 'mobile':
            return (
                <MobilePagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                />
            );

        case 'advanced':
            return (
                <AdvancedPagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                    onPerPageChange={onPerPageChange}
                />
            );

        default:
            return (
                <Pagination
                    links={links}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    className={className}
                />
            );
    }
}
