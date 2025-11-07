import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    PhoneIcon,
    EnvelopeIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
    BuildingLibraryIcon as ChurchIcon
} from '@heroicons/react/24/outline';
import { Ministry, ministryApi, parishApi, MinistryType, AgeGroup } from '../services/api';
import { getMinistryTypeDisplay, formatScheduleDisplay, MINISTRY_TYPE_DISPLAY } from '../utils/ministryUtils';

interface AdminMinistryCardProps {
    ministry?: Ministry; // Optional for create mode
    onUpdate?: (ministry: Ministry) => void;
    onDelete?: (ministryId: string) => void;
    onCreate?: (ministry: Ministry) => void;
    onCancel?: () => void;
    mode?: 'display' | 'edit' | 'create';
    className?: string;
}

const getAgeGroupDisplay = (ageGroups: string[]): string => {
    const ageGroupMap: { [key: string]: string } = {
        'CHILDREN': 'Children',
        'TEENAGERS': 'Teenagers',
        'YOUNG_ADULTS': 'Young Adults',
        'ADULTS': 'Adults',
        'SENIORS': 'Seniors',
        'FAMILIES': 'Families',
        'ALL_AGES': 'All Ages'
    };
    return ageGroups.map(ag => ageGroupMap[ag] || ag).join(', ');
};

const getMinistryCardStyle = (type: string): string => {
    const cardStyles: { [key: string]: string } = {
        'YOUTH_MINISTRY': 'border-l-4 border-l-green-400',
        'YOUNG_ADULT': 'border-l-4 border-l-green-400',
        'ADULT_EDUCATION': 'border-l-4 border-l-indigo-400',
        'BIBLE_STUDY': 'border-l-4 border-l-indigo-400',
        'PRAYER_GROUP': 'border-l-4 border-l-yellow-400',
        'SENIORS_MINISTRY': 'border-l-4 border-l-purple-400',
        'FOOD_PANTRY': 'border-l-4 border-l-orange-400',
        'COMMUNITY_SERVICE': 'border-l-4 border-l-orange-400',
        'SOCIAL_JUSTICE': 'border-l-4 border-l-orange-400',
        'MARRIAGE_FAMILY': 'border-l-4 border-l-pink-400',
        'RCIA': 'border-l-4 border-l-indigo-400',
        'RELIGIOUS_EDUCATION': 'border-l-4 border-l-indigo-400'
    };
    return cardStyles[type] || 'border-l-4 border-l-gray-400';
};

const getMinistryBadgeClass = (type: string): string => {
    const badgeClasses: { [key: string]: string } = {
        'YOUTH_MINISTRY': 'ministry-badge youth',
        'YOUNG_ADULT': 'ministry-badge youth',
        'ADULT_EDUCATION': 'ministry-badge education',
        'BIBLE_STUDY': 'ministry-badge education',
        'PRAYER_GROUP': 'ministry-badge prayer',
        'SENIORS_MINISTRY': 'ministry-badge seniors',
        'FOOD_PANTRY': 'ministry-badge service',
        'COMMUNITY_SERVICE': 'ministry-badge service',
        'SOCIAL_JUSTICE': 'ministry-badge service',
        'MARRIAGE_FAMILY': 'ministry-badge family',
        'RCIA': 'ministry-badge education',
        'RELIGIOUS_EDUCATION': 'ministry-badge education'
    };
    return badgeClasses[type] || 'ministry-badge default';
};

