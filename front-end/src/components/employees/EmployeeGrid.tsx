import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';
import { Employee as GraphQLEmployee } from '@/types/graphql';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface EmployeeGridProps {
  employees: GraphQLEmployee[];
  onSelectEmployee: (employee: GraphQLEmployee) => void;
  onEdit?: (employee: GraphQLEmployee) => void;
  onDelete?: (employee: GraphQLEmployee) => void;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSortChange?: (field: string, order: 'ASC' | 'DESC') => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
}

type SortableField = 'fullName' | 'age' | 'class';

const ITEMS_PER_PAGE = 10;

export function EmployeeGrid({ 
  employees, 
  onSelectEmployee, 
  onEdit, 
  onDelete,
  sortField: externalSortField = 'fullName',
  sortOrder: externalSortOrder = 'ASC',
  onSortChange,
  currentPage: externalCurrentPage = 1,
  totalPages: externalTotalPages = 1,
  onPageChange,
  totalCount = 0,
}: EmployeeGridProps) {
  const handleSort = (field: string) => {
    // Only allow sorting on fullName, age, and class
    const sortableFields: SortableField[] = ['fullName', 'age', 'class'];
    if (!sortableFields.includes(field as SortableField)) {
      return; // Don't sort on non-sortable fields
    }
    
    if (onSortChange) {
      const newOrder = externalSortField === field && externalSortOrder === 'ASC' ? 'DESC' : 'ASC';
      onSortChange(field, newOrder);
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (externalSortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return externalSortOrder === 'ASC' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const columns: { key: string; label: string; className?: string }[] = [
    { key: 'id', label: 'ID', className: 'w-16' },
    { key: 'fullName', label: 'Name', className: 'min-w-[180px]' },
    { key: 'age', label: 'Age', className: 'w-20' },
    { key: 'class', label: 'Class', className: 'w-24' },
    { key: 'subjects', label: 'Subjects', className: 'min-w-[150px]' },
    { key: 'totalAttendance', label: 'Total Attendance', className: 'w-32' },
    { key: 'attendancePercentage', label: 'Attendance %', className: 'w-32' },
    { key: 'createdAt', label: 'Created', className: 'w-32' },
    { key: 'actions', label: 'Actions', className: 'w-32' },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    col.className
                  )}
                >
                  {col.key !== 'actions' && (col.key === 'fullName' || col.key === 'age' || col.key === 'class') ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.key} />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                onClick={() => onSelectEmployee(employee)}
                className="cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {employee.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {employee.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{employee.fullName}</p>
                      {employee.userId && (
                        <p className="text-xs text-muted-foreground">User: {employee.userId.slice(0, 8)}...</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {employee.age ?? 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {employee.class ? (
                    <Badge variant="secondary" className="text-xs">{employee.class}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {employee.subjects && employee.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.subjects.slice(0, 2).map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {employee.subjects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{employee.subjects.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {employee.totalAttendance ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      (employee.attendancePercentage ?? 0) >= 80 
                        ? 'text-green-600' 
                        : (employee.attendancePercentage ?? 0) >= 60 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {employee.attendancePercentage ?? 0}%
                    </span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          (employee.attendancePercentage ?? 0) >= 80 
                            ? 'bg-green-500' 
                            : (employee.attendancePercentage ?? 0) >= 60 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${employee.attendancePercentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(employee);
                        }}
                        className="h-8"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(employee);
                        }}
                        className="h-8"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && (
        <Pagination
          currentPage={externalCurrentPage}
          totalPages={externalTotalPages}
          onPageChange={onPageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalCount || employees.length}
          showingText="employees"
        />
      )}
    </div>
  );
}
