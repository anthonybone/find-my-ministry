import React, { useState, useEffect, useMemo } from 'react';
import { MinistryCard } from '../components/MinistryCard';
import { useMinistryData } from '../hooks/useMinistryData';
import { LoadingState, SortControls } from '../components/common';
import { useSort } from '../hooks';
import { Ministry } from '../services/api';
import { sortMinistries, SortOption } from '../utils';
import {
    ClockIcon,
    CalendarDaysIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export const MeetingTimesSearch: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [filteredMinistries, setFilteredMinistries] = useState<Ministry[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const { sortOption, sortConfig, updateSort } = useSort({ defaultSort: 'name-asc' });
    const { data: ministriesData, isLoading } = useMinistryData({ includePlaceholders: false });

    // Sort the filtered ministries
    const sortedFilteredMinistries = useMemo(() => {
        return sortMinistries(filteredMinistries, sortConfig);
    }, [filteredMinistries, sortConfig]);

    const ministrySortOptions: SortOption[] = ['name-asc', 'name-desc', 'type-asc', 'type-desc'];

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    ];

    const timeSlots = [
        '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
    ];

    // Function to parse time and compare
    const parseTime = (timeStr: string) => {
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return null;

        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes; // Convert to minutes for easy comparison
    };

    // Function to check if ministry schedule matches criteria
    const doesMinistryMatch = (ministry: Ministry) => {
        if (!ministry.schedule) return false;

        const schedule = ministry.schedule as any;

        // Check for weekly schedule
        if (schedule.weekly) {
            const ministryDay = schedule.weekly.day;
            const ministryTime = schedule.weekly.time;

            // Day matching
            if (selectedDay && ministryDay) {
                if (ministryDay.toLowerCase() !== selectedDay.toLowerCase()) {
                    return false;
                }
            }

            // Time matching
            if (selectedTime && ministryTime) {
                // Extract start time from range like "7:00 PM - 8:30 PM"
                const timeMatch = ministryTime.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                if (timeMatch) {
                    const ministryStartTime = parseTime(timeMatch[1]);
                    const searchTime = parseTime(selectedTime);

                    if (ministryStartTime && searchTime) {
                        // Allow 1 hour window (60 minutes)
                        const timeDiff = Math.abs(ministryStartTime - searchTime);
                        if (timeDiff > 60) return false;
                    }
                }
            }

            return true;
        }

        // Check for monthly schedule
        if (schedule.monthly) {
            const ministryDay = schedule.monthly.day;

            if (selectedDay && ministryDay) {
                // For monthly schedules like "First Friday", check if it contains the day
                if (!ministryDay.toLowerCase().includes(selectedDay.toLowerCase())) {
                    return false;
                }
            }

            return true;
        }

        // Check for other schedule types if needed
        return false;
    };

    // Handle search
    const handleSearch = () => {
        if (!ministriesData?.ministries) return;

        const filtered = ministriesData.ministries.filter(doesMinistryMatch);
        setFilteredMinistries(filtered);
        setHasSearched(true);
    };

    // Auto-search when date changes (if it's selected)
    useEffect(() => {
        if (selectedDate && ministriesData?.ministries) {
            const date = new Date(selectedDate);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            setSelectedDay(dayName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, ministriesData]);

    // Auto-search when criteria changes
    useEffect(() => {
        if ((selectedTime || selectedDay) && ministriesData?.ministries && hasSearched) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTime, selectedDay, ministriesData, hasSearched]); if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoadingState message="Loading ministries..." size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <ClockIcon className="h-8 w-8 text-purple-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Find Ministries by Meeting Time
                        </h1>
                    </div>

                    <p className="text-gray-600 mb-8">
                        Search for ministries that meet at specific dates and times that work with your schedule.
                    </p>

                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Date Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            {/* Day of Week */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Day of Week
                                </label>
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">Any Day</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <ClockIcon className="h-4 w-4 inline mr-1" />
                                    Preferred Time
                                </label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">Any Time</option>
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={!selectedDay && !selectedTime}
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                Search Ministries
                            </button>
                        </div>

                        {/* Search Criteria Display */}
                        {(selectedDay || selectedTime) && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-700">
                                    <strong>Search Criteria:</strong>
                                    {selectedDay && ` ${selectedDay}`}
                                    {selectedTime && ` at ${selectedTime}`}
                                    {selectedDate && ` (${new Date(selectedDate).toLocaleDateString()})`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                {hasSearched && (
                    <div>
                        {/* Results Header */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    Search Results
                                </h2>
                                <p className="text-sm text-gray-600 sr-only">
                                    Found {sortedFilteredMinistries.length} {sortedFilteredMinistries.length === 1 ? 'ministry' : 'ministries'}
                                    {selectedDay && ` meeting on ${selectedDay}`}
                                    {selectedTime && ` around ${selectedTime}`}
                                </p>
                            </div>
                        </div>

                        <SortControls
                            sortOption={sortOption}
                            onSortChange={updateSort}
                            availableOptions={ministrySortOptions}
                            resultCount={sortedFilteredMinistries.length}
                            itemType="ministries"
                            className="mb-6"
                        />

                        {/* Ministry Grid */}
                        {sortedFilteredMinistries.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedFilteredMinistries.map((ministry) => (
                                    <MinistryCard key={ministry.id} ministry={ministry} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Ministries Found
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-4">
                                    No ministries match your selected time criteria. Try adjusting your search parameters or selecting different times.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedDate('');
                                        setSelectedDay('');
                                        setSelectedTime('');
                                        setFilteredMinistries([]);
                                        setHasSearched(false);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Reset Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Help Text */}
                {!hasSearched && (
                    <div className="mt-8 bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">
                            How to Search
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Select a specific date to automatically set the day of the week</li>
                            <li>• Choose a day of the week to find regular weekly meetings</li>
                            <li>• Pick a preferred time to find ministries meeting around that time</li>
                            <li>• You can combine multiple criteria for more specific results</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};