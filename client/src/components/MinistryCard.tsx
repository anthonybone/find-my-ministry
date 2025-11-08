import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Ministry } from '../services/api';
import {
    getMinistryTypeDisplay,
    formatScheduleDisplay,
    getMinistryCardStyle,
    getMinistryBadgeClass,
    getAgeGroupDisplay
} from '../utils';

interface MinistryCardProps {
    ministry: Ministry;
}

export const MinistryCard: React.FC<MinistryCardProps> = React.memo(({ ministry }) => {
    return (
        <Link
            to={`/ministry/${ministry.id}`}
            className="block group"
        >
            <div className={`ministry-card ${getMinistryCardStyle(ministry.type)} transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02] cursor-pointer`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={getMinistryBadgeClass(ministry.type)}>
                            {getMinistryTypeDisplay(ministry.type)}
                        </span>
                    </div>
                    {ministry.requiresRegistration && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium shadow-sm">
                            Registration Required
                        </span>
                    )}
                </div>

                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors">
                        {ministry.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <Link
                            to={`/parish-view/${ministry.parish.id}`}
                            className="font-medium text-gray-600 hover:text-primary-600 hover:underline transition-colors truncate z-10 relative"
                            onClick={(e) => e.stopPropagation()}
                            title={`View ${ministry.parish.name} parish card`}
                        >
                            {ministry.parish.name}
                        </Link>
                        <span className="mx-1.5 text-gray-400">•</span>
                        <span className="text-gray-500 truncate">
                            {ministry.parish.city}
                        </span>
                    </div>
                </div>

                {ministry.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {ministry.description}
                    </p>
                )}

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{formatScheduleDisplay(ministry.schedule)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{getAgeGroupDisplay(ministry.ageGroups)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        {ministry.contactPhone && (
                            <a
                                href={`tel:${ministry.contactPhone}`}
                                className="text-gray-400 hover:text-primary-600 transition-colors z-10 relative"
                                title="Call"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <PhoneIcon className="h-4 w-4" />
                            </a>
                        )}
                        {ministry.contactEmail && (
                            <a
                                href={`mailto:${ministry.contactEmail}`}
                                className="text-gray-400 hover:text-primary-600 transition-colors z-10 relative"
                                title="Email"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <EnvelopeIcon className="h-4 w-4" />
                            </a>
                        )}
                    </div>

                    <div className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors bg-primary-50 group-hover:bg-primary-100 px-3 py-1.5 rounded-lg">
                        Learn More →
                    </div>
                </div>

                {ministry.languages && ministry.languages.length > 1 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Languages: {ministry.languages.join(', ')}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
});

MinistryCard.displayName = 'MinistryCard';