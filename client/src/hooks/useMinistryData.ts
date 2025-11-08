import { useQuery } from 'react-query';
import { ministryApi, parishApi } from '../services/api';
import { CACHE_TIMES } from '../utils/constants';

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
            staleTime: CACHE_TIMES.MINISTRIES,
            cacheTime: CACHE_TIMES.MINISTRIES * 2,
        }
    );
};

export const useParishData = () => {
    return useQuery(
        'parishes',
        () => parishApi.getAll(),
        {
            staleTime: CACHE_TIMES.PARISHES,
            cacheTime: CACHE_TIMES.PARISHES * 2,
        }
    );
};