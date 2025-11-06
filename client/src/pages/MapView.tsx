import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { useQuery } from 'react-query';
import L from 'leaflet';
import { ministryApi, Ministry } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import {
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon,
    MapIcon,
    HomeIcon
} from '@heroicons/react/24/outline';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom styles for the map
const mapStyles = `
    .custom-ministry-marker {
        background: transparent !important;
        border: none !important;
    }
    
    .ministry-popup .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .ministry-popup .leaflet-popup-tip {
        background: white;
    }
    
    .leaflet-container {
        font-family: inherit;
    }
    
    .custom-zoom-control {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
    }
    
    .custom-zoom-control button {
        transition: all 0.2s ease;
    }
    
    .custom-zoom-control button:hover {
        background-color: #f3f4f6;
        transform: scale(1.05);
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = mapStyles;
    document.head.appendChild(styleSheet);
}
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// LA coordinates
const LA_CENTER: [number, number] = [34.0522, -118.2437];

// Custom map controls component
const MapControls: React.FC<{ onResetView: () => void; onZoomIn: () => void; onZoomOut: () => void }> = ({
    onResetView,
    onZoomIn,
    onZoomOut
}) => {
    return (
        <div className="absolute top-4 left-4 z-[1000] space-y-2">
            {/* Main Controls */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
                    <h3 className="font-semibold text-sm flex items-center text-primary-900">
                        <MapIcon className="h-4 w-4 mr-2" />
                        Map Controls
                    </h3>
                </div>
                <div className="flex flex-col">
                    <button
                        onClick={onZoomIn}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 border-b border-gray-100 group"
                        title="Zoom In (Mouse wheel up)"
                    >
                        <MagnifyingGlassPlusIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        Zoom In
                    </button>
                    <button
                        onClick={onZoomOut}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 border-b border-gray-100 group"
                        title="Zoom Out (Mouse wheel down)"
                    >
                        <MagnifyingGlassMinusIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        Zoom Out
                    </button>
                    <button
                        onClick={onResetView}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group"
                        title="Reset to LA Overview"
                    >
                        <HomeIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        Reset View
                    </button>
                </div>
            </div>

            {/* Instructions Panel */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-3 max-w-[200px]">
                <h4 className="font-medium text-xs text-gray-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    How to Navigate
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        Scroll wheel to zoom
                    </div>
                    <div className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        Drag to pan around
                    </div>
                    <div className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        Click markers for info
                    </div>
                    <div className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        Double-click to zoom
                    </div>
                </div>
            </div>
        </div>
    );
};

// Zoom Level Indicator Component
const ZoomIndicator: React.FC = () => {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());

    useEffect(() => {
        const handleZoomEnd = () => {
            setZoom(map.getZoom());
        };

        map.on('zoomend', handleZoomEnd);
        return () => {
            map.off('zoomend', handleZoomEnd);
        };
    }, [map]);

    const getZoomDescription = (zoomLevel: number) => {
        if (zoomLevel >= 16) return 'Street Level';
        if (zoomLevel >= 14) return 'Neighborhood';
        if (zoomLevel >= 12) return 'District';
        if (zoomLevel >= 10) return 'City View';
        if (zoomLevel >= 8) return 'Region';
        return 'Wide Area';
    };

    return (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 px-3 py-2">
            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Zoom:</span>
                <span className="font-medium text-gray-900">{Math.round(zoom)}</span>
                <span className="text-xs text-gray-500">({getZoomDescription(zoom)})</span>
            </div>
        </div>
    );
};

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
        // Zoom to marker when clicked
        if (mapRef.current) {
            mapRef.current.setView([ministry.parish.latitude, ministry.parish.longitude], 14, {
                animate: true,
                duration: 0.5
            });
        }
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };

    const handleResetView = () => {
        if (mapRef.current) {
            mapRef.current.setView(LA_CENTER, 10, {
                animate: true,
                duration: 0.8
            });
        }
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
                minZoom={8}
                maxZoom={18}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                zoomControl={false} // We'll add custom controls
                scrollWheelZoom={true}
                doubleClickZoom={true}
                dragging={true}
                keyboard={true}
                touchZoom={true}
            >
                <ZoomControl position="bottomright" />
                <ZoomIndicator />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={18}
                />

                {ministriesData?.ministries?.map((ministry) => {
                    // Create custom marker icon based on ministry type
                    const getMarkerColor = (type: string) => {
                        switch (type) {
                            case 'YOUTH_MINISTRY': return '#10B981'; // Green
                            case 'CHOIR_MUSIC': return '#8B5CF6'; // Purple
                            case 'SOCIAL_JUSTICE': return '#F59E0B'; // Orange
                            case 'MISSION_OUTREACH': return '#EF4444'; // Red
                            case 'PASTORAL_CARE': return '#3B82F6'; // Blue
                            case 'LITURGICAL_MINISTRY': return '#6366F1'; // Indigo
                            default: return '#6B7280'; // Gray
                        }
                    };

                    const customIcon = L.divIcon({
                        html: `<div style="background-color: ${getMarkerColor(ministry.type)}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                        className: 'custom-ministry-marker',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    return (
                        <Marker
                            key={ministry.id}
                            position={[ministry.parish.latitude, ministry.parish.longitude]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => handleMarkerClick(ministry),
                            }}
                        >
                            <Popup maxWidth={320} className="ministry-popup">
                                <div className="p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-base text-gray-900 flex-1 pr-2">
                                            {ministry.name}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                                            {ministry.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">📍 {ministry.parish.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {ministry.parish.address}, {ministry.parish.city}
                                        </div>
                                        {ministry.description && (
                                            <p className="text-sm text-gray-700 line-clamp-3">{ministry.description}</p>
                                        )}
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="text-xs text-gray-500">
                                                {ministry.ageGroups.join(', ').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                            <button
                                                onClick={() => setSelectedMinistry(ministry)}
                                                className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 transition-colors font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
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

            {/* Custom Map Controls */}
            <MapControls
                onResetView={handleResetView}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
            />

            {/* Map Info Panel */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
                <h3 className="font-semibold mb-2 text-sm">🗺️ Interactive Map</h3>
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-green-600">{ministriesData?.ministries?.length || 0}</span> ministries found
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                    <div>📍 Click markers for details</div>
                    <div>🖱️ Drag to pan around</div>
                    <div>🔍 Scroll wheel to zoom</div>
                    <div>⌨️ Use +/- keys to zoom</div>
                </div>
            </div>
        </div>
    );
};