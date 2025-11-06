import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Ministry } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import { useMinistryData } from '../hooks/useMinistryData';
import { LoadingState } from '../components/common/LoadingStates';
import { getMinistryTypeDisplay } from '../utils/ministryUtils';
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
        max-height: none !important;
        overflow: visible !important;
    }
    
    .ministry-popup .leaflet-popup-content {
        margin: 0 !important;
        max-height: none !important;
        overflow: visible !important;
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

// Component to handle map events
const MapEventHandler: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
    const map = useMap();

    React.useEffect(() => {
        map.on('click', onMapClick);
        return () => {
            map.off('click', onMapClick);
        };
    }, [map, onMapClick]);

    return null;
};

export const MapView: React.FC = () => {
    const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
    const [selectedParish, setSelectedParish] = useState<string | null>(null);
    const mapRef = useRef<L.Map>(null);

    const { data: ministriesData, isLoading } = useMinistryData({
        includePlaceholders: process.env.NODE_ENV === 'development' && localStorage.getItem('showPlaceholders') === 'true'
    });

    // Calculate unique parishes and ministry counts
    const uniqueParishes = React.useMemo(() => {
        if (!ministriesData?.ministries) return [];
        const parishMap = new Map();
        ministriesData.ministries.forEach(ministry => {
            const parishKey = ministry.parish.id;
            if (!parishMap.has(parishKey)) {
                parishMap.set(parishKey, {
                    ...ministry.parish,
                    ministryCount: 0
                });
            }
            parishMap.get(parishKey).ministryCount++;
        });
        return Array.from(parishMap.values());
    }, [ministriesData]);

    const displayedMinistryCount = React.useMemo(() => {
        if (!selectedParish) {
            return ministriesData?.ministries?.length || 0;
        }
        return ministriesData?.ministries?.filter(m => m.parish.id === selectedParish).length || 0;
    }, [ministriesData, selectedParish]);

    const selectedParishName = React.useMemo(() => {
        if (!selectedParish) return null;
        const parish = uniqueParishes.find(p => p.id === selectedParish);
        return parish?.name || null;
    }, [selectedParish, uniqueParishes]);

    const handleMarkerClick = (ministry: Ministry) => {
        // Set selected parish and zoom to marker when clicked
        setSelectedParish(ministry.parish.id);
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
        setSelectedParish(null);
        if (mapRef.current) {
            mapRef.current.setView(LA_CENTER, 10, {
                animate: true,
                duration: 0.8
            });
        }
    };

    const handleMapClick = () => {
        // Deselect parish when clicking on empty map area
        setSelectedParish(null);
    };

    if (isLoading) {
        return (
            <div className="h-screen">
                <LoadingState message="Loading ministries..." size="lg" />
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
                <MapEventHandler onMapClick={handleMapClick} />
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
                            <Popup maxWidth={400} className="ministry-popup">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-lg text-gray-900 flex-1 pr-2">
                                            {ministry.name}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full whitespace-nowrap font-medium">
                                            {getMinistryTypeDisplay(ministry.type)}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-semibold">📍 {ministry.parish.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            {ministry.parish.address}, {ministry.parish.city}
                                        </div>
                                        {ministry.description && (
                                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-3 border-primary-300 leading-relaxed">
                                                {ministry.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                Ages: {ministry.ageGroups.join(', ')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMinistry(ministry);
                                            }}
                                            className="w-full text-sm bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <span>📋</span>
                                            View Full Details
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Ministry Details Modal */}
            {selectedMinistry && (
                <>
                    {/* Modal Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[1500]"
                        onClick={() => setSelectedMinistry(null)}
                    />

                    {/* Modal Content */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-[1600] mx-4">
                        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📋</span>
                                    <h2 className="text-xl font-bold text-gray-900">Ministry Details</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedMinistry(null)}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                                    title="Close details"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Complete information for this ministry
                            </div>
                        </div>
                        <div className="p-4">
                            <MinistryCard ministry={selectedMinistry} />
                        </div>
                    </div>
                </>
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
                <div className="text-sm text-gray-600 mb-2 space-y-1">
                    <div>
                        <span className="font-medium text-green-600">{displayedMinistryCount}</span> ministries
                        {selectedParish && selectedParishName && (
                            <span className="text-blue-600 font-medium"> in {selectedParishName}</span>
                        )}
                    </div>
                    <div>
                        <span className="font-medium text-blue-600">{uniqueParishes.length}</span> parishes total
                    </div>
                    {selectedParish && (
                        <button
                            onClick={() => setSelectedParish(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Show all ministries
                        </button>
                    )}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                    <div>📍 Click markers to select parish</div>
                    <div>📋 Click "View Details" for full info</div>
                    <div>🗺️ Drag to pan around</div>
                    <div>🔍 Scroll wheel to zoom</div>
                </div>
            </div>
        </div>
    );
};