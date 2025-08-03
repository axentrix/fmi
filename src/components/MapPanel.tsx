import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Wrapper } from '@googlemaps/react-wrapper';
import type { Community, FilterState } from '../types/dashboard';

interface MapPanelProps {
  communities: Community[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onMapViewChange: (bounds: google.maps.LatLngBounds | null) => void;
}

// Google Maps API Key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA32dQx7QXO4pvxYE_Iq9NnGt9upUPI5Pw';

const MapComponent: React.FC<{ communities: Community[] }> = ({ communities }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<(google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[]>([]);

  useEffect(() => {
    if (map && communities.length > 0) {
      // Clear existing markers
      markers.forEach(marker => {
        if ('map' in marker && marker.map) {
          marker.map = null;
        } else if ('setMap' in marker) {
          marker.setMap(null);
        }
      });
      
      // Create new markers for each community
      const newMarkers = communities.map(community => {
        // Check if AdvancedMarkerElement is available, fallback to regular Marker
        if (google.maps.marker?.AdvancedMarkerElement) {
          // Create a custom marker element
          const markerElement = document.createElement('div');
          markerElement.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#2563eb" stroke="white" stroke-width="2"/>
              <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Avenir, Arial, sans-serif">${community.homes}</text>
            </svg>
          `;
          markerElement.style.cursor = 'pointer';

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: community.coordinates.lat, lng: community.coordinates.lng },
            map: map,
            title: community.community.name,
            content: markerElement
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${community.community.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${community.builder.name}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">~${community.homes} homes</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">${community.community.county}, ${community.community.state}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          return marker;
        } else {
          // Fallback to regular Marker if AdvancedMarkerElement is not available
          const marker = new google.maps.Marker({
            position: { lat: community.coordinates.lat, lng: community.coordinates.lng },
            map: map,
            title: community.community.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#2563eb" stroke="white" stroke-width="2"/>
                  <text x="16" y="21" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="Avenir, Arial, sans-serif">${community.homes}</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${community.community.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${community.builder.name}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">~${community.homes} homes</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">${community.community.county}, ${community.community.state}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          return marker;
        }
      });

      setMarkers(newMarkers);

      // Fit bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          if ('position' in marker && marker.position) {
            bounds.extend(marker.position as google.maps.LatLng);
          } else if ('getPosition' in marker && marker.getPosition()) {
            bounds.extend(marker.getPosition()!);
          }
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, communities]);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  return (
    <div 
      ref={(el) => {
        if (el && !map) {
          const newMap = new google.maps.Map(el, {
            center: { lat: 32.7767, lng: -96.7970 }, // Dallas, TX
            zoom: 6,
            mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });
          onMapLoad(newMap);
        }
      }}
      className="w-full h-full"
    />
  );
};

const MapPanel: React.FC<MapPanelProps> = ({
  communities,
  filters,
  onFiltersChange
}) => {
  const [isMapCollapsed] = useState(false);
  const states = ['Texas', 'Florida', 'California', 'Arizona'];
  const counties = {
    'Texas': ['Dallas County', 'Harris County', 'Travis County', 'Tarrant County'],
    'Florida': ['Miami-Dade County', 'Broward County', 'Palm Beach County'],
    'California': ['Los Angeles County', 'Orange County', 'San Diego County'],
    'Arizona': ['Maricopa County', 'Pima County']
  };

  const statusOptions = ['PRIME', 'RECENT', 'AGED', 'ARCHIVED'];

  const renderMap = (status: 'LOADING' | 'FAILURE' | 'SUCCESS') => {
    switch (status) {
      case 'LOADING':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-sm">
            Loading map...
          </div>
        );
      case 'FAILURE':
        return (
          <div className="flex items-center justify-center h-full bg-red-50 text-red-600 text-sm text-center p-4">
            <div>
              <div className="mb-2">Map Error</div>
              <div className="text-xs">Failed to load Google Maps</div>
              <div className="mt-2 text-xs text-gray-500">
                Communities: {communities.length} locations
              </div>
            </div>
          </div>
        );
      case 'SUCCESS':
        return <MapComponent communities={communities} />;
    }
  };

  return (
    <div className="h-full flex flex-col gap-2 sm:gap-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Toggle Button for Right Panel */}
   

      {/* Right Panel Content - Hidden when collapsed */}
      <div className={`${isMapCollapsed ? 'hidden' : 'block'} lg:block`}>
        {/* Map Section */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4" style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '12px' }}>
          
          {/* Map Container */}
          <div className="h-48 sm:h-64 bg-gray-100 rounded-lg relative overflow-hidden border-2 border-blue-300" style={{ height: '192px', backgroundColor: '#f3f4f6', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '2px solid #93c5fd' }}>
            <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={renderMap} />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mt-2 sm:mt-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter size={16} />
              <span>Filters</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {/* State Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => onFiltersChange({ ...filters, state: e.target.value, county: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-colors"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* County Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">County</label>
                <select
                  value={filters.county}
                  onChange={(e) => onFiltersChange({ ...filters, county: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm ${!filters.state ? 'opacity-50' : ''}`}
                  disabled={!filters.state}
                >
                  <option value="">All Counties</option>
                  {filters.state && counties[filters.state as keyof typeof counties]?.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              {/* Builder Search */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Builder</label>
                <input
                  type="text"
                  value={filters.builder}
                  onChange={(e) => onFiltersChange({ ...filters, builder: e.target.value })}
                  placeholder="Search builders..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-colors placeholder-gray-400"
                />
              </div>

              {/* Status Checkboxes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-col gap-2">
                  {statusOptions.map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...filters.status, status]
                            : filters.status.filter(s => s !== status);
                          onFiltersChange({ ...filters, status: newStatus });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 select-none">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter by Map View */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.filterByMap}
                    onChange={(e) => onFiltersChange({ ...filters, filterByMap: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 select-none">Filter table by map view</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
