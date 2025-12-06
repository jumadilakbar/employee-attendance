import { useState, useEffect, useMemo } from 'react';
import { X, Calendar, User, FileText, Search } from 'lucide-react';
import { Attendance as GraphQLAttendance, AttendanceStatus } from '@/types/graphql';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEmployees } from '@/hooks/use-employees';

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance?: GraphQLAttendance | null;
  onSubmit: (data: AttendanceFormData) => Promise<void>;
  loading?: boolean;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  note?: string | null;
}

export function AttendanceFormModal({
  isOpen,
  onClose,
  attendance,
  onSubmit,
  loading = false,
}: AttendanceFormModalProps) {
  const { toast } = useToast();
  const { employees } = useEmployees();
  const [formData, setFormData] = useState<AttendanceFormData>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: AttendanceStatus.PRESENT,
    note: null,
  });
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!employeeSearchQuery) return employees;
    const query = employeeSearchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(query) ||
        (emp.class && emp.class.toLowerCase().includes(query))
    );
  }, [employeeSearchQuery, employees]);

  useEffect(() => {
    if (attendance) {
      setFormData({
        employeeId: attendance.employeeId,
        date: attendance.date,
        status: attendance.status,
        note: attendance.note || null,
      });
    } else {
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: AttendanceStatus.PRESENT,
        note: null,
      });
    }
    setEmployeeSearchQuery('');
  }, [attendance, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId) {
      toast({
        title: 'Validation Error',
        description: 'Employee is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Date is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {attendance ? 'Edit Attendance' : 'Mark Attendance'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {attendance ? 'Update attendance record' : 'Create a new attendance record'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee *</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search employee by name..."
                  value={employeeSearchQuery}
                  onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, employeeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName} {employee.class && `(${employee.class})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as AttendanceStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AttendanceStatus.PRESENT}>Present</SelectItem>
                <SelectItem value={AttendanceStatus.ABSENT}>Absent</SelectItem>
                <SelectItem value={AttendanceStatus.LATE}>Late</SelectItem>
                <SelectItem value={AttendanceStatus.EXCUSED}>Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="note"
                placeholder="Enter note (optional)"
                value={formData.note || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value || null }))}
                className="w-full min-h-[80px] pl-10 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {attendance ? 'Updating...' : 'Creating...'}
                </span>
              ) : attendance ? (
                'Update Attendance'
              ) : (
                'Mark Attendance'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