export const AdminMinistryCard: React.FC<AdminMinistryCardProps> = ({
    ministry,
    onUpdate,
    onDelete,
    onCreate,
    onCancel,
    mode = 'display',
    className = ''
}) => {
    const [currentMode, setCurrentMode] = useState(mode);
    const [loading, setLoading] = useState(false);

    // Edit form state for existing ministry
    const [editData, setEditData] = useState({
        name: ministry?.name || '',
        description: ministry?.description || ''
    });

    // Create form state for new ministry
    const [createData, setCreateData] = useState({
        name: '',
        description: '',
        type: '' as MinistryType | '',
        ageGroups: [] as AgeGroup[],
        languages: ['English'],
        schedule: { description: '' },
        isOngoing: true,
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        requiresRegistration: false,
        isAccessible: true,
        requirements: [] as string[],
        materials: [] as string[],
        cost: '',
        parishId: ''
    });

    // Form options data
    const [parishes, setParishes] = useState<any[]>([]);
    const [ministryTypes, setMinistryTypes] = useState<MinistryType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load form data for create mode
    useEffect(() => {
        if (currentMode === 'create') {
            const loadFormData = async () => {
                try {
                    const [parishesData, typesData, ageGroupsData] = await Promise.all([
                        parishApi.getAll(),
                        ministryApi.getTypes(),
                        ministryApi.getAgeGroups()
                    ]);
                    setParishes(parishesData.parishes || []);
                    setMinistryTypes(typesData);
                    setAgeGroups(ageGroupsData);
                } catch (err) {
                    console.error('Error loading form data:', err);
                    setError('Failed to load form data');
                }
            };
            loadFormData();
        }
    }, [currentMode]);

    // Reset edit data when ministry changes
    useEffect(() => {
        if (ministry) {
            setEditData({
                name: ministry.name,
                description: ministry.description || ''
            });
        }
    }, [ministry]);

    const handleEdit = () => {
        setCurrentMode('edit');
    };

    const handleCancelEdit = () => {
        setCurrentMode('display');
        if (ministry) {
            setEditData({
                name: ministry.name,
                description: ministry.description || ''
            });
        }
    };

    const handleSaveEdit = async () => {
        if (!ministry || !editData.name.trim()) return;

        setLoading(true);
        try {
            const updatedMinistry = await ministryApi.update(ministry.id, {
                name: editData.name.trim(),
                description: editData.description.trim() || undefined
            });
            onUpdate?.(updatedMinistry);
            setCurrentMode('display');
        } catch (error) {
            console.error('Failed to update ministry:', error);
            alert('Failed to update ministry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!ministry) return;

        if (!window.confirm(`Are you sure you want to delete "${ministry.name}"? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            await ministryApi.delete(ministry.id);
            onDelete?.(ministry.id);
        } catch (error) {
            console.error('Failed to delete ministry:', error);
            alert('Failed to delete ministry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!createData.name.trim() || !createData.type || !createData.parishId) {
            setError('Please fill in all required fields (Name, Type, Parish)');
            setLoading(false);
            return;
        }

        try {
            const submitData = {
                ...createData,
                name: createData.name.trim(),
                description: createData.description.trim() || undefined,
                type: createData.type as MinistryType,
                schedule: createData.schedule.description ? createData.schedule : {},
                isActive: true,
                isPublic: true,
                currentParticipants: 0
            };

            const newMinistry = await ministryApi.create(submitData);
            onCreate?.(newMinistry);

            // Reset form
            setCreateData({
                name: '',
                description: '',
                type: '',
                ageGroups: [],
                languages: ['English'],
                schedule: { description: '' },
                isOngoing: true,
                contactName: '',
                contactPhone: '',
                contactEmail: '',
                requiresRegistration: false,
                isAccessible: true,
                requirements: [],
                materials: [],
                cost: '',
                parishId: ''
            });
            setError(null);
        } catch (err: any) {
            console.error('Error creating ministry:', err);
            setError(err.response?.data?.details?.map((d: any) => d.message).join(', ') || 'Failed to create ministry');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCancel = () => {
        setCreateData({
            name: '',
            description: '',
            type: '',
            ageGroups: [],
            languages: ['English'],
            schedule: { description: '' },
            isOngoing: true,
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: [],
            cost: '',
            parishId: ''
        });
        setError(null);
        onCancel?.();
    };

    // CREATE MODE
    if (currentMode === 'create') {
        return (
            <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
                <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <PlusIcon className="h-6 w-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-900">Create New Ministry</h3>
                        </div>
                        <button
                            onClick={handleCreateCancel}
                            className="text-green-600 hover:text-green-800 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ministry Name *
                            </label>
                            <input
                                type="text"
                                value={createData.name}
                                onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="e.g., Youth Bible Study"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <ChurchIcon className="h-4 w-4 inline mr-1" />
                                Parish *
                            </label>
                            <select
                                value={createData.parishId}
                                onChange={(e) => setCreateData(prev => ({ ...prev, parishId: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Select a parish</option>
                                {parishes.map(parish => (
                                    <option key={parish.id} value={parish.id}>
                                        {parish.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={createData.description}
                            onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Brief description of the ministry..."
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ministry Type *
                        </label>
                        <select
                            value={createData.type}
                            onChange={(e) => setCreateData(prev => ({ ...prev, type: e.target.value as MinistryType }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                        >
                            <option value="">Select ministry type</option>
                            {ministryTypes.map(type => (
                                <option key={type} value={type}>
                                    {MINISTRY_TYPE_DISPLAY[type] || type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleCreateCancel}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Create Ministry
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // EDIT MODE
    if (currentMode === 'edit' && ministry) {
        return (
            <div className={`ministry-card ${getMinistryCardStyle(ministry.type)} relative`}>
                <div className="flex items-start justify-between mb-4">
                    <span className={getMinistryBadgeClass(ministry.type)}>
                        {getMinistryTypeDisplay(ministry.type)}
                    </span>
                    {ministry.requiresRegistration && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium shadow-sm">
                            Registration Required
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ministry Name
                        </label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter ministry name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            placeholder="Enter ministry description"
                        />
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="font-medium text-gray-600 truncate">
                            {ministry.parish.name}
                        </span>
                        <span className="mx-1.5 text-gray-400">•</span>
                        <span className="text-gray-500 truncate">
                            {ministry.parish.city}
                        </span>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={loading || !editData.name.trim()}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // DISPLAY MODE
    if (!ministry) {
        return (
            <div className="ministry-card bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center p-8">
                <div className="text-center">
                    <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Ministry not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`ministry-card ${getMinistryCardStyle(ministry.type)} relative group`}>
            {/* Hover overlay with edit and delete buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                    onClick={handleEdit}
                    disabled={loading}
                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                    title="Edit Ministry"
                >
                    <PencilIcon className="h-4 w-4" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    title="Delete Ministry"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>

            <div className="flex items-start justify-between mb-4">
                <span className={getMinistryBadgeClass(ministry.type)}>
                    {getMinistryTypeDisplay(ministry.type)}
                </span>
                {ministry.requiresRegistration && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium shadow-sm">
                        Registration Required
                    </span>
                )}
            </div>

            <Link to={`/ministry/${ministry.id}`} className="block hover:bg-gray-50 -mx-6 -my-6 px-6 py-6 rounded-lg transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {ministry.name}
                </h3>

                {ministry.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {ministry.description}
                    </p>
                )}

                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="font-medium text-gray-600 truncate">
                            {ministry.parish.name}
                        </span>
                        <span className="mx-1.5 text-gray-400">•</span>
                        <span className="text-gray-500 truncate">
                            {ministry.parish.city}
                        </span>
                    </div>

                    {ministry.schedule && Object.keys(ministry.schedule).length > 0 && (
                        <div className="flex items-start text-sm text-gray-500">
                            <ClockIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">
                                {formatScheduleDisplay(ministry.schedule)}
                            </span>
                        </div>
                    )}

                    {ministry.ageGroups && ministry.ageGroups.length > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                            <UsersIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                                {getAgeGroupDisplay(ministry.ageGroups)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        {ministry.contactEmail && (
                            <div className="flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                <span className="text-gray-600 truncate">
                                    {ministry.contactEmail}
                                </span>
                            </div>
                        )}

                        {ministry.contactPhone && (
                            <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                <span className="text-gray-600">
                                    {ministry.contactPhone}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};