import { useState, useEffect } from 'react';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useScreenSize() {
    const [screenSize, setScreenSize] = useState<ScreenSize>('lg');

    useEffect(() => {
        const getScreenSize = (): ScreenSize => {
            const width = window.innerWidth;

            if (width < 640) return 'xs';
            if (width < 768) return 'sm';
            if (width < 1024) return 'md';
            if (width < 1280) return 'lg';
            if (width < 1536) return 'xl';
            return '2xl';
        };

        const handleResize = () => {
            setScreenSize(getScreenSize());
        };

        // Establecer tamaño inicial
        setScreenSize(getScreenSize());

        // Escuchar cambios de tamaño
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isMobile = screenSize === 'xs' || screenSize === 'sm';
    const isTablet = screenSize === 'md';
    const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl';
    const isLargeScreen = screenSize === 'xl' || screenSize === '2xl';

    return {
        screenSize,
        isMobile,
        isTablet,
        isDesktop,
        isLargeScreen,
    };
}

