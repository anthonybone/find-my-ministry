import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ministryApi, MinistryType } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import {
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline'; export const ListView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        type: MinistryType | '';
        ageGroups: string[];
        languages: string[];
    }>({
        type: '',
        ageGroups: [],
        languages: []
    });
    const [showFilters, setShowFilters] = useState(false);
    const [showPlaceholders, setShowPlaceholders] = useState(false);
    const [isDevMode, setIsDevMode] = useState(() =>
        process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost' ||
        localStorage.getItem('devMode') === 'true' ||
        new URLSearchParams(window.location.search).get('dev') === 'true'
    );

    // Keyboard shortcut to toggle dev mode (Ctrl+Shift+D)
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                const newDevMode = !localStorage.getItem('devMode') || localStorage.getItem('devMode') !== 'true';
                if (newDevMode) {
                    localStorage.setItem('devMode', 'true');
                } else {
                    localStorage.removeItem('devMode');
                }
                setIsDevMode(newDevMode || process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost');
                console.log('🔧 Dev Mode:', newDevMode ? 'ENABLED' : 'DISABLED');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []); const { data: ministriesData, isLoading } = useQuery(
        ['ministries', searchQuery, filters, showPlaceholders],
        () => ministryApi.getAll({
            query: searchQuery || undefined,
            type: filters.type || undefined,
            ageGroups: filters.ageGroups.length > 0 ? filters.ageGroups : undefined,
            languages: filters.languages.length > 0 ? filters.languages : undefined,
            includePlaceholders: showPlaceholders,
            limit: 50
        }),
        { refetchOnWindowFocus: false }
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The query will automatically refetch due to dependencies
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ministries...</p>
                </div>
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
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Search ministries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2" />
                                Filters
                            </button>

                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilters({ type: '', ageGroups: [], languages: [] });
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
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Show Test Data:</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={showPlaceholders}
                                                onChange={(e) => setShowPlaceholders(e.target.checked)}
                                            />
                                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2 ${showPlaceholders
                                                    ? 'bg-green-500 focus-within:ring-green-500'
                                                    : 'bg-gray-300 focus-within:ring-gray-300'
                                                }`}>
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${showPlaceholders ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </div>
                                        </label>
                                        <span className="text-xs text-orange-600 font-medium">DEV MODE</span>
                                        <span className="text-xs text-gray-500 ml-2" title="Press Ctrl+Shift+D to toggle dev mode">
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
                                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as MinistryType | '' }))}
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
                                setFilters({ type: '', ageGroups: [], languages: [] });
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