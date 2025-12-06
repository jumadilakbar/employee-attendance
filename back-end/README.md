# Backend - Employee Management System

Backend GraphQL API for Employee Management System using NestJS.

## Tech Stack

- **Framework**: NestJS
- **GraphQL**: Apollo Server with @nestjs/graphql
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` file to `.env` and adjust configuration:
```bash
cp env.example .env
```

**Important**: If the database password contains special characters (such as `#`, `@`, `$`, etc.), make sure to wrap it with double quotes in the `.env` file:
```bash
DB_PASSWORD="your#password@here"
```

3. Create PostgreSQL database:
```bash
# Access PostgreSQL
psql -U postgres

# Or if using sudo
sudo -u postgres psql

# Create database
CREATE DATABASE employee_management;

# Exit psql
\q
```

4. Make sure the `.env` file is created and configured correctly:
```bash
cp env.example .env
# Edit .env and adjust database configuration
```

5. Run migrations:
```bash
npm run migration:run
```

6. Run seeders:
```bash
npm run seed:run
```

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Endpoints

- **GraphQL Playground**: http://localhost:9100/graphql
- **Health Check**: http://localhost:9100/health

## Database Seeding

Default seeded data:
- **Users**: 
  - admin@company.com / password123 (ADMIN)
  - employee@company.com / password123 (EMPLOYEE)
- **Employees**: 12 sample employees

## Project Structure

```
back-end/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   └── employees/    # Employees module
│   ├── config/            # Configuration files
│   ├── database/
│   │   ├── migrations/    # Database migrations
│   │   └── seeds/         # Database seeders
│   └── main.ts            # Application entry point
├── .env.example           # Environment variables template
└── package.json
```

## Environment Variables

See `env.example` file for the complete list of required environment variables.

## License

ISC
