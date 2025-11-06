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

interface MinistryCardProps {
    ministry: Ministry;
}

const getMinistryTypeDisplay = (type: string): string => {
    const typeMap: { [key: string]: string } = {
        'YOUTH_MINISTRY': 'Youth Ministry',
        'YOUNG_ADULT': 'Young Adult',
        'ADULT_EDUCATION': 'Adult Education',
        'BIBLE_STUDY': 'Bible Study',
        'PRAYER_GROUP': 'Prayer Group',
        'CHOIR_MUSIC': 'Choir & Music',
        'LITURGICAL_MINISTRY': 'Liturgical Ministry',
        'SOCIAL_JUSTICE': 'Social Justice',
        'COMMUNITY_SERVICE': 'Community Service',
        'FOOD_PANTRY': 'Food Pantry',
        'SENIORS_MINISTRY': 'Seniors Ministry',
        'MENS_GROUP': "Men's Group",
        'WOMENS_GROUP': "Women's Group",
        'MARRIAGE_FAMILY': 'Marriage & Family',
        'BEREAVEMENT': 'Bereavement',
        'ADDICTION_RECOVERY': 'Addiction Recovery',
        'RELIGIOUS_EDUCATION': 'Religious Education',
        'RCIA': 'RCIA',
        'CONFIRMATION_PREP': 'Confirmation Prep',
        'FIRST_COMMUNION_PREP': 'First Communion Prep',
        'BAPTISM_PREP': 'Baptism Prep',
        'MARRIAGE_PREP': 'Marriage Prep',
        'KNIGHTS_OF_COLUMBUS': 'Knights of Columbus',
        'ALTAR_SOCIETY': 'Altar Society',
        'ST_VINCENT_DE_PAUL': 'St. Vincent de Paul',
        'PASTORAL_CARE': 'Pastoral Care',
        'HOSPITALITY': 'Hospitality',
        'MAINTENANCE_GROUNDS': 'Maintenance & Grounds',
        'FUNDRAISING': 'Fundraising',
        'RETREAT_MINISTRY': 'Retreat Ministry',
        'MISSION_OUTREACH': 'Mission & Outreach',
        'OTHER': 'Other'
    };
    return typeMap[type] || type;
};

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

const getScheduleDisplay = (schedule: any): string => {
    if (!schedule) return 'Schedule varies';

    if (schedule.weekly) {
        return `${schedule.weekly.day}s at ${schedule.weekly.time}`;
    }

    if (schedule.monthly) {
        return `${schedule.monthly.day} at ${schedule.monthly.time}`;
    }

    return 'See details for schedule';
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
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <span className={getMinistryBadgeClass(ministry.type)}>
                        {getMinistryTypeDisplay(ministry.type)}
                    </span>
                </div>
                {ministry.requiresRegistration && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Registration Required
                    </span>
                )}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <Link
                    to={`/ministry/${ministry.id}`}
                    className="hover:text-primary-600 transition-colors"
                >
                    {ministry.name}
                </Link>
            </h3>

            {ministry.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ministry.description}
                </p>
            )}

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                        {ministry.parish.name}, {ministry.parish.city}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{getScheduleDisplay(ministry.schedule)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
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
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
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