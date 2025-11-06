import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchApi, Ministry, Parish } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import { LoadingState } from '../components/common/LoadingStates';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    BuildingLibraryIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
    ministries: Ministry[];
    parishes: Parish[];
    totalResults: number;
}

export const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query.trim()) {
            performSearch(query.trim());
        }
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const searchResults = await searchApi.search({ query: searchQuery });
            setResults(searchResults);
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to perform search. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LoadingState message="Searching..." size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <MagnifyingGlassIcon className="h-8 w-8 text-primary-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Search Results
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Results for: <span className="font-semibold text-gray-900">"{query}"</span>
                    </p>
                    {results && (
                        <p className="text-sm text-gray-500 mt-2">
                            Found {results.totalResults} result{results.totalResults !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {results && results.totalResults === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600 mb-4">
                            We couldn't find any ministries or parishes matching "{query}".
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Try searching for:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Ministry types (e.g., "youth", "choir", "bible study")</li>
                                <li>Parish names (e.g., "St. Monica", "Cathedral")</li>
                                <li>Locations (e.g., "Santa Monica", "Downtown LA")</li>
                                <li>Abbreviations (e.g., "OLA" for Our Lady of the Angels)</li>
                            </ul>
                        </div>
                    </div>
                )}

                {results && results.totalResults > 0 && (
                    <div className="space-y-8">
                        {/* Parishes Section */}
                        {results.parishes.length > 0 && (
                            <section>
                                <div className="flex items-center mb-4">
                                    <BuildingLibraryIcon className="h-6 w-6 text-primary-600 mr-2" />
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Parishes ({results.parishes.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.parishes.map((parish) => (
                                        <Link
                                            key={parish.id}
                                            to={`/parish/${parish.id}`}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-primary-300"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                                                    {parish.name}
                                                </h3>
                                                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full whitespace-nowrap">
                                                    Parish
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                                    <span>{parish.address}, {parish.city}</span>
                                                </div>
                                                {parish._count && (
                                                    <div className="text-sm text-gray-500">
                                                        {parish._count.ministries} ministries available
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Ministries Section */}
                        {results.ministries.length > 0 && (
                            <section>
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">⛪</span>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Ministries ({results.ministries.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.ministries.map((ministry) => (
                                        <MinistryCard key={ministry.id} ministry={ministry} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};