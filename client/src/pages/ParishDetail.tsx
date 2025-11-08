import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Parish, parishApi, Ministry } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
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

                {/* Parish Header - Larger and more prominent */}
                <div className="bg-white rounded-lg shadow-xl p-10 mb-8 transform scale-105 origin-center">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                {parish.name}
                            </h1>
                            {parish.pastor && (
                                <p className="text-xl text-gray-600 mb-3">
                                    Pastor: {parish.pastor}
                                </p>
                            )}
                            <p className="text-base text-gray-500">
                                Diocese of {parish.diocese.name}
                            </p>
                        </div>
                        <BuildingLibraryIcon className="h-16 w-16 text-primary-600 flex-shrink-0 ml-6" />
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

                {/* Divider */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-50 px-6 py-2 text-lg text-gray-500 font-medium rounded-full">
                            {ministries.length > 0 ? `${ministries.length} ${ministries.length === 1 ? 'Ministry' : 'Ministries'}` : 'No Ministries'}
                        </span>
                    </div>
                </div>

                {/* Ministries Section */}
                {ministries.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            {ministries.map((ministry) => (
                                <div key={ministry.id} className="transform scale-95 origin-center">
                                    <MinistryCard ministry={ministry} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link
                                to={`/list?parish=${parish.id}`}
                                className="inline-flex items-center px-6 py-3 border border-primary-300 text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                            >
                                View All Ministries
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Ministries Available
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                This parish doesn't have any ministries listed yet. Check back later or contact the parish directly.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};