import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';

export const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

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
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Search ministries, parishes, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
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