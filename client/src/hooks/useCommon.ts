import { useState, useEffect } from 'react';

/**
 * Custom hook for managing dev mode detection and persistence
 */
export const useDevMode = () => {
    const [isDevMode, setIsDevMode] = useState(() =>
        localStorage.getItem('devMode') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('devMode', isDevMode.toString());
    }, [isDevMode]);

    const toggleDevMode = () => {
        setIsDevMode(prev => !prev);
    };

    return {
        isDevMode,
        setIsDevMode,
        toggleDevMode
    };
};

/**
 * Custom hook for managing filter state
 */
export const useFilters = <T extends Record<string, any>>(initialFilters: T) => {
    const [filters, setFilters] = useState<T>(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const toggleFiltersVisibility = () => {
        setShowFilters(prev => !prev);
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        showFilters,
        setShowFilters,
        toggleFiltersVisibility
    };
};