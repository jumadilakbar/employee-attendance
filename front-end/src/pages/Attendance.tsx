import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAttendance, useMarkAttendance, useUpdateAttendance, useDeleteAttendance, useAttendanceStatistics } from '@/hooks/use-attendance';
import { useEmployees } from '@/hooks/use-employees';
import { Attendance as GraphQLAttendance, AttendanceStatus } from '@/types/graphql';
import { AttendanceFormModal, AttendanceFormData } from '@/components/attendance/AttendanceFormModal';
import { DeleteAttendanceDialog } from '@/components/attendance/DeleteAttendanceDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ITEMS_PER_PAGE = 10;

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<{ date?: string; employeeId?: string } | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attendanceToEdit, setAttendanceToEdit] = useState<GraphQLAttendance | null>(null);
  const [attendanceToDelete, setAttendanceToDelete] = useState<GraphQLAttendance | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  // Build filter for API
  const apiFilter = useMemo(() => {
    const f: { date?: string; employeeId?: string } = {};
    if (selectedDate) {
      f.date = selectedDate;
    }
    // Note: Search by employee name needs to be done via employeeId filter
    // For now, we'll do client-side filtering for employee name search
    return Object.keys(f).length > 0 ? f : undefined;
  }, [selectedDate]);

  // Build sort for API
  const sort = useMemo(() => ({
    field: 'date',
    order: 'DESC' as const,
  }), []);

  // Fetch attendance and employees from GraphQL API
  const { attendance, loading: attendanceLoading, refetch, totalPages: apiTotalPages, totalCount } = useAttendance({
    filter: apiFilter,
    sort,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const { employees, loading: employeesLoading } = useEmployees();
  const { statistics: attendanceStats, loading: statsLoading } = useAttendanceStatistics();
  const { markAttendance, loading: createLoading } = useMarkAttendance();
  const { updateAttendance, loading: updateLoading } = useUpdateAttendance();
  const { deleteAttendance, loading: deleteLoading } = useDeleteAttendance();

  // Create a map of employee IDs to names
  const employeeMap = useMemo(() => {
    const map = new Map<string, string>();
    employees.forEach((emp) => {
      map.set(emp.id, emp.fullName);
    });
    return map;
  }, [employees]);

  // Client-side filtering for employee name search (since API doesn't support it directly)
  const filteredAttendance = useMemo(() => {
    let filtered = attendance;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((att) => {
        const employeeName = employeeMap.get(att.employeeId) || '';
        return employeeName.toLowerCase().includes(query);
      });
    }
    
    return filtered;
  }, [searchQuery, attendance, employeeMap]);

  // Use totalPages from API response
  const totalPages = apiTotalPages || 1;

  // Reset to page 1 when search or date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDate]);

  // Use statistics from API
  const stats = useMemo(() => {
    if (attendanceStats) {
      return {
        total: attendanceStats.totalPresent + attendanceStats.totalAbsent + attendanceStats.totalLate + attendanceStats.totalExcused,
        present: attendanceStats.totalPresent,
        absent: attendanceStats.totalAbsent,
        late: attendanceStats.totalLate,
        excused: attendanceStats.totalExcused,
        attendanceRate: attendanceStats.attendanceRate,
      };
    }
    // Fallback to calculated stats if API data not available
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    const absent = attendance.filter((a) => a.status === AttendanceStatus.ABSENT).length;
    const late = attendance.filter((a) => a.status === AttendanceStatus.LATE).length;
    const excused = attendance.filter((a) => a.status === AttendanceStatus.EXCUSED).length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, excused, attendanceRate };
  }, [attendanceStats, attendance]);

  const handleCreate = async (data: AttendanceFormData) => {
    try {
      await markAttendance({
        input: {
          employeeId: data.employeeId,
          date: data.date,
          status: data.status,
          note: data.note || undefined,
        },
      });
      await refetch();
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = (attendance: GraphQLAttendance) => {
    setAttendanceToEdit(attendance);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: AttendanceFormData) => {
    if (!attendanceToEdit) return;

    try {
      await updateAttendance({
        id: attendanceToEdit.id,
        input: {
          employeeId: data.employeeId,
          date: data.date,
          status: data.status,
          note: data.note || undefined,
        },
      });
      await refetch();
      toast({
        title: 'Success',
        description: 'Attendance updated successfully',
      });
      setIsEditModalOpen(false);
      setAttendanceToEdit(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update attendance',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = (attendance: GraphQLAttendance) => {
    setAttendanceToDelete(attendance);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!attendanceToDelete) return;

    try {
      await deleteAttendance({ id: attendanceToDelete.id });
      await refetch();
      toast({
        title: 'Success',
        description: 'Attendance deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete attendance',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const loading = attendanceLoading || employeesLoading || statsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Management</h1>
            <p className="text-muted-foreground">
              Track and manage employee attendance records
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total Present</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.present}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <XCircle className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total Absent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Late</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.late}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Excused</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.excused}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Attendance Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.attendanceRate}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                                <TableHead>Employee Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Note</TableHead>
                          {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((att) => {
                    const employeeName = employeeMap.get(att.employeeId) || 'Unknown';
                    const statusColors = {
                      [AttendanceStatus.PRESENT]: 'bg-green-500/10 text-green-500',
                      [AttendanceStatus.ABSENT]: 'bg-red-500/10 text-red-500',
                      [AttendanceStatus.LATE]: 'bg-orange-500/10 text-orange-500',
                      [AttendanceStatus.EXCUSED]: 'bg-blue-500/10 text-blue-500',
                    };
                    const statusIcons = {
                      [AttendanceStatus.PRESENT]: <CheckCircle className="mr-1 h-3 w-3" />,
                      [AttendanceStatus.ABSENT]: <XCircle className="mr-1 h-3 w-3" />,
                      [AttendanceStatus.LATE]: <Clock className="mr-1 h-3 w-3" />,
                      [AttendanceStatus.EXCUSED]: <CheckCircle className="mr-1 h-3 w-3" />,
                    };
                    
                    return (
                      <TableRow key={att.id}>
                        <TableCell className="font-medium">{employeeName}</TableCell>
                        <TableCell>{att.date}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[att.status]}`}
                          >
                            {statusIcons[att.status]}
                            {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{att.note || '-'}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(att)}
                                className="h-8"
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(att)}
                                className="h-8"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {!loading && attendance.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalCount || attendance.length}
              showingText="records"
            />
          </div>
        )}

                {/* Create Attendance Modal - Admin Only */}
                {isAdmin && (
                  <AttendanceFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreate}
                    loading={createLoading}
                  />
                )}

                {/* Edit Attendance Modal - Admin Only */}
                {isAdmin && (
                  <AttendanceFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                      setIsEditModalOpen(false);
                      setAttendanceToEdit(null);
                    }}
                    attendance={attendanceToEdit}
                    onSubmit={handleUpdate}
                    loading={updateLoading}
                  />
                )}

                {/* Delete Attendance Dialog - Admin Only */}
                {isAdmin && (
                  <DeleteAttendanceDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                      setIsDeleteDialogOpen(false);
                      setAttendanceToDelete(null);
                    }}
                    attendance={attendanceToDelete}
                    employeeName={attendanceToDelete ? employeeMap.get(attendanceToDelete.employeeId) : undefined}
                    onConfirm={handleConfirmDelete}
                    loading={deleteLoading}
                  />
                )}
      </main>
    </div>
  );
};

export default Attendance;

