import { useEffect } from 'react';

/**
 * Custom hook to scroll to the top of the page when component mounts
 * or when dependencies change.
 * 
 * @param dependencies - Array of dependencies that trigger scroll to top when changed
 */
export const useScrollToTop = (dependencies: React.DependencyList = []) => {
    useEffect(() => {
        // Scroll to top immediately
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        // Also scroll to top after a brief delay to handle cases where 
        // content is still loading and affecting layout
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 100);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};