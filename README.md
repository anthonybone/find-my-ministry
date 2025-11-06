# Find My Ministry

A comprehensive web application for discovering and managing church ministries throughout a diocese. Built specifically for the LA Diocese with mapping capabilities and detailed ministry information.

## Features

- **Interactive Map View**: Similar to masstimes.org, view ministries on an interactive map
- **List View**: Browse ministries in a structured list format
- **Comprehensive Ministry Data**: Track schedules, types, descriptions, locations, and more
- **Search & Filter**: Find ministries by type, location, schedule, or keywords
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Admin Panel**: Manage ministry data and church information

## Technology Stack

- **Frontend**: React with TypeScript, Leaflet for mapping
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Deployment**: Ready for Docker containerization

## Ministry Data Tracked

- Ministry name and type (e.g., Youth Ministry, Bible Study, Food Pantry)
- Meeting schedule (days, times, frequency)
- Detailed description and requirements
- Church/Parish information and location
- Contact information
- Age groups and target audience
- Special requirements or accessibility info
- Language offerings
- Registration requirements

## Quick Start

1. **Setup the project:**
   ```bash
   npm run setup
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the server directory
   - Configure your database URL and other settings

3. **Initialize the database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
find-my-ministry/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── database/              # Database schemas and migrations
├── docs/                  # Documentation
└── docker/               # Docker configuration
```

## Contributing

Please read our contributing guidelines and submit pull requests to our development branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
A centralized directory app for discovering and managing ministries across parishes in the Archdiocese of Los Angeles. Helps users explore service opportunities, contact ministry leaders, and connect with local faith communities.
