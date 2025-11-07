import { MinistryType } from '../services/api';

/**
 * Ministry type display mapping utility
 */
export const MINISTRY_TYPE_DISPLAY: Record<MinistryType, string> = {
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
    'TEST': 'Test',
    'OTHER': 'Other'
};

/**
 * Get human-readable display name for ministry type
 */
export const getMinistryTypeDisplay = (type: MinistryType): string => {
    return MINISTRY_TYPE_DISPLAY[type] || type;
};

/**
 * Format ministry schedule display
 */
export const formatScheduleDisplay = (schedule: any): string => {
    if (!schedule) return 'Schedule varies';

    if (typeof schedule === 'string') {
        return schedule;
    }

    if (schedule.days && schedule.time) {
        const days = Array.isArray(schedule.days) ? schedule.days.join(', ') : schedule.days;
        return `${days} at ${schedule.time}`;
    }

    return 'Schedule varies';
};

/**
 * Check if ministry is a placeholder
 */
export const isPlaceholderMinistry = (ministry: { name: string; description?: string }): boolean => {
    const placeholderKeywords = ['placeholder', 'example', 'sample', 'test', 'demo'];
    const name = ministry.name.toLowerCase();
    const description = ministry.description?.toLowerCase() || '';

    return placeholderKeywords.some(keyword =>
        name.includes(keyword) || description.includes(keyword)
    );
};