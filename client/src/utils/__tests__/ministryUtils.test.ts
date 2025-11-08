import { sortMinistries, sortParishes, parseSortOption } from '../ministryUtils';
import { Ministry, Parish, MinistryType } from '../../services/api';

// Mock data for testing
const mockMinistries: Ministry[] = [
    {
        id: '1',
        name: 'Youth Ministry',
        type: 'YOUTH_MINISTRY' as MinistryType,
        ageGroups: [],
        languages: [],
        schedule: {},
        isOngoing: true,
        requiresRegistration: false,
        isAccessible: true,
        requirements: [],
        materials: [],
        isActive: true,
        isPublic: true,
        parish: {} as Parish
    },
    {
        id: '2',
        name: 'Adult Bible Study',
        type: 'BIBLE_STUDY' as MinistryType,
        ageGroups: [],
        languages: [],
        schedule: {},
        isOngoing: true,
        requiresRegistration: false,
        isAccessible: true,
        requirements: [],
        materials: [],
        isActive: true,
        isPublic: true,
        parish: {} as Parish
    },
    {
        id: '3',
        name: 'Choir Ministry',
        type: 'CHOIR_MUSIC' as MinistryType,
        ageGroups: [],
        languages: [],
        schedule: {},
        isOngoing: true,
        requiresRegistration: false,
        isAccessible: true,
        requirements: [],
        materials: [],
        isActive: true,
        isPublic: true,
        parish: {} as Parish
    }
];

const mockParishes: Parish[] = [
    {
        id: '1',
        name: 'St. Mary Parish',
        address: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        latitude: 34.0522,
        longitude: -118.2437,
        diocese: { id: '1', name: 'Archdiocese of LA', location: 'LA' }
    },
    {
        id: '2',
        name: 'Holy Family Church',
        address: '456 Oak Ave',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        latitude: 34.0722,
        longitude: -118.4437,
        diocese: { id: '1', name: 'Archdiocese of LA', location: 'LA' }
    },
    {
        id: '3',
        name: 'Cathedral of Our Lady',
        address: '789 Pine St',
        city: 'Santa Monica',
        state: 'CA',
        zipCode: '90401',
        latitude: 34.0194,
        longitude: -118.4911,
        diocese: { id: '1', name: 'Archdiocese of LA', location: 'LA' }
    }
];

describe('Sorting Utils', () => {
    describe('parseSortOption', () => {
        it('should parse name-asc correctly', () => {
            const result = parseSortOption('name-asc');
            expect(result).toEqual({ field: 'name', direction: 'asc' });
        });

        it('should parse type-desc correctly', () => {
            const result = parseSortOption('type-desc');
            expect(result).toEqual({ field: 'type', direction: 'desc' });
        });
    });

    describe('sortMinistries', () => {
        it('should sort ministries by name ascending', () => {
            const sorted = sortMinistries(mockMinistries, { field: 'name', direction: 'asc' });
            expect(sorted[0].name).toBe('Adult Bible Study');
            expect(sorted[1].name).toBe('Choir Ministry');
            expect(sorted[2].name).toBe('Youth Ministry');
        });

        it('should sort ministries by name descending', () => {
            const sorted = sortMinistries(mockMinistries, { field: 'name', direction: 'desc' });
            expect(sorted[0].name).toBe('Youth Ministry');
            expect(sorted[1].name).toBe('Choir Ministry');
            expect(sorted[2].name).toBe('Adult Bible Study');
        });

        it('should sort ministries by type ascending', () => {
            const sorted = sortMinistries(mockMinistries, { field: 'type', direction: 'asc' });
            // Should be sorted by the display names: "Bible Study", "Choir & Music", "Youth Ministry"
            expect(sorted[0].type).toBe('BIBLE_STUDY');
            expect(sorted[1].type).toBe('CHOIR_MUSIC');
            expect(sorted[2].type).toBe('YOUTH_MINISTRY');
        });

        it('should not mutate the original array', () => {
            const original = [...mockMinistries];
            sortMinistries(mockMinistries, { field: 'name', direction: 'asc' });
            expect(mockMinistries).toEqual(original);
        });
    });

    describe('sortParishes', () => {
        it('should sort parishes by name ascending', () => {
            const sorted = sortParishes(mockParishes, { field: 'name', direction: 'asc' });
            expect(sorted[0].name).toBe('Cathedral of Our Lady');
            expect(sorted[1].name).toBe('Holy Family Church');
            expect(sorted[2].name).toBe('St. Mary Parish');
        });

        it('should sort parishes by name descending', () => {
            const sorted = sortParishes(mockParishes, { field: 'name', direction: 'desc' });
            expect(sorted[0].name).toBe('St. Mary Parish');
            expect(sorted[1].name).toBe('Holy Family Church');
            expect(sorted[2].name).toBe('Cathedral of Our Lady');
        });

        it('should sort parishes by city ascending', () => {
            const sorted = sortParishes(mockParishes, { field: 'city', direction: 'asc' });
            expect(sorted[0].city).toBe('Beverly Hills');
            expect(sorted[1].city).toBe('Los Angeles');
            expect(sorted[2].city).toBe('Santa Monica');
        });

        it('should not mutate the original array', () => {
            const original = [...mockParishes];
            sortParishes(mockParishes, { field: 'name', direction: 'asc' });
            expect(mockParishes).toEqual(original);
        });
    });
});