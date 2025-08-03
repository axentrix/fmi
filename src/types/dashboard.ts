export interface Community {
  id: string;
  builder: {
    name: string;
    logo: string;
  };
  community: {
    name: string;
    county: string;
    state: string;
  };
  homes: number;
  lotSize: number; // in acres
  dateAdded: string;
  status: 'PRIME' | 'RECENT' | 'AGED' | 'ARCHIVED';
  creditsRequired: number;
  pricingFactors: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MapCluster {
  center: {
    lat: number;
    lng: number;
  };
  communities: number;
  addresses: number;
  label: string;
}

export interface FilterState {
  state: string;
  county: string;
  builder: string;
  status: string[];
  filterByMap: boolean;
}

export type UserTier = 'Basic' | 'Pro' | 'Intelligence'; 