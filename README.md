# Professional Dashboard

A professional data analysis dashboard with a two-panel layout featuring a data table and interactive map.

## Features

- **Two-Panel Layout**: 70% data table, 30% map & filters
- **Real Google Maps**: Interactive map with community markers
- **Data Table**: Sortable columns with expandable rows
- **Filters**: State, county, builder, and status filtering
- **User Tiers**: Basic, Pro, and Intelligence tier features
- **Responsive Design**: Tailwind CSS styling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Maps API Key

To use the real Google Maps functionality, you need to set up a Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API key)
5. Create a `.env` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

## Usage

- **Switch User Tiers**: Use the "Switch Tier" button to test different user levels
- **Sort Data**: Click column headers to sort the data table
- **Expand Rows**: Click the "+" icon to see pricing factors
- **Filter Data**: Use the filters in the right panel
- **Interactive Map**: Click markers to see community details

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Google Maps JavaScript API
- Lucide React Icons
- Vite

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main dashboard layout
│   ├── DataTable.tsx      # Data table component
│   └── MapPanel.tsx       # Map and filters component
├── types/
│   └── dashboard.ts       # TypeScript interfaces
└── App.tsx               # Root component
```
