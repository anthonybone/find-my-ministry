import React from 'react';
import { Link } from 'react-router-dom';
import { Parish } from '../services/api';
import {
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    BuildingLibraryIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

interface ParishCardProps {
    parish: Parish;
}

export const ParishCard: React.FC<ParishCardProps> = ({ parish }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {parish.name}
                        </h3>
                        {parish.pastor && (
                            <p className="text-sm text-gray-600 mb-2">
                                Pastor: {parish.pastor}
                            </p>
                        )}
                    </div>
                    <BuildingLibraryIcon className="h-8 w-8 text-primary-600 flex-shrink-0 ml-3" />
                </div>

                {/* Location */}
                <div className="flex items-start mb-4">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                        <div>{parish.address}</div>
                        <div>{parish.city}, {parish.state} {parish.zipCode}</div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                    {parish.phone && (
                        <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{parish.phone}</span>
                        </div>
                    )}
                    {parish.website && (
                        <div className="flex items-center">
                            <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <a
                                href={parish.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-800 hover:underline"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}
                </div>

                {/* Ministry Count */}
                {parish._count?.ministries && (
                    <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                        <UsersIcon className="h-4 w-4 text-primary-600 mr-2" />
                        <span className="text-sm text-gray-700">
                            {parish._count.ministries} {parish._count.ministries === 1 ? 'Ministry' : 'Ministries'}
                        </span>
                    </div>
                )}

                {/* Diocese Info */}
                <div className="text-xs text-gray-500 mb-4">
                    Diocese of {parish.diocese.name}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        to={`/parish/${parish.id}`}
                        className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                        View Details
                    </Link>
                    {parish._count?.ministries && parish._count.ministries > 0 && (
                        <Link
                            to={`/list?parish=${parish.id}`}
                            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            View Ministries
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};