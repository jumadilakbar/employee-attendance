import { X, Calendar, BookOpen, User, Hash } from 'lucide-react';
import { Employee as GraphQLEmployee } from '@/types/graphql';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmployeeDetailModalProps {
  employee: GraphQLEmployee;
  onClose: () => void;
  onEdit?: (employee: GraphQLEmployee) => void;
}

export function EmployeeDetailModal({ employee, onClose, onEdit }: EmployeeDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header with cover */}
        <div className="relative h-32 bg-gradient-to-br from-primary to-primary/80">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile section */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
            <div className="h-32 w-32 rounded-2xl bg-primary/10 flex items-center justify-center ring-4 ring-card shadow-xl">
              <span className="text-4xl font-bold text-primary">
                {employee.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">{employee.fullName}</h2>
              </div>
              {employee.userId && (
                <p className="text-muted-foreground mt-1">User ID: {employee.userId}</p>
              )}
            </div>
          </div>

          {/* Contact info */}
          {employee.userId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Hash className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <p className="text-sm font-medium text-foreground">{employee.userId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {employee.age && (
              <DetailCard
                icon={<User className="h-5 w-5" />}
                label="Age"
                value={`${employee.age} years`}
              />
            )}
            {employee.class && (
              <DetailCard
                icon={<BookOpen className="h-5 w-5" />}
                label="Class"
                value={employee.class}
              />
            )}
            <DetailCard
              icon={<Calendar className="h-5 w-5" />}
              label="Created"
              value={formatDate(employee.createdAt)}
            />
            <DetailCard
              icon={<Calendar className="h-5 w-5" />}
              label="Updated"
              value={formatDate(employee.updatedAt)}
            />
          </div>

          {/* Additional info */}
          {employee.subjects && employee.subjects.length > 0 && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {employee.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {onEdit && (
              <Button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Edit Employee
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 text-accent mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
