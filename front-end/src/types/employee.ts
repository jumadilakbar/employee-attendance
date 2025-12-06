export interface Employee {
  id: string;
  name: string;
  email: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  phone: string;
  address: string;
  avatar: string;
}

export type ViewMode = 'grid' | 'tile';

export type SortField = keyof Employee;
export type SortDirection = 'asc' | 'desc';
