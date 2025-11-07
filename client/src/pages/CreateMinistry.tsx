import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ministryApi, parishApi, MinistryType, AgeGroup } from '../services/api';
import { MINISTRY_TYPE_DISPLAY } from '../utils/ministryUtils';

interface CreateMinistryForm {
    name: string;
    description: string;
    type: MinistryType | '';
    ageGroups: AgeGroup[];
    languages: string[];
    schedule: {
        weekly?: {
            day?: string;
            time?: string;
        };
        description?: string;
    };
    startDate?: string;
    endDate?: string;
    isOngoing: boolean;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    requiresRegistration: boolean;
    registrationDeadline?: string;
    maxParticipants?: number;
    isAccessible: boolean;
    requirements: string[];
    materials: string[];
    cost: string;
    parishId: string;
}

const initialFormData: CreateMinistryForm = {
    name: '',
    description: '',
    type: '',
    ageGroups: [],
    languages: ['en'],
    schedule: {
        description: ''
    },
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
};

export const CreateMinistry: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateMinistryForm>(initialFormData);
    const [parishes, setParishes] = useState<any[]>([]);
    const [ministryTypes, setMinistryTypes] = useState<MinistryType[]>([]);
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requirementInput, setRequirementInput] = useState('');
    const [materialInput, setMaterialInput] = useState('');
    const [createdMinistry, setCreatedMinistry] = useState<any | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            // Use allSettled so partial failures don't block rendering of the form
            const results = await Promise.allSettled([
                parishApi.getAll(),
                ministryApi.getTypes(),
                ministryApi.getAgeGroups()
            ]);

            const failures: string[] = [];

            // parishes
            if (results[0].status === 'fulfilled') {
                try {
                    setParishes((results[0].value && results[0].value.parishes) || []);
                } catch (e) {
                    console.error('Error processing parishes response', e);
                    failures.push('parishes');
                }
            } else {
                console.error('Failed to load parishes:', results[0].reason);
                failures.push('parishes');
            }

            // ministry types
            if (results[1].status === 'fulfilled') {
                setMinistryTypes(results[1].value || []);
            } else {
                console.error('Failed to load ministry types:', results[1].reason);
                failures.push('ministry types');
            }

            // age groups
            if (results[2].status === 'fulfilled') {
                setAgeGroups(results[2].value || []);
            } else {
                console.error('Failed to load age groups:', results[2].reason);
                failures.push('age groups');
            }

            if (failures.length > 0) {
                setError(`Some form data failed to load: ${failures.join(', ')}. You can still create a ministry.`);
            } else {
                setError(null);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === 'requiresRegistration' && !checked) {
                // Clear cost field when registration is unchecked
                setFormData(prev => ({ ...prev, [name]: checked, cost: '' }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else if (name === 'schedule.description') {
            setFormData(prev => ({
                ...prev,
                schedule: { ...prev.schedule, description: value }
            }));
        } else if (name === 'schedule.day' || name === 'schedule.time') {
            const scheduleField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                schedule: {
                    ...prev.schedule,
                    weekly: {
                        ...prev.schedule.weekly,
                        [scheduleField]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAgeGroupChange = (ageGroup: AgeGroup) => {
        setFormData(prev => ({
            ...prev,
            ageGroups: prev.ageGroups.includes(ageGroup)
                ? prev.ageGroups.filter(ag => ag !== ageGroup)
                : [...prev.ageGroups, ageGroup]
        }));
    };

    const handleLanguageChange = (language: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter(lang => lang !== language)
                : [...prev.languages, language]
        }));
    };

    const addRequirement = () => {
        if (requirementInput.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirementInput.trim()]
            }));
            setRequirementInput('');
        }
    };

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const addMaterial = () => {
        if (materialInput.trim()) {
            setFormData(prev => ({
                ...prev,
                materials: [...prev.materials, materialInput.trim()]
            }));
            setMaterialInput('');
        }
    };

    const removeMaterial = (index: number) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare the data for submission
            const submitData = {
                ...formData,
                type: formData.type as MinistryType,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                registrationDeadline: formData.registrationDeadline
                    ? new Date(formData.registrationDeadline).toISOString()
                    : undefined,
                maxParticipants: formData.maxParticipants || undefined,
                // Clean up empty schedule
                schedule: formData.schedule.description || formData.schedule.weekly ? formData.schedule : {},
                // Handle cost field - only include if registration is required and cost is provided
                cost: formData.requiresRegistration && formData.cost ? formData.cost : undefined,
                // Add required fields that aren't in the form
                isActive: true,
                isPublic: true,
                currentParticipants: 0
            };

            const newMinistry = await ministryApi.create(submitData);
            setCreatedMinistry(newMinistry);
            setShowSuccess(true);
        } catch (err: any) {
            console.error('Error creating ministry:', err);
            setError(err.response?.data?.details?.map((d: any) => d.message).join(', ') || 'Failed to create ministry');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const ageGroupDisplayNames: Record<AgeGroup, string> = {
        'CHILDREN': 'Children (0-12)',
        'TEENAGERS': 'Teenagers (13-17)',
        'YOUNG_ADULTS': 'Young Adults (18-35)',
        'ADULTS': 'Adults (36-64)',
        'SENIORS': 'Seniors (65+)',
        'FAMILIES': 'Families',
        'ALL_AGES': 'All Ages'
    };

    const commonLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ko', name: 'Korean' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'tl', name: 'Tagalog' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {showSuccess && createdMinistry ? (
                    // Success message
                    <div className="bg-white shadow-xl rounded-lg">
                        <div className="px-6 py-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ministry Created Successfully!</h1>
                            <p className="text-gray-600 mb-8">
                                Your ministry "<strong>{createdMinistry.name}</strong>" has been created and is now available for people to discover.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => navigate(`/ministry/${createdMinistry.id}`, { replace: true })}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                                >
                                    View Ministry
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Create form
                    <div className="bg-white shadow-xl rounded-lg">
                        <div className="px-6 py-8">{/* Existing form content */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">Create New Ministry</h1>
                                <p className="mt-2 text-gray-600">
                                    Add a new ministry to help people in your community find ways to serve and connect.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="text-red-800">{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Basic Information
                                    </h2>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Ministry Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="e.g., Youth Bible Study, Food Pantry Ministry"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Ministry Type *
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">Select ministry type...</option>
                                            {ministryTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {MINISTRY_TYPE_DISPLAY[type]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="parishId" className="block text-sm font-medium text-gray-700 mb-2">
                                            Parish *
                                        </label>
                                        <select
                                            id="parishId"
                                            name="parishId"
                                            value={formData.parishId}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">Select parish...</option>
                                            {parishes.map(parish => (
                                                <option key={parish.id} value={parish.id}>
                                                    {parish.name} - {parish.city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Describe the ministry's purpose, activities, and what participants can expect..."
                                        />
                                    </div>
                                </div>

                                {/* Age Groups */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Target Audience
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Age Groups * (Select all that apply)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {ageGroups.map(ageGroup => (
                                                <label key={ageGroup} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.ageGroups.includes(ageGroup)}
                                                        onChange={() => handleAgeGroupChange(ageGroup)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        {ageGroupDisplayNames[ageGroup]}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Languages * (Select all that apply)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {commonLanguages.map(lang => (
                                                <label key={lang.code} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.languages.includes(lang.code)}
                                                        onChange={() => handleLanguageChange(lang.code)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        {lang.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Schedule Information
                                    </h2>

                                    <div>
                                        <label className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                name="isOngoing"
                                                checked={formData.isOngoing}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                This is an ongoing ministry (no specific end date)
                                            </span>
                                        </label>
                                    </div>

                                    {!formData.isOngoing && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="startDate"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="endDate"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="schedule.description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Schedule Description
                                        </label>
                                        <textarea
                                            id="schedule.description"
                                            name="schedule.description"
                                            rows={2}
                                            value={formData.schedule.description || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="e.g., Every Wednesday at 7:00 PM, First Saturday of each month, etc."
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Contact Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact Person
                                            </label>
                                            <input
                                                type="text"
                                                id="contactName"
                                                name="contactName"
                                                value={formData.contactName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="Ministry leader or contact person"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="contactPhone"
                                                name="contactPhone"
                                                value={formData.contactPhone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="contactEmail"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="ministry@parish.org"
                                        />
                                    </div>
                                </div>

                                {/* Registration & Requirements */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Registration & Requirements
                                    </h2>

                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="requiresRegistration"
                                                checked={formData.requiresRegistration}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Registration required
                                            </span>
                                        </label>

                                        {formData.requiresRegistration && (
                                            <div className="space-y-4 ml-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Registration Deadline
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="registrationDeadline"
                                                            name="registrationDeadline"
                                                            value={formData.registrationDeadline}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Max Participants
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="maxParticipants"
                                                            name="maxParticipants"
                                                            min="1"
                                                            value={formData.maxParticipants || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                            placeholder="Leave empty for unlimited"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cost Information
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="cost"
                                                        name="cost"
                                                        value={formData.cost}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                        placeholder="e.g., Free, $25 per session, Donations welcome"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isAccessible"
                                            checked={formData.isAccessible}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Wheelchair accessible
                                        </span>
                                    </label>
                                </div>

                                {/* Requirements */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={requirementInput}
                                            onChange={(e) => setRequirementInput(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Add a requirement..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addRequirement}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {formData.requirements.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.requirements.map((req, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                                    <span className="text-sm text-gray-700">{req}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRequirement(index)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Materials */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Materials Needed/Provided</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={materialInput}
                                            onChange={(e) => setMaterialInput(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Add materials..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addMaterial}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {formData.materials.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.materials.map((material, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                                    <span className="text-sm text-gray-700">{material}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaterial(index)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Creating...' : 'Create Ministry'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};