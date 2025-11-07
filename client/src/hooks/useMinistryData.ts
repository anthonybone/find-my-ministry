import { useQuery } from 'react-query';
import { ministryApi, parishApi } from '../services/api';

interface UseMinistryDataOptions {
    includePlaceholders?: boolean;
    parishId?: string;
}

export const useMinistryData = (options: UseMinistryDataOptions = {}) => {
    const { includePlaceholders = false, parishId } = options;

    return useQuery(
        ['ministries', { includePlaceholders, parishId }],
        () => ministryApi.getAll({ includePlaceholders, parishId }),
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        }
    );
};

export const useParishData = () => {
    return useQuery(
        'parishes',
        () => parishApi.getAll(),
        {
            staleTime: 10 * 60 * 1000, // 10 minutes
            cacheTime: 20 * 60 * 1000, // 20 minutes
        }
    );
};