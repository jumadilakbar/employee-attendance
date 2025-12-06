import { useState, useMemo, useEffect } from 'react';
import { Users, TrendingUp, UserCheck, Clock, Loader2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { EmployeeTileView } from '@/components/employees/EmployeeTileView';
import { EmployeeDetailModal } from '@/components/employees/EmployeeDetailModal';
import { EmployeeFormModal, EmployeeFormData } from '@/components/employees/EmployeeFormModal';
import { DeleteEmployeeDialog } from '@/components/employees/DeleteEmployeeDialog';
import { ViewToggle } from '@/components/employees/ViewToggle';
import { SearchFilter } from '@/components/employees/SearchFilter';
import { ViewMode } from '@/types/employee';
import { Employee as GraphQLEmployee } from '@/types/graphql';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useEmployeeStatistics } from '@/hooks/use-employees';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 10;

const EmployeeManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<GraphQLEmployee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('fullName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filter, setFilter] = useState<{ fullName?: string } | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<GraphQLEmployee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<GraphQLEmployee | null>(null);
  const { toast } = useToast();

  // Build filter and sort variables
  const apiFilter = useMemo(() => {
    if (!searchQuery) return undefined;
    return {
      fullName: searchQuery,
    };
  }, [searchQuery]);

  const sort = useMemo(() => ({
    field: sortField,
    order: sortOrder,
  }), [sortField, sortOrder]);

  // Fetch employees from GraphQL API
  const { employees, loading, refetch, totalPages, totalCount } = useEmployees({
    filter: apiFilter,
    sort,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Statistics
  const { statistics: employeeStats, loading: statsLoading } = useEmployeeStatistics();

  // Mutations
  const { createEmployee, loading: createLoading } = useCreateEmployee();
  const { updateEmployee, loading: updateLoading } = useUpdateEmployee();
  const { deleteEmployee, loading: deleteLoading } = useDeleteEmployee();

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortOrder]);

  // Use statistics from API
  const stats = useMemo(() => {
    if (employeeStats) {
      return {
        total: employeeStats.totalEmployees,
        active: employeeStats.activeEmployees,
        avgAttendance: employeeStats.avgAttendance,
        onLeave: employeeStats.onLeave,
      };
    }
    // Fallback to calculated stats if API data not available
    return {
      total: totalCount || employees.length,
      active: employees.length,
      avgAttendance: 0,
      onLeave: 0,
    };
  }, [employeeStats, employees, totalCount]);

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      await createEmployee({
        input: {
          userId: data.userId || undefined,
          fullName: data.fullName,
          age: data.age ?? undefined,
          class: data.class || undefined,
          subjects: data.subjects && data.subjects.length > 0 ? data.subjects : undefined,
        },
      });
      await refetch();
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create employee',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = (employee: GraphQLEmployee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: EmployeeFormData) => {
    if (!employeeToEdit) return;

    try {
      await updateEmployee({
        id: employeeToEdit.id,
        input: {
          userId: data.userId || undefined,
          fullName: data.fullName,
          age: data.age ?? undefined,
          class: data.class || undefined,
          subjects: data.subjects && data.subjects.length > 0 ? data.subjects : undefined,
        },
      });
      await refetch();
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
      setIsEditModalOpen(false);
      setEmployeeToEdit(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update employee',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = (employee: GraphQLEmployee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee({ id: employeeToDelete.id });
      await refetch();
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleFlag = (employee: GraphQLEmployee) => {
    toast({
      title: 'Employee Flagged',
      description: `${employee.fullName} has been flagged for review`,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilter({ fullName: query });
    } else {
      setFilter(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Employees"
            value={stats.total}
            trend="+2 this month"
            color="primary"
          />
          <StatCard
            icon={<UserCheck className="h-5 w-5" />}
            label="Active Employees"
            value={stats.active}
            trend={`${Math.round((stats.active / stats.total) * 100)}% of total`}
            color="success"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg. Attendance"
            value={`${stats.avgAttendance}%`}
            trend="+3% from last month"
            color="accent"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="On Leave"
            value={stats.onLeave}
            trend="Expected back soon"
            color="warning"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <SearchFilter searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Loading state */}
        {(loading || statsLoading) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Employee list */}
        {!loading && !statsLoading && (
          <>
            {viewMode === 'grid' ? (
              <EmployeeGrid
                employees={employees}
                onSelectEmployee={setSelectedEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                  setSortField(field);
                  setSortOrder(order);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalCount={totalCount}
              />
            ) : (
              <EmployeeTileView
                employees={employees}
                onSelectEmployee={setSelectedEmployee}
                onEdit={handleEdit}
                onFlag={handleFlag}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {!loading && !statsLoading && employees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No employees found</p>
          </div>
        )}

        {/* Employee detail modal */}
        {selectedEmployee && (
          <EmployeeDetailModal
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onEdit={handleEdit}
          />
        )}

        {/* Create Employee Modal */}
        <EmployeeFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          loading={createLoading}
        />

        {/* Edit Employee Modal */}
        <EmployeeFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEmployeeToEdit(null);
          }}
          employee={employeeToEdit}
          onSubmit={handleUpdate}
          loading={updateLoading}
        />

        {/* Delete Employee Dialog */}
        <DeleteEmployeeDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setEmployeeToDelete(null);
          }}
          employee={employeeToDelete}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: 'primary' | 'success' | 'accent' | 'warning';
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 card-hover">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </div>
  );
}

export default EmployeeManagement;

