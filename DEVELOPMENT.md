# Find My Ministry - Development Setup

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

## Quick Start

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd find-my-ministry
   npm run setup
   ```

2. **Database Setup:**
   - Install and start PostgreSQL
   - Create a database named `find_my_ministry`
   - Copy server environment variables:
     ```bash
     cd server
     cp .env.example .env
     ```
   - Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/find_my_ministry?schema=public"
     ```

3. **Initialize the database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Project Structure

```
find-my-ministry/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── ...
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend API
│   ├── src/
│   │   ├── routes/        # Express routes
│   │   ├── validators/    # Input validation
│   │   └── index.ts       # Main server file
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Sample data
│   └── package.json
└── package.json           # Root package.json for scripts
```

## Features Implemented

### Backend API
- RESTful API with Express.js and TypeScript
- PostgreSQL database with Prisma ORM
- Comprehensive data model for dioceses, parishes, and ministries
- Search and filtering endpoints
- Input validation with Joi
- CORS and security middleware

### Frontend Application  
- React with TypeScript
- Interactive map view using Leaflet/OpenStreetMap
- List view with search and filtering
- Responsive design with Tailwind CSS
- React Query for data fetching
- React Router for navigation

### Database Schema
- **Dioceses**: Archdiocese information
- **Parishes**: Church locations with coordinates
- **Ministries**: Detailed ministry information including:
  - Type, age groups, languages
  - Schedule and contact information
  - Requirements and accessibility
  - Registration details

## Sample Data

The seed script creates sample data for:
- Archdiocese of Los Angeles
- 4+ sample parishes in the LA area with real addresses
- Multiple ministries per parish including:
  - Youth Ministry
  - Bible Study Groups  
  - Food Pantries
  - Senior Ministry
  - RCIA programs
  - Knights of Columbus

## API Endpoints

### Ministries
- `GET /api/ministries` - List all ministries with filtering
- `GET /api/ministries/:id` - Get ministry details
- `GET /api/ministries/meta/types` - Get ministry types
- `GET /api/ministries/meta/age-groups` - Get age groups

### Parishes
- `GET /api/parishes` - List all parishes
- `GET /api/parishes/:id` - Get parish details  
- `GET /api/parishes/:id/ministries` - Get parish ministries

### Search
- `GET /api/search` - Global search across ministries and parishes
- `GET /api/search/suggestions` - Get search suggestions

### Dioceses
- `GET /api/dioceses` - List all dioceses
- `GET /api/dioceses/:id` - Get diocese details

## Environment Variables

### Server (.env)
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/find_my_ministry?schema=public"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
```

### Client (.env.local)
```bash
REACT_APP_API_URL="http://localhost:5000/api"
```

## Development Commands

```bash
# Root level
npm run dev                 # Start both frontend and backend
npm run setup              # Install all dependencies
npm run build              # Build both applications

# Server specific
cd server
npm run dev                # Start backend only
npm run db:migrate         # Run database migrations
npm run db:seed           # Seed sample data
npm run db:studio         # Open Prisma Studio

# Client specific  
cd client
npm start                  # Start frontend only
npm run build             # Build production frontend
```

## Deployment Notes

- Backend can be deployed to platforms like Heroku, Railway, or Vercel
- Frontend can be deployed to Vercel, Netlify, or any static hosting
- Database can use managed PostgreSQL services like Neon, PlanetScale, or AWS RDS
- Environment variables need to be configured for production

## Next Steps for Enhancement

1. **Authentication & Authorization**
   - User registration and login
   - Role-based access (Admin, Parish Admin, User)
   - Ministry management permissions

2. **Enhanced Features**
   - Ministry registration system
   - Calendar integration
   - Email notifications
   - Multi-language support
   - Advanced search with location radius

3. **Admin Panel**
   - Ministry CRUD operations
   - Parish management
   - User management
   - Analytics dashboard

4. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline map caching