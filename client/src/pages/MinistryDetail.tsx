import React from 'react';
import { useParams } from 'react-router-dom';

export const MinistryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Ministry Detail Page
                    </h1>
                    <p className="text-gray-600">
                        Detailed view for ministry ID: {id}
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        This page will show comprehensive ministry information including:
                    </p>
                    <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                        <li>Full ministry description and requirements</li>
                        <li>Meeting schedule and location details</li>
                        <li>Contact information and registration process</li>
                        <li>Parish information and directions</li>
                        <li>Age groups, languages, and accessibility info</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};