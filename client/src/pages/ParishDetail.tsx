import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Parish, parishApi, Ministry } from '../services/api';
import { useScrollToTop } from '../hooks/useScrollToTop';
import {
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    BuildingLibraryIcon,
    UsersIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export const ParishDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [parish, setParish] = useState<Parish | null>(null);
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Ensure page scrolls to top when parish ID changes
    useScrollToTop([id]);

    useEffect(() => {
        const fetchParishData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // Fetch parish details and its ministries
                const [parishData, ministriesData] = await Promise.all([
                    parishApi.getById(id),
                    parishApi.getMinistriesByParish(id)
                ]);

                setParish(parishData);
                setMinistries(ministriesData);
            } catch (err) {
                console.error('Error fetching parish data:', err);
                setError('Failed to load parish information');
            } finally {
                setLoading(false);
            }
        };

        fetchParishData();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading parish details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !parish) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600">{error || 'Parish not found'}</p>
                        <button
                            onClick={handleBack}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Parish Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {parish.name}
                            </h1>
                            {parish.pastor && (
                                <p className="text-lg text-gray-600 mb-2">
                                    Pastor: {parish.pastor}
                                </p>
                            )}
                            <p className="text-sm text-gray-500">
                                Diocese of {parish.diocese.name}
                            </p>
                        </div>
                        <BuildingLibraryIcon className="h-12 w-12 text-primary-600 flex-shrink-0 ml-6" />
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                                    <div className="text-gray-600">
                                        <div>{parish.address}</div>
                                        <div>{parish.city}, {parish.state} {parish.zipCode}</div>
                                    </div>
                                </div>

                                {parish.phone && (
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-600">{parish.phone}</span>
                                    </div>
                                )}

                                {parish.website && (
                                    <div className="flex items-center">
                                        <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <a
                                            href={parish.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:text-primary-800 hover:underline"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {parish.massSchedule && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mass Schedule</h3>
                                <div className="flex items-start">
                                    <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                                    <div className="text-gray-600">
                                        {/* Mass schedule would be displayed here based on the data structure */}
                                        <p>Please contact the parish for current Mass times.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ministries Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Ministries</h2>
                        <div className="flex items-center">
                            <UsersIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <span className="text-gray-600">
                                {ministries.length} {ministries.length === 1 ? 'Ministry' : 'Ministries'}
                            </span>
                        </div>
                    </div>

                    {ministries.length > 0 ? (
                        <div className="space-y-4">
                            {ministries.map((ministry) => (
                                <div
                                    key={ministry.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {ministry.name}
                                            </h3>
                                            {ministry.description && (
                                                <p className="text-gray-600 mb-2">{ministry.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    {ministry.type.replace(/_/g, ' ')}
                                                </span>
                                                {ministry.ageGroups.map((ageGroup) => (
                                                    <span
                                                        key={ageGroup}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        {ageGroup.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                            {ministry.contactName && (
                                                <p className="text-sm text-gray-500">
                                                    Contact: {ministry.contactName}
                                                    {ministry.contactPhone && ` • ${ministry.contactPhone}`}
                                                    {ministry.contactEmail && ` • ${ministry.contactEmail}`}
                                                </p>
                                            )}
                                        </div>
                                        <Link
                                            to={`/ministry/${ministry.id}`}
                                            className="ml-4 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No ministries currently available at this parish.</p>
                        </div>
                    )}

                    {ministries.length > 0 && (
                        <div className="mt-6 text-center">
                            <Link
                                to={`/list?parish=${parish.id}`}
                                className="inline-flex items-center px-6 py-3 border border-primary-300 text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                            >
                                View All Ministries
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};