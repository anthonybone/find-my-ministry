import React from 'react';
import { useParams } from 'react-router-dom';

export const ParishDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Parish Detail Page
                    </h1>
                    <p className="text-gray-600">
                        Detailed view for parish ID: {id}
                    </p>
                </div>
            </div>
        </div>
    );
};