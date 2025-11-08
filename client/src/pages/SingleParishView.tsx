import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Parish } from '../services/api';
import { ParishCard } from '../components/ParishCard';
import { MinistryCard } from '../components/MinistryCard';
import { useParishData, useMinistryData } from '../hooks/useMinistryData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { LoadingState, ErrorState } from '../components/common/LoadingStates';
import {
    BuildingLibraryIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export const SingleParishView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: parishesData, isLoading, error } = useParishData();
    const { data: ministriesData, isLoading: ministriesLoading } = useMinistryData({ parishId: id });

    // Ensure page scrolls to top when parish ID changes
    useScrollToTop([id]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (isLoading || ministriesLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoadingState message="Loading parish information..." size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <ErrorState
                    message="Failed to load parish. Please try again later."
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    const parishes = parishesData?.parishes || [];
    const parish = parishes.find((p: Parish) => p.id === id);
    const ministries = ministriesData?.ministries || [];

    if (!parish) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back
                        </button>
                    </div>

                    <div className="text-center py-12">
                        <BuildingLibraryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Parish Not Found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            The parish you're looking for could not be found. It may have been removed or the link is incorrect.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>

                {/* Page Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <BuildingLibraryIcon className="h-8 w-8 text-primary-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Parish Information
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Detailed information about {parish.name}
                    </p>
                </div>

                {/* Parish Card - Larger and more prominent */}
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-2xl">
                        <div className="transform scale-105">
                            <ParishCard parish={parish} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-50 px-4 text-sm text-gray-500 font-medium">
                            {ministries.length > 0 ? `${ministries.length} ${ministries.length === 1 ? 'Ministry' : 'Ministries'}` : 'No Ministries'}
                        </span>
                    </div>
                </div>

                {/* Ministries Section */}
                {ministries.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                            Ministries at {parish.name}
                        </h2>
                        <div className="grid gap-4">
                            {ministries.map((ministry) => (
                                <div key={ministry.id} className="transform scale-95 origin-center">
                                    <MinistryCard ministry={ministry} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                            <BuildingLibraryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Ministries Available
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                This parish doesn't have any ministries listed yet. Check back later or contact the parish directly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => navigate('/parishes')}
                                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                                    Browse All Parishes
                                </button>
                                <button
                                    onClick={() => navigate('/list')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Browse All Ministries
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};