import React from 'react';
import { MinistryType } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import { useMinistryData } from '../hooks/useMinistryData';
import { useSearch } from '../hooks/useSearch';
import { useDevMode, useFilters } from '../hooks/useCommon';
import { SearchBar } from '../components/common/SearchBar';
import { ToggleSwitch } from '../components/common/ToggleSwitch';
import { LoadingState, ErrorState } from '../components/common/LoadingStates';
import {
    FunnelIcon
} from '@heroicons/react/24/outline';

export const ListView: React.FC = () => {
    const { searchQuery, setSearchQuery, handleSearch } = useSearch();
    const { isDevMode, toggleDevMode } = useDevMode();

    const initialFilters = {
        type: '' as MinistryType | '',
        ageGroups: [] as string[],
        languages: [] as string[]
    };

    const {
        filters,
        updateFilter,
        resetFilters,
        showFilters,
        toggleFiltersVisibility
    } = useFilters(initialFilters);

    const [showPlaceholders, setShowPlaceholders] = React.useState(false);

    // Keyboard shortcut to toggle dev mode (Ctrl+Shift+D)
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleDevMode();
                console.log('🔧 Dev Mode:', !isDevMode ? 'ENABLED' : 'DISABLED');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isDevMode, toggleDevMode]);

    const { data: ministriesData, isLoading } = useMinistryData({
        includePlaceholders: showPlaceholders
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoadingState message="Loading ministries..." size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Browse Ministries
                    </h1>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <SearchBar
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onSearch={handleSearch}
                                placeholder="Search ministries..."
                                className="w-full"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={toggleFiltersVisibility}
                                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2" />
                                Filters
                            </button>

                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    resetFilters();
                                    setShowPlaceholders(false);
                                }}
                                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Filter Ministries</h3>
                                {isDevMode && (
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            enabled={showPlaceholders}
                                            onToggle={() => setShowPlaceholders(!showPlaceholders)}
                                            label="Show Test Data"
                                        />
                                        <span className="text-xs text-orange-600 font-medium">DEV MODE</span>
                                        <span className="text-xs text-gray-500" title="Press Ctrl+Shift+D to toggle dev mode">
                                            (Ctrl+Shift+D)
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ministry Type
                                    </label>
                                    <select
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                        value={filters.type}
                                        onChange={(e) => updateFilter('type', e.target.value as MinistryType | '')}
                                    >
                                        <option value="">All Types</option>
                                        <option value="YOUTH_MINISTRY">Youth Ministry</option>
                                        <option value="BIBLE_STUDY">Bible Study</option>
                                        <option value="FOOD_PANTRY">Food Pantry</option>
                                        <option value="SENIORS_MINISTRY">Seniors Ministry</option>
                                        <option value="COMMUNITY_SERVICE">Community Service</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Age Group
                                    </label>
                                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">All Ages</option>
                                        <option value="CHILDREN">Children</option>
                                        <option value="TEENAGERS">Teenagers</option>
                                        <option value="YOUNG_ADULTS">Young Adults</option>
                                        <option value="ADULTS">Adults</option>
                                        <option value="SENIORS">Seniors</option>
                                        <option value="FAMILIES">Families</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">All Languages</option>
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="ko">Korean</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600">
                            {ministriesData?.ministries?.length || 0} ministries found
                        </p>
                        <div className="flex items-center gap-4">
                            {!showPlaceholders && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Real ministries only
                                </span>
                            )}
                            {showPlaceholders && isDevMode && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    ⚠️ Including test data
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ministry Grid */}
                {ministriesData?.ministries && ministriesData.ministries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ministriesData.ministries.map((ministry) => (
                            <MinistryCard key={ministry.id} ministry={ministry} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No ministries found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search terms or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                resetFilters();
                                setShowPlaceholders(false);
                            }}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};