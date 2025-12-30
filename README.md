# Animal Welfare Incident Reporting Application

A map-based application for reporting animal welfare incidents with an admin dashboard for managing reports.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Leaflet / React-Leaflet** - Interactive maps with OpenStreetMap

## Features

### 🏠 Welcome Page

- Clean, welcoming interface with animal welfare theme
- Brief description of app purpose
- Feature highlights
- Navigation to main features
- Placeholder for future login system

### 🗺️ Interactive Map System

- **Leaflet integration** with OpenStreetMap tiles
- **Click-to-pin functionality** for reporting incidents
- **Report form modal** with:
  - Incident type dropdown (abandoned, injured, abuse, stray, other)
  - Description textarea
  - Photo upload placeholder (for future implementation)
  - Severity level selector (critical/high/medium/low)
  - Optional reporter information
- **Map markers** displaying existing reports
- Color-coded markers based on severity level

### 📊 Admin Dashboard

- **Table/list view** of all submitted reports
- **Priority hierarchy system** (Critical/High/Medium/Low)
- **Filtering by**:
  - Incident type
  - Severity level
  - Date range (all/today/week/month)
  - Status (New/Investigating/Resolved)
- **Action capabilities**:
  - View details
  - Update status
  - Update severity level
  - Expandable rows for quick information access
- **Statistics panel** showing:
  - Total reports
  - Critical incidents count
  - New reports count
  - Resolved reports count

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Footer component
│   │   └── Button.tsx       # Reusable button component
│   ├── greeting/
│   │   ├── WelcomePage.tsx  # Landing page
│   │   └── LoginPlaceholder.tsx  # Login placeholder
│   ├── map/
│   │   ├── IncidentMap.tsx  # Main map component
│   │   ├── MapMarker.tsx    # Map marker component
│   │   └── ReportForm.tsx   # Incident report form
│   └── admin/
│       ├── AdminDashboard.tsx  # Admin dashboard
│       ├── ReportList.tsx      # Report list table
│       └── PriorityBadge.tsx   # Severity badge component
├── pages/
│   ├── HomePage.tsx        # Home page wrapper
│   ├── MapPage.tsx         # Map page wrapper
│   └── AdminPage.tsx       # Admin page wrapper
├── types/
│   └── incident.ts         # TypeScript type definitions
├── utils/
│   ├── mapHelpers.ts       # Map utility functions
│   └── apiMock.ts          # Mock API service (localStorage)
├── App.tsx                 # Main app component with routing
└── main.tsx                # Application entry point
```

## Data Structure

```typescript
interface IncidentReport {
  id: string;
  location: { lat: number; lng: number };
  type: "abandoned" | "injured" | "abuse" | "stray" | "other";
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "new" | "investigating" | "resolved";
  timestamp: Date;
  reporterInfo?: {
    name?: string;
    contact?: string;
  };
  adminNotes?: string[];
}
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Data Storage

The application uses `localStorage` for data persistence. Sample data is automatically initialized when you first visit the admin dashboard. Data persists across browser sessions but is stored locally in your browser.

**Note**: In a production environment, this would be replaced with a real backend API. The mock API service (`src/utils/apiMock.ts`) is structured to make this transition straightforward.

## Routes

- `/` - Welcome/Home page
- `/map` - Interactive map for reporting incidents
- `/admin` - Admin dashboard for managing reports

## Future Enhancements

- User authentication and authorization
- Photo upload functionality
- Real backend API integration
- Email notifications
- Advanced filtering and search
- Export reports functionality
- Mobile app version
- AI chatbot integration for reporting assistance

## Development Notes

- The project uses TypeScript with strict type checking
- Tailwind CSS 4 is used for styling
- Leaflet is used for map functionality with OpenStreetMap tiles
- All components are written in TypeScript with proper type definitions
- The codebase is structured for easy expansion and maintenance

## License

This project is open source and available for use.
