import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from 'react-query';
import L from 'leaflet';
import { ministryApi, Ministry } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// LA coordinates
const LA_CENTER: [number, number] = [34.0522, -118.2437];

export const MapView: React.FC = () => {
    const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
    const mapRef = useRef<L.Map>(null);

    const { data: ministriesData, isLoading } = useQuery(
        'map-ministries',
        () => ministryApi.getAll({
            limit: 100,
            includePlaceholders: process.env.NODE_ENV === 'development' && localStorage.getItem('showPlaceholders') === 'true'
        }),
        { refetchOnWindowFocus: false }
    );

    const handleMarkerClick = (ministry: Ministry) => {
        setSelectedMinistry(ministry);
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ministries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen relative">
            <MapContainer
                center={LA_CENTER}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {ministriesData?.ministries?.map((ministry) => (
                    <Marker
                        key={ministry.id}
                        position={[ministry.parish.latitude, ministry.parish.longitude]}
                        eventHandlers={{
                            click: () => handleMarkerClick(ministry),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-64">
                                <h3 className="font-semibold text-lg mb-1">{ministry.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{ministry.parish.name}</p>
                                <p className="text-sm text-gray-600 mb-2">
                                    {ministry.parish.address}, {ministry.parish.city}
                                </p>
                                {ministry.description && (
                                    <p className="text-sm mb-2 line-clamp-2">{ministry.description}</p>
                                )}
                                <button
                                    onClick={() => setSelectedMinistry(ministry)}
                                    className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Ministry Details Panel */}
            {selectedMinistry && (
                <div className="absolute top-4 right-4 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg z-[1000]">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Ministry Details</h2>
                            <button
                                onClick={() => setSelectedMinistry(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <MinistryCard ministry={selectedMinistry} />
                    </div>
                </div>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
                <h3 className="font-semibold mb-2">Map View</h3>
                <p className="text-sm text-gray-600 mb-2">
                    {ministriesData?.ministries?.length || 0} ministries found
                </p>
                <p className="text-xs text-gray-500">
                    Click on markers to view ministry details
                </p>
            </div>
        </div>
    );
};