import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ministryApi, Ministry } from '../services/api';
import { getMinistryTypeDisplay, formatScheduleDisplay } from '../utils/ministryUtils';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const MinistryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ministry, setMinistry] = useState<Ministry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Ensure page scrolls to top when ministry ID changes
    useScrollToTop([id]);

    useEffect(() => {
        const fetchMinistry = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await ministryApi.getById(id);
                console.log('Ministry data:', data);
                console.log('Parish data:', data.parish);
                setMinistry(data);
            } catch (err: any) {
                console.error('Error fetching ministry:', err);
                setError('Failed to load ministry details');
            } finally {
                setLoading(false);
            }
        };

        fetchMinistry();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const getAgeGroupDisplay = (ageGroups: string[]): string => {
        const ageGroupMap: { [key: string]: string } = {
            'CHILDREN': 'Children (0-12)',
            'TEENAGERS': 'Teenagers (13-17)',
            'YOUNG_ADULTS': 'Young Adults (18-35)',
            'ADULTS': 'Adults (36-64)',
            'SENIORS': 'Seniors (65+)',
            'FAMILIES': 'Families',
            'ALL_AGES': 'All Ages'
        };
        return ageGroups.map(ag => ageGroupMap[ag] || ag).join(', ');
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMinistryBadgeClass = (type: string): string => {
        const badgeClasses: { [key: string]: string } = {
            'YOUTH_MINISTRY': 'bg-green-100 text-green-800',
            'YOUNG_ADULT': 'bg-green-100 text-green-800',
            'ADULT_EDUCATION': 'bg-indigo-100 text-indigo-800',
            'BIBLE_STUDY': 'bg-indigo-100 text-indigo-800',
            'PRAYER_GROUP': 'bg-yellow-100 text-yellow-800',
            'SENIORS_MINISTRY': 'bg-purple-100 text-purple-800',
            'FOOD_PANTRY': 'bg-orange-100 text-orange-800',
            'COMMUNITY_SERVICE': 'bg-orange-100 text-orange-800',
            'SOCIAL_JUSTICE': 'bg-orange-100 text-orange-800',
            'MARRIAGE_FAMILY': 'bg-pink-100 text-pink-800',
            'RCIA': 'bg-indigo-100 text-indigo-800',
            'RELIGIOUS_EDUCATION': 'bg-indigo-100 text-indigo-800',
            'TEST': 'bg-red-100 text-red-800'
        };
        return badgeClasses[type] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !ministry) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ministry Not Found</h1>
                            <p className="text-gray-600">{error || 'The ministry you are looking for could not be found.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="mb-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMinistryBadgeClass(ministry.type)}`}>
                                        {getMinistryTypeDisplay(ministry.type)}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">{ministry.name}</h1>
                                <div className="text-primary-100">
                                    <div className="flex items-center mb-1">
                                        <MapPinIcon className="h-5 w-5 mr-2" />
                                        <Link
                                            to={`/parish-view/${ministry.parish.id}`}
                                            className="text-primary-100 hover:text-white transition-colors font-medium"
                                        >
                                            {ministry.parish.name}
                                        </Link>
                                    </div>
                                    <div className="ml-7 text-sm text-primary-200">
                                        {ministry.parish.address}
                                        <br />
                                        {ministry.parish.city}, {ministry.parish.state} {ministry.parish.zipCode}
                                    </div>
                                </div>
                            </div>
                            {ministry.requiresRegistration && (
                                <div className="ml-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                        Registration Required
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <InformationCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
                                        About This Ministry
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        {ministry.description ? (
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {ministry.description}
                                            </p>
                                        ) : (
                                            <div className="text-gray-500 italic text-center py-4">
                                                <DocumentTextIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                No description provided yet. Contact the ministry for more information.
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Schedule */}
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <ClockIcon className="h-6 w-6 mr-2 text-primary-600" />
                                        Schedule
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        {ministry.schedule && (ministry.schedule.description || ministry.schedule.weekly) ? (
                                            <div className="space-y-3">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {formatScheduleDisplay(ministry.schedule)}
                                                </p>
                                                {ministry.schedule.description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {ministry.schedule.description}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 italic text-center py-4">
                                                <ClockIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                Schedule information will be provided upon contact.
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Requirements & Materials */}
                                {((ministry.requirements && ministry.requirements.length > 0) || (ministry.materials && ministry.materials.length > 0)) && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <CheckCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
                                            Requirements & Materials
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {ministry.requirements && ministry.requirements.length > 0 && (
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h3 className="font-medium text-gray-900 mb-3">Requirements</h3>
                                                    <ul className="space-y-2">
                                                        {ministry.requirements.map((req, index) => (
                                                            <li key={index} className="flex items-start text-sm text-gray-700">
                                                                <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {ministry.materials && ministry.materials.length > 0 && (
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h3 className="font-medium text-gray-900 mb-3">Materials</h3>
                                                    <ul className="space-y-2">
                                                        {ministry.materials.map((material, index) => (
                                                            <li key={index} className="flex items-start text-sm text-gray-700">
                                                                <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                                                {material}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Info */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <UsersIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 block">Age Groups</span>
                                                <span className="text-sm text-gray-600">
                                                    {ministry.ageGroups && ministry.ageGroups.length > 0
                                                        ? getAgeGroupDisplay(ministry.ageGroups)
                                                        : 'All welcome'
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {ministry.languages && ministry.languages.length > 0 && (
                                            <div className="flex items-start">
                                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">Languages</span>
                                                    <span className="text-sm text-gray-600">
                                                        {ministry.languages.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {ministry.maxParticipants && (
                                            <div className="flex items-start">
                                                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">Capacity</span>
                                                    <span className="text-sm text-gray-600">
                                                        {ministry.currentParticipants || 0} / {ministry.maxParticipants} participants
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {ministry.cost && (
                                            <div className="flex items-start">
                                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">Cost</span>
                                                    <span className="text-sm text-gray-600">{ministry.cost}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 block">Accessibility</span>
                                                <span className="text-sm text-gray-600">
                                                    {ministry.isAccessible ? 'Wheelchair accessible' : 'Accessibility unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-4">
                                        {ministry.contactName && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 block">Contact Person</span>
                                                <span className="text-sm text-gray-600">{ministry.contactName}</span>
                                            </div>
                                        )}

                                        {ministry.contactPhone && (
                                            <div className="flex items-center">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                                                <a
                                                    href={`tel:${ministry.contactPhone}`}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    {ministry.contactPhone}
                                                </a>
                                            </div>
                                        )}

                                        {ministry.contactEmail && (
                                            <div className="flex items-center">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                                                <a
                                                    href={`mailto:${ministry.contactEmail}`}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium break-all"
                                                >
                                                    {ministry.contactEmail}
                                                </a>
                                            </div>
                                        )}

                                        {!ministry.contactPhone && !ministry.contactEmail && ministry.contactName && (
                                            <div className="text-center text-gray-500 py-4">
                                                <p className="text-sm">Contact details available through the parish</p>
                                            </div>
                                        )}

                                        {!ministry.contactPhone && !ministry.contactEmail && !ministry.contactName && (
                                            <div className="text-center text-gray-500 py-4">
                                                <PhoneIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm">Contact information available upon request</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Registration Info */}
                                {ministry.requiresRegistration && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <CalendarIcon className="h-5 w-5 text-amber-600 mr-2" />
                                            Registration Details
                                        </h3>
                                        <div className="space-y-3">
                                            {ministry.registrationDeadline && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">Deadline</span>
                                                    <span className="text-sm text-gray-600">
                                                        {formatDate(ministry.registrationDeadline)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-sm text-amber-700">
                                                <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                                                Registration required before participating
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Duration */}
                                {(ministry.startDate || ministry.endDate) && (
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration</h3>
                                        <div className="space-y-2">
                                            {ministry.startDate && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900">Start Date: </span>
                                                    <span className="text-sm text-gray-600">{formatDate(ministry.startDate)}</span>
                                                </div>
                                            )}
                                            {ministry.endDate && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900">End Date: </span>
                                                    <span className="text-sm text-gray-600">{formatDate(ministry.endDate)}</span>
                                                </div>
                                            )}
                                            {ministry.isOngoing && (
                                                <div className="text-sm text-green-600 font-medium">
                                                    <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                                                    Ongoing ministry
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};