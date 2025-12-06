import { useState, useMemo } from 'react';
import { Users, TrendingUp, UserCheck, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { EmployeeTileView } from '@/components/employees/EmployeeTileView';
import { EmployeeDetailModal } from '@/components/employees/EmployeeDetailModal';
import { ViewToggle } from '@/components/employees/ViewToggle';
import { SearchFilter } from '@/components/employees/SearchFilter';
import { LoginModal } from '@/components/auth/LoginModal';
import { employees } from '@/data/employees';
import { Employee, ViewMode } from '@/types/employee';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    avgAttendance: Math.round(
      employees.reduce((acc, e) => acc + e.attendance, 0) / employees.length
    ),
    onLeave: employees.filter((e) => e.status === 'on-leave').length,
  }), []);

  const handleEdit = (employee: Employee) => {
    toast({
      title: 'Edit Employee',
      description: `Editing ${employee.name}'s profile`,
    });
  };

  const handleFlag = (employee: Employee) => {
    toast({
      title: 'Employee Flagged',
      description: `${employee.name} has been flagged for review`,
    });
  };

  const handleDelete = (employee: Employee) => {
    toast({
      title: 'Delete Employee',
      description: `Are you sure you want to delete ${employee.name}?`,
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setIsLoginOpen(true)} />

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
          <SearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Employee list */}
        {viewMode === 'grid' ? (
          <EmployeeGrid
            employees={filteredEmployees}
            onSelectEmployee={setSelectedEmployee}
          />
        ) : (
          <EmployeeTileView
            employees={filteredEmployees}
            onSelectEmployee={setSelectedEmployee}
            onEdit={handleEdit}
            onFlag={handleFlag}
            onDelete={handleDelete}
          />
        )}

        {/* Employee detail modal */}
        {selectedEmployee && (
          <EmployeeDetailModal
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}

        {/* Login modal */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
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

export default Index;
