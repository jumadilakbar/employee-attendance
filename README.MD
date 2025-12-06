# Employee Management System

A full-stack Employee Management System built with NestJS (GraphQL) backend and React (Vite) frontend. This system provides comprehensive employee management, attendance tracking, and user management capabilities.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Documentation](#documentation)

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **GraphQL Client**: Apollo Client
- **Routing**: React Router DOM
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

Optional:
- **Redis** (for caching, optional)

## 📁 Project Structure

```
love-emp-test/
├── back-end/              # NestJS GraphQL Backend
│   ├── src/
│   │   ├── modules/      # Feature modules (auth, users, employees, attendance)
│   │   ├── config/       # Configuration files
│   │   ├── database/     # Migrations and seeds
│   │   └── main.ts       # Application entry point
│   ├── docs/             # API documentation
│   └── package.json
│
├── front-end/             # React Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── graphql/      # GraphQL queries and mutations
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and Apollo Client setup
│   └── package.json
│
├── BACKEND_REQUIREMENTS.md
├── FRONTEND_REQUIREMENTS.md
└── README.MD             # This file
```

## 🚀 Setup Instructions

**Important**: Follow the setup order: **Backend first**, then **Frontend**.

### 1. Backend Setup

#### Step 1.1: Navigate to Backend Directory
```bash
cd back-end
```

#### Step 1.2: Install Dependencies
```bash
npm install
```

#### Step 1.3: Configure Environment Variables
```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD="your_password_here"  # Wrap in quotes if contains special characters
DB_DATABASE=employee_management

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=9100
NODE_ENV=development

# GraphQL Configuration
GRAPHQL_PLAYGROUND=true
```

**Important**: If your database password contains special characters (like `#`, `@`, `$`, etc.), wrap it in double quotes:
```env
DB_PASSWORD="your#password@here"
```

#### Step 1.4: Create PostgreSQL Database
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

#### Step 1.5: Run Database Migrations
```bash
npm run migration:run
```

This will create all necessary tables (`users`, `employees`, `attendance`).

#### Step 1.6: Seed Database
```bash
npm run seed:run
```

This will populate the database with:
- Default users (admin and employee accounts)
- Sample employee data
- Sample attendance records

#### Step 1.7: Start Backend Server
```bash
npm run start:dev
```

The backend server will start on **http://localhost:9100**

You can verify it's running by:
- **GraphQL Playground**: http://localhost:9100/graphql
- **Health Check**: http://localhost:9100/health

---

### 2. Frontend Setup

**Note**: Make sure the backend is running before setting up the frontend.

#### Step 2.1: Navigate to Frontend Directory
```bash
# From project root
cd front-end
```

#### Step 2.2: Install Dependencies
```bash
npm install
```

#### Step 2.3: Configure Environment Variables
Create a `.env` or `.env.local` file in the `front-end` directory:

```env
VITE_API_URL=http://localhost:9100/graphql
```

**Note**: 
- Vite uses the `VITE_` prefix for environment variables
- The API URL should match your backend GraphQL endpoint

#### Step 2.4: Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:8081** (or another port if 8081 is occupied)

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd back-end
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
```

### Production Mode

**Backend:**
```bash
cd back-end
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd front-end
npm run build
npm run preview
```

## 🔗 API Endpoints

### Backend Endpoints
- **GraphQL Playground**: http://localhost:9100/graphql
- **GraphQL API**: http://localhost:9100/graphql
- **Health Check**: http://localhost:9100/health

### Frontend
- **Application**: http://localhost:8081

## 🔐 Default Credentials

After running the seeders, you can login with:

### Admin Account
- **Email**: `admin@company.com`
- **Password**: `password123`
- **Role**: ADMIN

### Employee Account
- **Email**: `employee@company.com`
- **Password**: `password123`
- **Role**: EMPLOYEE

## 📚 Documentation

### API Documentation
- **Full API Documentation**: See `back-end/docs/API-Documentation.md`
- **Postman Collection**: `back-end/docs/Employee-Management-API.postman_collection.json`

### Requirements Documentation
- **Backend Requirements**: `BACKEND_REQUIREMENTS.md`
- **Frontend Requirements**: `FRONTEND_REQUIREMENTS.md`

### Backend README
- See `back-end/README.md` for detailed backend setup and configuration

### Frontend README
- See `front-end/README.md` for frontend-specific information

## 🛠 Available Scripts

### Backend Scripts
```bash
npm run start:dev      # Start development server with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run migration:run   # Run database migrations
npm run seed:run       # Seed database with sample data
npm run test           # Run tests
npm run lint           # Run linter
```

### Frontend Scripts
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run linter
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in back-end/.env file
PORT=9101
```

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `employee_management` exists

**Migration errors:**
```bash
# Drop and recreate database if needed
psql -U postgres -c "DROP DATABASE employee_management;"
psql -U postgres -c "CREATE DATABASE employee_management;"
npm run migration:run
```

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on http://localhost:9100
- Check `VITE_API_URL` in frontend `.env` file
- Check CORS configuration in backend `main.ts`

**Port already in use:**
- Vite will automatically use the next available port
- Or specify a different port in `vite.config.ts`

## 📝 Notes

1. **Password with special characters**: Always wrap database passwords containing special characters in double quotes in the `.env` file.

2. **Date Format**: Use `YYYY-MM-DD` format for date fields in attendance.

3. **GraphQL Playground**: Available at http://localhost:9100/graphql for testing queries and mutations.

4. **Environment Variables**: Never commit `.env` files to version control. Use `.env.example` as a template.

## 🤝 Contributing

1. Follow the setup instructions above
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

---

**Need Help?** Check the documentation files or contact the development team.

