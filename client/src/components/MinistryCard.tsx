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
import { getMinistryTypeDisplay, formatScheduleDisplay } from '../utils/ministryUtils';

interface MinistryCardProps {
    ministry: Ministry;
}

const getAgeGroupDisplay = (ageGroups: string[]): string => {
    const ageGroupMap: { [key: string]: string } = {
        'CHILDREN': 'Children',
        'TEENAGERS': 'Teenagers',
        'YOUNG_ADULTS': 'Young Adults',
        'ADULTS': 'Adults',
        'SENIORS': 'Seniors',
        'FAMILIES': 'Families',
        'ALL_AGES': 'All Ages'
    };
    return ageGroups.map(ag => ageGroupMap[ag] || ag).join(', ');
};



const getMinistryCardStyle = (type: string): string => {
    const cardStyles: { [key: string]: string } = {
        'YOUTH_MINISTRY': 'border-l-4 border-l-green-400',
        'YOUNG_ADULT': 'border-l-4 border-l-green-400',
        'ADULT_EDUCATION': 'border-l-4 border-l-indigo-400',
        'BIBLE_STUDY': 'border-l-4 border-l-indigo-400',
        'PRAYER_GROUP': 'border-l-4 border-l-yellow-400',
        'SENIORS_MINISTRY': 'border-l-4 border-l-purple-400',
        'FOOD_PANTRY': 'border-l-4 border-l-orange-400',
        'COMMUNITY_SERVICE': 'border-l-4 border-l-orange-400',
        'SOCIAL_JUSTICE': 'border-l-4 border-l-orange-400',
        'MARRIAGE_FAMILY': 'border-l-4 border-l-pink-400',
        'RCIA': 'border-l-4 border-l-indigo-400',
        'RELIGIOUS_EDUCATION': 'border-l-4 border-l-indigo-400'
    };
    return cardStyles[type] || 'border-l-4 border-l-gray-400';
};

const getMinistryBadgeClass = (type: string): string => {
    const badgeClasses: { [key: string]: string } = {
        'YOUTH_MINISTRY': 'ministry-badge youth',
        'YOUNG_ADULT': 'ministry-badge youth',
        'ADULT_EDUCATION': 'ministry-badge education',
        'BIBLE_STUDY': 'ministry-badge education',
        'PRAYER_GROUP': 'ministry-badge prayer',
        'SENIORS_MINISTRY': 'ministry-badge seniors',
        'FOOD_PANTRY': 'ministry-badge service',
        'COMMUNITY_SERVICE': 'ministry-badge service',
        'SOCIAL_JUSTICE': 'ministry-badge service',
        'MARRIAGE_FAMILY': 'ministry-badge family',
        'RCIA': 'ministry-badge education',
        'RELIGIOUS_EDUCATION': 'ministry-badge education'
    };
    return badgeClasses[type] || 'ministry-badge default';
};

export const MinistryCard: React.FC<MinistryCardProps> = ({ ministry }) => {
    return (
        <div className={`ministry-card ${getMinistryCardStyle(ministry.type)}`}>
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
                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                    <Link
                        to={`/ministry/${ministry.id}`}
                        className="hover:text-primary-600 transition-colors"
                    >
                        {ministry.name}
                    </Link>
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    <span className="font-medium text-gray-600 truncate">
                        {ministry.parish.name}
                    </span>
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
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                            title="Call"
                        >
                            <PhoneIcon className="h-4 w-4" />
                        </a>
                    )}
                    {ministry.contactEmail && (
                        <a
                            href={`mailto:${ministry.contactEmail}`}
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                            title="Email"
                        >
                            <EnvelopeIcon className="h-4 w-4" />
                        </a>
                    )}
                </div>

                <Link
                    to={`/ministry/${ministry.id}`}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg"
                >
                    Learn More →
                </Link>
            </div>

            {ministry.languages && ministry.languages.length > 1 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        Languages: {ministry.languages.join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
};