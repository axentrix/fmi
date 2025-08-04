import React, { useState, useEffect } from 'react';
import Header from './Header';
import DataTable from './DataTable';
import MapPanel from './MapPanel';
import type { Community, FilterState, UserTier } from '../types/dashboard';

// Mock data for demonstration
const mockCommunities: Community[] = [
  {
    id: '1',
    builder: {
      name: 'D.R. Horton',
      logo: 'images/drhorton.png'
    },
    community: {
      name: 'Sunset Meadows',
      county: 'Dallas County',
      state: 'Texas'
    },
    homes: 200,
    lotSize: 0.25,
    dateAdded: '2024-01-15',
    status: 'PRIME',
    creditsRequired: 5,
    pricingFactors: ['PRIME DATA', 'HIGH-VALUE INDUSTRY', 'GROWTH MARKET'],
    coordinates: { lat: 32.7767, lng: -96.7970 }
  },
  {
    id: '2',
    builder: {
      name: 'Lennar',
      logo: 'images/lennar.png'
    },
    community: {
      name: 'Oak Ridge Estates',
      county: 'Harris County',
      state: 'Texas'
    },
    homes: 150,
    lotSize: 0.3,
    dateAdded: '2024-01-10',
    status: 'RECENT',
    creditsRequired: 3,
    pricingFactors: ['RECENT DATA', 'ESTABLISHED MARKET'],
    coordinates: { lat: 29.7604, lng: -95.3698 }
  },
  {
    id: '3',
    builder: {
      name: 'PulteGroup',
      logo: 'images/pulte.png'
    },
    community: {
      name: 'Riverside Gardens',
      county: 'Travis County',
      state: 'Texas'
    },
    homes: 180,
    lotSize: 0.22,
    dateAdded: '2024-01-05',
    status: 'AGED',
    creditsRequired: 2,
    pricingFactors: ['AGED DATA', 'STABLE MARKET'],
    coordinates: { lat: 30.2672, lng: -97.7431 }
  },
  {
    id: '4',
    builder: {
      name: 'KB Home',
      logo: 'images/kbhome.png'
    },
    community: {
      name: 'Mountain View',
      county: 'Tarrant County',
      state: 'Texas'
    },
    homes: 120,
    lotSize: 0.35,
    dateAdded: '2023-12-20',
    status: 'ARCHIVED',
    creditsRequired: 1,
    pricingFactors: ['ARCHIVED DATA', 'MATURE MARKET'],
    coordinates: { lat: 32.7555, lng: -97.3308 }
  }
];

interface DashboardProps {
  userTier: UserTier;
  onTierChange: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userTier, onTierChange }) => {
  const [communities] = useState<Community[]>(mockCommunities);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(mockCommunities);
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    county: '',
    builder: '',
    status: [],
    filterByMap: false
  });
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);



  // Filter communities based on current filters
  useEffect(() => {
    let filtered = [...communities];

    if (filters.state) {
      filtered = filtered.filter(c => c.community.state === filters.state);
    }

    if (filters.county) {
      filtered = filtered.filter(c => c.community.county === filters.county);
    }

    if (filters.builder) {
      filtered = filtered.filter(c => 
        c.builder.name.toLowerCase().includes(filters.builder.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(c => filters.status.includes(c.status));
    }

    setFilteredCommunities(filtered);
  }, [communities, filters]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleUnlock = (communityId: string) => {
    // Handle unlock logic here
    console.log(`Unlocking community ${communityId}`);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleMapViewChange = (bounds: google.maps.LatLngBounds | null) => {
    if (bounds && filters.filterByMap) {
      // Filter communities based on map bounds
      const filtered = communities.filter(community => {
        const lat = community.coordinates.lat;
        const lng = community.coordinates.lng;
        // Create a proper LatLng object
        const latLng = new google.maps.LatLng(lat, lng);
        return bounds.contains(latLng);
      });
      setFilteredCommunities(filtered);
    }
  };

  // Sort communities
  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any, bValue: any;

    switch (sortColumn) {
      case 'builder':
        aValue = a.builder.name;
        bValue = b.builder.name;
        break;
      case 'community':
        aValue = a.community.name;
        bValue = b.community.name;
        break;
      case 'homes':
        aValue = a.homes;
        bValue = b.homes;
        break;
      case 'lotSize':
        aValue = a.lotSize;
        bValue = b.lotSize;
        break;
      case 'dateAdded':
        aValue = new Date(a.dateAdded);
        bValue = new Date(b.dateAdded);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full h-screen flex flex-col bg-gray-50 shadow-2xl">
        {/* Header */}
        <Header 
          userTier={userTier} 
          onTierChange={onTierChange}
          showPanelToggle={true}
          isRightPanelOpen={isRightPanelOpen}
          onTogglePanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />

        {/* Main Content - Responsive Two Panel Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden dashboard-main-content">
          {/* Left Panel - Data Table (Dynamic width based on right panel state) */}
          <div 
            className={`w-full p-4 sm:p-6 overflow-auto border-b lg:border-b-0 bg-white dashboard-left-panel transition-all duration-300 ${
              isRightPanelOpen ? 'lg:w-[70%] lg:border-r border-gray-200' : 'lg:w-full'
            }`}
          >
            {/* Title and Description above Data Table */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">Dashboard</h1>
              <p className="text-gray-500 mt-1 mb-0 text-sm sm:text-base">Professional data analysis workspace</p>
            </div>
            
            <DataTable
              communities={sortedCommunities}
              userTier={userTier}
              onUnlock={handleUnlock}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </div>

          {/* Right Panel - Map & Filters (Toggleable) */}
          {isRightPanelOpen && (
            <div className="w-full lg:w-[30%] p-4 sm:p-6 overflow-auto bg-white dashboard-right-panel transition-all duration-300">
              <MapPanel
                communities={communities}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onMapViewChange={handleMapViewChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
