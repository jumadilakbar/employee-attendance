import { useState, useEffect, useMemo } from 'react';
import { X, User, Hash, Calendar, BookOpen, Search } from 'lucide-react';
import { Employee as GraphQLEmployee } from '@/types/graphql';
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/use-users';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: GraphQLEmployee | null;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  loading?: boolean;
}

export interface EmployeeFormData {
  userId?: string | null;
  fullName: string;
  age?: number | null;
  class?: string | null;
  subjects?: string[];
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  employee,
  onSubmit,
  loading = false,
}: EmployeeFormModalProps) {
  const { toast } = useToast();
  const { users } = useUsers();
  const [formData, setFormData] = useState<EmployeeFormData>({
    userId: null,
    fullName: '',
    age: null,
    class: null,
    subjects: [],
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [userSearchQuery, users]);

  useEffect(() => {
    if (employee) {
      setFormData({
        userId: employee.userId,
        fullName: employee.fullName,
        age: employee.age ?? null,
        class: employee.class ?? null,
        subjects: employee.subjects ?? [],
      });
    } else {
      setFormData({
        userId: null,
        fullName: '',
        age: null,
        class: null,
        subjects: [],
      });
    }
    setSubjectInput('');
    setUserSearchQuery('');
  }, [employee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Full name is required',
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

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...(prev.subjects || []), subjectInput.trim()],
      }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index) || [],
    }));
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
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {employee ? 'Edit Employee' : 'Create Employee'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {employee ? 'Update employee information' : 'Add a new employee to the system'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* User Selection (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="userId">User (Optional)</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search user by username or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={formData.userId || '__none__'}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, userId: value === '__none__' ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None (No user linked)</SelectItem>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Link this employee to an existing user account. Use search to find users quickly.
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    age: e.target.value ? parseInt(e.target.value, 10) : null,
                  }))
                }
                className="pl-10"
                min="1"
                max="120"
              />
            </div>
          </div>

          {/* Class */}
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="class"
                type="text"
                placeholder="Enter class/level (e.g., Junior, Mid, Senior)"
                value={formData.class || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, class: e.target.value || null }))
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter subject and press Enter"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubject();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSubject}
                disabled={!subjectInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.subjects && formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  {employee ? 'Updating...' : 'Creating...'}
                </span>
              ) : employee ? (
                'Update Employee'
              ) : (
                'Create Employee'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

