import { useState } from 'react';
import { SortOption, SortConfig, parseSortOption } from '../utils';

interface UseSortOptions {
    defaultSort?: SortOption;
}

export const useSort = (options: UseSortOptions = {}) => {
    const { defaultSort = 'name-asc' } = options;
    const [sortOption, setSortOption] = useState<SortOption>(defaultSort);

    const sortConfig: SortConfig = parseSortOption(sortOption);

    const updateSort = (newSortOption: SortOption) => {
        setSortOption(newSortOption);
    };

    return {
        sortOption,
        sortConfig,
        updateSort
    };
};