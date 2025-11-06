import React from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../../hooks/useSearch';
import { SearchBar } from '../common/SearchBar';

export const Navbar: React.FC = () => {
    const { searchQuery, setSearchQuery, handleSearch } = useSearch();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">✝</span>
                            </div>
                            <span className="ml-2 text-xl font-semibold text-gray-900">
                                Find My Ministry
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-8">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSearch={handleSearch}
                            placeholder="Search ministries, parishes, or locations..."
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/map"
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                            <MapIcon className="h-5 w-5 mr-1" />
                            Map View
                        </Link>
                        <Link
                            to="/list"
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                            <ListBulletIcon className="h-5 w-5 mr-1" />
                            List View
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};