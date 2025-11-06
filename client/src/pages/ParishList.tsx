import React from 'react';
import { Parish } from '../services/api';
import { ParishCard } from '../components/ParishCard';
import { useParishData } from '../hooks/useMinistryData';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingState, ErrorState } from '../components/common/LoadingStates';
import {
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';

export const ParishList: React.FC = () => {
    const { searchQuery, setSearchQuery, handleSearch } = useSearch();

    const { data: parishesData, isLoading, error } = useParishData();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoadingState message="Loading parishes..." size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <ErrorState
                    message="Failed to load parishes. Please try again later."
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    const parishes = parishesData?.parishes || [];
    const totalParishes = parishesData?.pagination?.total || 0;

    // Filter parishes based on search query
    const filteredParishes = parishes.filter((parish: Parish) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return (
            parish.name.toLowerCase().includes(query) ||
            parish.city.toLowerCase().includes(query) ||
            parish.address.toLowerCase().includes(query) ||
            parish.pastor?.toLowerCase().includes(query) ||
            parish.diocese.name.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <BuildingLibraryIcon className="h-8 w-8 text-primary-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Browse Parishes
                        </h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Explore parishes throughout the Archdiocese of Los Angeles and discover the ministries they offer.
                    </p>

                    {/* Search */}
                    <div className="max-w-md">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSearch={handleSearch}
                            placeholder="Search parishes by name, city, or pastor..."
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Showing {filteredParishes.length} of {totalParishes} parishes
                                </p>
                                {searchQuery && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Filtered by: "{searchQuery}"
                                    </p>
                                )}
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Parish Grid */}
                {filteredParishes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredParishes.map((parish: Parish) => (
                            <ParishCard key={parish.id} parish={parish} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BuildingLibraryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No parishes found' : 'No parishes available'}
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchQuery
                                ? `No parishes match your search for "${searchQuery}". Try adjusting your search terms.`
                                : 'There are currently no parishes available to display.'
                            }
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Show All Parishes
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};