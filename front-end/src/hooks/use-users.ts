import { useQuery, useMutation } from '@apollo/client/react';
import {
  LIST_USERS_QUERY,
  USERS_PAGINATION_QUERY,
  GET_USER_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  CreateUserVariables,
  UpdateUserVariables,
  DeleteUserVariables,
  GetUserVariables,
  ListUsersVariables,
  UsersPaginationVariables,
} from '@/graphql/user.queries';
import { useToast } from '@/hooks/use-toast';

export function useUsers(variables?: ListUsersVariables) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(LIST_USERS_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    },
  });

  // Get pagination info
  const paginationVariables: UsersPaginationVariables = {
    filter: variables?.filter,
    page: variables?.page,
    limit: variables?.limit,
  };

  const { data: paginationData } = useQuery(USERS_PAGINATION_QUERY, {
    variables: paginationVariables,
    fetchPolicy: 'cache-and-network',
    skip: loading, // Skip if main query is loading
  });

  const users = data?.users || [];
  const pagination = paginationData?.usersPagination;

  return {
    users,
    loading,
    error,
    refetch,
    totalPages: pagination?.totalPages || 1,
    totalCount: pagination?.totalCount || 0,
  };
}

export function useUser(id: string) {
  const { toast } = useToast();
  
  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { id },
    skip: !id,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch user',
        variant: 'destructive',
      });
    },
  });

  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
}

export function useCreateUser() {
  const { toast } = useToast();
  
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: LIST_USERS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  return {
    createUser: (variables: CreateUserVariables) => createUser({ variables }),
    loading,
  };
}

export function useUpdateUser() {
  const { toast } = useToast();
  
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [{ query: LIST_USERS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  return {
    updateUser: (variables: UpdateUserVariables) => updateUser({ variables }),
    loading,
  };
}

export function useDeleteUser() {
  const { toast } = useToast();
  
  const [deleteUser, { loading }] = useMutation(DELETE_USER_MUTATION, {
    refetchQueries: [{ query: LIST_USERS_QUERY }],
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  return {
    deleteUser: (variables: DeleteUserVariables) => deleteUser({ variables }),
    loading,
  };
}

