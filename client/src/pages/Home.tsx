import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapIcon,
    ListBulletIcon,
    BuildingLibraryIcon as ChurchIcon,
    UsersIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { MinistryCard } from '../components/MinistryCard';
import { useMinistryData, useParishData } from '../hooks/useMinistryData';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/common/SearchBar';

export const Home: React.FC = () => {
    const { searchQuery, setSearchQuery, handleSearch } = useSearch();

    // Fetch recent ministries for homepage (exclude placeholders by default)
    const { data: ministriesData } = useMinistryData({ includePlaceholders: false });

    // Fetch parishes count
    const { data: parishesData } = useParishData();

    const stats = [
        {
            name: 'Active Ministries',
            value: ministriesData?.pagination?.total || 0,
            icon: UsersIcon,
            color: 'text-primary-600'
        },
        {
            name: 'Parishes',
            value: parishesData?.pagination?.total || 0,
            icon: ChurchIcon,
            color: 'text-green-600'
        },
        {
            name: 'Meeting Times',
            value: '200+',
            icon: ClockIcon,
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Find Your Ministry
                        </h1>
                        <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
                            Discover meaningful ways to serve and connect with your faith community
                            throughout the Archdiocese of Los Angeles. Find ministries that match
                            your interests, schedule, and calling.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <SearchBar
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onSearch={handleSearch}
                                placeholder="Search by ministry type, parish, or location..."
                                className="text-lg"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                            <Link
                                to="/map"
                                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <MapIcon className="h-6 w-6 mr-3" />
                                Explore Map View
                            </Link>
                            <Link
                                to="/list"
                                className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-400 transition-colors"
                            >
                                <ListBulletIcon className="h-6 w-6 mr-3" />
                                Browse All Ministries
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => {
                            // Make the first stat (Active Ministries) clickable
                            if (index === 0) {
                                return (
                                    <Link
                                        key={stat.name}
                                        to="/list"
                                        className="text-center group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg p-6 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <stat.icon className={`h-12 w-12 ${stat.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                        </div>
                                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors">{stat.name}</div>
                                    </Link>
                                );
                            }

                            // Make the second stat (Parishes) clickable
                            if (index === 1) {
                                return (
                                    <Link
                                        key={stat.name}
                                        to="/parishes"
                                        className="text-center group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg p-6 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <stat.icon className={`h-12 w-12 ${stat.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                        </div>
                                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors">{stat.name}</div>
                                    </Link>
                                );
                            }

                            // Make the third stat (Meeting Times) clickable
                            if (index === 2) {
                                return (
                                    <Link
                                        key={stat.name}
                                        to="/meeting-times"
                                        className="text-center group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg p-6 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <stat.icon className={`h-12 w-12 ${stat.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                        </div>
                                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors">{stat.name}</div>
                                    </Link>
                                );
                            }

                            // Regular non-clickable stats for other items
                            return (
                                <div key={stat.name} className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <stat.icon className={`h-12 w-12 ${stat.color}`} />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                    </div>
                                    <div className="text-gray-600">{stat.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Featured Ministries */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Ministries
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover opportunities to serve and grow in faith
                        </p>
                    </div>

                    {ministriesData?.ministries && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ministriesData.ministries.slice(0, 6).map((ministry) => (
                                <MinistryCard key={ministry.id} ministry={ministry} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            to="/list"
                            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            View All Ministries
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-gray-600">
                            Find and connect with ministries in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                1. Search & Discover
                            </h3>
                            <p className="text-gray-600">
                                Use our search tools to find ministries by type, location, schedule, or age group
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                2. Explore Details
                            </h3>
                            <p className="text-gray-600">
                                View ministry information, meeting times, contact details, and parish locations
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UsersIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                3. Get Involved
                            </h3>
                            <p className="text-gray-600">
                                Connect directly with ministry leaders and join your faith community
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};