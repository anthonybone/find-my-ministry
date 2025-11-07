import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types
export interface Diocese {
    id: string;
    name: string;
    location: string;
    website?: string;
    phone?: string;
    email?: string;
    parishes?: Parish[];
}

export interface Parish {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    website?: string;
    pastor?: string;
    massSchedule?: any;
    diocese: Diocese;
    ministries?: Ministry[];
    _count?: {
        ministries: number;
    };
}

export interface Ministry {
    id: string;
    name: string;
    description?: string;
    type: MinistryType;
    ageGroups: AgeGroup[];
    languages: string[];
    schedule: any;
    startDate?: string;
    endDate?: string;
    isOngoing: boolean;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    requiresRegistration: boolean;
    registrationDeadline?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    isAccessible: boolean;
    requirements: string[];
    materials: string[];
    cost?: string;
    isActive: boolean;
    isPublic: boolean;
    parish: Parish;
}

export type MinistryType =
    | 'YOUTH_MINISTRY'
    | 'YOUNG_ADULT'
    | 'ADULT_EDUCATION'
    | 'BIBLE_STUDY'
    | 'PRAYER_GROUP'
    | 'CHOIR_MUSIC'
    | 'LITURGICAL_MINISTRY'
    | 'SOCIAL_JUSTICE'
    | 'COMMUNITY_SERVICE'
    | 'FOOD_PANTRY'
    | 'SENIORS_MINISTRY'
    | 'MENS_GROUP'
    | 'WOMENS_GROUP'
    | 'MARRIAGE_FAMILY'
    | 'BEREAVEMENT'
    | 'ADDICTION_RECOVERY'
    | 'RELIGIOUS_EDUCATION'
    | 'RCIA'
    | 'CONFIRMATION_PREP'
    | 'FIRST_COMMUNION_PREP'
    | 'BAPTISM_PREP'
    | 'MARRIAGE_PREP'
    | 'KNIGHTS_OF_COLUMBUS'
    | 'ALTAR_SOCIETY'
    | 'ST_VINCENT_DE_PAUL'
    | 'PASTORAL_CARE'
    | 'HOSPITALITY'
    | 'MAINTENANCE_GROUNDS'
    | 'FUNDRAISING'
    | 'RETREAT_MINISTRY'
    | 'MISSION_OUTREACH'
    | 'OTHER';

export type AgeGroup =
    | 'CHILDREN'
    | 'TEENAGERS'
    | 'YOUNG_ADULTS'
    | 'ADULTS'
    | 'SENIORS'
    | 'FAMILIES'
    | 'ALL_AGES';

export interface SearchFilters {
    query?: string;
    type?: MinistryType;
    location?: string;
    parishId?: string;
    ageGroups?: string[];
    languages?: string[];
    includePlaceholders?: boolean;
    limit?: number;
    offset?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

// API Functions
export const ministryApi = {
    getAll: async (filters?: SearchFilters): Promise<{ ministries: Ministry[]; pagination: any }> => {
        const params = new URLSearchParams();
        if (filters?.query) params.append('search', filters.query);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.parishId) params.append('parishId', filters.parishId);
        if (filters?.ageGroups) params.append('ageGroups', filters.ageGroups.join(','));
        if (filters?.languages) params.append('languages', filters.languages.join(','));
        if (filters?.includePlaceholders) params.append('includePlaceholders', filters.includePlaceholders.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const response = await api.get(`/ministries?${params.toString()}`);
        return response.data;
    },

    getById: async (id: string): Promise<Ministry> => {
        const response = await api.get(`/ministries/${id}`);
        return response.data;
    },

    getTypes: async (): Promise<MinistryType[]> => {
        const response = await api.get('/ministries/meta/types');
        return response.data;
    },

    getAgeGroups: async (): Promise<AgeGroup[]> => {
        const response = await api.get('/ministries/meta/age-groups');
        return response.data;
    },

    create: async (ministryData: Omit<Ministry, 'id' | 'createdAt' | 'updatedAt' | 'parish'>): Promise<Ministry> => {
        const response = await api.post('/ministries', ministryData);
        return response.data;
    },

    update: async (id: string, ministryData: Partial<Omit<Ministry, 'id' | 'createdAt' | 'updatedAt' | 'parish'>>): Promise<Ministry> => {
        const response = await api.put(`/ministries/${id}`, ministryData);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/ministries/${id}`);
    }
};

export const parishApi = {
    getAll: async (filters?: { dioceseId?: string; city?: string; search?: string }): Promise<{ parishes: Parish[]; pagination: any }> => {
        const params = new URLSearchParams();
        if (filters?.dioceseId) params.append('dioceseId', filters.dioceseId);
        if (filters?.city) params.append('city', filters.city);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get(`/parishes?${params.toString()}`);
        return response.data;
    },

    getById: async (id: string): Promise<Parish> => {
        const response = await api.get(`/parishes/${id}`);
        return response.data;
    },

    getMinistriesByParish: async (id: string, filters?: SearchFilters): Promise<Ministry[]> => {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.ageGroups) params.append('ageGroups', filters.ageGroups.join(','));
        if (filters?.languages) params.append('languages', filters.languages.join(','));

        const response = await api.get(`/parishes/${id}/ministries?${params.toString()}`);
        return response.data;
    }
};

export const dioceseApi = {
    getAll: async (): Promise<Diocese[]> => {
        const response = await api.get('/dioceses');
        return response.data;
    },

    getById: async (id: string): Promise<Diocese> => {
        const response = await api.get(`/dioceses/${id}`);
        return response.data;
    }
};

export const searchApi = {
    search: async (filters: SearchFilters): Promise<{
        ministries: Ministry[];
        parishes: Parish[];
        totalResults: number;
    }> => {
        const params = new URLSearchParams();
        if (filters.query) params.append('q', filters.query);
        if (filters.type) params.append('type', filters.type);
        if (filters.location) params.append('location', filters.location);
        if (filters.ageGroups) params.append('ageGroups', filters.ageGroups.join(','));
        if (filters.languages) params.append('languages', filters.languages.join(','));
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/search?${params.toString()}`);
        return response.data;
    },

    getSuggestions: async (query: string): Promise<{ suggestions: Array<{ type: string; text: string }> }> => {
        const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
        return response.data;
    }
};

export default api;