import { useState, useMemo, useEffect } from 'react';
import { Users, Plus, Loader2, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { User as GraphQLUser, UserRole } from '@/types/graphql';
import { UserFormModal, UserFormData } from '@/components/users/UserFormModal';
import { DeleteUserDialog } from '@/components/users/DeleteUserDialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<GraphQLUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<GraphQLUser | null>(null);
  const { toast } = useToast();

  // Build filter and sort variables
  const filter = useMemo(() => {
    if (!searchQuery) return undefined;
    return {
      username: searchQuery,
    };
  }, [searchQuery]);

  const sort = useMemo(() => ({
    field: sortField,
    order: sortOrder,
  }), [sortField, sortOrder]);

  const { users, loading, refetch, totalPages: apiTotalPages, totalCount } = useUsers({
    filter,
    sort,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const { createUser, loading: createLoading } = useCreateUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Use totalPages from API response
  const totalPages = apiTotalPages || 1;

  const handleCreate = async (data: UserFormData) => {
    try {
      await createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      await refetch();
      setIsCreateModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = (user: GraphQLUser) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: UserFormData) => {
    if (!userToEdit) return;

    try {
      await updateUser({
        id: userToEdit.id,
        username: data.username,
        email: data.email,
        role: data.role,
      });
      await refetch();
      setIsEditModalOpen(false);
      setUserToEdit(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = (user: GraphQLUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser({ id: userToDelete.id });
      await refetch();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN: 'bg-primary/10 text-primary border-primary/20',
      EMPLOYEE: 'bg-muted text-muted-foreground border-muted',
    };
    return (
      <Badge variant="outline" className={cn('capitalize', styles[role])}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and their roles
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by username, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Users table */}
        {!loading && (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{user.email}</td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="h-8"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          className="h-8"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalCount || users.length}
              showingText="users"
            />
          </div>
        )}

        {/* Create User Modal */}
        <UserFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          loading={createLoading}
        />

        {/* Edit User Modal */}
        <UserFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }}
          user={userToEdit}
          onSubmit={handleUpdate}
          loading={updateLoading}
        />

        {/* Delete User Dialog */}
        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
          }}
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      </main>
    </div>
  );
};

export default UserManagement;

