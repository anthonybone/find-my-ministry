import React from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { SortOption, getSortOptionLabel } from '../../utils';

interface SortDropdownProps {
    value: SortOption;
    onChange: (sortOption: SortOption) => void;
    options: SortOption[];
    className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
    value,
    onChange,
    options,
    className = ''
}) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {getSortOptionLabel(option)}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    );
};

interface SortControlsProps {
    sortOption: SortOption;
    onSortChange: (sortOption: SortOption) => void;
    availableOptions: SortOption[];
    resultCount?: number;
    itemType: 'ministries' | 'parishes';
    className?: string;
}

export const SortControls: React.FC<SortControlsProps> = ({
    sortOption,
    onSortChange,
    availableOptions,
    resultCount,
    itemType,
    className = ''
}) => {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex items-center space-x-4">
                {resultCount !== undefined && (
                    <p className="text-sm text-gray-600">
                        {resultCount} {itemType} found
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                <SortDropdown
                    value={sortOption}
                    onChange={onSortChange}
                    options={availableOptions}
                    className="min-w-[140px]"
                />
            </div>
        </div>
    );
};