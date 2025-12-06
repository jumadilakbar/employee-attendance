import { Pencil, Flag, Trash2 } from 'lucide-react';
import { Employee as GraphQLEmployee } from '@/types/graphql';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EmployeeTileViewProps {
  employees: GraphQLEmployee[];
  onSelectEmployee: (employee: GraphQLEmployee) => void;
  onEdit: (employee: GraphQLEmployee) => void;
  onFlag: (employee: GraphQLEmployee) => void;
  onDelete: (employee: GraphQLEmployee) => void;
}

export function EmployeeTileView({
  employees,
  onSelectEmployee,
  onEdit,
  onFlag,
  onDelete,
}: EmployeeTileViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {employees.map((employee, index) => (
        <div
          key={employee.id}
          className="group relative bg-card rounded-xl border border-border p-5 cursor-pointer card-hover animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onSelectEmployee(employee)}
        >
          {/* Profile section */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-background shadow-lg mb-3">
              <span className="text-2xl font-bold text-primary">
                {employee.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{employee.fullName}</h3>
            {employee.userId && (
              <p className="text-xs text-muted-foreground">User: {employee.userId.slice(0, 8)}...</p>
            )}
          </div>

          {/* Info section */}
          <div className="space-y-3">
            {employee.age && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium text-foreground">{employee.age} years</span>
              </div>
            )}
            {employee.class && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Class</span>
                <Badge variant="secondary">{employee.class}</Badge>
              </div>
            )}
            {employee.subjects && employee.subjects.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Subjects</span>
                <div className="flex flex-wrap gap-1">
                  {employee.subjects.slice(0, 3).map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {employee.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{employee.subjects.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(employee);
              }}
              className="btn-action-edit"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlag(employee);
              }}
              className="btn-action-flag"
              title="Flag"
            >
              <Flag className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(employee);
              }}
              className="btn-action-delete"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
