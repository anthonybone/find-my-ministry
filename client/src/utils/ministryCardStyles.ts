import { MinistryType } from '../services/api';

/**
 * Ministry type styling utilities for cards and badges
 */

export const getMinistryCardStyle = (type: MinistryType): string => {
    const cardStyles: Record<MinistryType, string> = {
        'YOUTH_MINISTRY': 'border-l-4 border-l-green-400',
        'YOUNG_ADULT': 'border-l-4 border-l-green-400',
        'ADULT_EDUCATION': 'border-l-4 border-l-indigo-400',
        'BIBLE_STUDY': 'border-l-4 border-l-indigo-400',
        'PRAYER_GROUP': 'border-l-4 border-l-yellow-400',
        'CHOIR_MUSIC': 'border-l-4 border-l-purple-400',
        'LITURGICAL_MINISTRY': 'border-l-4 border-l-purple-400',
        'SOCIAL_JUSTICE': 'border-l-4 border-l-orange-400',
        'COMMUNITY_SERVICE': 'border-l-4 border-l-orange-400',
        'FOOD_PANTRY': 'border-l-4 border-l-orange-400',
        'SENIORS_MINISTRY': 'border-l-4 border-l-purple-400',
        'MENS_GROUP': 'border-l-4 border-l-blue-400',
        'WOMENS_GROUP': 'border-l-4 border-l-pink-400',
        'MARRIAGE_FAMILY': 'border-l-4 border-l-pink-400',
        'BEREAVEMENT': 'border-l-4 border-l-gray-400',
        'ADDICTION_RECOVERY': 'border-l-4 border-l-teal-400',
        'RELIGIOUS_EDUCATION': 'border-l-4 border-l-indigo-400',
        'RCIA': 'border-l-4 border-l-indigo-400',
        'CONFIRMATION_PREP': 'border-l-4 border-l-indigo-400',
        'FIRST_COMMUNION_PREP': 'border-l-4 border-l-indigo-400',
        'BAPTISM_PREP': 'border-l-4 border-l-indigo-400',
        'MARRIAGE_PREP': 'border-l-4 border-l-pink-400',
        'KNIGHTS_OF_COLUMBUS': 'border-l-4 border-l-red-400',
        'ALTAR_SOCIETY': 'border-l-4 border-l-purple-400',
        'ST_VINCENT_DE_PAUL': 'border-l-4 border-l-orange-400',
        'PASTORAL_CARE': 'border-l-4 border-l-green-400',
        'HOSPITALITY': 'border-l-4 border-l-yellow-400',
        'MAINTENANCE_GROUNDS': 'border-l-4 border-l-brown-400',
        'FUNDRAISING': 'border-l-4 border-l-emerald-400',
        'RETREAT_MINISTRY': 'border-l-4 border-l-teal-400',
        'MISSION_OUTREACH': 'border-l-4 border-l-orange-400',
        'TEST': 'border-l-4 border-l-red-400',
        'OTHER': 'border-l-4 border-l-gray-400'
    };
    
    return cardStyles[type] || 'border-l-4 border-l-gray-400';
};

export const getMinistryBadgeClass = (type: MinistryType): string => {
    const badgeClasses: Record<MinistryType, string> = {
        'YOUTH_MINISTRY': 'ministry-badge youth',
        'YOUNG_ADULT': 'ministry-badge youth',
        'ADULT_EDUCATION': 'ministry-badge education',
        'BIBLE_STUDY': 'ministry-badge education',
        'PRAYER_GROUP': 'ministry-badge prayer',
        'CHOIR_MUSIC': 'ministry-badge worship',
        'LITURGICAL_MINISTRY': 'ministry-badge worship',
        'SOCIAL_JUSTICE': 'ministry-badge service',
        'COMMUNITY_SERVICE': 'ministry-badge service',
        'FOOD_PANTRY': 'ministry-badge service',
        'SENIORS_MINISTRY': 'ministry-badge seniors',
        'MENS_GROUP': 'ministry-badge fellowship',
        'WOMENS_GROUP': 'ministry-badge fellowship',
        'MARRIAGE_FAMILY': 'ministry-badge family',
        'BEREAVEMENT': 'ministry-badge support',
        'ADDICTION_RECOVERY': 'ministry-badge support',
        'RELIGIOUS_EDUCATION': 'ministry-badge education',
        'RCIA': 'ministry-badge education',
        'CONFIRMATION_PREP': 'ministry-badge education',
        'FIRST_COMMUNION_PREP': 'ministry-badge education',
        'BAPTISM_PREP': 'ministry-badge education',
        'MARRIAGE_PREP': 'ministry-badge family',
        'KNIGHTS_OF_COLUMBUS': 'ministry-badge fellowship',
        'ALTAR_SOCIETY': 'ministry-badge worship',
        'ST_VINCENT_DE_PAUL': 'ministry-badge service',
        'PASTORAL_CARE': 'ministry-badge support',
        'HOSPITALITY': 'ministry-badge fellowship',
        'MAINTENANCE_GROUNDS': 'ministry-badge service',
        'FUNDRAISING': 'ministry-badge service',
        'RETREAT_MINISTRY': 'ministry-badge spiritual',
        'MISSION_OUTREACH': 'ministry-badge service',
        'TEST': 'ministry-badge default',
        'OTHER': 'ministry-badge default'
    };
    
    return badgeClasses[type] || 'ministry-badge default';
};