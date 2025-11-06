import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Search Results
                    </h1>
                    <p className="text-gray-600">
                        Results for: "{query}"
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <p className="text-gray-600">
                        Search results will be displayed here based on the query: {query}
                    </p>
                </div>
            </div>
        </div>
    );
};