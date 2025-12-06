# Employee Management API Documentation

## Base URL
```
http://localhost:9100
```

## GraphQL Endpoint
```
POST /graphql
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. After login, use the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## GraphQL Queries & Mutations

### 1. Authentication

#### Login
**Query:**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
  }
}
```

**Variables:**
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Note:** The response format returns `access_token` directly within the `login` object.

---

#### Register
**Query:**
```graphql
mutation Register($username: String!, $email: String!, $password: String!, $role: UserRole) {
  register(username: $username, email: $email, password: $password, role: $role) {
    access_token
  }
}
```

**Variables:**
```json
{
  "username": "newuser",
  "email": "newuser@company.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**UserRole Enum:**
- `ADMIN` - Full access
- `EMPLOYEE` - Limited access

---

#### Auth Me (Check Current User Token)
**Query:**
```graphql
query AuthMe {
  authMe {
    id
    username
    email
    role
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{}
```

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "authMe": {
      "id": "user-uuid-here",
      "username": "admin",
      "email": "admin@company.com",
      "role": "ADMIN",
      "createdAt": "2025-12-03T10:00:00.000Z",
      "updatedAt": "2025-12-03T10:00:00.000Z"
    }
  }
}
```

**Note:** This endpoint requires an authentication token. Use it to verify the token and get information about the currently logged-in user.

---

#### Create User (Admin Only)
**Query:**
```graphql
mutation CreateUser($username: String!, $email: String!, $password: String!, $role: UserRole) {
  createUser(username: $username, email: $email, password: $password, role: $role) {
    id
    username
    email
    role
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "username": "newuser",
  "email": "newuser@company.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "createUser": {
      "id": "user-uuid-here",
      "username": "newuser",
      "email": "newuser@company.com",
      "role": "EMPLOYEE",
      "createdAt": "2025-12-03T10:00:00.000Z",
      "updatedAt": "2025-12-03T10:00:00.000Z"
    }
  }
}
```

**Note:** 
- This endpoint requires authentication with `ADMIN` role.
- Use this endpoint to create a user before creating an employee associated with that user.
- After the user is created, use the `id` from the response to create an employee with the `userId` field.

---

### 2. Employees

#### List All Employees
**Query:**
```graphql
query ListEmployees {
  employees {
    id
    userId
    fullName
    age
    class
    subjects
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{}
```

**Response:**
```json
{
  "data": {
    "employees": [
      {
        "id": "uuid-here",
        "userId": "user-uuid-here",
        "fullName": "Sarah Johnson",
        "age": 32,
        "class": "Senior",
        "subjects": ["Mathematics", "Physics"],
        "createdAt": "2025-12-03T10:00:00.000Z",
        "updatedAt": "2025-12-03T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### List Employees with Filter, Sort, and Pagination
**Query:**
```graphql
query ListEmployees(
  $filter: EmployeeFilter
  $sort: SortInput
  $page: Int
  $limit: Int
) {
  employees(filter: $filter, sort: $sort, page: $page, limit: $limit) {
    id
    userId
    fullName
    age
    class
    subjects
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "filter": {
    "fullName": "Sarah",
    "class": "Senior",
    "age": 32
  },
  "sort": {
    "field": "fullName",
    "order": "ASC"
  },
  "page": 1,
  "limit": 10
}
```

**EmployeeFilter Input:**
- `userId: String` - Filter by user ID
- `fullName: String` - Filter by full name (partial match)
- `age: Int` - Filter by exact age
- `class: String` - Filter by class
- `subject: String` - Filter by subject (contains in subjects array)

**SortInput:**
- `field: String` (optional) - Field to sort by. **Only sortable fields: "fullName", "age", "class"**
- `order: SortOrder` (optional) - Sort order: `ASC` or `DESC` (default: `ASC`)

**Pagination Parameters:**
- `page: Int` (optional, default: 1) - Page number (1-based)
- `limit: Int` (optional, default: 10) - Number of items per page

**Note:** Sorting is only available for fields `fullName`, `age`, and `class`. Other fields such as `createdAt`, `updatedAt`, `subjects` cannot be sorted.

---

#### Get Employees Pagination Info
**Query:**
```graphql
query EmployeesPagination(
  $filter: EmployeeFilter
  $page: Int
  $limit: Int
) {
  employeesPagination(filter: $filter, page: $page, limit: $limit) {
    totalCount
    totalPages
    currentPage
    limit
    hasNextPage
    hasPreviousPage
  }
}
```

**Variables:**
```json
{
  "filter": {
    "fullName": "Sarah"
  },
  "page": 1,
  "limit": 10
}
```

**Response:**
```json
{
  "data": {
    "employeesPagination": {
      "totalCount": 25,
      "totalPages": 3,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "employees": [
      {
        "id": "uuid-here",
        "userId": "user-uuid-here",
        "fullName": "Sarah Johnson",
        "age": 32,
        "class": "Senior",
        "subjects": ["Mathematics", "Physics"],
        "createdAt": "2025-12-03T10:00:00.000Z",
        "updatedAt": "2025-12-03T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### Get Employee by ID
**Query:**
```graphql
query GetEmployee($id: String!) {
  employee(id: $id) {
    id
    userId
    fullName
    age
    class
    subjects
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "employee-uuid-here"
}
```

**Response:**
```json
{
  "data": {
    "employee": {
      "id": "uuid-here",
      "userId": "user-uuid-here",
      "fullName": "Sarah Johnson",
      "age": 32,
      "class": "Senior",
      "subjects": ["Mathematics", "Physics"],
      "createdAt": "2025-12-03T10:00:00.000Z",
      "updatedAt": "2025-12-03T10:00:00.000Z"
    }
  }
}
```

---

#### Create Employee (Admin Only)
**Query:**
```graphql
mutation CreateEmployee($input: EmployeeInput!) {
  createEmployee(input: $input) {
    id
    userId
    fullName
    age
    class
    subjects
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "userId": "user-uuid-here",
    "fullName": "John Doe",
    "age": 30,
    "class": "Mid",
    "subjects": ["Software Development", "System Design"]
  }
}
```

**EmployeeInput Fields:**
- `userId: String` - Optional, link to user ID
- `fullName: String!` - Required, full name
- `age: Int` - Optional, age
- `class: String` - Optional, class/level
- `subjects: [String!]` - Optional, array of subjects/skills

**Response:**
```json
{
  "data": {
    "createEmployee": {
      "id": "new-uuid-here",
      "userId": "user-uuid-here",
      "fullName": "John Doe",
      "age": 30,
      "class": "Mid",
      "subjects": ["Software Development", "System Design"],
      "createdAt": "2025-12-03T10:00:00.000Z",
      "updatedAt": "2025-12-03T10:00:00.000Z"
    }
  }
}
```

---

#### Update Employee (Admin Only)
**Query:**
```graphql
mutation UpdateEmployee($id: String!, $input: EmployeeUpdateInput!) {
  updateEmployee(id: $id, input: $input) {
    id
    userId
    fullName
    age
    class
    subjects
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "employee-uuid-here",
  "input": {
    "fullName": "John Doe Updated",
    "age": 31,
    "class": "Senior"
  }
}
```

**EmployeeUpdateInput:** All fields are optional, same as EmployeeInput

**Response:**
```json
{
  "data": {
    "updateEmployee": {
      "id": "uuid-here",
      "userId": "user-uuid-here",
      "fullName": "John Doe Updated",
      "age": 31,
      "class": "Senior",
      "subjects": ["Software Development", "System Design"],
      "updatedAt": "2025-12-03T11:00:00.000Z"
    }
  }
}
```

---

#### Delete Employee (Admin Only)
**Query:**
```graphql
mutation DeleteEmployee($id: String!) {
  deleteEmployee(id: $id)
}
```

**Variables:**
```json
{
  "id": "employee-uuid-here"
}
```

**Response:**
```json
{
  "data": {
    "deleteEmployee": true
  }
}
```

---

### 2.5. Employee Statistics

#### Get Employee Statistics
**Query:**
```graphql
query EmployeeStatistics {
  employeeStatistics {
    totalEmployees
    activeEmployees
    avgAttendance
    onLeave
  }
}
```

**Variables:**
```json
{}
```

**Response:**
```json
{
  "data": {
    "employeeStatistics": {
      "totalEmployees": 25,
      "activeEmployees": 25,
      "avgAttendance": 85,
      "onLeave": 3
    }
  }
}
```

**Note:** 
- `totalEmployees`: Total count of all employees in the database
- `activeEmployees`: Number of active employees (currently all employees are considered active)
- `avgAttendance`: Average attendance percentage of all employees (in percentage)
- `onLeave`: Number of employees with ABSENT or EXCUSED status in the last 7 days

---

### 3. Attendance

#### List Attendance
**Query:**
```graphql
query ListAttendance(
  $filter: AttendanceFilter
  $sort: SortInput
  $page: Int
  $limit: Int
) {
  attendance(filter: $filter, sort: $sort, page: $page, limit: $limit) {
    id
    employeeId
    date
    status
    note
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "filter": {
    "employeeId": "employee-uuid-here",
    "date": "2025-12-03",
    "status": "PRESENT"
  },
  "sort": {
    "field": "date",
    "order": "DESC"
  },
  "page": 1,
  "limit": 10
}
```

**AttendanceFilter Input:**
- `employeeId: String` - Filter by employee ID
- `date: String` - Filter by date (format: "YYYY-MM-DD")
- `status: AttendanceStatus` - Filter by status (PRESENT, ABSENT, LATE, EXCUSED)

**SortInput:**
- `field: String` (optional) - Field to sort by: "date", "status", "createdAt", "updatedAt" (default: "date")
- `order: SortOrder` (optional) - Sort order: "ASC" or "DESC" (default: "DESC")

**Pagination Parameters:**
- `page: Int` (optional, default: 1) - Page number (1-based)
- `limit: Int` (optional, default: 10) - Number of items per page

**Response:**
```json
{
  "data": {
    "attendance": [
      {
        "id": "uuid-here",
        "employeeId": "employee-uuid-here",
        "date": "2025-12-03",
        "status": "PRESENT",
        "note": null,
        "createdAt": "2025-12-03T08:00:00.000Z",
        "updatedAt": "2025-12-03T08:00:00.000Z"
      }
    ]
  }
}
```

---

#### Get Attendance by ID
**Query:**
```graphql
query GetAttendance($id: String!) {
  attendanceById(id: $id) {
    id
    employeeId
    date
    status
    note
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "attendance-uuid-here"
}
```

**Response:**
```json
{
  "data": {
    "attendanceById": {
      "id": "uuid-here",
      "employeeId": "employee-uuid-here",
      "date": "2025-12-03",
        "status": "PRESENT",
      "note": null,
      "createdAt": "2025-12-03T08:00:00.000Z",
      "updatedAt": "2025-12-03T08:00:00.000Z"
    }
  }
}
```

---

#### Mark Attendance (Admin Only)
**Query:**
```graphql
mutation MarkAttendance($input: AttendanceInput!) {
  markAttendance(input: $input) {
    id
    employeeId
    date
    status
    note
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "employeeId": "employee-uuid-here",
    "date": "2025-12-03",
        "status": "PRESENT",
    "note": "On time"
  }
}
```

**AttendanceInput Fields:**
- `employeeId: String!` - Required, employee ID
- `date: String!` - Required, date format: "YYYY-MM-DD"
- `status: AttendanceStatus!` - Required: `PRESENT`, `ABSENT`, `LATE`, or `EXCUSED` (uppercase)
- `note: String` - Optional, admin note

**AttendanceStatus Enum:**
- `PRESENT` - Employee present
- `ABSENT` - Employee absent
- `LATE` - Employee late
- `EXCUSED` - Employee excused

**Response:**
```json
{
  "data": {
    "markAttendance": {
      "id": "new-uuid-here",
      "employeeId": "employee-uuid-here",
      "date": "2025-12-03",
        "status": "PRESENT",
      "note": "On time",
      "createdAt": "2025-12-03T08:00:00.000Z",
      "updatedAt": "2025-12-03T08:00:00.000Z"
    }
  }
}
```

**Note:** One employee can only have 1 attendance record per day. If one already exists, it will return an error.

---

#### Update Attendance (Admin Only)
**Query:**
```graphql
mutation UpdateAttendance($id: String!, $input: AttendanceUpdateInput!) {
  updateAttendance(id: $id, input: $input) {
    id
    employeeId
    date
    status
    note
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "attendance-uuid-here",
  "input": {
        "status": "LATE",
    "note": "Arrived 15 minutes late"
  }
}
```

**AttendanceUpdateInput:** All fields are optional

**Response:**
```json
{
  "data": {
    "updateAttendance": {
      "id": "uuid-here",
      "employeeId": "employee-uuid-here",
      "date": "2025-12-03",
        "status": "LATE",
      "note": "Arrived 15 minutes late",
      "updatedAt": "2025-12-03T09:00:00.000Z"
    }
  }
}
```

---

#### Delete Attendance (Admin Only)
**Query:**
```graphql
mutation DeleteAttendance($id: String!) {
  deleteAttendance(id: $id)
}
```

**Variables:**
```json
{
  "id": "attendance-uuid-here"
}
```

**Response:**
```json
{
  "data": {
    "deleteAttendance": true
  }
}
```

---

### 4. Health Check

#### GET /health
```bash
GET http://localhost:9100/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

---

## Error Handling

The GraphQL API returns errors in the following format:

```json
{
  "errors": [
    {
      "message": "Error message here",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "exception": {
          "status": 401
        }
      }
    }
  ]
}
```

**Common Error Codes:**
- `UNAUTHENTICATED` (401) - Invalid or missing token
- `FORBIDDEN` (403) - No permission (not Admin)
- `BAD_USER_INPUT` (400) - Input validation error
- `INTERNAL_SERVER_ERROR` (500) - Server error

---

## Authorization Rules

### Admin Role
- ✅ Full access to all queries and mutations
- ✅ Can create, update, delete employees
- ✅ Can create, update, delete attendance records
- ✅ Can view all employees and attendance

### Employee Role
- ✅ Can view employees list (with filters)
- ✅ Can view own employee details
- ✅ Can view attendance records
- ❌ Cannot create, update, or delete employees
- ❌ Cannot create, update, or delete attendance records

---

## Example Requests

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:9100/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { access_token } }",
    "variables": {
      "email": "admin@company.com",
      "password": "password123"
    }
  }'
```

**List Employees (with token):**
```bash
curl -X POST http://localhost:9100/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { employees { id fullName age class subjects } }"
  }'
```

**Mark Attendance (with token):**
```bash
curl -X POST http://localhost:9100/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "mutation MarkAttendance($input: AttendanceInput!) { markAttendance(input: $input) { id employeeId date status } }",
    "variables": {
      "input": {
        "employeeId": "employee-uuid-here",
        "date": "2025-12-03",
        "status": "PRESENT"
      }
    }
  }'
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:9100/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          access_token
        }
      }
    `,
    variables: {
      email: 'admin@company.com',
      password: 'password123',
    },
  }),
});

const loginData = await loginResponse.json();
const token = loginData.data.login.access_token; // Format: { data: { login: { access_token: "..." } } }

// Get Employees
const employeesResponse = await fetch('http://localhost:9100/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: `
      query {
        employees {
          id
          userId
          fullName
          age
          class
          subjects
        }
      }
    `,
  }),
});

const employeesData = await employeesResponse.json();
console.log(employeesData.data.employees);

// Mark Attendance
const attendanceResponse = await fetch('http://localhost:9100/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: `
      mutation MarkAttendance($input: AttendanceInput!) {
        markAttendance(input: $input) {
          id
          employeeId
          date
          status
          note
        }
      }
    `,
    variables: {
      input: {
        employeeId: 'employee-uuid-here',
        date: '2025-12-03',
        status: 'PRESENT',
        note: 'On time',
      },
    },
  }),
});

const attendanceData = await attendanceResponse.json();
console.log(attendanceData.data.markAttendance);
```

---

## Postman Collection

Import the `Employee-Management-API.postman_collection.json` file into Postman to get all pre-configured requests.

**Setup Environment Variables in Postman:**
- `base_url`: `http://localhost:9100`
- `access_token`: (will be set automatically after login)

---

## Frontend Integration Guide

### Setup for Frontend Integration

#### 1. Environment Variables

Create a `.env` or `.env.local` file in the frontend folder with the following configuration:

```env
VITE_API_URL=http://localhost:9100/graphql
# atau
REACT_APP_API_URL=http://localhost:9100/graphql
```

**Note:** Adjust according to the framework used (Vite uses `VITE_`, Create React App uses `REACT_APP_`).

#### 2. GraphQL Client Setup

**Using Apollo Client (Recommended):**

```bash
npm install @apollo/client graphql
```

```javascript
// src/lib/apollo-client.js atau src/config/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:9100/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get token from localStorage or state management
  const token = localStorage.getItem('access_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

**Using Fetch API:**

```javascript
// src/lib/api.js atau src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9100/graphql';

export async function graphqlRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}
```

#### 3. Authentication Flow

**Login Example:**

```javascript
// Using Apollo Client
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

function LoginComponent() {
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (email, password) => {
    try {
      const { data } = await login({
        variables: { email, password },
      });
      
      const token = data.login.access_token;
      localStorage.setItem('access_token', token);
      
      // Redirect to dashboard or update auth state
      // ...
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // ...
}
```

**Auth Me (Check Token) Example:**

```javascript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const AUTH_ME_QUERY = gql`
  query AuthMe {
    authMe {
      id
      username
      email
      role
    }
  }
`;

function useAuth() {
  const { data, loading, error } = useQuery(AUTH_ME_QUERY, {
    skip: !localStorage.getItem('access_token'),
  });

  return {
    user: data?.authMe,
    loading,
    isAuthenticated: !!data?.authMe,
  };
}
```

#### 4. Error Handling

```javascript
// src/lib/error-handler.js
export function handleGraphQLError(error) {
  if (error.networkError) {
    return 'Network error. Please check your connection.';
  }

  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    // Handle specific error codes
    switch (graphQLError.extensions?.code) {
      case 'UNAUTHENTICATED':
        // Clear token and redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
      
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      
      case 'BAD_USER_INPUT':
        return graphQLError.message || 'Invalid input. Please check your data.';
      
      default:
        return graphQLError.message || 'An error occurred.';
    }
  }

  return 'An unexpected error occurred.';
}
```

#### 5. Common Queries & Mutations for Frontend

**Get Employee Statistics (for Dashboard):**

```javascript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const EMPLOYEE_STATISTICS_QUERY = gql`
  query EmployeeStatistics {
    employeeStatistics {
      totalEmployees
      activeEmployees
      avgAttendance
      onLeave
    }
  }
`;

function DashboardComponent() {
  const { data, loading, error } = useQuery(EMPLOYEE_STATISTICS_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const stats = data.employeeStatistics;

  return (
    <div>
      <div>Total Employees: {stats.totalEmployees}</div>
      <div>Active Employees: {stats.activeEmployees}</div>
      <div>Avg. Attendance: {stats.avgAttendance}%</div>
      <div>On Leave: {stats.onLeave}</div>
    </div>
  );
}
```

**Get Attendance Statistics (for Dashboard/Attendance Page):**

```javascript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const ATTENDANCE_STATISTICS_QUERY = gql`
  query AttendanceStatistics {
    attendanceStatistics {
      totalPresent
      totalAbsent
      totalLate
      totalExcused
      attendanceRate
    }
  }
`;

function AttendanceStatsComponent() {
  const { data, loading, error } = useQuery(ATTENDANCE_STATISTICS_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const stats = data.attendanceStatistics;

  return (
    <div>
      <div>Total Present: {stats.totalPresent}</div>
      <div>Total Absent: {stats.totalAbsent}</div>
      <div>Total Late: {stats.totalLate}</div>
      <div>Total Excused: {stats.totalExcused}</div>
      <div>Attendance Rate: {stats.attendanceRate}%</div>
    </div>
  );
}
```

**List Employees with Filter:**

```javascript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const LIST_EMPLOYEES_QUERY = gql`
  query ListEmployees($filter: EmployeeFilter, $sort: SortInput, $page: Int, $limit: Int) {
    employees(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      id
      userId
      fullName
      age
      class
      subjects
      createdAt
      updatedAt
    }
  }
`;

const EMPLOYEES_PAGINATION_QUERY = gql`
  query EmployeesPagination($filter: EmployeeFilter, $page: Int, $limit: Int) {
    employeesPagination(filter: $filter, page: $page, limit: $limit) {
      totalCount
      totalPages
      currentPage
      limit
      hasNextPage
      hasPreviousPage
    }
  }
`;

function EmployeeListComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('ASC');
  
  const { data, loading, error } = useQuery(LIST_EMPLOYEES_QUERY, {
    variables: {
      filter: { fullName: 'John' },
      sort: { field: sortField, order: sortOrder },
      page: currentPage,
      limit: 10,
    },
  });

  const { data: paginationData } = useQuery(EMPLOYEES_PAGINATION_QUERY, {
    variables: {
      filter: { fullName: 'John' },
      page: currentPage,
      limit: 10,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.employees.map((employee) => (
        <div key={employee.id}>{employee.fullName}</div>
      ))}
    </div>
  );
}
```

**Create Employee:**

```javascript
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      userId
      fullName
      age
      class
      subjects
    }
  }
`;

function CreateEmployeeComponent() {
  const [createEmployee, { loading, error }] = useMutation(CREATE_EMPLOYEE_MUTATION);

  const handleCreate = async (employeeData) => {
    try {
      const { data } = await createEmployee({
        variables: {
          input: {
            userId: employeeData.userId,
            fullName: employeeData.fullName,
            age: employeeData.age,
            class: employeeData.class,
            subjects: employeeData.subjects,
          },
        },
      });
      
      // Handle success (show notification, redirect, etc.)
      console.log('Employee created:', data.createEmployee);
    } catch (err) {
      console.error('Failed to create employee:', err);
    }
  };

  // ...
}
```

#### 6. Workflow for Create User → Create Employee

```javascript
// 1. Create User first (Admin Only)
const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $role: UserRole) {
    createUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

// 2. After user is created, use user.id to create employee
const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      userId
      fullName
    }
  }
`;

async function createUserAndEmployee(userData, employeeData) {
  // Step 1: Create User
  const { data: userData } = await createUser({
    variables: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'EMPLOYEE',
    },
  });

  const userId = userData.createUser.id;

  // Step 2: Create Employee with userId
  const { data: employeeData } = await createEmployee({
    variables: {
      input: {
        userId: userId,
        fullName: employeeData.fullName,
        age: employeeData.age,
        class: employeeData.class,
        subjects: employeeData.subjects,
      },
    },
  });

  return { user: userData.createUser, employee: employeeData.createEmployee };
}
```

#### 7. TypeScript Types (Optional)

If using TypeScript, create types for GraphQL responses:

```typescript
// src/types/graphql.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string | null;
  fullName: string;
  age: number | null;
  class: string | null;
  subjects: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  login: {
    access_token: string;
  };
}

export interface EmployeeFilter {
  userId?: string;
  fullName?: string;
  age?: number;
  class?: string;
  subject?: string;
}

export interface SortInput {
  field: string;
  order: 'ASC' | 'DESC';
}
```

#### 8. CORS Configuration

Make sure the backend allows requests from the frontend. In NestJS `main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Adjust according to frontend port
  credentials: true,
});
```

#### 9. Testing Integration

1. **Test Login:**
   - Login with valid credentials
   - Ensure token is stored in localStorage
   - Ensure redirect to dashboard is successful

2. **Test Auth Me:**
   - After login, call `authMe` query
   - Ensure user data is successfully retrieved
   - Ensure error handling for invalid token works

3. **Test Protected Routes:**
   - Access protected route without token → should redirect to login
   - Access protected route with token → should succeed

4. **Test CRUD Operations:**
   - Test list employees with various filters
   - Test create employee (make sure to create user first)
   - Test update and delete employee

---

## GraphQL Playground

Access GraphQL Playground at:
```
http://localhost:9100/graphql
```

The Playground allows you to:
- Write and test queries/mutations
- View schema documentation
- View query history

---

## Database Schema (ERD)

### Users Table
- `id` (UUID, PK)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `role` (VARCHAR: 'admin' | 'employee')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Employees Table
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id, nullable)
- `full_name` (VARCHAR)
- `age` (INT, nullable)
- `class` (VARCHAR, nullable)
- `subjects` (JSONB, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Attendance Table
- `id` (UUID, PK)
- `employee_id` (UUID, FK → employees.id)
- `date` (DATE)
- `status` (VARCHAR: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED')
- `note` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- Unique constraint: `(employee_id, date)`

---

## Notes

1. **Password with special characters**: If the password contains special characters such as `#`, `@`, `$`, make sure to quote it in environment variables.

2. **Date Format**: Use format `YYYY-MM-DD` for the `date` field in attendance.

3. **Subjects**: The `subjects` field is an array of strings, example: `["Math", "Physics"]`.

4. **Attendance Status**: 
   - `PRESENT` - Employee present
   - `ABSENT` - Employee absent
   - `LATE` - Employee late
   - `EXCUSED` - Employee excused

5. **Pagination**: Use `page` and `limit` for pagination. Default limit is 10.

6. **Sorting**: Sortable fields: `fullName`, `age`, `class` (for employees), `date`, `status` (for attendance), etc.

7. **Unique Constraint**: One employee can only have 1 attendance record per day. If you try to create a duplicate, it will return an error.

---

## Support

For questions or issues, please contact the development team.
