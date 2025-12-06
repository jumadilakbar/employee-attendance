import { gql } from '@apollo/client';
import { Employee, EmployeeFilter, SortInput } from '@/types/graphql';

// List Employees Query
export const LIST_EMPLOYEES_QUERY = gql`
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
      totalAttendance
      attendancePercentage
    }
  }
`;

export interface ListEmployeesVariables {
  filter?: EmployeeFilter;
  sort?: SortInput;
  page?: number;
  limit?: number;
}

// Employees Pagination Query
export const EMPLOYEES_PAGINATION_QUERY = gql`
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

export interface EmployeesPaginationVariables {
  filter?: EmployeeFilter;
  page?: number;
  limit?: number;
}

export interface EmployeesPaginationData {
  employeesPagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Employee Statistics Query
export const EMPLOYEE_STATISTICS_QUERY = gql`
  query EmployeeStatistics {
    employeeStatistics {
      totalEmployees
      activeEmployees
      avgAttendance
      onLeave
    }
  }
`;

export interface EmployeeStatisticsData {
  employeeStatistics: {
    totalEmployees: number;
    activeEmployees: number;
    avgAttendance: number;
    onLeave: number;
  };
}

export interface ListEmployeesData {
  employees: Employee[];
}

// Get Employee by ID Query
export const GET_EMPLOYEE_QUERY = gql`
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
`;

export interface GetEmployeeVariables {
  id: string;
}

export interface GetEmployeeData {
  employee: Employee;
}

// Create Employee Mutation
export const CREATE_EMPLOYEE_MUTATION = gql`
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
`;

export interface CreateEmployeeVariables {
  input: {
    userId?: string;
    fullName: string;
    age?: number;
    class?: string;
    subjects?: string[];
  };
}

export interface CreateEmployeeData {
  createEmployee: Employee;
}

// Update Employee Mutation
export const UPDATE_EMPLOYEE_MUTATION = gql`
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
`;

export interface UpdateEmployeeVariables {
  id: string;
  input: {
    userId?: string;
    fullName?: string;
    age?: number;
    class?: string;
    subjects?: string[];
  };
}

export interface UpdateEmployeeData {
  updateEmployee: Employee;
}

// Delete Employee Mutation
export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id)
  }
`;

export interface DeleteEmployeeVariables {
  id: string;
}

export interface DeleteEmployeeData {
  deleteEmployee: boolean;
}

