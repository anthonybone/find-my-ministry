import { AgeGroup } from '../services/api';

/**
 * Age group display utilities
 */

export const AGE_GROUP_DISPLAY: Record<AgeGroup, string> = {
    'CHILDREN': 'Children',
    'TEENAGERS': 'Teenagers',
    'YOUNG_ADULTS': 'Young Adults',
    'ADULTS': 'Adults',
    'SENIORS': 'Seniors',
    'FAMILIES': 'Families',
    'ALL_AGES': 'All Ages'
};

/**
 * Get human-readable display names for age groups
 */
export const getAgeGroupDisplay = (ageGroups: AgeGroup[]): string => {
    return ageGroups
        .map(ag => AGE_GROUP_DISPLAY[ag] || ag)
        .join(', ');
};