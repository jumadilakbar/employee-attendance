// GraphQL Types
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
  totalAttendance?: number | null;
  attendancePercentage?: number | null;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  login: {
    access_token: string;
  };
}

export interface RegisterResponse {
  register: {
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

export interface AttendanceFilter {
  employeeId?: string;
  date?: string;
  status?: AttendanceStatus;
}

