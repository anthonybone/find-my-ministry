import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Ministry, Parish } from '../services/api';
import { MinistryCard } from '../components/MinistryCard';
import { ParishCard } from '../components/ParishCard';
import { Link } from 'react-router-dom';
import { useMinistryData, useParishData } from '../hooks/useMinistryData';
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
    .custom-ministry-marker, .custom-parish-marker {
        background: transparent !important;
        border: none !important;
    }
    
    .ministry-popup .leaflet-popup-content-wrapper,
    .parish-popup .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        max-height: none !important;
        overflow: visible !important;
    }
    
    .ministry-popup .leaflet-popup-content,
    .parish-popup .leaflet-popup-content {
        margin: 0 !important;
        max-height: none !important;
        overflow: visible !important;
    }
    
    .ministry-popup .leaflet-popup-tip,
    .parish-popup .leaflet-popup-tip {
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
    const [selectedParish, setSelectedParish] = useState<Parish | null>(null);
    const mapRef = useRef<L.Map>(null);

    const { data: ministriesData, isLoading: isLoadingMinistries } = useMinistryData({
        includePlaceholders: process.env.NODE_ENV === 'development' && localStorage.getItem('showPlaceholders') === 'true'
    });

    const { data: parishesData, isLoading: isLoadingParishes } = useParishData();

    const isLoading = isLoadingMinistries || isLoadingParishes;

    // Calculate unique parishes and ministry counts
    const uniqueParishes = React.useMemo(() => {
        if (!parishesData?.parishes) return [];

        // Get parish ministry counts from ministries data
        const ministryCounts = new Map();
        if (ministriesData?.ministries) {
            ministriesData.ministries.forEach(ministry => {
                const parishId = ministry.parish.id;
                ministryCounts.set(parishId, (ministryCounts.get(parishId) || 0) + 1);
            });
        }

        // Add ministry counts to parishes
        return parishesData.parishes.map(parish => ({
            ...parish,
            ministryCount: ministryCounts.get(parish.id) || 0
        }));
    }, [parishesData, ministriesData]);

    const displayedMinistryCount = React.useMemo(() => {
        if (!selectedParish) {
            return ministriesData?.ministries?.length || 0;
        }
        return ministriesData?.ministries?.filter(m => m.parish.id === selectedParish.id).length || 0;
    }, [ministriesData, selectedParish]);

    const selectedParishName = React.useMemo(() => {
        return selectedParish?.name || null;
    }, [selectedParish]);

    const handleMarkerClick = (parish: Parish) => {
        // Set selected parish and zoom to marker when clicked
        setSelectedParish(parish);
        if (mapRef.current) {
            mapRef.current.setView([parish.latitude, parish.longitude], 14, {
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
            <div className="h-[calc(100vh-4rem)]">
                <LoadingState message="Loading ministries..." size="lg" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] relative">
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

                {uniqueParishes.map((parish) => {
                    // Simple blue dot marker for all parishes (no ministry count)
                    const size = 12;
                    const color = '#3B82F6'; // blue-500

                    const customIcon = L.divIcon({
                        html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.15);"></div>`,
                        className: 'custom-parish-marker',
                        iconSize: [size, size],
                        iconAnchor: [size / 2, size / 2]
                    });

                    return (
                        <Marker
                            key={parish.id}
                            position={[parish.latitude, parish.longitude]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => handleMarkerClick(parish),
                            }}
                        >
                            <Popup maxWidth={400} className="parish-popup">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-lg text-gray-900 flex-1 pr-2">
                                            {parish.name}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap font-medium">
                                            Parish
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-600 font-medium">
                                            📍 {parish.address}, {parish.city}, {parish.state} {parish.zipCode}
                                        </div>
                                        {parish.pastor && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-semibold">Pastor:</span> {parish.pastor}
                                            </div>
                                        )}
                                        {parish.phone && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-semibold">Phone:</span> {parish.phone}
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2 border-t">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedParish(parish);
                                                }}
                                                className="flex-1 text-sm bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                                            >
                                                <span>🏛️</span>
                                                View Parish
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Navigate to list view filtered by this parish
                                                    window.location.href = `/list?parish=${parish.id}`;
                                                }}
                                                className="flex-1 text-sm bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                                            >
                                                <span>📋</span>
                                                View Ministries
                                            </button>
                                        </div>
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
                <h3 className="font-semibold mb-2 text-sm">🗺️ Parish Map</h3>
                <div className="text-sm text-gray-600 mb-2">
                    <div>
                        <span className="font-medium text-blue-600">{uniqueParishes.length}</span> parishes displayed
                    </div>
                    <div>
                        <span className="font-medium text-green-600">{ministriesData?.ministries?.length || 0}</span> ministries total
                    </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div>🏛️ Click markers to view a brief parish summary</div>
                    <div>📋 Use Ministries button in the popup to view ministries</div>
                    <div>🗺️ Drag to pan around</div>
                    <div>🔍 Scroll wheel to zoom</div>
                </div>
            </div>
        </div>
    );
};