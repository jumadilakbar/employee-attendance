import { gql } from '@apollo/client';
import { Attendance, AttendanceFilter, AttendanceStatus } from '@/types/graphql';

// List Attendance Query
export const LIST_ATTENDANCE_QUERY = gql`
  query ListAttendance($filter: AttendanceFilter, $sort: SortInput, $page: Int, $limit: Int) {
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
`;

export interface SortInput {
  field?: string;
  order?: 'ASC' | 'DESC';
}

export interface ListAttendanceVariables {
  filter?: AttendanceFilter;
  sort?: SortInput;
  page?: number;
  limit?: number;
}

export interface ListAttendanceData {
  attendance: Attendance[];
}

// Attendance Pagination Query
export const ATTENDANCE_PAGINATION_QUERY = gql`
  query AttendancePagination($filter: AttendanceFilter, $page: Int, $limit: Int) {
    attendancePagination(filter: $filter, page: $page, limit: $limit) {
      totalCount
      totalPages
      currentPage
      limit
      hasNextPage
      hasPreviousPage
    }
  }
`;

export interface AttendancePaginationVariables {
  filter?: AttendanceFilter;
  page?: number;
  limit?: number;
}

export interface AttendancePaginationData {
  attendancePagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Attendance Statistics Query
export const ATTENDANCE_STATISTICS_QUERY = gql`
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

export interface AttendanceStatisticsData {
  attendanceStatistics: {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalExcused: number;
    attendanceRate: number;
  };
}

// Get Attendance by ID Query
export const GET_ATTENDANCE_QUERY = gql`
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
`;

export interface GetAttendanceVariables {
  id: string;
}

export interface GetAttendanceData {
  attendanceById: Attendance;
}

// Mark Attendance Mutation
export const MARK_ATTENDANCE_MUTATION = gql`
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
`;

export interface MarkAttendanceVariables {
  input: {
    employeeId: string;
    date: string;
    status: AttendanceStatus;
    note?: string;
  };
}

export interface MarkAttendanceData {
  markAttendance: Attendance;
}

// Update Attendance Mutation
export const UPDATE_ATTENDANCE_MUTATION = gql`
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
`;

export interface UpdateAttendanceVariables {
  id: string;
  input: {
    employeeId?: string;
    date?: string;
    status?: AttendanceStatus;
    note?: string;
  };
}

export interface UpdateAttendanceData {
  updateAttendance: Attendance;
}

// Delete Attendance Mutation
export const DELETE_ATTENDANCE_MUTATION = gql`
  mutation DeleteAttendance($id: String!) {
    deleteAttendance(id: $id)
  }
`;

export interface DeleteAttendanceVariables {
  id: string;
}

export interface DeleteAttendanceData {
  deleteAttendance: boolean;
}

