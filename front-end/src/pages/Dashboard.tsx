import { useMemo } from 'react';
import { Users, TrendingUp, UserCheck, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEmployeeStatistics } from '@/hooks/use-employees';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch statistics from GraphQL API
  const { statistics: employeeStats, loading: statsLoading } = useEmployeeStatistics();

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
    // Fallback if API data not available
    return {
      total: 0,
      active: 0,
      avgAttendance: 0,
      onLeave: 0,
    };
  }, [employeeStats]);

  const loading = statsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your employee management system
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Stats cards */}
        {!loading && (
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
              trend={stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% of total` : '0% of total'}
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
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/employees')}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Manage Employees</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/attendance')}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Manage Attendance</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/users')}
                variant="outline"
                className="w-full justify-between"
              >
                <span>Manage Users</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Updates</h2>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">New employee added</p>
                <p className="text-xs">2 hours ago</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Attendance marked</p>
                <p className="text-xs">5 hours ago</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Employee profile updated</p>
                <p className="text-xs">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
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

export default Dashboard;

