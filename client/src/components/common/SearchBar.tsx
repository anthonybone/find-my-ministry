import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MagnifyingGlassIcon, ClockIcon, MapPinIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { searchApi } from '../../services/api';
import { API_CONFIG } from '../../utils/constants';
import { useDebounce } from '../../hooks';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearch: (e: React.FormEvent) => void;
    placeholder?: string;
    className?: string;
}

interface Suggestion {
    type: string;
    text: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    onSearchChange,
    onSearch,
    placeholder = "Search ministries, parishes, or locations...",
    className = ""
}) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Debounced suggestion fetching
    const debouncedGetSuggestions = useDebounce(async (query: string) => {
        if (query.length >= API_CONFIG.SEARCH_MIN_QUERY_LENGTH) {
            setIsLoading(true);
            try {
                const result = await searchApi.getSuggestions(query);
                setSuggestions(result.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Failed to get suggestions:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, API_CONFIG.SEARCH_DEBOUNCE_MS);

    // Get suggestions when user types
    useEffect(() => {
        debouncedGetSuggestions(searchQuery);
    }, [searchQuery, debouncedGetSuggestions]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onSearchChange(suggestion.text);
        setShowSuggestions(false);
        // Trigger search immediately
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        onSearch(fakeEvent);
    };

    // Memoized suggestion icon function to avoid recreating on each render
    const getSuggestionIcon = useMemo(() => {
        return (type: string) => {
            switch (type) {
                case 'ministry':
                    return <span className="text-sm">⛪</span>;
                case 'parish':
                    return <BuildingLibraryIcon className="h-4 w-4 text-blue-500" />;
                case 'location':
                    return <MapPinIcon className="h-4 w-4 text-green-500" />;
                default:
                    return <ClockIcon className="h-4 w-4 text-gray-400" />;
            }
        };
    }, []);

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={onSearch}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={handleInputFocus}
                    autoComplete="off"
                />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || isLoading) && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {isLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                            Searching...
                        </div>
                    )}

                    {!isLoading && suggestions.length > 0 && (
                        <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                                Suggestions
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-50 last:border-b-0 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        {getSuggestionIcon(suggestion.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {suggestion.text}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {suggestion.type}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}

                    {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            No suggestions found. Try searching for "OLA", "Our Lady", or parish names.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};