/**
 * Ministry utility functions and type definitions
 * 
 * This module provides utilities for:
 * - Ministry type display mapping
 * - Schedule formatting
 * - Placeholder detection  
 * - Sorting operations
 * - String parsing
 * 
 * @author Find My Ministry Team
 * @version 1.0.0
 */

import { MinistryType, Ministry, Parish } from '../services/api';
import { DEV_CONFIG } from './constants';

/**
 * Sorting types and options
 */
export type SortOption = 'name-asc' | 'name-desc' | 'type-asc' | 'type-desc';

export interface SortConfig {
    field: 'name' | 'type';
    direction: 'asc' | 'desc';
}

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
 * 
 * @param type - The ministry type enum value
 * @returns Human-readable string representation
 * 
 * @example
 * getMinistryTypeDisplay('YOUTH_MINISTRY') // returns 'Youth Ministry'
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
    const name = ministry.name.toLowerCase();
    const description = ministry.description?.toLowerCase() || '';

    return DEV_CONFIG.PLACEHOLDER_KEYWORDS.some(keyword =>
        name.includes(keyword) || description.includes(keyword)
    );
};

/**
 * Sort ministries by specified criteria with locale-aware comparison
 * 
 * @param ministries - Array of ministry objects to sort
 * @param sortConfig - Configuration object specifying field and direction
 * @returns New sorted array (does not mutate original)
 * 
 * @example
 * sortMinistries(ministries, { field: 'name', direction: 'asc' })
 */
export const sortMinistries = (ministries: Ministry[], sortConfig: SortConfig): Ministry[] => {
    const sorted = [...ministries].sort((a, b) => {
        let comparison = 0;

        switch (sortConfig.field) {
            case 'name':
                comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                break;
            case 'type':
                const typeA = getMinistryTypeDisplay(a.type);
                const typeB = getMinistryTypeDisplay(b.type);
                comparison = typeA.localeCompare(typeB, undefined, { numeric: true, sensitivity: 'base' });
                break;
            default:
                return 0;
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
};

/**
 * Sort parishes by specified criteria
 */
export const sortParishes = (parishes: Parish[], sortConfig: Omit<SortConfig, 'field'> & { field: 'name' | 'city' }): Parish[] => {
    const sorted = [...parishes].sort((a, b) => {
        let comparison = 0;

        switch (sortConfig.field) {
            case 'name':
                comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                break;
            case 'city':
                comparison = a.city.localeCompare(b.city, undefined, { numeric: true, sensitivity: 'base' });
                break;
            default:
                return 0;
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
};

/**
 * Parse sort option string to sort config
 */
export const parseSortOption = (sortOption: SortOption): SortConfig => {
    const [field, direction] = sortOption.split('-') as [SortConfig['field'], SortConfig['direction']];
    return { field, direction };
};

/**
 * Get display label for sort option
 */
export const getSortOptionLabel = (sortOption: SortOption): string => {
    const labels: Record<SortOption, string> = {
        'name-asc': 'Name (A-Z)',
        'name-desc': 'Name (Z-A)',
        'type-asc': 'Type (A-Z)',
        'type-desc': 'Type (Z-A)'
    };
    return labels[sortOption];
};